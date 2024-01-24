import express from 'express';
import { deleteUser, test, updateUser,  getUserListings, getUser} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router = express.Router();

router.get('/test', test);
//verify user through jwt token then allow update, delete functionality
router.put('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);                  
router.get('/listings/:id', verifyToken, getUserListings);                                //to get all listings of a partcular user
router.get('/:id', verifyToken, getUser);                                                 //to get the other user info --> for contacting  them as buyers
 
export default router;