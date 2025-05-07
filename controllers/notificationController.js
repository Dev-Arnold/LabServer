import Notification from '../models/Notification.js';

const getNotifications = async (req, res, next) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching notifications' });
      next(err)
    }
}

const getUnreadCount = async (req, res, next) => {
    try {
      const unreadCount = await Notification.countDocuments({ read: false });
      res.json({ unreadCount });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching unread count' });
      next(err)
    }
}

const markAsRead = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Notification.findByIdAndUpdate(id, { read: true });
      res.status(200).json({ message: 'Notification marked as read' });
    } catch (err) {
      res.status(500).json({ message: 'Error marking notification as read' });
      next(err)
    }
}

const markAllAsRead = async (req, res, next) => {
    try {
      await Notification.updateMany({ read: false }, { read: true });
      res.status(200).json({ message: 'All notifications marked as read' });
    } catch (err) {
      res.status(500).json({ message: 'Error marking all notifications as read' });
      next(err)
    }
}

const delNotification = async (req, res, next) => {
    try {
      const { id } = req.params;
      await Notification.findByIdAndDelete(id);
      res.status(200).json({ message: 'Notification deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting notification' });
      next(err)
    }
}
const delAllNotifications = async (req, res, next) => {
    try {
      await Notification.deleteMany({});
      res.status(200).json({ message: 'All notifications deleted' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting all notifications' });
      next(err)
    }
}

export { getNotifications, getUnreadCount, markAsRead, markAllAsRead, delNotification, delAllNotifications };