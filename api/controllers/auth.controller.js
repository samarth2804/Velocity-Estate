import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
  const { username, email, password } = req.body;
  //check whether user with same email exist
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    const err = errorHandler(400, 'User already exist');
    next(err);
  }

  const salt = await bcryptjs.genSalt(10); //generate salt(string)
  const hashedPassword = bcryptjs.hashSync(password, salt); //hashing the password using cryptograpgy hashing algo (and it is irreversible)
  const newUser = new User({ username, email, password: hashedPassword }); 

    await newUser.save();  //saving user data in database
    res.status(201).json(`Welcome ${username}!`);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); //finding the user email in db
    if (!validUser) return next(errorHandler(404, 'User not found!')); //if email doesnot exist in db
    const validPassword = bcryptjs.compareSync(password, validUser.password); //compare the entered password with actual one
    if (!validPassword) return next(errorHandler(401, 'Wrong credentials!')); 
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); //generate jwt token
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie('access_token', token, { httpOnly: true }) // saving the token in cookies for a session
      .status(200)
      .json(rest); //sending user info(- password)
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    //finding whether user exist
    const user = await User.findOne({ email: req.body.email });

    //if user exist, create token and save in cookie
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      //if user doesnot exist create the user in db
      const generatedPassword = req.body.uid;                              //used uid for password
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(generatedPassword,salt);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase(),                 //usename should be connected
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been logged out!');
  } catch (error) {
    next(error);
  }
};
