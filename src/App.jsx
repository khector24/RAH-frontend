import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Deliveries from './Pages/Deliveries';
import Managers from './Pages/Managers';
import Drivers from './Pages/Drivers';
import Layout from './Layout';
import NewDelivery from './Pages/NewDelivery';
import NewManager from './Pages/NewManager';
import EditManager from './Pages/EditManager';
import EditDelivery from './Pages/EditDelivery';
import MarkedForDeletion from './Pages/MarkedForDeletion';
import OutToDeliveryPage from './Pages/OutToDeliveryPage';
import MarkedForReview from './Pages/MarkedForReview';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<Layout />}>
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/deliveries/new" element={<NewDelivery />} />
          <Route path="/deliveries/:id/edit" element={<EditDelivery />} />
          <Route path="/managers" element={<Managers />} />
          <Route path="/managers/new" element={<NewManager />} />
          <Route path="/managers/:id/edit" element={<EditManager />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/markedForDeletion" element={<MarkedForDeletion />} />
          <Route path="/markedForReview" element={<MarkedForReview />} />
          <Route path="/outToDelivery" element={<OutToDeliveryPage />} />
        </Route>
      </Routes>
    </Router>
  );
}


