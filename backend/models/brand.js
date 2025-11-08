import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Brand = sequelize.define("Brand", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
     
        },
        slug: {                           // ✅ Add this
            type: DataTypes.STRING(60),
            allowNll: false,
         
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        image_url: { 
            type: DataTypes.STRING(255), 
            allowNull: true 
        },
        public_id: { 
            type: DataTypes.STRING(255), 
            allowNull: true 
        },
    }, {
        tableName: "brands",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: false
    });

    return Brand;
}