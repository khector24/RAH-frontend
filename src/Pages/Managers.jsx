import { useEffect, useState } from 'react';
import axios from 'axios';
import Manager from '../Components/Manager';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../Styles/Page-Styles/Managers.css';

export default function Managers() {
    const [managers, setManagers] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Retrieved token:', token);

                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get('http://localhost:3000/managers', {
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

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>All Managers at Rainbow Ace Hardware</h2>
            {managers.map((manager) => (
                <Manager key={manager.id.S} manager={manager} />
            ))}
            <AddCircleOutlineIcon />
        </div>
    );
}