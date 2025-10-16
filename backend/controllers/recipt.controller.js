import db from "../models/index.js";

export const recipts = async (req, res) => {
    try {
        const targetUser = req.params.id;
        
        const user = await db.User.findByPk(targetUser);
        if (!user) {
            return res.status(404).json({   
                success: false, 
                message: "User not found!"
            });
        }

        if (req.user.role !== 'admin' && req.user.id !== parseInt(targetUser)) {
            return res.status(403).json({
                success: false, 
                message: "Unauthorized"
            });
        }

        const orders = await db.Order.findAll({
            where: { user_id: user.id }
        });

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false, 
                message: "No orders found!"
            });
        }

        const orderIds = orders.map(order => order.id);
        
        const payments = await db.Payment.findAll({
            where: { 
                order_id: orderIds,
                paid: true  
            },
            order: [['createdAt', 'DESC']], 
            attributes: ['id', 'status', 'payment_method', 'amount', 'paid', 'createdAt'], 
            include: [
                {
                    model: db.Order,
                    attributes: ['id', 'user_id', 'customer_name', 'phone_number', 
                               'shipping_address', 'discount_amount', 
                               'order_number', 'delivery_company'],
                    include: [
                        {
                            model: db.OrderItem,
                            attributes: ['id', 'quantity', 'price', 'name']
                        }
                    ]
                }
            ]
        });
   
        console.log('Found payments:', payments.length);
        
        if (!payments || payments.length === 0) {
            return res.status(404).json({
                success: false, 
                message: "No paid receipts found!"
            });
        }

        return res.status(200).json({
            success: true, 
            message: 'Receipts retrieved successfully!',
            data: payments
        });
    }
    catch (error) {
        console.error('Error in receipts:', error);
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}