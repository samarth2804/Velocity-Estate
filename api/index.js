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

const __dirname = path.resolve();                                            //get the present directory name            

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());                                                             //allow accessing of json data from post/put request of client at sever 

app.use(cookieParser());                                                             //to set and get info from the cookie. it adds a cookies property to the request object

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use('/api/user', userRouter);                                                    //get-user, update-user, delete-user, get-user-listingss
app.use('/api/auth', authRouter);                                                    //sign-in, sign-up, sign-out
app.use('/api/listing', listingRouter);                                              //create,update and delete listings
 

app.use(express.static(path.join(__dirname, '/client/dist')));                         //all the static files(css,js and images) present in dist

//handle all routes except the above three
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));                  //send the html file (present in client/dist/index.html)
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
