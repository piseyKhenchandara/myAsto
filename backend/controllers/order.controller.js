import db from "../models/index.js";
import { Op } from "sequelize";




export const orders = async (req, res) => {
    
    const { 
            amount,
            customer_name,
            phone_number, 
            shipping_address,
            discount_amount,
            currency,
            delivery_company, 
            //payment model
            payment_method,
            
            cart,
            
        } = req.body;

    // ✅ Fixed validation
    if(!customer_name || !phone_number || !delivery_company || !shipping_address || !amount || !payment_method) {
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

        const result = await db.sequelize.transaction(async(transaction) => {

      
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
                amount,
                status : "pending",
                customer_name,
                phone_number,
                shipping_address,
                discount_amount : discount_amount || 0,
                order_notes : order_notes || null,
                order_number: await generateOrderNumber(),  
                currency : currency || "USD",
                delivery_company,
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
                currency : currency || "USD",
                status : "pending",
                paid : false,
                paid_at : null,
                
            };

            promises.push(db.Payment.create(paymentData, {transaction}));

            // ✅ Wait for all promises (same pattern as uploadProduct)
            await Promise.all(promises);
            
            return order;
        });

        // ✅ Fixed success response
        res.status(201).json({success: true, message : "Order created successfully!✅", 
            data : {
                order_id : result.id,
                order_number : result.order_number,

            }
        });

    }
    catch(error) {
        res.status(500).json({success : false, message : error.message});
    }
    
}