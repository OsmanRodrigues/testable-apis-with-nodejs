import mongoose from 'mongoose';
import config from 'config';

const mongodbUrl = config.get('database.mongoUrl');
const connect = () =>
    mongoose.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
const close = () => mongoose.connection.close();

export default {
    connect,
    close,
    connection: mongoose.connection
};
