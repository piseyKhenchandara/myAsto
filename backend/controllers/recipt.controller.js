import db from "../models/index.js";

export const recipts = async (req, res) => {
    try {
        const user = await db.User.findByPk(req.params.id);
        
        // Add debug logging
        console.log('User ID:', req.params.id);
        
        if (!user) {
            return res.status(404).json({
                success: false, 
                message: "User not found!"
            });
        }

        // Change: Find all orders for the user instead of just one
        const orders = await db.Order.findAll({
            where: { user_id: user.id }
        });
        
        console.log('Found orders:', orders.length);

        if (!orders || orders.length === 0) {
            return res.status(404).json({
                success: false, 
                message: "No orders found!"
            });
        }

        // Get order IDs
        const orderIds = orders.map(order => order.id);
        console.log('Order IDs:', orderIds);

        const payments = await db.Payment.findAll({
            where: { 
                order_id: orderIds,
                paid: true  // Changed from '1' to true
            },
            attributes: ['status', 'payment_method', 'amount', 'paid'], 
            include: [
                {
                    model: db.Order,
                    attributes: ['user_id', 'customer_name', 'phone_number', 
                               'shipping_address', 'discount_amount', 
                               'order_number', 'delivery_company'],
                    include: [
                        {
                            model: db.OrderItem,
                            attributes: ['quantity', 'price', 'name']
                        }
                    ]
                }
            ]
        });
        
        // Add debug logging
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