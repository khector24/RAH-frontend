// Pages/MarkForReview.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Page-Styles/MarkedForReview.css';

const MarkedCompleted = () => {
    const [completedDeliveries, setCompletedDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCompletedDeliveries = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/deliveries', {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                const deliveriesMarkedForReview = response.data.filter(
                    (delivery) => delivery.markedCompleted?.BOOL
                );

                setCompletedDeliveries(deliveriesMarkedForReview);
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
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:3000/deliveries/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                alert("Item permanently deleted!");
                setCompletedDeliveries((prevDeliveries) =>
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
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:3000/deliveries/${id}/edit`,
                { markedCompleted: false },
                {
                    headers: {
                        'Authorization': `${token}`,
                    },
                }
            );
            alert("Item restored successfully!");
            setCompletedDeliveries((prevDeliveries) =>
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
            {completedDeliveries.map((delivery) => (
                <div className='Delivery' key={delivery.id.S}>
                    <p>Customer: {delivery.customerName?.S}</p>
                    <p>Phone: {delivery.customerPhoneNumber?.S || 'N/A'}</p>
                    <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
                    <p>Date: {delivery.deliveryDate?.S || 'N/A'}</p>
                    <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
                    <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>
                    {/* Include other details as needed */}
                    {/* <button onClick={() => handleFinalDelete(delivery.id.S)}>
                        Delete Permanently
                    </button> */}
                    <button onClick={() => handleRestore(delivery.id.S)}>
                        Restore
                    </button>
                </div>
            ))}
        </div>
    );
};

export default MarkedCompleted;