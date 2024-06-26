class UsersController {
    constructor(User, AuthService) {
        this.User = User;
        this.AuthService = AuthService;
    }

    async authenticate(req, res) {
        const authService = new this.AuthService(this.User);
        const user = await authService.authenticate(req.body);

        if (!user) return res.sendStatus(401);

        const token = this.AuthService.genToken({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });

        return res.send({ token });
    }

    async get(req, res) {
        try {
            const users = await this.User.find({});
            return res.send(users);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    async getById(req, res) {
        const {
            params: { id }
        } = req;

        try {
            const user = await this.User.find({ _id: id });
            res.send(user);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }

    async create(req, res) {
        try {
            const user = new this.User(req.body);

            await user.save();
            res.status(201).send(user);
        } catch (err) {
            res.status(422).send(err.message);
        }
    }

    async update(req, res) {
        const {
            body,
            params: { id }
        } = req;
        try {
            const user = await this.User.findById(id);
            user.name = body.name;
            user.email = body.email;
            user.role = body.role;

            if (body.password) user.password = body.password;

            await user.save();

            res.sendStatus(200);
        } catch (err) {
            res.status(422).send(err.message);
        }
    }

    async delete(req, res) {
        try {
            await this.User.deleteOne({ _id: req.params.id });
            res.sendStatus(204);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
}

export default UsersController;
