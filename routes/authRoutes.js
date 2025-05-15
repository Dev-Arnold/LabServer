import e from "express";
import { changePassword, forgot_password, logout, reset_password, signin, signup } from "../controllers/authController.js";
import authorize from "../middlewares/authorize.js";
import User from "../models/User.js";
const authRouter = e.Router();

authRouter.post('/',signup);

authRouter.post('/login',signin)


authRouter.get('/check', authorize(['Admin', 'Staff', 'User']), (req, res) => {
    res.json({
      loggedIn: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      }
    })
})

authRouter.post('/logout',logout)

authRouter.post('/reset-password/:token', reset_password);

authRouter.post('/forgot-password', forgot_password);

authRouter.get('/admin', authorize(['Admin']), async (req, res) => {
    const admin = await User.findById(req.user.id).select('-password'); 
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json(admin);
});

authRouter.post('/change-password', authorize(["Admin","Staff","User"]), changePassword)

export default authRouter