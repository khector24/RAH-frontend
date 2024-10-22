// Deliveries.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Delivery from '../Components/delivery';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../Styles/Page-Styles/Deliveries.css';

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const deliveryResponse = await axios.get('http://localhost:3000/deliveries', {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDeliveries(deliveryResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch deliveries.');
            }
        };

        const fetchDrivers = async () => { // New function to fetch drivers
            try {
                const token = localStorage.getItem('token');
                const driverResponse = await axios.get('http://localhost:3000/drivers', {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDrivers(driverResponse.data); // Update drivers state
            } catch (err) {
                console.error('Error fetching drivers:', err);
                setError(err.response?.data?.message || 'Failed to fetch drivers.');
            }
        };

        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([fetchDeliveries(), fetchDrivers()]); // Fetch deliveries and drivers concurrently
            setLoading(false);
        };

        fetchAllData();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this delivery?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/deliveries/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                alert("Item successfully deleted!");
                setDeliveries((prevDeliveries) => prevDeliveries.filter((delivery) => delivery.id !== id));
            } catch (err) {
                console.error('Error deleting delivery:', err);
                setError(err.response?.data?.message || 'Failed to delete delivery.');
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/deliveries/${id}/edit`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

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
                <Delivery
                    key={delivery.id.S}
                    delivery={delivery}
                    drivers={drivers}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            ))}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate("/deliveries/new")}
            />
        </div>
    );
};

export default Deliveries;



