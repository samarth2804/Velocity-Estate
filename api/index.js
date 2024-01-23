import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

//env intialisation
dotenv.config();

//MongoDB connection
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());                     //allow sending of json in post/put request

app.use(cookieParser());                     //to get info from the cookie. it adds a cookies property to the request object

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api/user', userRouter);               //get-user, update-user, delete-user, get-user-listingss
app.use('/api/auth', authRouter);               //sign-in, sign-up, sign-out
app.use('/api/listing', listingRouter);         //create,update and delete listings
 

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

//In case of any erorr this middleware is called
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
