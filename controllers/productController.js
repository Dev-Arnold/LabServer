import Product from "../models/Product.js";
import redis from '../redis.js'; // Assuming you have a redis.js file that exports the Redis instance


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
        await redis.del('homepage:products');
        await redis.del('shopPage:products');
        await redis.del('category:products');

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

        await redis.del('homepage:products');
        await redis.del('shopPage:products');
        await redis.del('category:products');
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

        let updatedProduct = await Product.findByIdAndUpdate(id,updatedData,{new:true}); 
        if(!updatedProduct) return res.status(404).json({message:"product not found"}); 

        await redis.del('homepage:products');
        await redis.del('shopPage:products');
        await redis.del('category:products');
        res.status(200).json({message:"product updated successfully"});

    } catch (error) {
        console.log(`Error while updating product : ${error}`)
        next(error)
    }
}

const getAllProducts = async (req, res, next) => {
    try {
        const cached = await redis.get('shopPage:products');
  
        if (cached) {
          console.log('Serving from cache 🔥');
          return res.status(200).json(JSON.parse(cached));
        }
    
        console.log('Cache not found, fetching from DB...');
        let products = await Product.find();

        if (!products) {
            return res.status(404).json({ message: "No product found" })
        }

        await redis.set('shopPage:products', JSON.stringify(products), 'EX', 300);
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
        const cached = await redis.get('category:products');
  
        if (cached) {
          console.log('Serving from cache 🔥');
          return res.status(200).json(JSON.parse(cached));
        }
    
        console.log('Cache not found, fetching from DB...');
        let { category } = req.params;
        let products = await Product.find({ category });

        if (!products || products.length === 0) return res.status(404).json({ message: "No product found" });

        await redis.set('category:products', JSON.stringify(products), 'EX', 300);
        res.status(200).json(products);
    }
    catch (error) {
        console.log(`Error while fetching Product : ${error}`);
        next(error);
    }
}


const getLatestProducts = async (req, res, next) => {
    try {
      const cached = await redis.get('homepage:products');
  
      if (cached) {
        console.log('Serving from cache 🔥');
        return res.status(200).json(JSON.parse(cached));
      }
  
      console.log('Cache not found, fetching from DB...');
      const fewProds = await Product.find()
        .sort({ createdAt: -1 })
        .limit(10);
  
      if (!fewProds || fewProds.length === 0) {
        return res.status(404).json({ message: "No products found" });
      }
  
      await redis.set('homepage:products', JSON.stringify(fewProds), 'EX', 300);
      console.log('Serving from DB and caching it 💾');
  
      res.status(200).json(fewProds);
    } catch (error) {
      console.error(`Error while fetching latest products: ${error}`);
      next(error);
    }
  };
  

export {
    addProduct,
    delProduct,
    getOneProduct,
    getAllProducts,
    updateOneProduct,
    getProductByCategory,
    getLatestProducts
}