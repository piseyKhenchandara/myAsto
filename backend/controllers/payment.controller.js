import db from "../models.js";
import {BakongKHQR, khqrData, INdividualInfo} from 'bakong-khqr';


const BAKONG_BASE_URL = process.env.BAKONG_PROD_BASE_API_URL;
const BAKONG_ACCESS_TOKEN = process.env.BAKONG_ACCESS_TOKEN;

export const createKHQRPayment = async (req,res) => {
    try {
        const {order_id} = req.body;

        if(!order_id) {
            return res.status(400).json({
                success : false, 
                message : "Order_id is required!"
            })
        }

        const order = await db.Order.findByPk(order_id);
        if(!order) {
            return res.status(404).json({
                sucess : false,
                message : "Order not found!"
            })
        }

        const payment = await db.Payment.findOne({where : {order_id : order_id}})

        if(!payment) {
            return res.status(404).json({ 
                success: false, 
                message: "Payment not found for this order" 
            });

        }
        //Generate KHQR
        const expirationTimestamp = Date.now() + 5 *60 * 1000;
        
        
        const optionalData = {
            currency : khqrData.currency.khr,
            amount : parseFloat(order.amount),
            expirationTimestamp,
        };

        const individualInfo = new INdividualInfo(
            process.env.BAKONG_ACCOUNT_USERNAME,
            process.env.BAKONG_ACCOUNT_NAME || "ASTO",
            "PHNOM PENH",
            optionalData
        );



        const khqr = new BakongKHQR();
        const qrData = khqr.generateIndividual(individualInfo);

        await payment.update({
            currency : "USD",
            qr_code : qrData.data.qr,
            qr_md5 : qrData.data.md5,
            qr_expiration : expirationTimestamp,
        })

        return res.status(201).json({
            success : true,
            message : "KHQR generated successfully!",
            data : {
                payment_id : payment.id,
                order_id : order.id,
                order_number : order.order_number,
                qr_code: payment.qr_code,
                qr_md5: payment.qr_md5,
                amount: payment.amount,
                currency: payment.currency,
                qr_expiration: new Date(payment.qr_expiration).toISOString()

            }
        });

    }
    catch (error) {
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
        const {order_id, qr_md5} = req.body;

        if (!qr_md5) {
            return res.status(400).json({ 
                success: false, 
                message: "qr_md5 is required" 
            });
        }

        const order = await db.Order.findByPk({id : order_id});
        if(!order) {
            return res.status(404).json({success : false, message : "order not found!"});
        }

        const payment = await db.Payment.findOne({
            where : {qr_md5},   
        })

        if(!payment) res.status(404).json({success : false, message : "User haven't paid yet!"});

        const response = await axios.post(
            `${BAKONG_BASE_URL}/v1/check_transaction_by_md5`,{qr_md5 :payment.qr_md5},{header :{Authorization : `Bearer ${BAKONG_ACCESS_TOKEN}`}}
        )
        const data = response.data;

        if(data.responseCode === 0 && data.data?.hash) {
            await payment.updateOne({where : {order_id : order.id }},
                {
                    bakongHash: data.data.hash,
                    fromAccountId : data.data.fromAccountId,
                    toAccount : data.data.toAccount,
                    currency : data.data.currency,
                    amount : data.data.amount,
                    description : data.data.description,
                    createdDateMs : data.data.createdDateMs,
                    acknowledgeDateMs : data.data.acknowledgeDateMs,
                    trackingStatus : data.data.trackingStatus,
                    receiverBank : data.data.receiverBank,
                    receiverBankAccount : data.data.receiverBankAccount,
                    responseCode : data.data.responseCode,
                    responseMessage : data.data.responseMessage,
                    paid : true,
                    paid_at : new Date()
                }
            );

            return res.status(200).json({success : true, message : "Payment confirmed", 
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