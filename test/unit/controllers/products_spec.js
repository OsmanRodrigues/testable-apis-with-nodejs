import ProductsController from '../../../src/controllers/products';
import sinon from 'sinon';

describe('Controllers: Products', () => {
    const defaultProduct = [{
        name: 'Default product',
        description: 'product description',
        price: 100
    }]
    describe('get() products', () => {
        it('should return a list of products', () => {
            const req = {};
            const res = {
                send: sinon.spy()
            };
            const productsController = new ProductsController();
            productsController.get(req, res);

            expect(res.send.called).to.be.true;
            expect(res.send.calledWith(defaultProduct)).to.be.true;
        });
    });
});