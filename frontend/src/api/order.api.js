import http from './http'

export const orderAPI = async ({payload}) =>   {
    const {
        amount,
        customer_name,
        phone_number,
        shipping_address,
        discount_amount,    
        delivery_company,
        cart
    } = payload

    const {data} = await http.post('/order/', payload);
    return data;
}


export const getAllWhoOrderedAPI = async (limit, page) => {
    const params = {limit , page} 

    const {data} = await http.get('/order/get-all-users-who-ordered', {params});

    return data;

}

export const getTheReceipt = async (user_id, order_number) => {
    
    const data = await http.get(`/order/get-the-receipt-from-the-user/${user_id}`, {params : {order_number}});
    return data;
}

export const updateDeliveryCheckAPI = async (orderId, delivery_check) => {
    const {data} = await http.patch(`/order/${orderId}/delivery`, { delivery_check });
    return data;
}
