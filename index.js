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
import cors from 'cors'
const port = process.env.PORT || 2600;
    
connectDB()

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
    origin: "*"
}));

app.use('/auth', authRouter)

app.use('/product',productRouter)

app.use('/order',orderRouter)

app.use(errorHandler)

app.listen(port,()=>{
    console.log(`server is running on port : ${port}`)
})