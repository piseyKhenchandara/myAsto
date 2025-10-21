// controllers/notification.controller.js
import db from '../models/index.js';

const { Notification } = db;

// GET all notifications (for admin/seller to VIEW)
export const getNotifications = async (req, res) => {
  try {
    const { role } = req.user;

    if (role !== 'admin' && role !== 'seller') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const notifications = await Notification.findAll({
      where: { target_role: role },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    const unreadCount = await Notification.count({
      where: { target_role: role, read: false }
    });

    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH mark as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    const notification = await Notification.findOne({
      where: { id, target_role: role }
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.update({ 
      read: true, 
      readAt: new Date() 
    });

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PATCH mark all as read
export const markAllAsRead = async (req, res) => {
  try {
    const { role } = req.user;

    await Notification.update(
      { read: true, readAt: new Date() },
      { where: { target_role: role, read: false } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};