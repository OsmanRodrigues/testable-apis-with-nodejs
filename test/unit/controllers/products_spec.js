import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';
import Product from '../../../src/models/product';

describe('Controllers: Products', () => {
    const defaultReq = {
        params: {}
    };
    const defaultProduct = [{
        __v: 0,
        _id: '56cb91bdc3464f14678934ca',
        name: 'Default product',
        description: 'product description',
        price: 100
    }]
    describe('get() products', () => {
        it('should return a list of products', async () => {
            const res = {
                send: sinon.spy()
            };
            Product.find = sinon.stub();
            Product.find.withArgs({}).resolves(defaultProduct);
            const productsController = new ProductsController(Product);
            
            await productsController.get(defaultReq, res);

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
    describe('getById()', () => {
        it('should return one product', async () => {
            const fakeId = 'a-fake-id';
            const req = {
                params: {
                    id: fakeId
                }
            };
            const res = {
                send: sinon.spy()
            };
            Product.find = sinon.stub();
            Product.find
                .withArgs({ _id: fakeId })
                .resolves(defaultProduct);
            
            const productsController = new ProductsController(Product);
            await productsController.getById(req, res);

            sinon.assert.calledWith(res.send, defaultProduct);
        });
    });
    describe('create()', () => {
        it('should save a new product successfully', async () => {
            const reqWithBody = Object.assign({}, {
                body: defaultProduct[0]
            }, defaultReq);
            const res = {
                send: sinon.spy(),
                status: sinon.stub()
            };
            class fakeProduct {
                save(){}
            };

            res.status.withArgs(201).returns(res);
            sinon.stub(fakeProduct.prototype, 'save')
                .withArgs()
                .resolves();
            
            const productsController = new ProductsController(fakeProduct);

            await productsController.create(reqWithBody, res);
            sinon.assert.calledWith(res.send);
        });
    });
});