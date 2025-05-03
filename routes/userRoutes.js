import e from "express";
const userRouter = e.Router();
import { getUsers, updateUser, delUser, getAllStaff } from "../controllers/userController.js";
import authorize from "../middlewares/authorize.js";

userRouter.get("/", authorize(["Admin"]), getUsers);

userRouter.put("/:id", authorize(["Admin"]), updateUser);

userRouter.delete("/:id", authorize(["Admin"]), delUser);

userRouter.get("/staff", authorize(["Admin"]), getAllStaff);


export default userRouter;