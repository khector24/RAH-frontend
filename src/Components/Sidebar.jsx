import { NavLink } from 'react-router-dom';
import '../Styles/Components-Styles/Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className='dashboard'>
                <h3>Dashboard</h3>
                <nav>
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/deliveries" >Deliveries</NavLink>
                    <NavLink to="/managers" >Managers</NavLink>
                    <NavLink to="/drivers">Drivers</NavLink>
                </nav>
            </div>
        </div>
    );
}
