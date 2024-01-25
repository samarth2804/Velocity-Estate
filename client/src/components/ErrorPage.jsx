import { Link } from 'react-router-dom';
import ErrorImg from '/404.png';

export default function ErrorPage() {

  return (
    <div className=""  >
      <div
        className="flex flex-col gap-2 mt-5 "
      >
        <img src={ErrorImg} alt="Error" className="m-auto h-[250px] w-[400px] sm:h-[350px] sm:w-[450px] p-3 rounded-lg shadow-lg" />
        <h2 className='m-auto text-center font-semibold text-3xl sm:text-2xl'>
          404 <br />
          Error: Page Not Found !
        </h2>
        <p className='m-auto text-center'>
          Go to <Link to="/"><span className='text-blue-700 hover:underline'>Home</span></Link>    {/* navigate to home route */}
        </p>
      </div>
    </div>
  );
}