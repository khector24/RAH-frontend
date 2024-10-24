import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Delivery from '../Components/Delivery';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import '../Styles/Page-Styles/Deliveries.css';

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const currentUser = localStorage.getItem('username'); // Get the current user's username

    useEffect(() => {
        const fetchDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                const deliveryResponse = await axios.get('http://localhost:3000/deliveries', {
                    headers: { 'Authorization': `${token}` },
                });
                const filteredDeliveries = deliveryResponse.data.filter(
                    (delivery) => !delivery.markedForDeletion?.BOOL
                );
                setDeliveries(filteredDeliveries);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch deliveries.');
            }
        };

        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem('token');
                const driverResponse = await axios.get('http://localhost:3000/drivers', {
                    headers: { 'Authorization': `${token}` },
                });
                setDrivers(driverResponse.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch drivers.');
            }
        };

        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([fetchDeliveries(), fetchDrivers()]);
            setLoading(false);
        };

        fetchAllData();
    }, []);

    const updateDeliveryHistory = async (id, action, status) => {
        const token = localStorage.getItem('token');
        const timestamp = new Date().toISOString();

        // Ensure you format deliveryHistory properly
        const deliveryHistoryEntry = {
            action: { S: action },
            status: { S: status },
            manager: { S: currentUser },
            timestamp: { S: timestamp },
        };

        try {
            await axios.put(
                `http://localhost:3000/deliveries/${id}/edit`,
                {
                    [action]: { BOOL: true }, // Set the action to true
                    deliveryHistory: {
                        M: deliveryHistoryEntry, // Use M for a map
                    },
                },
                { headers: { 'Authorization': `${token}` } }
            );
        } catch (error) {
            console.error(`Error updating delivery for ${action}:`, error);
            setError(error.response?.data?.message || `Failed to update delivery for ${action}.`);
        }
    };


    const handleUpdateDelivery = async (id, action, status) => {
        const confirm = window.confirm(`Are you sure you want to mark this delivery as ${status}?`);
        if (confirm) {
            await updateDeliveryHistory(id, action, status);
            setDeliveries((prev) =>
                prev.map((d) =>
                    d.id.S === id ? { ...d, [action]: { BOOL: true } } : d // Update local state
                )
            );
        }
    };

    const handleFlagReview = (id) => {
        handleUpdateDelivery(id, 'markedForReview', 'review');
    };

    const handleOutForDelivery = (id) => {
        handleUpdateDelivery(id, 'outForDelivery', 'outForDelivery');
    };

    const handleComplete = (id) => {
        handleUpdateDelivery(id, 'markedCompleted', 'completed');
    };

    const handleDelete = (id) => {
        handleUpdateDelivery(id, 'markedForDeletion', 'deletion');
    };

    const handleEdit = (id) => {
        navigate(`/deliveries/${id}/edit`);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className='Deliveries'>
            <h2>Deliveries</h2>
            {deliveries.map((delivery) => (
                <Delivery
                    key={delivery.id.S}
                    delivery={delivery}
                    drivers={drivers}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    onFlagReview={handleFlagReview}
                    onOutForDelivery={handleOutForDelivery}
                    onComplete={handleComplete}
                />
            ))}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate('/deliveries/new')}
            />
        </div>
    );
};

export default Deliveries;
