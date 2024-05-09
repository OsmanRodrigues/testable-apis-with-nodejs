import authMiddleware from '../../../src/middlewares/auth';
import jwt from 'jsonwebtoken';
import config from 'config';

describe('AuthMiddleware', () => {
    it('should verify a JWT token and call the next middleware', done => {
        const token = jwt.sign({ data: 'fake' }, config.get('auth.key'));
        const req = {
            headers: {
                'x-access-token': token
            }
        };
        const res = {};
        authMiddleware(req, res, done);
    });
    it('should call the next middleware passing an error when the token validation fails', done => {
        const req = {
            headers: {
                'x-access-token': 'invalid token'
            }
        };
        const res = {};
        authMiddleware(req, res, err => {
            expect(err.message).to.eq('jwt malformed');
            done();
        });
    });
    it('should call the next middleware if theres no token', done => {
        const req = {
            headers: {}
        };
        const res = {};
        authMiddleware(req, res, done);
    });
});
