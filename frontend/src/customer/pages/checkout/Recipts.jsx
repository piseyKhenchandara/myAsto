import React, { useEffect, useState } from 'react'
import { reciptsAPI } from '../../../api/Recipt.api';
import { useUser } from '../../../../context/UserContext';
import ReciptBody from '../../components/recipt/ReciptBody';
import ReciptHeader from '../../components/recipt/reciptHeader';
import asto_logo from '../../../assets/logoes/asto_logo.png'
import { useOutletContext } from 'react-router-dom';

const Recipts = () => {
    const { user: whoami } = useUser();
    const {visible = false} = useOutletContext() || {};


    const [message, setMessage] = useState({ type: '', text: '' });
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);

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
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg font-semibold">Loading receipts...</div>
            </div>
        );
    }

    if (message.type === 'error') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {message.text}
                </div>
            </div>
        );
    }

    if (!receipts || receipts.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-gray-600">No receipts found</div>
            </div>
        );
    }

    return (
        <div className=" mx-auto p-4 max-w-[1920px]">
         
            


            <div className= 'grid min-[840px]:grid-cols-2 xl:grid-cols-3 gap-6'>
                
                {receipts.map((payment, index) => (
                    <div key={payment.id || index} className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 p-5">
                        {/* Receipt Header */} 
                        <ReciptHeader asto_logo= {asto_logo}/>

                        {/* Receipt Body */}
                        <ReciptBody
                            cart={payment.Order?.OrderItems || []}
                            getCartCount={() => getCartCount(payment.Order?.OrderItems)}
                            calculateTotal={() => calculateTotal(payment.Order?.OrderItems)}
                            whoami={{ name: payment.Order?.customer_name }}
                            phoneNumber={payment.Order?.phone_number}
                            selectedLocation={payment.Order?.shipping_address}
                            selectedDeliveryCompany={payment.Order?.delivery_company}
                        />
                    </div>
                ))}
                
            </div>
        </div>
    );
}

export default Recipts;