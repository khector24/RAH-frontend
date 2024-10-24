// Deliveries.jsx

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


    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to mark this delivery for deletion?");
        if (confirmDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.put(`http://localhost:3000/deliveries/${id}/edit`, {
                    markedForDeletion: true
                }, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                alert("Delivery marked for deletion!");
                fetchDeliveries();
            } catch (err) {
                console.error('Error marking delivery for deletion:', err);
                setError(err.response?.data?.message || 'Failed to mark delivery for deletion.');
            }
        }
    };

    const handleFlagReview = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/deliveries/${id}/edit`, {
                markedForReview: true,
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            alert("Delivery marked for review!");
            // Update the deliveries state
            fetchDeliveries();
        } catch (err) {
            console.error('Error marking delivery for review:', err);
            setError(err.response?.data?.message || 'Failed to mark delivery for review.');
        }
    };

    const handleOutForDelivery = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/deliveries/${id}/edit`, {
                outForDelivery: true,
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            alert("Delivery marked as out for delivery!");
            // Update the deliveries state
            setDeliveries((prevDeliveries) =>
                prevDeliveries.map((delivery) =>
                    delivery.id.S === id ? { ...delivery, outForDelivery: true } : delivery
                )
            );
        } catch (err) {
            console.error('Error marking delivery as out for delivery:', err);
            setError(err.response?.data?.message || 'Failed to mark delivery as out for delivery.');
        }
    };

    const handleComplete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/deliveries/${id}/edit`, {
                markedCompleted: true,
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            alert("Delivery marked as completed!");
            // Update the deliveries state
            setDeliveries((prevDeliveries) =>
                prevDeliveries.map((delivery) =>
                    delivery.id.S === id ? { ...delivery, markedCompleted: true } : delivery
                )
            );
        } catch (err) {
            console.error('Error marking delivery as completed:', err);
            setError(err.response?.data?.message || 'Failed to mark delivery as completed.');
        }
    };


    const handleEdit = (id) => {
        navigate(`/deliveries/${id}/edit`);
    };

    const filteredDeliveries = deliveries.filter(delivery => {
        return (
            !delivery.markedForDeletion?.BOOL &&
            !delivery.markedCompleted?.BOOL &&
            !delivery.markedForReview?.BOOL &&
            !delivery.outForDelivery?.BOOL
        );
    });

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
            {filteredDeliveries.length > 0 ? (
                filteredDeliveries.map((delivery) => (
                    <Delivery
                        key={delivery.id.S}
                        delivery={delivery}
                        drivers={drivers}
                        onFlagReview={handleFlagReview}
                        onOutForDelivery={handleOutForDelivery}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))
            ) : (
                <p>No deliveries available.</p>
            )}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate("/deliveries/new")}
            />
        </div>
    );
};

export default Deliveries;