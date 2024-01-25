import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-hot-toast';

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      //authentication using Firebase 
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);                              // Get the authentication instance from the Firebase app
      
      const result = await signInWithPopup(auth, provider);   // Perform Google Sign-In using a pop-up window
      
      //post request to send user data to server
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          //extract name, email, photo, uid of user and send to the server
          name: result.user.displayName,  
          email: result.user.email,
          photo: result.user.photoURL,
          uid : result.user.uid
        })
      });

      const data = await res.json();
      dispatch(signInSuccess(data));
      toast.success(`Welcome ${data.username} !`); 
      navigate('/');
    } catch (error) {
      toast.error('could not sign in with google');
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type='button'                                                                        //to avoid submitting the form
      className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95'
    >
      Continue with google
    </button>
  );
}
