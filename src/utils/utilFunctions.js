// utils/utilFunction.js
import axios from 'axios';

export const logDeliveryAction = async (id, action, manager) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authorization token not found');

        console.log('Logging delivery action with ID:', id, 'and action:', action);

        await axios.post('http://localhost:3000/deliveries/history', {
            deliveryId: id,
            action,
            timestamp: new Date().toISOString(),
            manager
        }, {
            headers: {
                'Authorization': `${token}`,
            },
        });
    } catch (err) {
        console.error('Error logging delivery action:', err.response?.data || err.message);
    }
};

export const fetchDeliveryHistory = async (id) => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Token not found');
        }

        const deliveryHistoryResponse = await axios.get(`http://localhost:3000/deliveries/${id}/history`, {
            headers: {
                'Authorization': `${token}`,
            },
        });
        setDeliveries(deliveryHistoryResponse.data);
    } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch the delivery history.');
    }
};
