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
});