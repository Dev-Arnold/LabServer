import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:false
    },
    role: { 
        type: String, 
        default: "User",
        enum:["Admin","Staff","User"],
    } 

},{timestamps:true})

const User = mongoose.model('User',userSchema);
export default User