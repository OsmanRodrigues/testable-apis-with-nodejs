import Product from "../../../src/models/product";
import AuthService from "../../../src/services/auth";

describe('Routes: Products', () => {
    const defaultId = '56cb91bdc3464f14678934ca';
    const defaultProduct = {
        name: 'Default product',
        description: 'product description',
        price: 100
    };
    const expectedProduct = {
        ...defaultProduct,
        __v: 0,
        _id: defaultId,
    };
    const expectedUser = {
        _id: defaultId,
        name: 'Default user',
        email: 'default@mail.com',
        role: 'admin'
    };
    const authToken = AuthService.genToken(expectedUser);

    beforeEach(async () => {
        await Product.deleteMany();
        const product = new Product(defaultProduct);
        product._id = expectedProduct._id;

        return await product.save();
    });
    afterEach(async () => await Product.deleteMany());
    
    
    describe('GET /products', () => {
        context('when an id is specified', () => {
            it('should return 200 with one product', done => { 
                request
                    .get(`/products/${defaultId}`)
                    .set({ 'x-access-token': authToken })
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body).to.eql([expectedProduct]);
                        done(err);
                    });
            });
        });
        it('should return a list of products', done => {
            request
                .get('/products')
                .set({ 'x-access-token': authToken })
                .end((err, res) => {
                    expect(res.body).to.eql([expectedProduct]);
                    done(err);
                });
        });
    });

    describe('POST /products', () => {
        context('when posting a product', () => {
            it('should return a new product with status code 201', done => {
                const customId = '56cb91bdc3464f14678934ba';
                const newProduct = Object.assign({}, {
                    _id: customId,
                    __v: 0
                }, defaultProduct);
                const expectedSavedProduct = {
                    __v: 0,
                    _id: customId,
                    name: 'Default product',
                    description: 'product description',
                    price: 100
                };

                request
                    .post('/products')
                    .set({ 'x-access-token': authToken })
                    .send(newProduct)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(201);
                        expect(res.body).to.eql(expectedSavedProduct);
                        done(err);
                    });
            });
        });
    });

    describe('PUT /products/:id', () => {
        context('when update a product', () => {
          it('should return the updated product with status code 200', (done) => {
            const id = expectedProduct._id;
            const updatedProduct = {
              ...expectedProduct,
              name: 'Updated product',
            };

            request
                .put(`/products/${id}`)
                .set({ 'x-access-token': authToken })
                .send(updatedProduct)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(200);
                    expect(res.body).to.eql(updatedProduct);
                    done(err);
                });
          });
        });
        context('when try to update a product with same old values', () => {
          it('should return a status code 304', (done) => {
            const id = expectedProduct._id;
            const updatedProduct = {
              ...expectedProduct,
            };

            request
                .put(`/products/${id}`)
                .set({ 'x-access-token': authToken })
                .send(updatedProduct)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(304);
                    done(err);
                });
          });
        });
    });

    describe('DELETE /products/:id', () => {
        context('when delete a product', () => {
            it('should return no content and status code 204', (done) => {
              const id = expectedProduct._id;

                request
                    .delete(`/products/${id}`)
                    .set({ 'x-access-token': authToken })
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(204);
                        expect(res.body).to.eql({});
                        done(err);
                    });
            });
        });
    });
});