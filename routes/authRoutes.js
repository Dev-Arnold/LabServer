import e from "express";
import { logout, signin, signup } from "../controllers/authController.js";
const authRouter = e.Router();

authRouter.post('/',signup);

authRouter.post('/login',signin)

authRouter.post('/logout',logout)

export default authRouter
