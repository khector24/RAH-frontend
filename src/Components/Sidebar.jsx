import { NavLink } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import ListIcon from '@mui/icons-material/List';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import '../Styles/Components-Styles/Sidebar.css';

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className='dashboard'>
                <h3>Dashboard</h3>
                <nav>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''} end>
                        <SupervisorAccountIcon className="icon" />
                        Home
                    </NavLink>
                    <NavLink to="/managers" className={({ isActive }) => isActive ? 'active-link' : ''} end>
                        <SupervisorAccountIcon className="icon" />
                        Managers
                    </NavLink>
                    <NavLink to="/drivers" className={({ isActive }) => isActive ? 'active-link' : ''} end>
                        <DriveEtaIcon className="icon" />
                        Drivers
                    </NavLink>
                    <hr />
                    <NavLink to="/deliveries" className={({ isActive }) => isActive ? 'active-link' : ''} end>
                        <ListIcon className="icon" />
                        Deliveries
                    </NavLink>
                    <NavLink to="/deliveries/outForDelivery" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <RocketLaunchIcon className="icon" />
                        Out for Delivery
                    </NavLink>
                    <NavLink to="/deliveries/markedCompleted" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <DoneAllIcon className="icon" />
                        Completed
                    </NavLink>
                    <NavLink to="/deliveries/markedForReview" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <FlagIcon className="icon" />
                        Under Review
                    </NavLink>
                    <NavLink to="/deliveries/markedForDeletion" className={({ isActive }) => isActive ? 'active-link' : ''}>
                        <DeleteIcon className="icon" />
                        For Deletion
                    </NavLink>
                </nav>
            </div>
        </div>
    );
}