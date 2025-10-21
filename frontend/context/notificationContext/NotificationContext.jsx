import { Children, createContext, useContext, useState } from "react";
import { socket } from "../../socket";
import { useEffect } from "react";
import { useUser } from "../UserContext";


const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [notification, setNotification] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const {user} = useUser();

    const addNotification = (notif) => {
        setNotification((prevNotifs) => [notif, ...prevNotifs]);
        setUnreadCount((prevCount) => prevCount + 1);
    }


    useEffect(() => {


        if(user && (user.role === 'admin' || user.role === 'seller')) {
            socket.emit('join', { role: user.role });
        }
        
        const onNewOrder = (order) => addNotification({
            id: `order-${order.order_id}-${Date.now()}`,
            type: 'order',
            message: `New order: ${order.order_number}`,
            order_number : order.order_number,
            createdAt : order.createdAt,
            read: false
        });

        const onNewUser = (user) => addNotification({
            id: `user-${user.id}-${date.now()}`,
            type : 'user',
            message : `New user : ${user.name || user.username}`,
            email : user.email,
            createdAt : user.createdAt,
            read : false,
        })


        const onUserVerified = (payload) => addNotification({
            id: `verified-${payload.id}-${Date.now()}`,
            type: 'userVerified',
            message: `User verified: ${payload.name}`,
            email: payload.email,
            createdAt : payload.createdAt,
            read: false
        });

        const onPaymentConfirmed = (payload) => addNotification({
            id: `payment-${payload.order_id}-${Date.now()}`,
            type: 'payment',
            message: `Payment confirmed: ${payload.order_number} ($${payload.amount})`,
            order_number : payload.order_number,
            createdAt : payload.paid_at,
            read: false
        });


        socket.on('newOrder', onNewOrder);
        socket.on('newUser', onNewUser);
        socket.on('userVerified', onUserVerified);
        socket.on('paymentConfirmed', onPaymentConfirmed);


        return () => {
            socket.off('newOrder', onNewOrder);
            socket.off('newUser', onNewUser);
            socket.off('userVerified', onUserVerified);
            socket.off('paymentConfirmed', onPaymentConfirmed);
        }


    },[]);

    const markAllAsRead = () => {
        setNotification(pre => pre.map(n => ({...n, read : true})));
        setUnreadCount(0)
    }


    const markAsRead = (id) => {
        setNotification(pre => pre.map(n => n.id === id ? {...n, read :true} : n));
        setUnreadCount(pre => Math.max(0, pre-1));
    }

    return <NotificationContext.Provider value={{
        notification,
        unreadCount,
        markAllAsRead,
        markAsRead
    }}>

        {children}
    </NotificationContext.Provider>

}


export const useNotifications = () => {
    const context = useContext(NotificationContext);

    if(!context) throw new Error('useNotifications must be used within NotificationProvider')
    return context;
}