import { DataTypes } from "sequelize";
export default (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {              
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      image_url: {
        type: DataTypes.STRING(255), //  instead of TEXT
        allowNull: false
      },
      public_id : {
        type : DataTypes.STRING(255),
        allowNull : false,
      }

    },
    {
      tableName: "categories",
      timestamps: true,
      indexes : [
        {
          fields : ['name']
        },
        {
          fields : ['id']
        }
      ]
    }
  );

  return Category;
};
