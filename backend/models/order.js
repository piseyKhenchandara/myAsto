import { DataTypes } from "sequelize"

export default (sequelize) => {
    const Order = sequelize.define("Order",{
        id:{
            primaryKey : true,
            autoIncrement : true,
            type : DataTypes.INTEGER
        },
        user_id : {
            type  : DataTypes.INTEGER,
            allowNull : false,
        },
        total_price : {
            type : DataTypes.DECIMAL(10,2), 
            allowNull : false,
        },
        status : {
            type : DataTypes.ENUM ("pending", "paid", "shipped", "completed", "cancelled"),
            defaultValue : "pending"
        },
        customer_name : {
            type : DataTypes.STRING(150), 
            allowNull : false
        },
        phone_number : {
            type : DataTypes.STRING(50),
            allowNull : false
        },
        shipping_address : {
            type : DataTypes.TEXT,
            allowNull : false,

        },
        discount_amount : {
            type : DataTypes.DECIMAL(10,2),
            defaultValue : 0
        },
        order_notes : {
            type : DataTypes.TEXT,
            allowNull : true,
        },
        order_number: {
            type: DataTypes.STRING(50),
            unique: true,
            allowNull: false
        },
        currency: {
            type: DataTypes.STRING(3),
            defaultValue: "USD"
        },
        delivery_company: {
            type :  DataTypes.ENUM ("Vireak Buntam", "J&T", 'Phnom Penh delivery'),
            allowNull : false,

        },
       


        

    }, {tableName : "orders",
        timestamps : true,
        indexes : [
            {fields : ['user_id']},
            {fields : ["order_number"], unique : true},
            {fields : ['createdAt']},
            {fields : ['status']}
        ]

    });

    return Order;

}