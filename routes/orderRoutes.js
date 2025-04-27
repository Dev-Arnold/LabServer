import e from "express";
import { get1Order, getOrderByUser, getOrders, placeOrder } from "../controllers/orderController.js";
const orderRouter = e.Router();
import authorize from "../middlewares/authorize.js";

orderRouter.post('/placeorder',authorize(["Admin","Staff","User"]) , placeOrder);

orderRouter.get('/', authorize(["Admin","Staff","User"]) , getOrders);

orderRouter.get('/:id', authorize(["Admin","Staff","User"]) , get1Order); 

orderRouter.get('/user/:id', authorize(["Admin","Staff","User"]) , getOrderByUser); 

export default orderRouter; 