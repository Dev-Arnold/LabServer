import Notification from '../models/Notification.js';

const getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
}

const getUnreadCount = async (req, res) => {
    try {
      const unreadCount = await Notification.countDocuments({ read: false });
      res.json({ unreadCount });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching unread count' });
    }
}

const markAsRead = async (req, res) => {
    try {
      const { id } = req.params;
      await Notification.findByIdAndUpdate(id, { read: true });
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      res.status(500).json({ message: 'Error marking notification as read' });
    }
}

const markAllAsRead = async (req, res) => {
    try {
      await Notification.updateMany({ read: false }, { read: true });
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
      res.status(500).json({ message: 'Error marking all notifications as read' });
    }
}

const delNotification = async (req, res) => {
    try {
      const { id } = req.params;
      await Notification.findByIdAndDelete(id);
      res.status(200).json({ message: 'Notification deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting notification' });
    }
}
const delAllNotifications = async (req, res) => {
    try {
      await Notification.deleteMany({});
      res.status(200).json({ message: 'All notifications deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting all notifications' });
    }
}

export { getNotifications, getUnreadCount, markAsRead, markAllAsRead, delNotification, delAllNotifications };