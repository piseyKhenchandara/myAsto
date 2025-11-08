import AddressModel from "./address.js";
import BrandModel from "./brand.js";
import CategoryModel from "./category.js";
import OrderModel from "./order.js";
import OrderItemModel from "./orderItem.js";
import PaymentModel from "./payment.js";
import ProductModel from "./product.js";
import ProductFeatureModel from "./productFeature.js";
import ProductImageModel from "./productImage.js";
import ReviewModel from "./review.js";
import UserModel from "./user.js";
import { sequelize } from '../config/sequelize.js';
import ProductVideoModel from "./ProductVideo.js";
import ProductBannerModel from "./productBanner.js";
import NotificationModel from "./notification.js";

const Address = AddressModel(sequelize);
const Brand = BrandModel(sequelize);
const Category = CategoryModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Payment = PaymentModel(sequelize);
const Product = ProductModel(sequelize);
const ProductFeature = ProductFeatureModel(sequelize);
const ProductImage = ProductImageModel(sequelize);
const Review = ReviewModel(sequelize);
const User = UserModel(sequelize);
const ProductVideo = ProductVideoModel(sequelize);
const ProductBanner = ProductBannerModel(sequelize);
const Notification = NotificationModel(sequelize);

const db = {
  sequelize,
  Address,
  Brand,
  Category,
  Order,
  OrderItem,
  Payment,
  Product,
  ProductFeature,
  ProductImage,
  Review,
  User,
  ProductVideo,
  ProductBanner,
  Notification
};

export default db;



// 🧑 User ↔ Address
User.hasMany(Address, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
Address.belongsTo(User, {
    foreignKey: "user_id"
});

// 🧑 User ↔ Order
User.hasMany(Order, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
Order.belongsTo(User, {
    foreignKey: "user_id"
});

// 🛒 Order ↔ OrderItem
Order.hasMany(OrderItem, {
  foreignKey: "order_id",
  onDelete: "CASCADE"
});
OrderItem.belongsTo(Order, {
    foreignKey: "order_id"
});

// 📦 Product ↔ OrderItem
Product.hasMany(OrderItem, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
});
OrderItem.belongsTo(Product, {
    foreignKey: "product_id"
});

// 💰 Order ↔ Payment
Order.hasOne(Payment, {
  foreignKey: "order_id",
  onDelete: "CASCADE"
});
Payment.belongsTo(Order, {
    foreignKey: "order_id"
});

// 🧑 User ↔ Review
User.hasMany(Review, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
Review.belongsTo(User, {
  foreignKey: "user_id"
});

// 📦 Product ↔ Review
Product.hasMany(Review, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
});
Review.belongsTo(Product, {
    foreignKey: "product_id"
});

// 📦 Product ↔ ProductFeature
Product.hasMany(ProductFeature, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
});
ProductFeature.belongsTo(Product, {
  foreignKey: "product_id"
});

// 📦 Product ↔ ProductImage
Product.hasMany(ProductImage, {
    foreignKey: "product_id",
    onDelete: "CASCADE"
});
ProductImage.belongsTo(Product, {
  foreignKey: "product_id"
});

// 📦 Product ↔ ProductVideo
Product.hasMany(ProductVideo, {
    foreignKey: "product_id",   
    onDelete: "CASCADE"         
});
ProductVideo.belongsTo(Product, {
    foreignKey: "product_id"    
});

Product.hasOne(ProductBanner,{
    foreignKey : 'product_id',
    onDelete : "CASCADE",
})

ProductBanner.belongsTo(Product,{
    foreignKey : "product_id"
})

Category.hasMany(ProductBanner,{
    foreignKey : 'category_id',
    onDelete : "CASCADE"
})
ProductBanner.belongsTo(Category,{
    foreignKey : "category_id"
})
// 🟨 Category ↔ Brand (new & important!)
Category.hasMany(Brand, {
    foreignKey: "category_id",
    onDelete: "CASCADE"
});
Brand.belongsTo(Category, {
    foreignKey: "category_id"
});

// 🟪 Brand ↔ Product
Brand.hasMany(Product, {
  foreignKey: "brand_id",
  onDelete: "CASCADE"
});
Product.belongsTo(Brand, {
  foreignKey: "brand_id"
});

// 🟨 Category ↔ Product (optional direct relation)
Category.hasMany(Product, {
    foreignKey: "category_id",
  onDelete: "CASCADE"
});
Product.belongsTo(Category, {
    foreignKey: "category_id"
});

Order.hasMany(Notification, {
    foreignKey: "order_id",
    onDelete: "CASCADE"
});
Notification.belongsTo(Order, {
    foreignKey: "order_id"
});

// 📢 User ↔ Notification (to link notifications to users)
User.hasMany(Notification, {
    foreignKey: "user_id",
    onDelete: "CASCADE"
});
Notification.belongsTo(User, {
    foreignKey: "user_id"
});

