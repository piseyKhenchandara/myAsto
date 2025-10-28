import React, { useEffect, useState } from 'react'
import { reciptsAPI } from '../../../api/Recipt.api';
import { useUser } from '../../../../context/UserContext';
import ReciptBody from '../../components/recipt/ReciptBody';
import ReciptHeader from '../../components/recipt/ReciptHeader';
import asto_logo from '../../../assets/logoes/asto_logo.png'
import { useOutletContext } from 'react-router-dom';

const Recipts = ({whoami}) => {
  
    const {visible = false} = useOutletContext() || {};

    const [message, setMessage] = useState({ type: '', text: '' });
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Helper function to check if receipt is new (less than 24 hours)
    const isNewReceipt = (createdAt) => {
        const receiptDate = new Date(createdAt);
        const now = new Date();
        const hoursDifference = (now - receiptDate) / (1000 * 60 * 60); // Convert to hours
        return hoursDifference < 24;
    };

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                setLoading(true);
                const response = await reciptsAPI(whoami.id);
                setLoading(false);
                
                if (response.success) {
                    setReceipts(response.data);
                    setMessage({ type: 'success', text: response.message });
                }
            }
            catch (error) {   
                setLoading(false);
                setMessage({ 
                    type: 'error', 
                    text: error.response?.data?.message || error.message || 'Failed to load receipts' 
                });
            }
        }

        if (whoami?.id) {
            fetchReceipts();
        }
    }, [whoami?.id]);

    // Helper function to calculate total from order items
    const calculateTotal = (orderItems) => {
        if (!orderItems || orderItems.length === 0) return 0;
        return orderItems.reduce((sum, item) => {
            return sum + (Number(item.price) * Number(item.quantity));
        }, 0);
    };

    // Helper function to get cart count
    const getCartCount = (orderItems) => {
        if (!orderItems || orderItems.length === 0) return 0;
        return orderItems.reduce((sum, item) => sum + Number(item.quantity), 0);
    };

    if (loading) {
        return (
            <section className="flex justify-center items-center min-h-screen">
                <p className="text-lg font-semibold">Loading receipts...</p>
            </section>
        );
    }

    if (message.type === 'error') {
        return (
            <section className="flex justify-center items-center min-h-screen">
                <aside className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {message.text}
                </aside>
            </section>
        );
    }

    if (!receipts || receipts.length === 0) {
        return (
            <section className="flex justify-center items-center min-h-screen">
                <p className="text-lg text-gray-600">No receipts found</p>
            </section>
        );
    }

    return (
        
        <section className="mx-auto p-4 max-w-[1920px]">
            <div className={`grid ${visible ? "md:grid-cols-1 xl:grid-cols-2" : "min-[840px]:grid-cols-2 xl:grid-cols-3"} gap-6`}>
                
                {receipts.map((payment, index) => (
                    <article key={payment.id || index} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-5 relative">
                        
                        {/* NEW Badge - Shows if receipt is less than 24 hours old */}
                        {isNewReceipt(payment.createdAt) && (
                            <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                                NEW
                            </span>
                        
                        )}

                        {/* Receipt Header */} 
                        <ReciptHeader asto_logo={asto_logo}/>

                        {/* Receipt Body */}
                        <ReciptBody
                            cart={payment.Order?.OrderItems || []}
                            invoiceNumber={payment.Order?.order_number}
                            date = {payment?.createdAt}
                            getCartCount={() => getCartCount(payment.Order?.OrderItems)}
                            calculateTotal={() => calculateTotal(payment.Order?.OrderItems)}
                            whoami={{ name: payment.Order?.customer_name }}
                            phoneNumber={payment.Order?.phone_number}
                            selectedLocation={payment.Order?.shipping_address}
                            selectedDeliveryCompany={payment.Order?.delivery_company}
                        />
                    </article>
                ))}
                
            </div>
        </section>
    );
}

export default Recipts;