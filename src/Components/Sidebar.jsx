import { NavLink } from 'react-router-dom';
import '../Styles/Components-Styles/Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className='dashboard'>
                <h3>Dashboard</h3>
                <nav>
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/managers" >Managers</NavLink>
                    <NavLink to="/drivers">Drivers</NavLink>
                    <NavLink to="/deliveries" >Deliveries</NavLink>
                    <NavLink to="/outToDelivery" >Out to Delivery</NavLink>
                    <NavLink to="/markedForReview">Marked for Review</NavLink>
                    <NavLink to="/markedForDeletion">Marked for Deletion</NavLink>
                </nav>
            </div>
        </div>
    );
}
