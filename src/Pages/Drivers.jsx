import { useEffect, useState } from 'react';
import axios from 'axios';
import Driver from '../Components/driver';
import '../Styles/Page-Styles/Drivers.css';

export default function Drivers() {
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                <Driver key={driver.id.S} driver={driver} />
            ))}
        </div>
    );
}