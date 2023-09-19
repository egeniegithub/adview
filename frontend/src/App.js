import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { LinkedinBtn } from "./Components/SocialButtons/Linkedin";
import { BingBtn } from "./Components/SocialButtons/BingBtn";
import Login from "./screens/Login";
import ProtectedRoute from "./ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import MonthlyLogScreen from "./screens/MonthlyLogScreen";
import AccountsScreen from "./screens/AccountsScreen";
import ThisMonthScreen from "./screens/ThisMonthScreen";
import PrivacyPolicy from "./screens/PrivacyPolicy";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/linkedin" element={<LinkedinBtn />} />
          <Route path="/bing" element={<BingBtn/>} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ThisMonthScreen />
              </ProtectedRoute>
            }
          />
          <Route 
          path="/monthly-log" 
          element={
            <ProtectedRoute>
                <MonthlyLogScreen />
              </ProtectedRoute>
          }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <AccountsScreen />
              </ProtectedRoute>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <ProtectedRoute>
                <PrivacyPolicy />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
