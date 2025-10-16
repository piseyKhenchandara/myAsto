import db from "../models/index.js";
import { Op } from "sequelize";




export const orders = async (req, res) => {
    
    const { 
            amount,
            customer_name,
            phone_number, 
            shipping_address,
            discount_amount,
            delivery_company, 
            //payment model
            payment_method,           
            cart,
        } = req.body;

    // ✅ Fixed validation
    if(!customer_name || !phone_number || !delivery_company || !shipping_address || !amount) {
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
                order_number: await generateOrderNumber(),  
                currency :"USD",
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
                payment_method : payment_method || 'KHQR',
                currency :"USD",
                status : "pending",
                paid : false,
                paid_at : null,
                amount,
            
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


export const getAllUsersWhoOrdered = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12; 
    const offset = (page - 1) * limit;

    if (req.user?.role === 'admin' || req.user?.role === 'seller') {
        try {
            const { rows: orders, count: total } = await db.Order.findAndCountAll({
                limit,
                offset,
                attributes: ['id', 'user_id', 'customer_name', 'phone_number', 
                'shipping_address', 'discount_amount', 'amount',
                'order_number', 'delivery_company','createdAt', 'updatedAt'
                 
            ],

                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'email','role', 'phone', 'profile_picture']
                    },
                    {
                        model: db.Payment,
                        attributes : ['id','paid_at']
                    },
                    {
                        
                        model: db.OrderItem,
                        attributes: ['id', 'quantity', 'price', 'name']
                        
                    }
                   
                ],

                order: [['createdAt', 'DESC']], 
            });
            
            res.status(200).json({
                success: true,
                data: orders,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({
                success: false, 
                message: "Failed to fetch orders"
            });
        }
    } else {
        return res.status(403).json({
            success: false, 
            message: "Unauthorized!"
        });
    }
}


export const getTheReceipt = async (req, res) => {
    const {user_id} = req.params.id;
    const {order_number} = req.body;

    if(req.user?.role === 'admin' || req.user?.role === 'seller'){
        try{
            
            const user = await db.findByPk(user_id);
            if(!user) res.status(404).json({success : false, message : "User not found!"});

            const order = await db.findOne(
            {
                where : {order_number},
                attributes: ['id', 'user_id', 'customer_name', 'phone_number', 
                           'shipping_address', 'discount_amount', 
                           'order_number', 'delivery_company'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'email', 'role', 'phone', 'profile_picture']
                    },
                    {
                        model: db.OrderItem,
                        attributes: ['id', 'quantity', 'price', 'name']
                    }
                ],
            
            });
            if(!order) res.status(404).json({success : false, message : "Order number not found!"});

            res.status(200).json({success : true,
                order
            })

        }
        catch(error) {
            res.status(500).json({success : false, message : error.message});
        }
    }
    else{
        res.status(409).json({success : false, message : "Unauthorized!"});
    }
}

