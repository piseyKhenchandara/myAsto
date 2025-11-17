import { DataTypes } from "sequelize";


export default (sequelize) => {
    const ProductVideo = sequelize.define(
        "ProductVideo",
        {
            id : {
                autoIncrement : true,
                primaryKey : true,
                type : DataTypes.INTEGER,
            },
            product_id : {
                type : DataTypes.INTEGER,
                allowNull : false,
            },
            video_url : {
                type : DataTypes.STRING(500),
                allowNull : false,
            },
            public_id : {
                type : DataTypes.STRING(255),
                allowNull : false,
            },

            format : {
                type : DataTypes.STRING(50),
                allowNull : true,
            },

            duration_sec : {
                type : DataTypes.FLOAT,
                allowNull : true,
            },

            bytes : {
                type : DataTypes.INTEGER,
                allowNull : true,

            },
            is_main : {
                type : DataTypes.BOOLEAN,
                defaultValue : false,
            },

        },
        {
            tableName : 'product_videos',
            timestamps : true,
            
        }
    );

    return ProductVideo;
    
}