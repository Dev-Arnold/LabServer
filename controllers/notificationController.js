import Notification from '../models/Notification.js';

const getNotifications = async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ createdAt: -1 }).limit(20);
      res.json(notifications);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching notifications' });
    }
}

export { getNotifications };