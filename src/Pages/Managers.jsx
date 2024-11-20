import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Manager from '../Components/Manager';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../Styles/Page-Styles/Managers.css';

export default function Managers() {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/managers`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setManagers(response.data);
            } catch (err) {
                console.error('Error fetching managers:', err);
                setError(err.response?.data?.message || 'Failed to fetch managers.');
            } finally {
                setLoading(false);
            }
        };
        fetchManagers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this manager?");

        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/managers/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setManagers((prevManagers) => prevManagers.filter((manager) => manager.id.S !== id));
            } catch (err) {
                console.error('Error deleting manager:', err);
                setError(err.response?.data?.message || 'Failed to delete manager.');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/managers/${id}/edit`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='Managers'>
            <h2>All Managers at Rainbow Ace Hardware</h2>
            {managers.map((manager) => (
                <Manager
                    key={manager.id.S}
                    manager={manager}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ))}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate("/managers/new")}
            />
        </div>
    );
}
