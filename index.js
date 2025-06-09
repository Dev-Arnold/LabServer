import e from "express";
const app = e();
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
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
import { dashboardStats } from "./controllers/orderController.js";
const port = process.env.PORT || 2600;
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.',
    standardHeaders: true, // Send rate limit info in `X-RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` legacy headers
});
    
connectDB()

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like curl, Postman)
        if (!origin) return callback(null, true);
        return callback(null, origin); // Reflect the request origin
    },
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(limiter);

app.get('/admin/dashboard', dashboardStats)

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