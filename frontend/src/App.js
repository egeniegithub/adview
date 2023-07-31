import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import OversightTable from "./screens/OversightTable";
import UOTableScreen from "./screens/UOTableScreen";
import { LinkedinBtn } from "./Components/SocialButtons/Linkedin";
import { BingBtn } from "./Components/SocialButtons/BingBtn";
import Login from "./screens/Login";
import ProtectedRoute from "./ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AccountsTableScreen from "./screens/AccountsTableScreen";

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
          <Route path="/monthly-log" element={<UOTableScreen />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
