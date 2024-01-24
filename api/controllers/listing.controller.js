import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

//create listing in db
export const createListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
  try {
    const listing = await Listing.create(req.body);                         //create listing in db
    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
}
else{
  return next(errorHandler(401, 'You can create only your own listings!'));
}
};

//delete a listing from db
export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);                              //find listing by their id

  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));                             
  }
  
  //if listing doesnot belong that user
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only delete your own listings!'));
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};

//update listing in the db
export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);        
  if (!listing) {
    return next(errorHandler(404, 'Listing not found!'));
  }
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, 'You can only update your own listings!'));
  }

  try {
    //find the listing by id and update it 
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }                                                                           //to get the updated listing
    );
    res.status(200).json(updatedListing);                                                     //send the updated listing
  } catch (error) {
    next(error);
  }
};

//to get a particular listing
export const getListing = async (req, res, next) => {
  try {
    //find listing by their id
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

//to get all listings based on search parameter
export const getListings = async (req, res, next) => {
  try {
    //the request query start with ? and can have multiple query separated by &
    const limit = parseInt(req.query.limit) || 9;                                          //limit the number of listing at a time
    const startIndex = parseInt(req.query.startIndex) || 0;                                //for skipping some listing (e.g.-> for 1st time noskip, then skip first 9 itmes to fetch next 9 items)
    let offer = req.query.offer;                                                           //to check request query have offer parameter or not

    if (offer === undefined || offer === 'false') {                                        //if offer parameter is not there or it is false --> find all listings with offer or not offer
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;                                                              //type for sell or rent or both

    if (type === undefined || type === 'all') {                                             //if type is all --> seach all listings (sell or rent)
      type = { $in: ['sell', 'rent'] };
    }

    const searchTerm = req.query.searchTerm || '';                                          //find the listing having matching name , address or description

    const sort = req.query.sort || 'createdAt';                                             //sort listing based on price or latest/oldest

    const order = req.query.order || 'desc';                                                //order of sort the listings
    
    // find the listings having all the matching fields and sort-order them as specified by user
    const listings = await Listing.find({    
      $or: [
        {'name': { $regex: searchTerm, $options: 'i' }},                                     //options : 'i' --> to avoid casing type (lowerCase or Uppercase) during search of listing
        {'description': { $regex: searchTerm, $options: 'i' }},
        {'address': { $regex: searchTerm, $options: 'i' }},
      ],                                     
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};
