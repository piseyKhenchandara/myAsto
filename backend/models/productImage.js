import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ProductImage = sequelize.define(
        "ProductImage",
        {
            id: {
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            image_url: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            is_main: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            product_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            public_id: {
                type: DataTypes.STRING(255), // Cloudinary public_id
                allowNull: false
            }
        },
        {
            tableName: "product_images",
            timestamps: true,
            updatedAt: false
        }
    );

    return ProductImage;
};
