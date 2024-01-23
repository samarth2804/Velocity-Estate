import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);                                                  //ref obj to make a click on input file
  const { currentUser, loading, error } = useSelector((state) => state.user);    // data from the redux store
  const [file, setFile] = useState(undefined);                                   //image file during upload
  const [fileUploadError, setFileUploadError] = useState(false);                 //to show the error during image upload
  const [formData, setFormData] = useState({});                                  
  const [updateSuccess, setUpdateSuccess] = useState(false);                     //to show the message during user update
  const [showListingsError, setShowListingsError] = useState(false);             //to show error during render of listings
  const [userListings, setUserListings] = useState([]);                          //to hold all listings of a particular user
  const dispatch = useDispatch();
  
  //whenever file changes call the handleFileUpload()
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    //intialize storage reference
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    //set the upload task
    const uploadTask = uploadBytesResumable(storageRef, file);
    //upload the image
    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        setFileUploadError(true);                                                    //in-case of error during image upload
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>                //upon successful upload set the avartar url to the uploaded image url
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  
  //update the form data
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  //update the user in db
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());                                              //set loading true
      //http put request to update the user
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      //if error during update we get success 'false'
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));                              //set the error
        return;
      }
      
      //if sucessfully updated --> set the updated user as current user
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);                                                    //to show the message after successful update
    } catch (error) {
      dispatch(updateUserFailure(error.message));                                //in case of error during update dispatch the updateUserFailure action with the error message
    }
  };
  
  //delete the user from db
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());                                               //set loading true
      //http  delete request
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));                               
        return;
      }
      dispatch(deleteUserSuccess());                                         //set currentuser to null
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

//signOut the user by clearing jwt token and set the currentuser to null
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      //http get request to clear jwt token
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      //set the currentuser to null
      dispatch(signOutUserSuccess());  
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  };

//to make listing visible/hidden
  const handleShowListings = async () => {
    try {
      //if listing already available --> hide it
      if(userListings.length > 0) {
        setUserListings([]);
        return;
      }
  
      setShowListingsError(false);
      //http get request to get all listings of user
      const res = await fetch(`/api/user/listings/${currentUser._id}`);            
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      //set the recieved data in the userListings state 
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

//delete a listing
  const handleListingDelete = async (listingId) => {
    try {
      //http delete request to delete a listing from db
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      
      //after deleting the listing from db delete it from userListings state
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        {/* input for uploading image file */}
        <input
          onChange={(e) => setFile(e.target.files[0])}             //save the image file in file state
          type='file'
          ref={fileRef}                                            //using fileRef --> trigger click event
          hidden
          accept='image/*'                                        
        />
        <img
          onClick={() => fileRef.current.click()}                  //clicking on input file
          src={formData.avatar || currentUser.avatar}              //if user uploaded avatar then show that one
          alt='profile'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />
        <p className='text-sm self-center'>
          {fileUploadError ? (                                     //if  fileUploadError means image is greater than 2 MB
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) :''
          }
          { formData.avatar ? (                                    // if user uploaded avatar
            <span className='text-green-700'>
             Image uploaded Successfully!                          
            </span>
          ) : ''
          }
        </p>
        <input
          type='text'
          placeholder='username'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          defaultValue={currentUser.email}
          className='border p-3 rounded-lg bg-zinc-200/50'
          disabled
        />
        <input
          type='password'
          placeholder='Update password'
          onChange={handleChange}
          id='password'
          className='border p-3 rounded-lg'
        />
        <button
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'
          to={'/create-listing'}
        >
          Create Listing
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'
        >
          Delete account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>

      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className='text-green-700 w-full'>
        {userListings.length > 0 ? 'Hide Listings' : 'Show Listings'}
      </button>
      <p className='text-red-700 mt-5'>
        {showListingsError ? 'Something went wrong. Try again later' : ''}
      </p>

      {userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center mt-7 text-2xl font-semibold'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='border rounded-lg p-3 flex justify-between items-center gap-4'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='h-16 w-16 object-contain'
                />
              </Link>
              <Link
                className='text-slate-700 font-semibold  hover:underline truncate flex-1'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
