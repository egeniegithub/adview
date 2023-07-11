import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OversightTable from "./screens/OversightTable"
import U_OTableScreen from './screens/U_OTableScreen';
import { LinkedinBtn } from './Components/Linkdin';
import { BingBtn } from './Components/BingBtn';
import Success from './Components/success';
import Login from './screens/Login';
import ProtectedRoute from './ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AccountsTableScreen from './screens/AccountsTableScreen';


function App() {
  return (
    <GoogleOAuthProvider clientId="828028257241-vhnmormtqapi8j744f086ee5shoc5380.apps.googleusercontent.com">
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/linkedin" element={<LinkedinBtn />} />
        <Route path="/bing" element={<BingBtn />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <OversightTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <AccountsTableScreen />
            </ProtectedRoute>
          }
        />
        <Route path="/OverUnderlog" element={<U_OTableScreen />} />
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
