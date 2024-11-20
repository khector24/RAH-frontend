import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Delivery from '../Components/delivery';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { format, startOfToday } from 'date-fns';
import { getAuthHeaders, logDeliveryAction, getOneWeekFromNow } from '../utils/utilFunctions';
import '../Styles/Page-Styles/Deliveries.css';

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const navigate = useNavigate();

    const fetchDeliveries = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const deliveryResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries`, {
                headers: getAuthHeaders(),
            });
            setDeliveries(deliveryResponse.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch deliveries.');
        }
    };

    // const fetchDeliveryHistory = async (id) => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             throw new Error('Token not found');
    //         }

    //         const deliveryHistoryResponse = await axios.get(`h${process.env.REACT_APP_BACKEND_URL}/deliveries/${id}/history`, {
    //             headers: {
    //                 'Authorization': `${token}`,
    //             },
    //         });
    //         setDeliveries(deliveryHistoryResponse.data);
    //     } catch (err) {
    //         setError(err.response?.data?.message || 'Failed to fetch the delivery history.');
    //     }
    // };

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                const driverResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/drivers`, {
                    headers: getAuthHeaders(),
                });
                setDrivers(driverResponse.data);
            } catch (err) {
                console.error('Error fetching drivers:', err);
                setError(err.response?.data?.message || 'Failed to fetch drivers.');
            }
        };

        const fetchAllData = async () => {
            setLoading(true);
            await Promise.all([fetchDeliveries(), fetchDrivers()]);
            setLoading(false);
        };

        fetchAllData();
    }, [selectedDate]);

    const handleDateChange = (event) => {
        setSelectedDate(new Date(event.target.value));
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to mark this delivery for deletion?");
        if (confirmDelete) {
            try {
                const deletionDate = getOneWeekFromNow();
                const username = localStorage.getItem('username'); // Get username directly here

                await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries/${id}/edit`, {
                    markedForDeletion: true,
                    deletionDate: deletionDate,
                }, {
                    headers: getAuthHeaders(),
                });

                if (username) { // Use username directly
                    await logDeliveryAction(id, 'marked for deletion', username);
                } else {
                    console.error('Username not found. Cannot log action.');
                }

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
            const username = localStorage.getItem('username'); // Get username directly here

            await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries/${id}/edit`, {
                markedForReview: true,
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (username) { // Use username directly
                await logDeliveryAction(id, 'marked for review', username);
            } else {
                console.error('Username not found. Cannot log action.');
            }

            alert("Delivery marked for review!");
            fetchDeliveries();
        } catch (err) {
            console.error('Error marking delivery for review:', err);
            setError(err.response?.data?.message || 'Failed to mark delivery for review.');
        }
    };

    const handleOutForDelivery = async (id, driverName) => {
        try {
            const username = localStorage.getItem('username');

            await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries/${id}/edit`, {
                outForDelivery: true,
                driver: driverName,
            }, {
                headers: getAuthHeaders(),
            });

            if (username) {
                await logDeliveryAction(id, 'out for delivery', username);
            } else {
                console.error('Username not found. Cannot log action.');
            }

            alert("Delivery marked as out for delivery!");
            fetchDeliveries();
        } catch (err) {
            console.error('Error marking delivery as out for delivery:', err);
            setError(err.response?.data?.message || 'Failed to mark delivery as out for delivery.');
        }
    };

    const handleComplete = async (id, driverName) => {
        try {
            const username = localStorage.getItem('username'); // Get username directly here
            const deletionDate = getOneWeekFromNow();

            await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries/${id}/edit`, {
                markedCompleted: true,
                driver: driverName,
                deletionDate: deletionDate,
            }, {
                headers: getAuthHeaders(),
            });

            if (username) { // Use username directly
                await logDeliveryAction(id, 'marked completed', username);
            } else {
                console.error('Username not found. Cannot log action.');
            }

            alert("Delivery marked as completed!");
            fetchDeliveries();
        } catch (err) {
            console.error('Error marking delivery as completed:', err);
            setError(err.response?.data?.message || 'Failed to mark delivery as completed.');
        }
    };

    const handleEdit = (id) => {
        navigate(`/deliveries/${id}/edit`);
    };

    const filteredDeliveries = deliveries.filter((delivery) => {
        const deliveryDate = delivery.deliveryDate?.S;
        const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
        return (
            deliveryDate === selectedDateString &&
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

    return (
        <div className='Deliveries'>
            <div className="date-picker">
                <div className="date-picker-title">
                    <h2>Deliveries for: </h2>
                </div>
                <div className="date-picker-input">
                    <input
                        type="date"
                        value={format(selectedDate, 'yyyy-MM-dd')}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
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
                <p>No deliveries available for this date.</p>
            )}
            <AddCircleOutlineIcon
                className='add-icon'
                onClick={() => navigate("/deliveries/new")}
            />
        </div>
    );
};

export default Deliveries;

