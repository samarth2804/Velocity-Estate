import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;                                    //get token from the req object.it is saved in the user's browser and send in each req

  if (!token) return next(errorHandler(401, 'Unauthorized User!'));          //user doesnot have valid credentials

  //decode token --> signature verify
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {               
    if (err) return next(errorHandler(403, 'Forbidden'));                    

    req.user = user;                //set  the decoded user in the req body
    next();             
  });
};
