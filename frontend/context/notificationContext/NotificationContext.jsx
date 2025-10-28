import { createContext, useContext, useState, useEffect } from "react";
import { socket } from "../../socket";
import { useUser } from "../UserContext";
import { 
    getNotificationsAPI, 
    markAsReadAPI, 
    markAllAsReadAPI 
} from "../../src/api/notification.api";

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
            
       
            const fetchNotifications = async () => {
                try {
                    const data = await getNotificationsAPI();
                    setNotification(data.notifications || []);
                    setUnreadCount(data.unreadCount || 0);
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                }
            };

            fetchNotifications();

            socket.emit('join', { role: user.role });
            

            const onNewOrder = (order) => addNotification({
                id: order.id,
                type: 'order',
                message: order.message || `New order: ${order.order_number}`,
                data: order.data || {},
                createdAt: order.createdAt,
                read: false
            });

            const onNewUser = (payload) => addNotification({
                id: payload.id,
                type: 'user',
                message: payload.message || `New user: ${payload.name}`,
                data: payload.data || {},
                createdAt: payload.createdAt,
                read: false
            });

            const onUserVerified = (payload) => addNotification({
                id: payload.id,
                type: 'userVerified',
                message: payload.message || `User verified: ${payload.name}`,
                data: payload.data || {},
                createdAt: payload.createdAt,
                read: false
            });

            const onPaymentConfirmed = (payload) => addNotification({
                id: payload.id,
                type: 'payment',
                message: payload.message || `Payment confirmed: ${payload.order_number}`,
                data: payload.data || {},
                createdAt: payload.createdAt,
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
        }
    }, [user]);

    const markAllAsRead = async () => {
        try {
            // Update in backend using API
            await markAllAsReadAPI();
            
            // Update local state
            setNotification(prev => prev.map(n => ({...n, read: true})));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }

    const markAsRead = async (id) => {
        try {
            // Update in backend using API
            await markAsReadAPI(id);
            
            // Update local state
            setNotification(prev => prev.map(n => 
                n.id === id ? {...n, read: true} : n
            ));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }

    return (
        <NotificationContext.Provider value={{
            notification,
            unreadCount,
            markAllAsRead,
            markAsRead
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if(!context) throw new Error('useNotifications must be used within NotificationProvider');
    return context;
}