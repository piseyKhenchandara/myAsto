  import db from "../models/index.js";
import { io } from "../server.js";




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

            const order = await db.Order.create({
                user_id : checkUser.id,
                amount,
                status : "pending",
                customer_name,
                phone_number,
                shipping_address,
                discount_amount : discount_amount || 0,
                order_number: null,  
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
                    name : p.name,
                    warranty : p.warranty,
                }));

                promises.push(db.OrderItem.bulkCreate(cartData, {transaction}));
            }

           


           promises.push(db.Payment.create({
                order_id: order.id,
                amount: amount,
                payment_method: payment_method || 'khqr',
                status: 'pending'
            }, {transaction}));

            // ✅ Wait for all promises (same pattern as uploadProduct)
            await Promise.all(promises);
            
            return order;
        });

        // Create notifications for both admin and seller
        const notifications = await Promise.all([
            db.Notification.create({
                type: 'order',
                message: `New order placed: ${result.order_number}`,
                target_role: 'admin',
                order_id: result.id,
                user_id: result.user_id,
                read: false
            }),
            db.Notification.create({
                type: 'order',
                message: `New order placed: ${result.order_number}`,
                target_role: 'seller',
                order_id: result.id,
                user_id: result.user_id,
                read: false
            })
        ]);

        // Emit socket event (will notify both roles listening to 'room')
        io.to('room').emit('newOrder', {
            id: notifications[0].id,
            type: notifications[0].type,
            message: notifications[0].message,
            order_id: result.id,
            order_number: result.order_number,
            customer_name: result.customer_name,
            amount: result.amount,
            status: result.status,
            createdAt: notifications[0].createdAt,
            read: false
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
                'order_number', 'delivery_company','createdAt', 'updatedAt','delivery_check'
                 
            ],

                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'email','role', 'phone', 'profile_picture']
                    },
                    {
                        model: db.Payment,
                        where : {status : "paid"},
                        attributes : ['id','paid_at', ]
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
    const {user_id} = req.params;
    const {order_number} = req.query;

    if(req.user?.role === 'admin' || req.user?.role === 'seller'){
        try{
            
            const user = await db.User.findByPk(user_id);
            if(!user) return res.status(404).json({success : false, message : "User not found!"});

            const order = await db.Order.findOne(
            {
                where : {order_number},
                attributes: ['id', 'user_id', 'customer_name', 'phone_number', 
                           'shipping_address', 'discount_amount', 
                           'order_number', 'delivery_company', 'delivery_check'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'email', 'role', 'phone', 'profile_picture']
                    },
                    {
                        model: db.Payment,
                        attributes : ['id','paid_at'],
                        where : {status : 'paid'},
                    },
                    {
                        model: db.OrderItem,
                        attributes: ['id', 'quantity', 'price', 'name', 'product_id'],
                        include : [{
                            model:db.Product,
                            required: false,
                            include : [{
                                model : db.ProductImage,
                                attributes : ['is_main', 'image_url','product_id']
                            }]
                        }]
                    },
                    
                        
                
                ],
            
            });
            if(!order) res.status(404).json({success : false, message : "Order number not found!"});

            res.status(200).json({success : true,
                order
            })

        }
        catch(error) {
            console.error('ERROR in getTheReceipt:', error);
            res.status(500).json({success : false, message : error.message});
        }
    }
    else{
        res.status(409).json({success : false, message : "Unauthorized!"});
    }
}

export const updateDeliveryCheck = async (req, res) => {
    const { order_id } = req.params;
    const { delivery_check } = req.body;
    

    if (req.user?.role === 'admin' || req.user?.role === 'seller') {
        try {
      
      

            // Find the order
            const order = await db.Order.findByPk(order_id);
            
            if (!order) {
                return res.status(404).json({
                    success: false, 
                    message: "Order not found!"
                });
            }

            // Update delivery_check
            await order.update({ delivery_check });


            res.status(200).json({
                success: true,
                message: "Delivery status updated successfully",
                delivery_check: order.delivery_check
            });

            

        } catch (error) {
            console.error('ERROR in updateDeliveryCheck:', error);
            res.status(500).json({
                success: false, 
                message: error.message
            });
        }
    } else {
        res.status(403).json({
            success: false, 
            message: "Unauthorized!"
        });
    }
}


