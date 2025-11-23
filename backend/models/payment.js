import { DataTypes, ENUM } from "sequelize";
import { Op } from "sequelize";  //  Import Op separately
export default (sequelize) => {
    const Payment = sequelize.define("Payment",{
        id : {
            autoIncrement : true,
            primaryKey : true,
            type : DataTypes.INTEGER
        },
        order_id : {
            type : DataTypes.INTEGER,
            allowNull : false,
            unique : true
        },
        payment_method : {
            type : DataTypes.ENUM("cod", "paypal", "credit_card", "khqr"),
            allowNull : false
        },
        status : {
            type : DataTypes.ENUM("pending", "paid", "failed"),
            defaultValue : "pending"
        },
        transaction_id : {
            type : DataTypes.STRING(255),
            allowNull : true
        },
        paid_at : {
            type : DataTypes.DATE,
            allowNull : true
        },
        amount : {
            type : DataTypes.DECIMAL(10,2),
            defaultValue : 0,
        },
        
        // KHQR specific fields (only for khqr payment method)
        qr_code : {
            type : DataTypes.TEXT,  //  Keep as TEXT (no index on this)
            allowNull : true,
        },
        qr_md5 : {
            type : DataTypes.STRING(32),  //  Changed to STRING(32) - MD5 is always 32 chars
            allowNull : true,
            unique : true,
        },
        qr_expiration : {
            type : DataTypes.BIGINT,
            allowNull : true,

        },

        // Payment return from Bakong API
        bakongHash : {
            type : DataTypes.STRING(255),  //  Changed to STRING (has index potential)
            allowNull : true
        },
        fromAccountId : {
            type : DataTypes.STRING(100),  //  Changed to STRING
            allowNull : true
        },
        toAccountId : {
            type : DataTypes.STRING(100),  //  Changed to STRING
            allowNull : true
        },
        currency : {
            type : DataTypes.ENUM('KHR', 'USD'),
            defaultValue : 'USD'
        },
        description : {
            type : DataTypes.TEXT,  //  Keep as TEXT (long content)
            allowNull : true
        },
        externalRef : {
            type : DataTypes.STRING(100),  //  Changed to STRING
            allowNull : true
        },
        
        // Status
        paid : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        trackingStatus : {
            type : DataTypes.STRING(20),
            allowNull : true
        },

        // Bank Detail
        receiverBank : {
            type : DataTypes.STRING(100),
            allowNull : true
        },
        receiverBankAccount : {
            type : DataTypes.STRING(100),
            allowNull : true
        },
        instructionRef : {
            type : DataTypes.STRING(255),  //  Changed to STRING
            allowNull : true
        },

        // Timestamps from Bakong
        createdDateMs : {
            type : DataTypes.BIGINT,
            allowNull : true
        },
        acknowledgedDateMs : {
            type : DataTypes.BIGINT,
            allowNull : true
        }

    },{
        tableName : "payments", 
        timestamps : true,
        underscored: false,
        indexes: [
            { fields: ['status'] }, 
            { 
                fields: ['paid', 'createdAt'] 
            }

  
        ]
    })
    
    return Payment;
}