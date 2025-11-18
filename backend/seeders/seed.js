import { Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

// ✅ HARDCODED - CHANGE THESE 3 THINGS:
const DB_NAME = 'REDACTED_DB_NAME';  // ← Your database name
const DB_USER = 'root';       // ← Your MySQL username  
const DB_PASS="Pisey@!#$%^&*1234858483"

console.log('Using database:', DB_NAME, 'with user:', DB_USER);

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

// Define User model inline
const User = sequelize.define('User', {
    name: { type: Sequelize.STRING },
    email: { type: Sequelize.STRING, unique: true },
    password: { type: Sequelize.STRING },
    role: { type: Sequelize.ENUM('customer', 'admin', 'seller') },
    is_verified: { type: Sequelize.BOOLEAN },
    auth_provider: { type: Sequelize.STRING },
}, {
    tableName: 'users',
    timestamps: true
});

const seedUsers = async (count = 10000) => {
    console.log(`🌱 Seeding ${count} users...`);
    const start = Date.now();
    const password = await bcrypt.hash('password123', 10);
    const batchSize = 1000;

    for (let batch = 0; batch < Math.ceil(count / batchSize); batch++) {
        const users = [];
        const size = Math.min(batchSize, count - (batch * batchSize));

        for (let i = 0; i < size; i++) {
            const num = (batch * batchSize) + i + 1;
            users.push({
                name: `TestUser${num}`,
                email: `testuser${num}@example.com`,
                password,
                role: 'customer',
                is_verified: true,
                auth_provider: 'email'
            });
        }

        await User.bulkCreate(users, { ignoreDuplicates: true });
        console.log(`✅ Batch ${batch + 1}/${Math.ceil(count / batchSize)}`);
    }

    console.log(`🎉 Done in ${((Date.now() - start) / 1000).toFixed(2)}s`);
};

(async () => {
    try {
        console.log('🔌 Connecting...');
        await sequelize.authenticate();
        console.log('✅ Connected!');
        await seedUsers(10000);
        await sequelize.close();
        process.exit(0);
    } catch (error) {
        console.error('❌', error.message);
        process.exit(1);
    }
})();