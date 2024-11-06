import '../Styles/Components-Styles/Header.css';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem('token');
            navigate('/');
        }
    };

    // Function to format the path into a readable title
    const getTitleFromPath = (path) => {
        const parts = path.split('/').filter(Boolean);

        // Check if the path includes "edit" to display "Update Manager"
        if (parts.includes('edit')) {
            return `Update ${capitalize(parts[parts.length - 2])}`;
        }

        // Map each part to capitalized form and join with spaces
        return parts.map(part => capitalize(part.replace(/([A-Z])/g, ' $1'))).join(' ');
    };

    // Function to capitalize the first letter of each word
    const capitalize = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    // Get the formatted title from the current path
    const title = getTitleFromPath(location.pathname);

    return (
        <div className='header-content'>
            <div className='left-header-content'>
                <h2>{title}</h2>
            </div>
            <div className='right-header-content'>
                <input
                    type="text"
                    placeholder="Search..."
                />

                <button onClick={handleLogout}><LogoutIcon /></button>
            </div>
        </div>
    );
}

