import express from 'express';
import productsRoute from './products';
import usersRoute from './users';

const router = express.Router();

router.use('/products', productsRoute);
router.use('/users', usersRoute);
router.get('/', (req, res) => res.send('hello world!'));

export default router;