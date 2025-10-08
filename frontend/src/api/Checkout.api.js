import http from "./http";

export const orderAPI = async ({payload}) => {
    const {
        total_price,
        customer_name,
        phone_number,
        shipping_address,
        delivery_method,
        cart,
        payment_method
    } = payload;

    const {data} = await http.post('/checkout/',payload);
    return data;

}