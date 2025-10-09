import e from "express";
import { get1Order, getOrderByUser, getOrders, getRecentOrders, placeOrder, confirmPayment } from "../controllers/orderController.js";
const orderRouter = e.Router();
import authorize from "../middlewares/authorize.js";
import upload from "../middlewares/upload.js";

orderRouter.post('/placeorder',authorize(["Admin","Staff","User"]) , placeOrder);

orderRouter.get('/my-orders', authorize(["Admin","Staff","User"]) , getOrderByUser); 

orderRouter.get('/', authorize(["Admin","Staff","User"]) , getOrders);

orderRouter.get('/recent' , getRecentOrders);

orderRouter.post('/confirm-payment', authorize(["Admin","Staff","User"]), upload.single('paymentProof'), confirmPayment);

orderRouter.get('/:id', authorize(["Admin","Staff","User"]) , get1Order); 

export default orderRouter; 