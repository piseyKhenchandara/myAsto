import { Children, createContext, useState } from "react";
import { socket } from "../socket";


const NotificationContext = createContext();

export const NotificationProvider = ({children}) => {
    const [notification, setNotification] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);


    useEffect(() => {
        socket.on('newOrder', (order) => {
            addNotification({
                id : Date.now(),
                type : 'order',
                message : `New order : ${order.order_number}`,
                data : order,
                timestamp : new Date(),
                read : false,
            });
        });

        socket.on('newUser', (user) => {
            addNotification({
                id : Date.now(),
                type : 'user',
                message : `New user registered : ${user.username}`,
                data : user,
                timestamp : new Date(),
                read : false,
            });
        });
    })


}