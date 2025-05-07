import e from "express";
const app = e();
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import errorHandler from './middlewares/errorHandler.js'
import connectDB from "./dbConfig/dbconfig.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
// const paymentRoutes = require('./routes/paymentRoutes');
import paymentRouter from "./routes/paymentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from 'cors'
const port = process.env.PORT || 2600;
    
connectDB()

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:5173","accon-lab.vercel.app"],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use('/auth', authRouter) 

app.use('/product',productRouter)

app.use('/order',orderRouter)

app.use('/notification',notificationRouter)

app.use('/user',userRoutes)

app.use('/api/payment', paymentRouter);

app.use(errorHandler)

app.listen(port,()=>{
    console.log(`server is running on port : ${port}`)
})