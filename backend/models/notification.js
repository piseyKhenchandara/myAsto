import { DataTypes } from "sequelize";

// models/notification.model.js
export default (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    type: {
      type: DataTypes.ENUM('newOrder', 'payment', 'user', 'userVerified'),
      allowNull: false
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false
    },
    readAt: {  // ✅ ADD THIS - you use it in markAsRead!
      type: DataTypes.DATE,
      allowNull: true
    },
    data: {
      type: DataTypes.JSON, // Store order_id, order_number, etc.
      allowNull: true
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    target_role: {
      type: DataTypes.ENUM('admin', 'seller'),
      allowNull: false
    },

    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'order_id'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'user_id'
    }
  }, {
    timestamps: true,
    indexes : [
      {
        fields : ['target_role', 'createdAt']
      },
      {
        fields : ['target_role', "read"]
      },
     

    ]
  });

  return Notification;
};