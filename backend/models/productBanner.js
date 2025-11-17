import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ProductBanner = sequelize.define(
        "ProductBanner",
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
                allowNull: false,
                unique : true,
            },
            public_id: {
                type: DataTypes.STRING(255), // Cloudinary public_id
                allowNull: false
            },
            category_id : {
                
                type : DataTypes.INTEGER,
                allowNull : false,
            }
        
        },
        {
            tableName : 'product_banners',
            timestamps : true,
            indexes : [
                {fields : ['category_id', 'createdAt']},
            ]
        }
    )
    return ProductBanner;
}