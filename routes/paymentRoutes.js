import e from "express";
const paymentRouter = e.Router();
import { verifyPayment } from "../controllers/paymentController.js";
// const { verifyPayment } = require('../controllers/paymentController');

paymentRouter.post('/verify-payment', verifyPayment);

export default paymentRouter;
