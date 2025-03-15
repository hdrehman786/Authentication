import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import connectDB from './dbConnect/databaseCon.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import router from './routers/authRouter.js';
import { getUserData } from './controllers/userController.js';
import userRouter from './midleware/userRoute.js';

configDotenv();
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,               
  }));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())


connectDB();

const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.send('Hello from the server!');
})
app.use('/auth',router);
app.use('/user', userRouter);

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`);
})