// Pages/OutForDelivery.jsx

import { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Page-Styles/OutForDelivery.css';

const OutForDelivery = () => {
    const [outDeliveries, setOutDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
