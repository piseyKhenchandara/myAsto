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

