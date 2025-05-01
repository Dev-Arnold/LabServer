import e from "express";
import { get1Order, getOrderByUser, getOrders, getRecentOrders, placeOrder } from "../controllers/orderController.js";
const orderRouter = e.Router();
import authorize from "../middlewares/authorize.js";

orderRouter.post('/placeorder',authorize(["Admin","Staff","User"]) , placeOrder);

orderRouter.get('/my-orders', authorize(["Admin","Staff","User"]) , getOrderByUser); 

orderRouter.get('/', authorize(["Admin","Staff","User"]) , getOrders);

orderRouter.get('/recent' , getRecentOrders);

orderRouter.get('/:id', authorize(["Admin","Staff","User"]) , get1Order); 

export default orderRouter; 