class ProductsController {
    constructor(Product) { 
        this.Product = Product;
    }
    
    async get(req, res) {
        const products = await this.Product.find({});
        return res.send(products);
    }
 };

export default ProductsController;