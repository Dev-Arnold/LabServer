import user from "../models/User.js";
import jwt from 'jsonwebtoken'

const updateUser = async (req, res, next) => {
    try {
        const {id} = req.params;
        const updatedData = req.body;
        const updatedUser = await user.findByIdAndUpdate(id,updatedData,{new:true})

        if(!updatedUser) return res.status(404).json({message:"User not found"})

        res.status(201).json({ message: "User updated successfully!" });
    } catch (err) {
        console.error(`Failed to update user : ${err}`);
        next(err);
    }
}

const delUser = async (req,res)=>{
    try {
        const {id} = req.params
        const deletedUser = await user.findByIdAndDelete(id)

        if(!deletedUser) return res.status(404).json({message:"User not found"})

        res.status(200).json({message:"User deleted successfully"});

    } catch (error) {
        console.log(`Error while deleting user : ${error}`)
        next(error)
    }

}

const getUsers = async (req,res,next)=>{
    try {
        let allUsers = await user.find()
        res.json(allUsers)
    } catch (error) {
        console.log(`Error while fetching users : ${error}`)
        next(error)
    }
}

const getAllStaff = async (req, res) => {
    try {
        const staff = await user.find({ role: "Staff" }).select("-password");
        if (!staff) return res.status(404).json({ message: "No staff found" });
        res.json(staff);
    } catch (err) {
        console.error(`Failed to get all staff: ${err}`);
        res.status(500).json({ message: "Internal server error" });
    }
}

const userProfile = async (req, res) => {
    try {
        let {id} = req.params;

        const userData = await user.findById(id).select("-password"); // Exclude password

        if (!userData) return res.status(404).json({ message: "User not found" });

        res.status(200).json({userData});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
}

export {
    updateUser,
    delUser,
    getUsers,
    userProfile,
    getAllStaff
}