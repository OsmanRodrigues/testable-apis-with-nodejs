class ProductsController {
    constructor(Product) {
        this.Product = Product;
    }

    async get(req, res) {
        try {
            const products = await this.Product.find({});
            return res.send(products);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    async getById(req, res) {
        const {
            params: { id }
        } = req;

        try {
            const product = await this.Product.find({ _id: id });
            res.send(product);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    async create(req, res) {
        try {
            const product = new this.Product(req.body);

            await product.save();
            res.status(201).send(product);
        } catch (err) {
            res.status(422).send(err.message);
        }
    }

    async update(req, res) {
        const {
            body,
            params: { id }
        } = req;
        try {
            const updateRes = await this.Product.updateOne({ _id: id }, body);

            if (updateRes?.ok !== 1 || updateRes?.nModified === 0) {
                res.status(304).send();
            } else {
                res.status(200).send(body);
            }
        } catch (err) {
            res.status(422).send(err.message);
        }
    }

    async delete(req, res) {
        try {
            await this.Product.deleteOne({
                _id: req.params.id
            });
            res.status(204).send(undefined);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
}

export default ProductsController;
