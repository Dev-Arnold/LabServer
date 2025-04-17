import e from "express";
import { get1Order, getOrderByUser, getOrders, placeOrder } from "../controllers/orderController.js";
const orderRouter = e.Router();

orderRouter.post('/placeorder', placeOrder);

orderRouter.get('/', getOrders);

orderRouter.get('/:id', get1Order); 

orderRouter.get('/user/:id', getOrderByUser); 

export default orderRouter; 