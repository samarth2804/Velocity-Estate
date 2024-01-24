import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings } from '../controllers/listing.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

//create, delete and update listing is allowed after verification
router.post('/create/:id', verifyToken, createListing);
router.delete('/delete/:id', verifyToken, deleteListing);
router.put('/update/:id', verifyToken, updateListing);
router.get('/get/:id', getListing);                                                   //to get a particular listing from its id 
router.get('/get', getListings);                                                      //to get access to all listing on search

export default router;
