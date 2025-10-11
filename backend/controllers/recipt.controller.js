import db from "../models/index.js";


export const recipts = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "User not found!"
            });
        }

        const order = await db.Order.findOne({
            where: { user_id: user.id }
        });
        
        if (!order) {
            return res.status(404).json({
                success: false, 
                message: "Order not found!"
            });
        }

        const payments = await db.Payment.findAll({
            where: { 
                order_id: order.id,
                paid: '1'
            },
            attributes: ['status', 'payment_method', 'amount', 'paid'], 
            include: [
                {
                    model: db.Order,
                    attributes: ['user_id', 'customer_name', 'phone_number', 'shipping_address', 'discount_amount', 'order_number', 'delivery_company'],
                    include: [
                        {
                            // ✅ Nested include - OrderItems through Order
                            model: db.OrderItem,
                            attributes: ['quantity', 'price', 'name']
                        }
                    ]
                }
            ]
        });
        
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
        return res.status(500).json({
            success: false, 
            message: error.message
        });
    }
}