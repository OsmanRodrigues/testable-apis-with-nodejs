import Product from "../../../src/models/product";

describe('Routes: Products', () => {
    let request;
    let app;
    const defaultProduct = {
        name: 'Default product',
        description: 'product description',
        price: 100
    };
    const expectedProduct = {
        ...defaultProduct,
        __v: 0,
        _id: '56cb91bdc3464f14678934ca',
    };

    beforeEach(async () => {
        await Product.deleteMany();
        const product = new Product(defaultProduct);
        product._id = expectedProduct._id;

        return await product.save();
    });
    afterEach(async () => await Product.deleteMany());
    before(async () => {
        app = await setupApp();
        request = supertest(app);
    });
    after(async () => await app.database.connection.close());
    
    describe('GET /products', () => {
        it('should return a list of products', done => {
            request
                .get('/products')
                .end((err, res) => {
                    expect(res.body).to.eql([expectedProduct]);
                    done(err);
                });
        });
    });
});