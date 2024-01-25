import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import {toast} from 'react-hot-toast';

export default function SignUp() {
  const [formData, setFormData] = useState({});                                      //username, email and password data
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //function to store username, email and password whenever it changes 
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
 
  //submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault(); //prevent refreshing the page when form submitted 
    try {
      setLoading(true);
      
      //check for valid username
      if(formData.username.length < 3){
        toast.error("Username must be a minimum of 3 characters");
        setLoading(false);
        return;
      }
      //check for valid password
      const userPassword = formData.password;
      if( userPassword.length <= 6 || /[A-Z]/.test(userPassword) === false || /[a-z]/.test(userPassword) === false || /\d/.test(userPassword) === false ){
        toast.error("Password: 6+ chars and must have 1 uppercase, 1 lowercase, 1 digit");
        setLoading(false);
        return;
      }
      

      //post request to http://localhost:3000/api/auth/signup
      const res = await fetch('/api/auth/signup', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        //form data is send to server in the request body
        body: JSON.stringify(formData), //javaScript obj to json string
      });

      const data = await res.json(); //take json data from response object and parse to js object

      // if error recieved from server
      if (data.success === false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.success("User SignUp Successfully !");
      navigate('/sign-in'); //navigate to sign-in page upon successful signup
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='text'
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />
        <input
          type='password'
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Loading...' : 'Sign Up'}
        </button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to={'/sign-in'}>
          <span className='text-blue-700'>Sign in</span>
        </Link>
      </div>
    </div>
  );
}
