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
        context('when an error occurs', () => {
            it('should return 422', async () => {
                const res = {
                    send: sinon.spy(),
                    status: sinon.stub()
                };
                class fakeProduct {
                    save() {}
                }

                res.status.withArgs(422).returns(res);
                sinon.stub(fakeProduct.prototype, 'save')
                    .withArgs()
                    .rejects({ message: 'Error' });
                
                const productsController = new ProductsController(fakeProduct);

                await productsController.create(defaultReq, res);
                sinon.assert.calledWith(res.status, 422);
            });
        });
    });
    describe('update()', () => {
        it('should update an given product successfully', async () => { 
            const updatedProduct = {
                ...defaultProduct[0], 
                name: 'Updated product',
            };
            const reqWithBodyAndParam = Object.assign({},{
                params: { id: updatedProduct._id },
                body: updatedProduct
            });
            const res = {
                send: sinon.spy(),
                status: sinon.stub()
            }
            
            res.status.withArgs(200).returns(res);
            Product.updateOne = sinon.stub()
            Product.updateOne
                .withArgs({ _id: defaultProduct[0]._id }, updatedProduct)
                .resolves({ok: 1, nModified: 1});
            
            const productsController = new ProductsController(Product);
            await productsController.update(reqWithBodyAndParam, res);

            sinon.assert.calledWith(res.send);
        });
        context('when an error occurs', () => {
            it('should return 422', async () => {
                const fakeId = 'fake-id';
                const req = {
                    params: { id: fakeId },
                    body: {
                        ...defaultProduct
                    }
                };
                const res = {
                send: sinon.spy(),
                status: sinon.stub(),
              };
              class fakeProduct {
                static updateOne() {}
              }
                
              sinon
                .stub(fakeProduct, 'updateOne')
                .withArgs({_id: fakeId}, req.body)
                .rejects({ message: 'Error' });
              res.status.withArgs(422).returns(res);

              const productsController = new ProductsController(fakeProduct);

              await productsController.update(req, res);
              sinon.assert.calledWith(res.status, 422);
            });
        });
    });
    describe('delete()', () => {
        it('should delete an given product successfully', async () => {
            const id = defaultProduct[0]._id;
            const reqWithParam = {
                params: { id }
            };
            const res = {
                send: sinon.spy(),
                status: sinon.stub()
            };
            class fakeProduct {
                static deleteOne(){}
            }

            sinon
                .stub(fakeProduct, 'deleteOne')
                .withArgs({ _id: id })
                .resolves();
            res.status.withArgs(204).returns(res);

            const productsController = new ProductsController(fakeProduct);
            await productsController.delete(reqWithParam, res);


            sinon.assert.calledWithExactly(res.status, 204);
            sinon.assert.calledWithExactly(res.send, undefined);
        });
    });
});