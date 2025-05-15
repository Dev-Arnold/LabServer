import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    sku:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    oldPrice:{
        type: Number,
        required: true
    },
    productQuantity:{
        type: Number,
        required: true 
    },
    category:{
        type: String,
        required: true,
        enum:[
            "hospital",
            "education",
            "lab",
            "surgical",
            "biology",
            "chemistry",
            "physics"
        ],
    },
    rating:{
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    status:{
        type: String,
        enum:["new","regular"],
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product; 