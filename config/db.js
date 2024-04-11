import mongoose from 'mongoose';
import colors from 'colors';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB: ${conn.connection.host}`.bgMagenta.white)
    } catch (error) {
        console.log(`Error in MongoDB connection: ${error}`.bgRed.white);
    }
}

export { connectDB }