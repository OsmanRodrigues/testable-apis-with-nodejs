import UsersController from '../../../src/controllers/users';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import User from '../../../src/models/user';

describe('Controllers: Users', () => {
    const defaultReq = {
        params: {}
    };
    const defaultUser = [{
        __v: 0,
        _id: '56cb91bdc3464f14678934ca',
        name: 'Default user',
        email: 'user@mail.com',
        password: 'password',
        role: 'user'
    }]

    describe('authenticate()', () => {
        it('should authenticate a user', async () => {
            const fakeUser = {};
            const { __v, _id, ...userLeftovers } = defaultUser[0];
            const userWithEncryptedPwd = {
                ...userLeftovers,
                password: bcrypt.hashSync(userLeftovers.password, 10)
            };
            const token = jwt.sign(userWithEncryptedPwd, config.get('auth.key'), {
                expiresIn: config.get('auth.tokenExpiresIn')
            });
            class fakeAuthService {
                static genToken() {
                    return token
                }
                authenticate() {
                    return Promise.resolve(userWithEncryptedPwd);
                }
            }
            const req = {
              body: userLeftovers,
            };
            const res = {
              send: sinon.spy(),
            };

            const usersController = new UsersController(fakeUser, fakeAuthService);
            await usersController.authenticate(req, res);

            sinon.assert.calledWith(res.send, { token });
        });
        it('should return 401 when the user can not be found', async () => {
            const fakeUser = {};
            class fakeAuthService {
                authenticate() {
                    return Promise.resolve(false);
                }
            }
            const { __v, _id, ...userLeftovers } = defaultUser[0];
            const req = {
                body: userLeftovers
            };
            const res = {
                sendStatus: sinon.spy()
            };
            const usersController = new UsersController(fakeUser, fakeAuthService);

            await usersController.authenticate(req, res);

            sinon.assert.calledWith(res.sendStatus, 401);
        });
    });

    describe('get() users', () => {
        it('should return a list of users', async () => {
            const res = {
                send: sinon.spy()
            };
            User.find = sinon.stub();
            User.find.withArgs({}).resolves(defaultUser);
            const usersController = new UsersController(User);
            
            await usersController.get(defaultReq, res);

            sinon.assert.calledWith(res.send, defaultUser);
        });
        it('should return 400 when an error occurs', async () => { 
            const req = {};
            const res = {
                send: sinon.spy(),
                status: sinon.stub()
            }

            res.status.withArgs(400).returns(res);
            User.find = sinon.stub();
            User.find.withArgs({}).rejects({ message: 'Error' });

            const usersController = new UsersController(User);
            await usersController.get(req, res);

            sinon.assert.calledWith(res.send, 'Error');
        });
    });
    describe('getById()', () => {
        it('should return one user', async () => {
            const fakeId = 'a-fake-id';
            const req = {
                params: {
                    id: fakeId
                }
            };
            const res = {
                send: sinon.spy()
            };
            User.find = sinon.stub();
            User.find
                .withArgs({ _id: fakeId })
                .resolves(defaultUser);
            
            const usersController = new UsersController(User);
            await usersController.getById(req, res);

            sinon.assert.calledWith(res.send, defaultUser);
        });
    });
    describe('create()', () => {
        it('should call send with a new user', async () => {
            const reqWithBody = Object.assign({}, {
                body: defaultUser[0]
            }, defaultReq);
            const res = {
                send: sinon.spy(),
                status: sinon.stub()
            };
            class fakeUser {
                save(){}
            };

            res.status.withArgs(201).returns(res);
            sinon.stub(fakeUser.prototype, 'save')
                .withArgs()
                .resolves();
            
            const usersController = new UsersController(fakeUser);

            await usersController.create(reqWithBody, res);
            sinon.assert.calledWith(res.send);
        });
        context('when an error occurs', () => {
            it('should return 422', async () => {
                const res = {
                    send: sinon.spy(),
                    status: sinon.stub()
                };
                class fakeUser {
                    save() {}
                }

                res.status.withArgs(422).returns(res);
                sinon.stub(fakeUser.prototype, 'save')
                    .withArgs()
                    .rejects({ message: 'Error' });
                
                const usersController = new UsersController(fakeUser);

                await usersController.create(defaultReq, res);
                sinon.assert.calledWith(res.status, 422);
            });
        });
    });
    describe('update()', () => {
        it('should respond with 200 when the user has been updated', async () => { 
            const updatedUser = {
                ...defaultUser[0], 
                name: 'Updated user',
            };
            const reqWithBodyAndParam = Object.assign({},{
                params: { id: updatedUser._id },
                body: updatedUser
            });
            const res = {
                sendStatus: sinon.spy(),
            }
            class fakeUser {
                static findById() { }
                save() { }
            }
            const fakeUserInstance = new fakeUser();
            const saveSpy = sinon.spy(fakeUser.prototype, 'save');
            const findByIdStub = sinon.stub(fakeUser, 'findById');
            findByIdStub.withArgs(updatedUser._id).resolves(fakeUserInstance);
            
            const usersController = new UsersController(fakeUser);
            await usersController.update(reqWithBodyAndParam, res);

            sinon.assert.calledWith(res.sendStatus, 200);
            sinon.assert.calledOnce(saveSpy);
        });
        context('when an error occurs', () => {
            it('should return 422', async () => {
                const fakeId = 'fake-id';
                const req = {
                    params: { id: fakeId },
                    body: {
                        ...defaultUser,
                        _id: fakeId
                    }
                };
                const res = {
                    send: sinon.spy(),
                    status: sinon.stub(),
                };
                class fakeUser {
                    static findById() {}
                }
                const findByIdStub = sinon.stub(fakeUser, 'findById');
                findByIdStub.withArgs(fakeId).rejects({ message: 'Error' });
                res.status.withArgs(422).returns(res);

                const usersController = new UsersController(fakeUser);

                await usersController.update(req, res);
                sinon.assert.calledWith(res.send, 'Error');
            });
        });
    });
    describe('delete()', () => {
        it('should respond with 204 when the given user has been deleted', async () => {
            const id = defaultUser[0]._id;
            const reqWithParam = {
                params: { id }
            };
            const res = {
                sendStatus: sinon.spy(),
            };
            class fakeUser {
                static deleteOne(){}
            }
            const removeStub = sinon.stub(fakeUser, 'deleteOne');
            removeStub.withArgs({ _id: id }).resolves([1]);

            const usersController = new UsersController(fakeUser);
            await usersController.delete(reqWithParam, res);


            sinon.assert.calledWithExactly(res.sendStatus, 204);
        });
        context('when an error occurs', () => {
            it('should return 400', async () => {
                const fakeId = 'fakeId';
                const reqWithParam = {
                  params: { id: fakeId },
                };
                const res = {
                  send: sinon.spy(),
                  status: sinon.stub(),
                };
                class fakeUser {
                  static deleteOne() {}
                }

                const removeStub = sinon.stub(fakeUser, 'deleteOne');
                removeStub
                    .withArgs({ _id: fakeId })
                    .rejects({message: 'Error'});
                  
                res.status.withArgs(400).returns(res);

                const usersController = new UsersController(fakeUser);
                await usersController.delete(reqWithParam, res);

                sinon.assert.calledWithExactly(res.send, 'Error');
            });
        });
    });
});