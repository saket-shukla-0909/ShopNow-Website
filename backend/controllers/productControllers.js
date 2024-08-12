import Product from '../models/products.js';


// Create new Product => /api/v1/products
export const getProducts = async (req, res)=>{
    const products = await Product.find();
    res.status(200).json({products,});
};

// Create new Product => /api/v1/admin/products
export const newProduct = async (req, res)=>{
    const product = await Product.create();

    res.status(200).json({product,});
};


// Get single product details => /api/v1/:id
export const getProductDetails = async (req, res)=>{
    const product = await Product.findById(req?.params?.id);
    if(!product){
        return res.status(404).json({error:'Product not found',});
    };
}