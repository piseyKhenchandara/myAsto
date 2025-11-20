import db from "../models/index.js";
import {BakongKHQR, khqrData, IndividualInfo} from 'bakong-khqr';
import axios from 'axios';
import { io } from "../server.js";
import { Op } from "sequelize";

export const createKHQRPayment = async (req, res) => {
    const {order_id} = req.params;
    try {
        
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

        if (order.user_id !== user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: This order does not belong to you!"
            });
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

        const customerInfo = new IndividualInfo(
            process.env.BAKONG_ACCOUNT_USERNAME,
            process.env.BAKONG_ACCOUNT_NAME || "ASTO",
            "PHNOM PENH",
            optionalData
        );

        const khqr = new BakongKHQR();
        const qrData = khqr.generateIndividual(customerInfo);



        // Check if qrData is valid
        if (!qrData || !qrData.data || !qrData.data.qr) { // ✅ Changed from qrData.data.qr
            throw new Error('KHQR generation failed - no QR code returned');
        }

        await db.sequelize.transaction(async(transaction) => {
            await payment.update({
                currency: "USD",
                qr_code: qrData.data.qr,      
                qr_md5: qrData.data.md5,       
                qr_expiration: expirationTimestamp,
            }, {transaction})
        })

        return res.status(201).json({
            success: true,
            message: "KHQR generated successfully!",
            data: {
                BAKONG_ACCOUNT_NAME : process.env.BAKONG_ACCOUNT_NAME,
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


export const checkPaymentStatus = async (req, res) => {
    const {qr_md5} = req.body;
    const {order_id} = req.params;

    try {
        const order = await db.Order.findByPk(order_id);

        if (!order) {
            return res.status(404).json({
                success: false, 
                message: "Order not found!"
            });
        }

        if (req.user && order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: This order does not belong to you!"
            });
        }

        const payment = await db.Payment.findOne({
            where: {qr_md5, order_id: order_id},   
        });

        if (!payment) {
            console.log('❌ Payment not found'); 
            return res.status(404).json({success: false, message: "User haven't paid yet!"});
        }

        if (payment.paid && payment.status === 'paid') {
            return res.status(200).json({
                success: true, 
                message: "Payment already confirmed!✅", 
                data: {
                    order_id: order.id,
                    order_number: order.order_number,
                    bakongHash: payment.bakongHash, 
                }
            });
        }

        if (payment.qr_expiration && Date.now() > payment.qr_expiration) {
            return res.status(400).json({
                success: false,
                message: "QR code has expired. Please generate a new one."
            });
        }

        const response = await axios.post(
            `${process.env.BAKONG_PROD_BASE_API_URL}/check_transaction_by_md5`,
            {md5: payment.qr_md5},
            {headers: {Authorization: `Bearer ${process.env.BAKONG_ACCESS_TOKEN}`}}
        );

        const data = response.data;
        
        if (data.responseCode === 0 && data.data?.hash) {
            let orderNumber;
            
            await db.sequelize.transaction(async(transaction) => {
                const generateOrderNumber = async () => {
                    const year = new Date().getFullYear();
                    let orderNumber;
                    let attempts = 0;
                    const maxAttempts = 100;
                    
                    while (attempts < maxAttempts) {
                        const count = await db.Order.count({
                            where: {
                                order_number: { [Op.not]: null },
                                createdAt: {
                                    [Op.gte]: new Date(`${year}-01-01`),
                                    [Op.lt]: new Date(`${year + 1}-01-01`)
                                }
                            },
                            transaction
                        });
                        
                        orderNumber = `ORD-${year}-${String(count + 1 + attempts).padStart(6, '0')}`;
                        
                        const existing = await db.Order.findOne({
                            where: { order_number: orderNumber },
                            transaction
                        });
                        
                        if (!existing) {
                            return orderNumber; 
                        } 
                        attempts++;
                    }
                    
                    throw new Error('Could not generate unique order number');
                };

                orderNumber = order.order_number;
                
                if (!orderNumber) {
                    orderNumber = await generateOrderNumber();
                }

                await payment.update({
                    bakongHash: data.data.hash,
                    fromAccountId: data.data.fromAccountId,
                    toAccountId: data.data.toAccountId,
                    currency: data.data.currency,
                    amount: data.data.amount,
                    description: data.data.description,
                    createdDateMs: data.data.createdDateMs,
                    acknowledgeDateMs: data.data.acknowledgedDateMs,
                    trackingStatus: data.data.trackingStatus,
                    receiverBank: data.data.receiverBank,
                    receiverBankAccount: data.data.receiverBankAccount,
                    paid: true,
                    paid_at: new Date(),
                    status: 'paid'
                }, {transaction});
                
                const updateData = {
                    status: 'paid', 
                    paid_at: new Date()
                };
                
                if (!order.order_number) {
                    updateData.order_number = orderNumber;
                }
                
                await order.update(updateData, {transaction});

                const notifications = await Promise.all([
                    db.Notification.create({
                        type: 'payment',
                        message: `Payment confirmed for order: ${orderNumber}`,
                        target_role: 'admin',
                        order_id: order.id,
                        user_id: order.user_id,
                        read: false
                    }, {transaction}),
                    db.Notification.create({
                        type: 'payment',
                        message: `Payment confirmed for order: ${orderNumber}`,
                        target_role: 'seller',
                        order_id: order.id,
                        user_id: order.user_id,
                        read: false
                    }, {transaction})
                ]);

                io.to('room').emit('paymentConfirmed', {
                    id: notifications[0].id,
                    type: notifications[0].type,
                    message: notifications[0].message,
                    order_id: order.id,
                    order_number: orderNumber,
                    amount: payment.amount,
                    paid_at: payment.paid_at,
                    bakongHash: data.data.hash,
                    createdAt: notifications[0].createdAt,
                    read: false
                });
            });
            
            return res.status(200).json({
                success: true, 
                message: "Payment confirmed!✅", 
                data: {
                    order_id: order.id,
                    order_number: orderNumber,
                    bakongHash: data.data.hash,
                }
            });
        } else {
            return res.status(400).json({success: false, message: "Payment not found!"});
        }

    } catch(error) {
        console.error('Payment check error:', error);
        return res.status(400).json({success: false, message: error.message});
    }
};


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