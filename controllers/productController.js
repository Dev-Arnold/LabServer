import Product from "../models/Product.js";

const addProduct = async (req, res, next) => {
    try {
        let imageUrl = req.file ? req.file.path : null; 

        const { productName , description, sku, price, oldPrice, productQuantity, category, rating, status } = req.body;
        // console.log("New user :" + JSON.stringify(req.user))

        const newProduct = new Product({
            productName,
            image: imageUrl,
            description,
            sku,
            price,
            oldPrice,
            productQuantity,
            category,
            rating,
            status
        });
        
        await newProduct.save();

        res.status(201).json({ message: "Product added successfully" });
    } catch (err) {
        console.error(`Failed to add Product : ${err}`);
        // next(err);
    }
};

const delProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "product not found" });
        }

        res.status(200).json({ message: "product deleted successfully" });

    } catch (err) {
        console.error(`Failed to delete product : ${err}`);
        next(err);
    }
}

const updateOneProduct = async(req,res,next)=>{
    try {
        let {id} = req.params;
        let updatedData = req.body;
        console.log(updatedData)

        let updatedProduct = await Deposit.findByIdAndUpdate(id,updatedData,{new:true}); 
        if(!updatedProduct) return res.status(404).json({message:"product not found"}); 

        res.status(200).json({message:"product updated successfully"});

    } catch (error) {
        console.log(`Error while updating product : ${error}`)
        next(error)
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        let products = await Product.find();
        console.log(products)

        if (!products) {
            return res.status(404).json({ message: "No product found" })
        }

        res.status(200).json(products);

    } catch (err) {
        console.error(`Failed to fetch product : ${err}`);
        next(err);
    }
}

const getOneProduct = async (req, res, next) => {
    try {
        let { id } = req.params;
        let oneProduct = await Product.findById(id);

        if (!oneProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(oneProduct);
        
    } catch (error) {
        console.log(`Error while fetching Product : ${error}`);
        next(error);
    }
}

const getProductByCategory = async (req, res, next) => {
    try {
        let { category } = req.params;
        let products = await Product.find({ category });
        console.log(products)
        if (!products) return res.status(404).json({ message: "No product found" });
        res.status(200).json(products);
    }
    catch (error) {
        console.log(`Error while fetching Product : ${error}`);
        next(error);
    }
}

const filterProducts = async (req, res, next) => {
    try {
        const { category } = req.query;
        let products = await Product.find({ category });
        if (!products) return res.status(404).json({ message: "No product found" });
        res.status(200).json(products);
    }
    catch (error) {
        console.log(`Error while fetching Product : ${error}`);
        next(error);
    }
}

export {
    addProduct,
    delProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
    getProductByCategory,
    filterProducts
}