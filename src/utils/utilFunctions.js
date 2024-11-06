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

export const fetchDeliveryHistory = async (deliveryId) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/deliveries/${deliveryId}/history`, {
            headers: {
                'Authorization': `${token}`,
            },
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

export const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });
};

// Function to get background color based on action
export const getActionColor = (action) => {
    switch (action) {
        case 'created':
            return '#e2e3e5'; // Light Grey
        case 'out for delivery':
            return '#cce5ff'; // Light Blue
        case 'marked for review':
            return '#fff3cd'; // Light Yellow
        case 'marked completed':
            return '#d4edda'; // Light Green
        case 'marked for deletion':
            return '#f8d7da'; // Light Red
        case 'updated':
            return '#e5d4f1'; // Light Purple
        default:
            return 'transparent'; // Default background color
    }
};

export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { 'Authorization': `${token}` };
};

// Returns a Unix timestamp for one week from the current time
export const getOneWeekFromNow = () => {
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
    const oneWeekFromNow = Date.now() + oneWeekInMs; // Current time + one week
    return Math.floor(oneWeekFromNow / 1000); // Convert to Unix timestamp in seconds
};

