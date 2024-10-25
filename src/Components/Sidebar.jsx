import { NavLink } from 'react-router-dom';
import '../Styles/Components-Styles/Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className='dashboard'>
                <h3>Dashboard</h3>
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} end>Home</NavLink>
                    <NavLink to="/managers" className={({ isActive }) => isActive ? 'active-link' : ''} end>Managers</NavLink>
                    <NavLink to="/drivers" className={({ isActive }) => isActive ? 'active-link' : ''} end>Drivers</NavLink>
                    <hr />
                    <NavLink to="/deliveries" className={({ isActive }) => isActive ? 'active-link' : ''} end>Deliveries</NavLink>
                    <NavLink to="/deliveries/outForDelivery" className={({ isActive }) => isActive ? 'active-link' : ''}>Out for Delivery</NavLink>
                    <NavLink to="/deliveries/markedCompleted" className={({ isActive }) => isActive ? 'active-link' : ''}>Mark Completed</NavLink>
                    <NavLink to="/deliveries/markedForReview" className={({ isActive }) => isActive ? 'active-link' : ''}>Marked for Review</NavLink>
                    <NavLink to="/deliveries/markedForDeletion" className={({ isActive }) => isActive ? 'active-link' : ''}>Marked for Deletion</NavLink>
                </nav>
            </div>
        </div>
    );
}