import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { logDeliveryAction } from '../utils/utilFunctions';
import '../Styles/Page-Styles/NewDelivery.css';

export default function NewDelivery() {
    const [managerId, setManagerId] = useState('');
    const [drivers, setDrivers] = useState([]); // State to hold drivers
    const [selectedDriver, setSelectedDriver] = useState(''); // State to hold selected driver ID
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({ mode: 'onChange' });

    // Function to validate phone number
    const validatePhoneNumber = (value) => {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        return phonePattern.test(value) || 'Phone number must be in the format 123-456-7890.';
    };

    // Fetch the manager ID (username) on component mount
    useEffect(() => {
        const username = localStorage.getItem('username');
        if (username) {
            setManagerId(username);
        }

        // Fetch drivers from the API
        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:3000/drivers', {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDrivers(response.data); // Set drivers to state
            } catch (error) {
                console.error('Error fetching drivers:', error);
            }
        };

        fetchDrivers();
    }, []);

    const onSubmit = async (data) => {
        const confirmDeliveryCreation = window.confirm('Are you sure you want to create this delivery?');

        if (confirmDeliveryCreation) {
            try {

                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.post(
                    'http://localhost:3000/deliveries',
                    {
                        ...data,
                        managerId, // Include manager ID
                        // driverId is no longer included
                    },
                    {
                        headers: {
                            'Authorization': `${token}`,
                        },
                    }
                );

                console.log('Server response:', response.data);

                // Capture deliveryId from response data
                const deliveryId = response.data.deliveryId; // Adjust based on your API response
                const manager = response.data.managerId;

                if (deliveryId) {
                    await logDeliveryAction(deliveryId, 'created', manager);
                } else {
                    throw new Error('Delivery ID not returned from server');
                }
                console.log('Delivery created successfully:', response.data);
                navigate('/deliveries');
            } catch (err) {
                console.error('Error creating delivery:', err);
                setError('submit', { type: 'manual', message: 'Failed to create delivery. Please try again.' });
            }
        }
    };


    return (
        <div className='new-delivery'>
            <h2>Create New Delivery</h2>
            {errors.submit && <p className='error-message'>{errors.submit.message}</p>}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Customer Name:</label>
                    <input
                        type="text"
                        {...register('customerName', { required: 'Customer name is required.' })}
                        placeholder="e.g., John Smith"
                    />
                    {errors.customerName && <p className='error-message'>{errors.customerName.message}</p>}
                </div>
                <div>
                    <label>Customer Phone Number:</label>
                    <input
                        type="text"
                        {...register('customerPhoneNumber', {
                            required: 'Customer phone number is required.',
                            validate: validatePhoneNumber
                        })}
                        placeholder="e.g., 123-456-7890"
                    />
                    {errors.customerPhoneNumber && <p className='error-message'>{errors.customerPhoneNumber.message}</p>}
                </div>
                <div>
                    <label>Delivery Address:</label>
                    <input
                        type="text"
                        {...register('deliveryAddress', { required: 'Delivery address is required.' })}
                        placeholder="e.g., 123 Milton Ave."
                    />
                    {errors.deliveryAddress && <p className='error-message'>{errors.deliveryAddress.message}</p>}
                </div>
                <div>
                    <label>Delivery Date:</label>
                    <input
                        type="date"
                        {...register('deliveryDate', { required: 'Delivery date is required.' })}
                    />
                    {errors.deliveryDate && <p className='error-message'>{errors.deliveryDate.message}</p>}
                </div>
                <div>
                    <label htmlFor="time-ranges">Choose a Time Range:</label>
                    <select
                        id="time-ranges"
                        {...register('timeRange', { required: 'Time range is required.' })}
                        defaultValue="" // Set default value to empty
                    >
                        <option value="" disabled>Select a time range</option>
                        <option value="7 AM to 12 PM">7 AM to 12 PM</option>
                        <option value="12 PM to 5 PM">12 PM to 5 PM</option>
                    </select>
                    {errors.timeRange && <p className='error-message'>{errors.timeRange.message}</p>}
                </div>
                <div>
                    <label>Delivery Notes:</label>
                    <textarea
                        {...register('deliveryNotes', { required: 'Delivery notes are required.' })}
                        placeholder="Any notes"
                        rows="6"
                    ></textarea>
                    {errors.deliveryNotes && <p className='error-message'>{errors.deliveryNotes.message}</p>}
                </div>
                <div className='bottom-buttons'>
                    <button className='submit-button' type='submit'>
                        Create Delivery
                    </button>
                    <button type='button' onClick={() => navigate('/deliveries')}>
                        Cancel
                    </button>
                </div>
            </form >
        </div >
    );
}
