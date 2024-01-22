import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

//when the user exist then allow the protected routes 
export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet /> : <Navigate to='/sign-in' />;     //oulet helps to render child routes
}
