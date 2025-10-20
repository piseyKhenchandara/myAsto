import db from "../models/index.js";
import {BakongKHQR, khqrData, IndividualInfo} from 'bakong-khqr';
import axios from 'axios';

export const createKHQRPayment = async (req, res) => {
    try {
        const {order_id} = req.params;
        
        const user = await db.User.findByPk(req.user.id);

        if(!user) return res.status(404).json({success: false, message: "User not found!"});

        if(!order_id) {
            return res.status(400).json({
                success: false, 
                message: "Order_id is required!"
            })
        }

        const order = await db.Order.findByPk(order_id);
        if(!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found!"
            })
        }

        const payment = await db.Payment.findOne({where: {order_id: order_id}})

        if(!payment) {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found for this order" 
            });
        }

        // Check environment variables
        if (!process.env.BAKONG_ACCOUNT_USERNAME) {
            throw new Error('BAKONG_ACCOUNT_USERNAME not set in environment variables');
        }

        //Generate KHQR
        const expirationTimestamp = Date.now() + 5 * 60 * 1000;
        
        const optionalData = {
            currency: khqrData.currency.usd,
            amount: parseFloat(order.amount),
            expirationTimestamp,
        };

        console.log('Creating IndividualInfo with:', {
            username: process.env.BAKONG_ACCOUNT_USERNAME,
            name: process.env.BAKONG_ACCOUNT_NAME || "ASTO",
            location: "PHNOM PENH",
            amount: optionalData.amount
        });

        const customerInfo = new IndividualInfo(
            process.env.BAKONG_ACCOUNT_USERNAME,
            process.env.BAKONG_ACCOUNT_NAME || "ASTO",
            "PHNOM PENH",
            optionalData
        );

        const khqr = new BakongKHQR();
        const qrData = khqr.generateIndividual(customerInfo);

        console.log('KHQR generated:', qrData);

        // Check if qrData is valid
        if (!qrData || !qrData.data || !qrData.data.qr) { // ✅ Changed from qrData.data.qr
            throw new Error('KHQR generation failed - no QR code returned');
        }

        await payment.update({
            currency: "USD",
            qr_code: qrData.data.qr,      
            qr_md5: qrData.data.md5,       
            qr_expiration: expirationTimestamp,
        })

        console.log(qrData);

        return res.status(201).json({
            success: true,
            message: "KHQR generated successfully!",
            data: {
                payment_id: payment.id,
                order_id: order.id,
                order_number: order.order_number,
                qr_code: payment.qr_code,
                qr_md5: payment.qr_md5,
                amount: payment.amount,
                currency: payment.currency,
                qr_expiration: new Date(payment.qr_expiration).toISOString()
            }
        });

    } catch (error) {
        console.error('KHQR generation error:', error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to generate KHQR", 
            error: error.message 
        });
    }
};


export const checkPaymentStatus = async (req,res) => {
    try {
        const {qr_md5} = req.body;
        const {order_id} = req.params;

        if (!qr_md5) {
            return res.status(400).json({ 
                success: false, 
                message: "qr_md5 is required" 
            });
        }

        const order = await db.Order.findByPk(order_id);
        if(!order) {
            return res.status(404).json({success : false, message : "order not found!"});
        }

        const payment = await db.Payment.findOne({
            where : {qr_md5},   
        })

        if(!payment) return res.status(404).json({success : false, message : "User haven't paid yet!"});

        const response = await axios.post(
            `${process.env.BAKONG_PROD_BASE_API_URL}/check_transaction_by_md5`,{md5 :payment.qr_md5},{headers :{Authorization : `Bearer ${process.env.BAKONG_ACCESS_TOKEN}`}}
        )
        const data = response.data;
        
        console.log(data);
        if(data.responseCode === 0 && data.data?.hash) {
            await payment.update(
                {
                    bakongHash: data.data.hash,
                    fromAccountId : data.data.fromAccountId,
                    toAccountId : data.data.toAccountId,
                    currency : data.data.currency,
                    amount : data.data.amount,
                    description : data.data.description,
                    createdDateMs : data.data.createdDateMs,
                    acknowledgeDateMs : data.data.acknowledgeDateMs,
                    trackingStatus : data.data.trackingStatus,
                    receiverBank : data.data.receiverBank,
                    receiverBankAccount : data.data.receiverBankAccount,
                    paid : true,
                    paid_at : new Date(),
                    status : 'paid'
                }
            );

            await order.update({
                status: 'paid', // or 'completed', 'confirmed' - whatever your Order model uses
                paid_at: new Date()
            });

            io.emit('paymentConfirmed', {
                order_id: order.id,
                order_number: order.order_number,
                payment_id: payment.id,
                amount: payment.amount,
                paid_at: payment.paid_at,
                bakongHash: data.data.hash
            });

            return res.status(200).json({success : true, message : "Payment confirmed!✅", 
                data : {
                    order_id : order.id,
                    bakongHash : data.data.hash,
                    
                }
            });
        
        }
        else {
            return res.status(400).json({success : false, message : "Payment not found not!"});
        }

    }
    catch(error) {
        return res.status(400).json({success: false, message : error.message})
    }
    
}


export const getPaymentByOrderId = async (req, res) => {
    try {
        const {order_id} = req.params;

        const payment = await db.Payment.findOne({where : {order_id}});

        if(!payment) return res.status(404).json({success : false, message : 'payment not found!'});

        return res.status(200).json({
            success : true,
            message : "payment fetched successfully!",
            data : payment,
        })
    }
    catch(error) {
        return res.status(500).json({success : false, message : "Failed to fetch payment"})
    }
}