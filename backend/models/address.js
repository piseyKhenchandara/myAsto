import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true, // ✅ Correct key
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(20),
        allowNull: true, // Optional
      },
      shipping_address: {
        type: DataTypes.TEXT,
        allowNull: false, // Usually required
      },
      customer_name : {
        type : DataTypes.STRING(150),
        allowNull : false
      },

    },
    { tableName: "addresses", timestamps: true }
  );

  return Address;
};
