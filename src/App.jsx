import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Deliveries from './Pages/Deliveries'; // Other components
import Managers from './Pages/Managers'
import Drivers from './Pages/Drivers';
import Layout from './Layout';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/drivers" element={<Drivers />} />
          {/* Add other protected routes here */}
        </Route>
      </Routes>
    </Router>
  );
}

