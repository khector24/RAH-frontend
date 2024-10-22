import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Delivery from '../Components/delivery';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../Styles/Page-Styles/Deliveries.css';

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                console.log('Retrieved token:', token);

                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get('http://localhost:3000/deliveries', {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDeliveries(response.data);
            } catch (err) {
                console.error('Error fetching deliveries:', err);
                setError(err.response?.data?.message || 'Failed to fetch deliveries.');
            } finally {
                setLoading(false);
            }
        };
        fetchDeliveries();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    // Get the full date
    const date = new Date();
    const fullDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className='Deliveries'>
            <h2>Deliveries for: {fullDate}</h2>
            {deliveries.map((delivery) => (
                <Delivery key={delivery.id.S} delivery={delivery} />
            ))}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate("/deliveries/new")}
            />
        </div>
    );
};

export default Deliveries;


