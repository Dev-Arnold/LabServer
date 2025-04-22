import e from "express";
const productRouter = e.Router();
import { upload } from "../cloudinaryConfig.js";
import { addProduct, delProduct, getAllProducts, getOneProduct, updateOneProduct } from "../controllers/productController.js";

productRouter.post('/',upload.single('image'), addProduct);

productRouter.delete('/:id',delProduct);

productRouter.put('/:id',updateOneProduct);

productRouter.get('/:id',getOneProduct);

productRouter.get('/',getAllProducts);

export default productRouter

// blaq diamond - summar mohit 

// Tumisho - sax dance