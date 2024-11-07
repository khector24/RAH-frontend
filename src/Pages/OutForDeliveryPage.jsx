// src/Pages/OutForDelivery.jsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Page-Styles/OutForDelivery.css';
import { logDeliveryAction, getActionColor, formatTimestamp, getAuthHeaders, getOneWeekFromNow } from '../utils/utilFunctions';
import "../Styles/Page-Styles/MarkedDeliveries.css";
import EditIcon from '@mui/icons-material/Edit';


const OutForDelivery = () => {
    const [outDeliveries, setOutDeliveries] = useState([]);
    const [deliveryHistories, setDeliveryHistories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchDeliveryHistory = async (deliveryId) => {
        try {
            const response = await axios.get(`http://localhost:3000/deliveries/${deliveryId}/history`, {
                headers: getAuthHeaders(),
            });

            // Update the history state for this specific delivery
            setDeliveryHistories((prevHistories) => ({
                ...prevHistories,
                [deliveryId]: {
                    ...prevHistories[deliveryId],
                    history: response.data,
                    error: null, // Clear any previous error
                },
            }));
        } catch (err) {
            if (err.response?.status === 404) {
                setDeliveryHistories((prevHistories) => ({
                    ...prevHistories,
                    [deliveryId]: {
                        ...prevHistories[deliveryId],
                        history: [],
                        error: 'No delivery history exists for this delivery.',
                    },
                }));
            } else {
                setDeliveryHistories((prevHistories) => ({
                    ...prevHistories,
                    [deliveryId]: {
                        ...prevHistories[deliveryId],
                        history: [],
                        error: 'Failed to fetch the delivery history.',
                    },
                }));
            }
        }
    };

    // Toggle delivery history visibility
    const toggleHistoryVisibility = async (deliveryId) => {
        setDeliveryHistories((prevHistories) => {
            const isVisible = prevHistories[deliveryId]?.isVisible;

            if (!isVisible) {
                // Fetch delivery history if it's not visible
                fetchDeliveryHistory(deliveryId);
            }

            return {
                ...prevHistories,
                [deliveryId]: {
                    isVisible: !isVisible,
                    history: prevHistories[deliveryId]?.history || [],
                },
            };
        });
    };

    useEffect(() => {
        const fetchOutDeliveries = async () => {
            try {
                const response = await axios.get('http://localhost:3000/deliveries', {
                    headers: getAuthHeaders(),
                });

                const deliveriesOutForDelivery = response.data.filter(
                    (delivery) => delivery.outForDelivery?.BOOL
                );

                setOutDeliveries(deliveriesOutForDelivery);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch deliveries out for delivery.');
            } finally {
                setLoading(false);
            }
        };

        fetchOutDeliveries();
    }, []);

    const handleComplete = async (id) => {
        try {
            const username = localStorage.getItem('username');
            const deletionDate = getOneWeekFromNow();

            await axios.put(`http://localhost:3000/deliveries/${id}/edit`,
                {
                    markedCompleted: true,
                    deletionDate: deletionDate,
                },
                {
                    headers: getAuthHeaders(),
                }
            );

            if (username) {
                await logDeliveryAction(id, "restored", username);
            } else {
                console.error('Username not found. Cannot log action.');
            }

            alert("Delivery marked as completed!");
            setOutDeliveries((prevDeliveries) =>
                prevDeliveries.filter((delivery) => delivery.id.S !== id)
            );
        } catch (err) {
            console.error('Error marking delivery as completed:', err);
            setError(err.response?.data?.message || 'Failed to complete delivery.');
        }
    };

    const handleRestore = async (id) => {
        try {
            const username = localStorage.getItem('username');

            await axios.put(`http://localhost:3000/deliveries/${id}/edit`,
                {
                    outForDelivery: false,
                },
                {
                    headers: getAuthHeaders(),
                }
            );

            if (username) {
                await logDeliveryAction(id, "restored", username);
            } else {
                console.error('Username not found. Cannot log action.');
            }

            alert("Item restored successfully!");
            setOutDeliveries((prevDeliveries) =>
                prevDeliveries.filter((delivery) => delivery.id.S !== id)
            );
        } catch (err) {
            console.error('Error restoring delivery:', err);
            setError(err.response?.data?.message || 'Failed to restore delivery.');
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

    return (
        <div>
            <h2>Out for Delivery</h2>
            {outDeliveries.map((delivery) => (
                <div className='delivery' key={delivery.id.S}>
                    <div className='delivery-heading'>
                        <h3>Customer: {delivery.customerName?.S || 'N/A'}</h3>
                        <div className='heading-buttons'>
                            <EditIcon
                                titleAccess="Edit Delivery"
                                onClick={() => handleEdit(delivery.id.S)}
                            />
                        </div>
                    </div>
                    <p>Phone: {delivery.customerPhoneNumber?.S || 'N/A'}</p>
                    <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
                    <p>Date: {delivery.deliveryDate?.S || 'N/A'}</p>
                    <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
                    <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>
                    <p>Driver: {delivery.driver?.S || 'N/A'}</p>
                    <button onClick={() => toggleHistoryVisibility(delivery.id.S)}>
                        {deliveryHistories[delivery.id.S]?.isVisible ? 'Hide Delivery History' : 'Show Delivery History'}
                    </button>
                    <div>
                        {deliveryHistories[delivery.id.S]?.isVisible && (
                            <div className='delivery-history'>
                                {deliveryHistories[delivery.id.S]?.error ? (
                                    <p className='no-delivery-message'>{deliveryHistories[delivery.id.S].error}</p>
                                ) : (
                                    deliveryHistories[delivery.id.S]?.history.map((historyItem, index) => {
                                        const action = historyItem.action.S;
                                        const manager = historyItem.manager.S;
                                        const timestamp = historyItem.timestamp.S;
                                        const actionColor = getActionColor(action.toLowerCase());

                                        return (
                                            <div className='history-item' key={index} style={{ backgroundColor: actionColor }}>
                                                <div className='item'>
                                                    Action: {action}
                                                </div>
                                                <div className='item'>
                                                    Manager: {manager}
                                                </div>
                                                <div className='item'>
                                                    Time: {formatTimestamp(timestamp)}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        )}
                    </div>

                    <button onClick={() => handleComplete(delivery.id.S)}>
                        Mark as Completed
                    </button>
                    <button onClick={() => handleRestore(delivery.id.S)}>
                        Restore
                    </button>
                </div>
            ))}
        </div>
    );
};

export default OutForDelivery;
