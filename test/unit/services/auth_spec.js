import AuthService from '../../../src/services/auth';
import bcrypt from 'bcrypt';
import Util from 'util';
import sinon from 'sinon';
import jwt from 'jsonwebtoken';
import config from 'config';

const hashAsync = Util.promisify(bcrypt.hash);

describe('Service: Auth', () => {
    context('authenticate', () => {
        it('should authenticate an user', async () => {
            const fakeUser = {
                findOne: sinon.stub()
            };
            const user = {
                name: 'Default user',
                email: 'default@mail.com',
                password: '12345'
            };
            const authService = new AuthService(fakeUser);
            const hashedPwd = await hashAsync(user.password, 10);
            const userFromDB = { ...user, password: hashedPwd };

            fakeUser.findOne
                .withArgs({ email: user.email })
                .resolves(userFromDB);
            
            const res = await authService.authenticate(user);

            expect(res).to.eql(userFromDB);
        });
        it('should return false when the password does not match', async () => {
            const user = {
                email: 'default@mail.com',
                password: '12345'
            };
            const fakeUser = {
                findOne: sinon.stub()
            };

            fakeUser.findOne.resolves({
                email: user.email,
                password: 'afakehashedpassword'
            });

            const authService = new AuthService(fakeUser);
            const res = await authService.authenticate(user);

            expect(res).to.be.false;
        });
    });
    context('genToken', () => {
        it('should generate a JWT token from a given payload', () => {
            const payload = {
                name: 'Jhon',
                email: 'jhondoe@email.com',
                password: '12345'
            };
            const expectedToken = jwt.sign(payload, config.get('auth.key'), {
                expiresIn: config.get('auth.tokenExpiresIn')
            });
            const generatedToken = AuthService.genToken(payload);

            expect(generatedToken).to.eql(expectedToken);
        });
    });
});