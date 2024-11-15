import React, { useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import '../Styles/Components-Styles/Delivery.css';
import axios from 'axios';
import { getActionColor, formatTimestamp } from '../utils/utilFunctions';

const Delivery = ({ delivery, drivers, onDelete, onEdit, onFlagReview, onOutForDelivery, onComplete }) => {
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [deliveryHistory, setDeliveryHistory] = useState([]);
    const [error, setError] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState('');

    const handleDriverChange = (event) => {
        setSelectedDriver(event.target.value);
    };

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
            <p>Email: {delivery.customerEmail?.S || 'N/A'}</p>
            <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
            <p>Delivery Date: {delivery.deliveryDate?.S || 'N/A'}</p>
            <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
            <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>

            <label htmlFor="driver-select">Assign Driver:</label>
            <select name="drivers" id="driver-select" onChange={handleDriverChange}>
                <option value="">--Please choose an option--</option>
                {drivers.map((driver) => (
                    <option key={driver.id.S} value={`${driver.firstName.S} ${driver.lastName.S}`}>
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
                {error && <p className='error'>{error}</p>}
            </div>

            <button
                onClick={() => onOutForDelivery(delivery.id.S, selectedDriver)}
                disabled={!selectedDriver} // Disable if no driver selected
            >
                Mark as Out for Delivery
            </button>

            <button onClick={() => onComplete(delivery.id.S, selectedDriver)}>Mark as Completed</button>
        </div>
    );
};

export default Delivery;


// const AWS = require('aws-sdk');
// const sns = new AWS.SNS();

// const SNS_TOPIC_ARN = 'arn:aws:sns:REGION:ACCOUNT_ID:DeliveryUpdates'; // Replace with your actual SNS ARN

// export const handler = async (event) => {
//     console.log('Received event:', JSON.stringify(event, null, 2));
    
//     // Process each record in the stream
//     for (const record of event.Records) {
//         console.log(record.eventID);
//         console.log(record.eventName);
        
//         // Check if it's an insert or update event
//         if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
//             const newImage = AWS.DynamoDB.Converter.unmarshall(record.dynamodb.NewImage);
//             const customerPhoneNumber = newImage.customerPhoneNumber;
//             const customerName = newImage.customerName;
//             const deliveryDate = newImage.deliveryDate;
//             const timeRange = newImage.timeRange;
            
//             // Construct the message for the customer
//             const customerMessage = `Hello ${customerName}, your delivery is scheduled for ${deliveryDate} between ${timeRange}.`;

//             // Send a message to the customer via SNS
//             await sns.publish({
//                 Message: customerMessage,
//                 PhoneNumber: customerPhoneNumber // Send the message as SMS to customer
//             }).promise();

//             // Prepare the message for all managers (Assuming manager phone numbers are stored in an array)
//             const managerNumbers = await getManagersPhoneNumbers(); // Function to fetch managers' phone numbers
            
//             const managerMessage = `A new delivery has been scheduled for ${customerName} on ${deliveryDate} between ${timeRange}.`;
            
//             for (const number of managerNumbers) {
//                 await sns.publish({
//                     Message: managerMessage,
//                     PhoneNumber: number // Send the message as SMS to each manager
//                 }).promise();
//             }
//         }
//     }

//     return `Successfully processed ${event.Records.length} records.`;
// };

// // Function to get manager phone numbers (could be from a database or hardcoded for simplicity)
// const getManagersPhoneNumbers = async () => {
//     // Example: retrieve manager phone numbers from a database or static list
//     return ['+12345678901', '+12345678902'];  // Replace with actual logic to get manager phone numbers
// };
