import mongoose from 'mongoose';


let isConnected = false;

const ConnectDb = async () => {

    if (isConnected) {
        console.log('Using existing connection');
        return isConnected;
    }

    try {
        const res = await mongoose.connect(process.env.MONGO_URL);
        isConnected = res.connection;
        console.log('New connection created');
        return isConnected;
    } catch (error) {
        console.log('Error in connecting to database: ', error);
    }
};

export default ConnectDb;