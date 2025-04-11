import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
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
        type: Number,
        required: true
    },
    mainPrice:{
        type: Number,
        required: true
    },
    oldPrice:{
        type: Number,
        required: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product; 