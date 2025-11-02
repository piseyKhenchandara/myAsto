import { createContext, useContext, useState, useEffect, useCallback } from "react";
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
    const [page, setPage] = useState(1); 
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const {user} = useUser();

    const addNotification = (notif) => {
        setNotification((prevNotifs) => [notif, ...prevNotifs]);
        setUnreadCount((prevCount) => prevCount + 1);
    }

    const fetchNotifications = useCallback(async (pageNum = 1, append = false) => {
        try {
            setLoading(true);
            const data = await getNotificationsAPI({page: pageNum, limit: 15});

            if(append) {
                setNotification(prev => [...prev, ...(data.notifications || [])]);
            } else {
                setNotification(data.notifications || []);
            }

            setUnreadCount(data.unreadCount || 0);
            setHasMore(data.hasMore || false);
            setPage(pageNum);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false); // ❌ YOU WERE MISSING THIS!
        }
    }, []);

    // ✅ Add loadMoreNotifications function
    const loadMoreNotifications = useCallback(() => {
        if (!loading && hasMore) {
            fetchNotifications(page + 1, true);
        }
    }, [loading, hasMore, page, fetchNotifications]);

    useEffect(() => {
        if(user && (user.role === 'admin' || user.role === 'seller')) {
            
            // Initial fetch
            fetchNotifications(1, false);

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
    }, [user, fetchNotifications]);

    const markAllAsRead = async () => {
        try {
            await markAllAsReadAPI();
            setNotification(prev => prev.map(n => ({...n, read: true})));
            setUnreadCount(0);
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    }

    const markAsRead = async (id) => {
        try {
            await markAsReadAPI(id);
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
            markAsRead,
            loadMoreNotifications, // ❌ YOU WERE MISSING THIS!
            hasMore,                // ❌ YOU WERE MISSING THIS!
            loading                 // ❌ YOU WERE MISSING THIS!
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