import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import OversightTable from "./screens/OversightTable"
import U_OTableScreen from './screens/U_OTableScreen';
import { LinkedinBtn } from './Components/Linkdin';
import { BingBtn } from './Components/BingBtn';
import Success from './Components/success';

function App() {
  return ( 
    <Router>
      <Routes>
        <Route exact path="/" element={<OversightTable />} />
        <Route exact path="/linkedin" element={<LinkedinBtn />} />
        <Route exact path="/bing" element={<BingBtn />} />
        <Route path="/OverUnderlog" element={<U_OTableScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
