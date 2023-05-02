import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OversightTable from "./screens/OversightTable"
import U_OTableScreen from './screens/U_OTableScreen';
import { LinkedinBtn } from './Components/Linkdin';
import { BingBtn } from './Components/BingBtn';
import Success from './Components/success';
import Login from './screens/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route path="/" element={<OversightTable />} />
        <Route path="/linkedin" element={<LinkedinBtn />} />
        <Route path="/bing" element={<BingBtn />} />
        <Route path="/OverUnderlog" element={<U_OTableScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
