import mongoose from 'mongoose';

const mongodbUrl = process.env.MONGODB_URL || 'mongodb://root:dev@localhost:27017/';
const connect = () => mongoose.connect(mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const close = () => mongoose.connection.close();

export default {
    connect,
    close,
    connection: mongoose.connection
};