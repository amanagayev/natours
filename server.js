const mongoose = require('mongoose');
const dotenv = require('dotenv');


process.on('uncaughtException', err => {
    console.log('Uncaugth exception! Shutting down...');
    console.log(err.name, err.message);
    console.log(err);
    process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(() => console.log('DB connected successfully!'));

// console.log(process.env);
// console.log(process.env.NODE_ENV);

const port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`App running on port: ${port}`);
});

process.on('unhandledRejection', err => {
    console.log('Unhandled rejection! Shutting down...');
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
        console.log('Process terminated!');
    });
});
