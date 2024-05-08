import User from "../../../src/models/user";
import AuthService from '../../../src/services/auth';

describe('Routes: Users', () => {
    const defaultId = '56cb91bdc3464f14678934ca';
    const defaultUser = {
        name: 'Default user',
        email: 'default@mail.com',
        password: '123password',
        role: 'admin'
    };
    const { password, ...userLeftOvers } = defaultUser;
    const expectedUser = {
        ...userLeftOvers,
        _id: defaultId,
    };
    const authToken = AuthService.genToken(expectedUser);

    beforeEach(async () => {
        await User.deleteMany();
        const user = new User(defaultUser);
        user._id = expectedUser._id;

        return await user.save();
    });
    afterEach(async () => await User.deleteMany());
    
    describe('POST /users/authenticate', () => {
        context('when authenticating an user', () => {
            it('should generate a valid token', done => {
                request
                    .post(`/users/authenticate`)
                    .send({
                        email: 'default@mail.com',
                        password: '123password'
                    })
                    .end((err, res) => { 
                        expect(res.body).to.have.key('token');
                        expect(res.status).to.eql(200);
                        done(err);
                    });
            });
            it('should return unauthorized when the password does not match', done => {
                request
                    .post(`/users/authenticate`)
                    .send({
                        email: 'default@mail.com',
                        password: 'wrongpassword'
                    })
                    .end((err, res) => { 
                        expect(res.status).to.eql(401);
                        done(err);
                    });
            });
        });
    });
    
    describe('GET /users', () => {
        context('when an id is specified', () => {
            it('should return 200 with one user', done => { 
                request
                    .get(`/users/${defaultId}`)
                    .set({ 'x-access-token': authToken })
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(200);
                        expect(res.body).to.eql([expectedUser]);
                        done(err);
                    });
            });
        });
        it('should return a list of users', done => {
            request
                .get('/users')
                .set({'x-access-token': authToken})
                .end((err, res) => {
                    expect(res.body).to.eql([expectedUser]);
                    done(err);
                });
        });
    });

    describe('POST /users', () => {
        context('when posting an user', () => {
            it('should return a new user with status code 201', done => {
                const customId = '56cb91bdc3464f14678934ba';
                const newUser = Object.assign({}, {
                    _id: customId,
                    __v: 0
                }, defaultUser);
                const expectedSavedUser = {
                    _id: customId,
                    name: 'Default user',
                    email: 'default@mail.com',
                    role: 'admin'
                };

                request
                    .post('/users')
                    .set({ 'x-access-token': authToken })
                    .send(newUser)
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(201);
                        expect(res.body).to.eql(expectedSavedUser);
                        done(err);
                    });
            });
        });
    });

    describe('PUT /users/:id', () => {
        context('when editing an user', () => {
          it('should update an user and return status code 200', (done) => {
            const id = expectedUser._id;
            const updatedUser = {
              ...expectedUser,
              name: 'Updated user',
            };

            request
                .put(`/users/${id}`)
                .set({ 'x-access-token': authToken })
                .send(updatedUser)
                .end((err, res) => {
                    expect(res.statusCode).to.eql(200);
                    done(err);
                });
          });
        });
    });

    describe('DELETE /users/:id', () => {
        context('when delete an user', () => {
            it('should return no content and status code 204', (done) => {
              const id = expectedUser._id;

                request
                    .delete(`/users/${id}`)
                    .set({'x-access-token': authToken})
                    .end((err, res) => {
                        expect(res.statusCode).to.eql(204);
                        expect(res.body).to.eql({});
                        done(err);
                    });
            });
        });
    });
});