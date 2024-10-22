import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Deliveries from './Pages/Deliveries'; // Other components
import Managers from './Pages/Managers'
import Drivers from './Pages/Drivers';
import Layout from './Layout';
import NewDelivery from './Pages/NewDelivery';
import NewManager from './Pages/NewManager';
import EditManager from './Pages/EditManager';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/deliveries/new" element={<NewDelivery />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/managers/new" element={<NewManager />} />
          <Route path="/managers/:id/edit" element={<EditManager />} />
          <Route path="/drivers" element={<Drivers />} />
        </Route>
      </Routes>
    </Router>
  );
}

