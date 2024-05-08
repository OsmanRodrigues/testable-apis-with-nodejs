import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';

class AuthService {
    constructor(User) {
        this.User = User;
    }

    static genToken(payload) { 
        return jwt.sign(
          payload,
          config.get('auth.key'),
          {
            expiresIn: config.get('auth.tokenExpiresIn'),
          }
        );
    }

    async authenticate(data) { 
        const { email, password } = data;
        const user = await this.User.findOne({ email });
        const compareResult = await bcrypt.compare(password, user.password);
        
        if (!user || !compareResult) return false;

        return user;
    }
}

export default AuthService;
