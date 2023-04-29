import { Navigate } from "react-router-dom";
function ProtectedRoute({ children }) {
	let user = JSON.parse(localStorage.getItem('user')) || {}
	if(user?.email=='admin' && user?.password == 'admin')
		return children
	else
		return <Navigate to="/login" />;
}

export default ProtectedRoute;
