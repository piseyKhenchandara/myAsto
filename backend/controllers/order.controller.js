import db from "../models/index.js";
import { Op } from "sequelize";

const BAKONG_BASE_URL = process.env.BAKONG_PROD_BASE_API_URL;
const BAKONG_ACCESS_TOKEN = process.env.BAKONG_ACCESS_TOKEN;

const generateOrderID = async () => {
    
}

export const orders = async (req, res) => {
    
    const { customer_name,
            phone_number, 
            shipping_address,
            delivery_method, 
            total_price,
            cart,
            payment_method,
            paid_at,
            
        } = req.body;

    // ✅ Fixed validation
    if(!customer_name || !phone_number || !delivery_method || !shipping_address || !total_price || !payment_method) {
        return res.status(400).json({message : "All fields are required!"});
    }
        
    try{
        const checkUser = await db.User.findByPk(req.user.id);
        
        if(!checkUser) return res.status(404).json({message :"User not found!"});


        let parsedCart = [];
        
        try{
            parsedCart = typeof cart === 'string' ? JSON.parse(cart) : cart;
        }
        catch(error) {
            return res.status(400).json({message : "Invalid cart format (must be JSON)"});
        }


        if(!parsedCart || parsedCart.length === 0) {
            return res.status(400).json({message : "Cart cannot be empty"});
        }

        await db.sequelize.transaction(async(transaction) => {

      
            await db.Address.create({
                customer_name,
                phone_number,
                shipping_address,
                user_id : checkUser.id,
            }, {transaction});

            const generateOrderNumber = async () => {
                const year = new Date().getFullYear();
                
                const count = await db.Order.count({
                    where: {
                        createdAt: {
                            [Op.gte]: new Date(`${year}-01-01`),
                            [Op.lt]: new Date(`${year + 1}-01-01`)
                        }
                    },
                    transaction 
                });
                
                const orderNumber = `ORD-${year}-${String(count + 1).padStart(6, '0')}`;
                return orderNumber;
            };

            const order = await db.Order.create({
                user_id : checkUser.id,
                total_price,
                customer_name,
                phone_number,
                shipping_address,
                delivery_method,
                order_number: await generateOrderNumber(),  
            }, {transaction});


            const promises = [];

            // Add order items
            if(parsedCart.length > 0) {
                const cartData = parsedCart.map((p) => ({
                    order_id : order.id,
                    product_id : p.id,
                    quantity : p.quantity,
                    price : p.price,
                    name : p.name
                }));

                promises.push(db.OrderItem.bulkCreate(cartData, {transaction}));
            }

            // Add payment
            const paymentData = {
                order_id : order.id,
                payment_method,
                paid_at : paid_at || new Date(),
                
            };

            promises.push(db.Payment.create(paymentData, {transaction}));

            // ✅ Wait for all promises (same pattern as uploadProduct)
            await Promise.all(promises);
            
            return order;
        });

        // ✅ Fixed success response
        res.status(201).json({success: true, message : "Order created successfully!✅"});

    }
    catch(error) {
        res.status(500).json({success : false, message : error.message});
    }
    
}