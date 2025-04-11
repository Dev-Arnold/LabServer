import e from "express";
const app = e();
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import errorHandler from './middlewares/errorHandler.js'
import connectDB from "./dbconfig/dbconfig.js";
import authRouter from "./routes/authRoutes.js";
import productRouter from "./routes/productRoutes.js";
// import cors from 'cors'
const port = process.env.PORT || 2600;
    
connectDB()

app.use(e.json());
app.use(e.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(cors({
//     origin: ['https://coinflow-phi.vercel.app','http://localhost:5173'], 
//     credentials: true,
//     optionsSuccessStatus: 200
// }));

app.use('/auth', authRouter)

app.use('/product',productRouter)

app.use(errorHandler)

app.listen(port,()=>{
    console.log(`server is running on port : ${port}`)
})