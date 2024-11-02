import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import '../Styles/Components-Styles/Delivery.css';
import axios from 'axios';
import { getActionColor, formatTimestamp } from '../utils/utilFunctions';

const Delivery = ({ delivery, drivers, onDelete, onEdit, onFlagReview, onOutForDelivery, onComplete }) => {
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [deliveryHistory, setDeliveryHistory] = useState([]); // Local state for delivery history
    const [error, setError] = useState(null); // State for error handling

    const toggleHistoryVisibility = async () => {
        setIsHistoryVisible((prev) => !prev);

        if (!isHistoryVisible) {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/deliveries/${delivery.id.S}/history`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDeliveryHistory(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch the delivery history.');
            }
        }
    };

    return (
        <div className='delivery'>
            <div className='delivery-heading'>
                <h3>Customer: {delivery.customerName?.S || 'N/A'}</h3>
                <div className='heading-buttons'>
                    <EditIcon
                        titleAccess="Edit Delivery"
                        onClick={() => onEdit(delivery.id.S)}
                    />
                    <DeleteIcon
                        titleAccess="Delete Delivery"
                        onClick={() => onDelete(delivery.id.S)}
                    />
                    <FlagIcon
                        titleAccess="Mark for Review"
                        onClick={() => onFlagReview(delivery.id.S)}
                    />
                </div>
            </div>

            <p>Phone: {delivery.customerPhoneNumber?.S || 'N/A'}</p>
            <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
            <p>Delivery Date: {delivery.deliveryDate?.S || 'N/A'}</p>
            <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
            <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>

            <label htmlFor="driver-select">Assign Driver:</label>
            <select name="drivers" id="driver-select">
                <option value="">--Please choose an option--</option>
                {drivers.map((driver) => (
                    <option key={driver.id.S} value={driver.id.S}>
                        {driver.firstName.S} {driver.lastName.S}
                    </option>
                ))}
            </select>

            <div>
                <button onClick={toggleHistoryVisibility}>
                    {isHistoryVisible ? 'Hide Delivery History' : 'Show Delivery History'}
                </button>

                {isHistoryVisible && deliveryHistory.length > 0 && (
                    <div className='delivery-history'>
                        {deliveryHistory.map((historyItem, index) => {
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
                {isHistoryVisible && deliveryHistory.length === 0 && <p>No history available.</p>}
                {error && <p className='error'>{error}</p>} {/* Display error if any */}
            </div>

            <button onClick={() => onOutForDelivery(delivery.id.S)}>Out for Delivery</button>
            <button onClick={() => onComplete(delivery.id.S)}>Mark as Completed</button>
        </div>
    );
};

export default Delivery;









// // Components/Delivery.jsx

// import React from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FlagIcon from '@mui/icons-material/Flag';

// const Delivery = ({ delivery }) => {
//     return (
//         // <div className='delivery'>
//         //     <li>
//         //         <h3>
//         //             Customer: {delivery.customerName.S}
//         //             <EditIcon titleAccess="Edit Delivery" />
//         //             <DeleteIcon titleAccess="Delete Delivery" />
//         //             <FlagIcon titleAccess="Flag Delivery" />
//         //         </h3>
//         //         <p>Phone: {delivery.customerPhoneNumber.S}</p>
//         //         <p>Address: {delivery.customerAddress.S}</p>
//         //         <p>Date: {delivery.deliveryDate.S}</p>
//         //         <p>Time Range: {delivery.timeRange.S}</p>
//         //     </li>
//         //     <div>
//         //         <button>Out for Delivery</button>
//         //         <button>Mark as Completed</button>
//         //     </div>

//         //     <label htmlFor="driver-select">Assign Driver:</label>
//         //     <select name="drivers" id="driver-select">
//         //         <option value="">--Please choose an option--</option>
//         //         {/* You can populate options here dynamically */}
//         //     </select>

//         //     <p>Created by: {delivery.managerId}</p>
//         // </div>
//         <h1>delivery.customerName.S</h1>
//     );
// };

// export default Delivery;

