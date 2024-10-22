import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/Page-Styles/NewDelivery.css';

export default function NewDelivery() {
    const [customerName, setCustomerName] = useState('');
    const [customerPhoneNumber, setCustomerPhoneNumber] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [deliveryDate, setDeliveryDate] = useState('');
    const [timeRange, setTimeRange] = useState('');
    const [deliveryNotes, setDeliveryNotes] = useState('');
    const [managerId, setManagerId] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleCreateDelivery = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.post('http://localhost:3000/deliveries', {
                customerName,
                customerPhoneNumber,
                deliveryAddress,
                deliveryDate,
                timeRange,
                deliveryNotes,
                managerId,
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log('Delivery created successfully:', response.data);
            navigate('/deliveries');
        } catch (err) {
            console.error('Error creating delivery:', err);
            setError('Failed to create delivery. Please try again.');
        }
    };

    return (
        <div className='new-delivery'>
            <h2>Create New Delivery</h2>
            {error && <p className='error-message'>{error}</p>}
            <form onSubmit={handleCreateDelivery}>
                <div>
                    <label>Customer Name:</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        required
                        placeholder="e.g., John Smith"
                    />
                </div>
                <div>
                    <label>Customer Phone Number:</label>
                    <input
                        type="text"
                        value={customerPhoneNumber}
                        onChange={(e) => setCustomerPhoneNumber(e.target.value)}
                        required
                        placeholder="e.g., 123-456-7890"
                    />
                </div>
                <div>
                    <label>Delivery Address:</label>
                    <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                        placeholder="e.g., 123 Milton Ave."
                    />
                </div>
                <div>
                    <label>Delivery Date:</label>
                    <input
                        type="date"
                        value={deliveryDate}
                        onChange={(e) => setDeliveryDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="time-ranges">Choose a Time Range:</label>
                    <select
                        id="time-ranges"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        required
                    >
                        <option value="7 AM to 12 PM">7 AM to 12 PM</option>
                        <option value="12 PM to 5 PM">12 PM to 5 PM</option>
                    </select>
                </div>
                <div>
                    <label>Delivery Notes:</label>
                    <textarea
                        name="Delivery-Notes"
                        id="delivery-notes"
                        cols="30"
                        rows="6"
                        placeholder="Any notes"
                        value={deliveryNotes}
                        onChange={(e) => setDeliveryNotes(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Manager ID:</label>
                    <input
                        type="text"
                        value={managerId}
                        onChange={(e) => setManagerId(e.target.value)}
                        required
                    />
                </div>
                <div className='bottom-buttons'>
                    <button type='submit'>Create Delivery</button>
                    <button
                        type='button'
                        onClick={() => navigate('/deliveries')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
