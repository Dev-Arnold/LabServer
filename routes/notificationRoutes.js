import e from "express";
import { getNotifications } from "../controllers/notificationController.js";
const notificationRouter = e.Router();

notificationRouter.get('/', getNotifications);

export default notificationRouter;