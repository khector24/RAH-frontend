import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import '../Styles/Components-Styles/Delivery.css';

const Delivery = ({ delivery, drivers, onDelete, onEdit, onFlagReview, onOutForDelivery, onComplete }) => {
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
                <button onClick={() => onOutForDelivery(delivery.id.S)}>Out for Delivery</button>
                <button onClick={() => onComplete(delivery.id.S)}>Mark as Completed</button>
            </div>
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

