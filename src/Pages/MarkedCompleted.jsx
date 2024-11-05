// Pages/MarkForCompleted.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Page-Styles/MarkedForReview.css';
import { logDeliveryAction, getActionColor, formatTimestamp, getAuthHeaders } from '../utils/utilFunctions';

const MarkedCompleted = () => {
    const [markedDeliveries, setMarkedDeliveries] = useState([]);
    const [deliveryHistories, setDeliveryHistories] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    const fetchDeliveryHistory = async (deliveryId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:3000/deliveries/${deliveryId}/history`, {
                headers: getAuthHeaders(),
            });
            // Update the history state for this specific delivery
            setDeliveryHistories((prevHistories) => ({
                ...prevHistories,
                [deliveryId]: {
                    ...prevHistories[deliveryId],
                    history: response.data,
                },
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch the delivery history.');
        }
    };

    useEffect(() => {
        const fetchCompletedDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/deliveries', {
                    headers: getAuthHeaders(),
                });

                const deliveriesMarkedCompleted = response.data.filter(
                    (delivery) => delivery.markedCompleted?.BOOL
                );

                setMarkedDeliveries(deliveriesMarkedCompleted);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch marked deliveries.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompletedDeliveries();
    }, []);

    const handleFinalDelete = async (id) => {
        const confirmFinalDelete = window.confirm(
            "You are on the final delete page, if you press yes, the delivery will be deleted forever. Are you sure you want to proceed?"
        );
        if (confirmFinalDelete) {
            try {
                const username = localStorage.getItem('username');

                await axios.delete(`http://localhost:3000/deliveries/${id}`, {
                    headers: getAuthHeaders(),
                });

                if (username) {
                    await logDeliveryAction(id, "final deletion", username);
                } else {
                    console.error('Username not found. Cannot log action.');
                }

                alert("Item permanently deleted!");
                setMarkedDeliveries((prevDeliveries) =>
                    prevDeliveries.filter((delivery) => delivery.id.S !== id)
                );
            } catch (err) {
                console.error('Error deleting delivery:', err);
                setError(err.response?.data?.message || 'Failed to delete delivery.');
            }
        }
    };

    const handleRestore = async (id) => {
        try {
            const username = localStorage.getItem('username');

            await axios.put(`http://localhost:3000/deliveries/${id}/edit`,
                { markedCompleted: false },
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
            setMarkedDeliveries((prevDeliveries) =>
                prevDeliveries.filter((delivery) => delivery.id.S !== id)
            );
        } catch (err) {
            console.error('Error restoring delivery:', err);
            setError(err.response?.data?.message || 'Failed to restore delivery.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Completed Deliveries</h2>
            {markedDeliveries.map((delivery) => (
                <div className='Delivery' key={delivery.id.S}>
                    <p>Customer: {delivery.customerName?.S}</p>
                    <p>Phone: {delivery.customerPhoneNumber?.S || 'N/A'}</p>
                    <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
                    <p>Date: {delivery.deliveryDate?.S || 'N/A'}</p>
                    <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
                    <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>
                    <button onClick={() => toggleHistoryVisibility(delivery.id.S)}>
                        {deliveryHistories[delivery.id.S]?.isVisible ? 'Hide Delivery History' : 'Show Delivery History'}
                    </button>
                    <div>
                        {deliveryHistories[delivery.id.S]?.isVisible && deliveryHistories[delivery.id.S]?.history.length > 0 && (
                            <div className='delivery-history'>
                                {deliveryHistories[delivery.id.S].history.map((historyItem, index) => {
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
                                })}
                            </div>
                        )}
                    </div>

                    <button onClick={() => handleFinalDelete(delivery.id.S)}>
                        Delete Permanently
                    </button>
                    <button onClick={() => handleRestore(delivery.id.S)}>
                        Restore
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MarkedCompleted;