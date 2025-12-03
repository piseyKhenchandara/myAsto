import { DataTypes, Op } from "sequelize"; // 👈 ISSUE 1: Import Op

export default (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        role: {
            type: DataTypes.ENUM("customer", "admin", "seller"),
            defaultValue: "customer"
        },
        phone: {
            type: DataTypes.STRING,
        },
        address: {
            type: DataTypes.TEXT,
        },
        last_login: {
            type: DataTypes.DATE,
            allowNull : true,
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        reset_password_token: {
            type: DataTypes.STRING,
        },
        reset_password_expires_at: {
            type: DataTypes.DATE,
        },
        verification_token: {
            type: DataTypes.STRING,
        },
        verification_token_expires_at: {
            type: DataTypes.DATE,
        },
        auth_provider: {

            type: DataTypes.ENUM('email', 'google', 'facebook', 'apple', 'github'),
            defaultValue: 'email',
        },
        provider_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profile_picture: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        public_id: {  
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
      
        tableName: "users",
        timestamps: true,
        indexes: [
            {
                unique: true,
                fields: ["auth_provider", "provider_id"], 
                where: {
                    provider_id: { [Op.ne]: null }
                }
            }, 
            {
                fields : ['reset_password_token']
            }
        ]
    });
    
    return User;
}