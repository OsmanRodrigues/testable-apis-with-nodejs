import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import Product from '../../../src/models/product';

describe('Controllers: Products', () => {
    const defaultProduct = [{
        name: 'Default product',
        description: 'product description',
        price: 100
    }]
    describe('get() products', () => {
        it('should return a list of products', async () => {
            const req = {};
            const res = {
                send: sinon.spy()
            };
            Product.find = sinon.stub();
            Product.find.withArgs({}).resolves(defaultProduct);
            const productsController = new ProductsController(Product);
            
            await productsController.get(req, res);

            sinon.assert.calledWith(res.send, defaultProduct);
        });
        it('should return 400 when an error occurs', async () => { 
            const req = {};
            const res = {
                send: sinon.spy(),
                status: sinon.stub()
            }

            res.status.withArgs(400).returns(res);
            Product.find = sinon.stub();
            Product.find.withArgs({}).rejects({ message: 'Error' });

            const productsController = new ProductsController(Product);
            await productsController.get(req, res);

            sinon.assert.calledWith(res.send, 'Error');
        });
    });
});