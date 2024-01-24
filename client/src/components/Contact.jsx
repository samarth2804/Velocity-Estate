import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({ listing }) {                                           //getting listing info as a props
  const [landlord, setLandlord] = useState(null);                                        //hold landlord info
  const [message, setMessage] = useState('');                                            //hold message of user (send to landlord on submit)

  //to make changes in the message
  const onChange = (e) => {
    setMessage(e.target.value);
  };

//to fetch the landlord info 
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        //htttp get request to get the user 
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className='flex flex-col gap-2 mt-5'>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>
          {/* send mail to landlord with subject (listing name) and message */}
          <Link
          to={`mailto:${landlord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
