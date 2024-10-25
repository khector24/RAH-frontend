import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Driver from '../Components/driver';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../Styles/Page-Styles/Drivers.css';

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Retrieved token:', token);

                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get('http://localhost:3000/drivers', {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDrivers(response.data);
            } catch (err) {
                console.error('Error fetching drivers:', err);
                setError(err.response?.data?.message || 'Failed to fetch drivers.');
            } finally {
                setLoading(false);
            }
        }
        fetchDrivers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this driver?");

        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/drivers/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDrivers((prevDrivers) => prevDrivers.filter((driver) => driver.id.S !== id));
            } catch (err) {
                console.error('Error deleting driver:', err);
                setError(err.response?.data?.message || 'Failed to delete driver.');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/drivers/${id}/edit`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='Drivers'>
            <h2>All Drivers at Rainbow Ace Hardware</h2>
            {drivers.map((driver) => (
                <Driver
                    key={driver.id.S}
                    driver={driver}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ))}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate("/drivers/new")}
            />
        </div>
    );
}