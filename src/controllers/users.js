class UsersController {
    constructor(User) { 
        this.User = User;
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
        const { params: { id } } = req;
        
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
        const { body, params: { id } } = req;
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
            const deleteRes = await this.User.remove({ _id: req.params.id });
            res.sendStatus(204);
        } catch (err) {
            res.status(400).send(err.message);
        }
    }
 };

export default UsersController;