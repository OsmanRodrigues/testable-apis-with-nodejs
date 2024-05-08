import AuthService from '../../../src/services/auth';
import bcrypt from 'bcrypt';
import Util from 'util';
import sinon from 'sinon';

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
    });
});