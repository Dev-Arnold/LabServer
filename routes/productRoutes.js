import e from "express";
const productRouter = e.Router();
import { upload } from "../cloudinaryConfig.js";
import { addProduct, delProduct, getAllProducts, getOneProduct, updateOneProduct } from "../controllers/productController.js";
import authorize from "../middlewares/authorize.js";

productRouter.post('/',upload.single('image'), authorize(["Admin","Staff"]), addProduct);

productRouter.delete('/:id',authorize(["Admin"]),delProduct);

productRouter.put('/:id',authorize(["Admin","Staff"]),updateOneProduct);

productRouter.get('/:id',getOneProduct);

productRouter.get('/',getAllProducts);

export default productRouter

// blaq diamond - summar mohit 

// Tumisho - sax dance