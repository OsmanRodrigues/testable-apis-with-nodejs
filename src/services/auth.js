import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';

class AuthService {
    constructor(User) {
        this.User = User;
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
