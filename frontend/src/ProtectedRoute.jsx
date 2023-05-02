import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
	let token = JSON.parse(localStorage.getItem('token')) 
	if(token)
		return children
	else
		return <Navigate to="/login" />;
}

export default ProtectedRoute;
