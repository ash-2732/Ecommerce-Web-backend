import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import { router as authRouter } from './routes/authRoute.js';
import { router as categoryRouter } from './routes/categoryRoute.js';
import { router as productRouter } from './routes/productRoute.js';
import cors from 'cors';


// configure dotenv
dotenv.config();

// connect to database
connectDB();

// rest object
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/category', categoryRouter);
app.use('/api/v1/product', productRouter);

// rest api
app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to this API!'
    });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on ${process.env.DEV_MODE} port ${PORT}`.bgCyan.white);
});

