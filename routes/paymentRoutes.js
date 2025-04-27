import e from "express";
const paymentRouter = e.Router();
import { verifyPayment } from "../controllers/paymentController.js";
import authorize from "../middlewares/authorize.js";

paymentRouter.post('/verify-payment',authorize(["Admin","Staff","User"]) ,verifyPayment);

export default paymentRouter;