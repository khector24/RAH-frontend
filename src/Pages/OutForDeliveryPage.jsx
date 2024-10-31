// Pages/OutForDelivery.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Page-Styles/OutForDelivery.css';

const OutForDelivery = () => {
    const [outDeliveries, setOutDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State to manage visibility of delivery history
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);

    // Function to format the timestamp to standard time
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    // Function to get background color based on action
    const getActionColor = (action) => {
        switch (action) {
            case 'created':
                return '#d4edda'; // Light Green
            case 'out for delivery':
                return '#cce5ff'; // Light Blue
            case 'marked for review':
                return '#fff3cd'; // Light Yellow
            case 'marked completed':
                return '#e2e3e5'; // Light Grey
            case 'marked for deletion':
                return '#f8d7da'; // Light Red
            case 'restored':
                return '#ffeeba'; // Light Orange
            default:
                return 'transparent'; // Default background color
        }
    };

    // Toggle delivery history visibility
    const toggleHistoryVisibility = () => {
        setIsHistoryVisible((prev) => !prev);
    };

    useEffect(() => {
        const fetchOutDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/deliveries', {
                    headers: {
                        'Authorization': `${token}`,
                    },
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
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/deliveries/${id}/edit`,
                { markedCompleted: true },
                {
                    headers: {
                        'Authorization': `${token}`,
                    },
                }
            );
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
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/deliveries/${id}/edit`,
                { outForDelivery: false },
                {
                    headers: {
                        'Authorization': `${token}`,
                    },
                }
            );


            alert("Item restored successfully!");
            setOutDeliveries((prevDeliveries) =>
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
            <h2>Out for Delivery</h2>
            {outDeliveries.map((delivery) => (
                <div className='Delivery' key={delivery.id.S}>
                    <p>Customer: {delivery.customerName?.S}</p>
                    <p>Phone: {delivery.customerPhoneNumber?.S || 'N/A'}</p>
                    <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
                    <p>Date: {delivery.deliveryDate?.S || 'N/A'}</p>
                    <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
                    <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>

                    <div>
                        {/* <h4>Delivery History:</h4> */}
                        <button onClick={toggleHistoryVisibility}>
                            {isHistoryVisible ? 'Hide Delivery History' : 'Show Delivery History'}
                        </button>

                        {isHistoryVisible && delivery.deliveryHistory?.L && (
                            <div className='delivery-history'>
                                {delivery.deliveryHistory.L.map((historyItem, index) => {
                                    const action = historyItem.M.action.S;
                                    const manager = historyItem.M.manager.S;
                                    const timestamp = historyItem.M.timestamp.S;
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
