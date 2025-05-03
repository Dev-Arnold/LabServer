import e from "express";
import { delAllNotifications, delNotification, getNotifications, getUnreadCount, markAllAsRead, markAsRead } from "../controllers/notificationController.js";
import authorize from "../middlewares/authorize.js";
const notificationRouter = e.Router();

notificationRouter.get('/',authorize(['Admin','Staff']), getNotifications);

notificationRouter.get('/unread-count',authorize(['Admin','Staff']), getUnreadCount);

notificationRouter.post('/mark-as-read/:id',authorize(['Admin','Staff']), markAsRead);

notificationRouter.post('/mark-all-read',authorize(['Admin','Staff']), markAllAsRead)

notificationRouter.delete('/delete/:id',authorize(['Admin']), delNotification);

notificationRouter.delete('/delete-all',authorize(['Admin']), delAllNotifications)

export default notificationRouter;