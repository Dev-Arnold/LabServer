import e from "express";
const productRouter = e.Router();
import { upload } from "../cloudinaryConfig.js";
import { addProduct, delProduct, getAllProducts, getLatestProducts, getOneProduct, getProductByCategory, updateOneProduct } from "../controllers/productController.js";
import authorize from "../middlewares/authorize.js";

productRouter.post('/',upload.single('image'), authorize(["Admin","Staff"]), addProduct);

productRouter.delete('/:id',authorize(["Admin"]),delProduct);

productRouter.get('/latest', getLatestProducts);

productRouter.get('/:id',getOneProduct);

productRouter.put('/:id',updateOneProduct);

productRouter.get('/category/:category',getProductByCategory);

productRouter.get('/',getAllProducts);

export default productRouter 