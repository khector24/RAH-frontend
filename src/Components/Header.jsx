// Components/Header.jsx
import '../Styles/Components-Styles/Header.css';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to logout?");
        if (confirmLogout) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    return (
        <div className='header-content'>
            <input
                type="text"
                placeholder="Search..."
            />

            <button style={{ color: "white" }} onClick={handleLogout}><LogoutIcon /></button>
        </div>
    );
}