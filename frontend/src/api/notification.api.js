
import http from "./http";


export const getNotificationsAPI = async () => {
    const { data } = await http.get('/notifications');
    return data; 
}


/* export const getUnreadNotificationsAPI = async () => {
    const { data } = await http.get('/notifications/unread');
    return data; 
} */


export const markAsReadAPI = async (id) => {
    const { data } = await http.patch(`/notifications/${id}/read`);
    return data; 
}


export const markAllAsReadAPI = async () => {
    const { data } = await http.patch('/notifications/read-all');
    return data; 
}

