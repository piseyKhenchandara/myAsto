import http from './http'

export const createKHQRPaymentAPI = async (order_id) => {

    const {data} = await http.post(`/payment/${order_id}/usd`);
    return data.data;
}

export const checkPaymentStatus = async (qr_md5, order_id) =>  {

    const {data} = await http.post(`/payment/${order_id}/check_status`, {qr_md5});
    return data
}

export const getPaymentByOrderId = async (order_id) => {
    const {data} = await http.get(`/payment/${order_id}`);
    return data;
}