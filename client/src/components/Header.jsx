import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');                                         //hold search data and set it to the search bar
  const navigate = useNavigate();                                                           //to navigate to other routes
  
  //Search on header form
  const handleSubmit = (e) => {
    e.preventDefault();                                                                     //avoid refershing the page
    const urlParams = new URLSearchParams(window.location.search);                          //got 6 url search parameters                          
    urlParams.set('searchTerm', searchTerm);                                                //modify the searchTerm parameter
    const searchQuery = urlParams.toString();                                               //object to string
    navigate(`/search?${searchQuery}`);                                                     //navigate to new route (having new SearchTerm and rest same)
  };

  //sync between url seachTerm of url and header search bar
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);                                 
    const searchTermFromUrl = urlParams.get('searchTerm');                                  //get the searchTerm from search paramters
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
    else{
      setSearchTerm('');
    }
  }, [location.search]);                                                                    //whenever search parameter changes -->sync the search bar with url searchTerm
  
  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Velocity</span>
            <span className='text-slate-700'>Estate</span>
          </h1>
        </Link>
        <form
          onSubmit={handleSubmit}
          className='bg-slate-100 p-3 rounded-lg flex items-center'
        >
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className='text-slate-600' />
          </button>
        </form>
        <ul className='flex gap-4'>
          <Link to='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-7 w-7 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline'> Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
