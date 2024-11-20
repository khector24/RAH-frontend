import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../Styles/Page-Styles/EditDelivery.css';
import { logDeliveryAction, getAuthHeaders } from '../utils/utilFunctions';

export default function EditDelivery() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedDriver, setSelectedDriver] = useState('');

    const handleDriverChange = (event) => {
        setSelectedDriver(event.target.value);
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries/${id}`, {
                    headers: getAuthHeaders(),
                });
                const deliveryData = response.data;

                // Set form values based on the fetched delivery data
                setValue('customerName', deliveryData.customerName?.S || '');
                setValue('customerPhoneNumber', deliveryData.customerPhoneNumber?.S || '');
                setValue('customerEmail', deliveryData.customerEmail?.S || '');
                setValue('customerAddress', deliveryData.customerAddress?.S || '');
                setValue('deliveryDate', deliveryData.deliveryDate?.S || '');
                setValue('timeRange', deliveryData.timeRange?.S || '');
                setValue('deliveryNotes', deliveryData.deliveryNotes?.S || '');
                // Set the selected driver based on delivery data
                setSelectedDriver(deliveryData.driver?.S || '');
            } catch (err) {
                console.error('Error fetching delivery:', err);
                setError(err.response?.data?.message || 'Failed to fetch delivery.');
            } finally {
                setLoading(false);
            }
        };

        const fetchDrivers = async () => {
            try {
                const token = localStorage.getItem('token');
                const driverResponse = await axios.get(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/drivers`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                setDrivers(driverResponse.data);
            } catch (err) {
                console.error('Error fetching drivers:', err);
                setError(err.response?.data?.message || 'Failed to fetch drivers.');
            }
        };

        fetchDelivery();
        fetchDrivers();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const username = localStorage.getItem('username');

            await axios.put(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/deliveries/${id}/edit`, {
                customerName: data.customerName,
                customerPhoneNumber: data.customerPhoneNumber,
                customerEmail: data.customerEmail,
                customerAddress: data.customerAddress,
                deliveryDate: data.deliveryDate,
                timeRange: data.timeRange,
                deliveryNotes: data.deliveryNotes,
                driver: data.driver,
            }, {
                headers: getAuthHeaders()
            });

            if (username) {
                await logDeliveryAction(id, "updated", username);
            } else {
                console.error('Username not found. Cannot log action.');
            }

            navigate('/deliveries');
        } catch (err) {
            console.error('Error updating delivery:', err);
            setError(err.response?.data?.message || 'Failed to update delivery. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='edit-delivery'>
            <h2>Edit Delivery</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>Customer Name:</label>
                    <input
                        type="text"
                        {...register('customerName', { required: 'Customer Name is required.' })}
                    />
                    {errors.customerName && <p className='error-message'>{errors.customerName.message}</p>}
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        {...register('customerPhoneNumber', { required: 'Phone Number is required.' })}
                    />
                    {errors.customerPhoneNumber && <p className='error-message'>{errors.customerPhoneNumber.message}</p>}
                </div>
                <div>
                    <label>Email:</label>
                    <input
                        type="text"
                        {...register('customerEmail', { required: 'Email is required.' })}
                    />
                    {errors.customerEmail && <p className='error-message'>{errors.customerEmail.message}</p>}
                </div>
                <div>
                    <label>Address:</label>
                    <input
                        type="text"
                        {...register('customerAddress', { required: 'Address is required.' })}
                    />
                    {errors.customerAddress && <p className='error-message'>{errors.customerAddress.message}</p>}
                </div>
                <div>
                    <label>Delivery Date:</label>
                    <input
                        type="date"
                        {...register('deliveryDate', { required: 'Delivery Date is required.' })}
                    />
                    {errors.deliveryDate && <p className='error-message'>{errors.deliveryDate.message}</p>}
                </div>
                <div>
                    <label>Time Range:</label>
                    <select
                        {...register('timeRange', { required: 'Time Range is required.' })}
                        defaultValue={selectedDriver ? selectedDriver : ""} // Set the default value to the pre-selected time range
                    >
                        <option value="" disabled>Select a time range</option>
                        <option value="7 AM to 12 PM">7 AM to 12 PM</option>
                        <option value="12 PM to 5 PM">12 PM to 5 PM</option>
                        <option value="5 PM to 9 PM">5 PM to 9 PM</option> {/* Add more options as needed */}
                    </select>
                    {errors.timeRange && <p className='error-message'>{errors.timeRange.message}</p>}
                </div>

                <div>
                    <label>Delivery Notes:</label>
                    <textarea
                        {...register('deliveryNotes')}
                    />
                </div>
                <div>
                    <label htmlFor="driver-select">Assign Driver:</label>
                    <select
                        {...register('driver')} // Use register instead of value and onChange
                        id="driver-select"
                        value={selectedDriver} // Set the selected driver
                        onChange={handleDriverChange} // Update selected driver when changed
                    >
                        <option value="">--Please choose an option--</option>
                        {drivers.map((driver) => (
                            <option key={driver.id.S} value={`${driver.firstName.S} ${driver.lastName.S}`}>
                                {driver.firstName.S} {driver.lastName.S}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='bottom-buttons'>
                    <button
                        type='button'
                        onClick={() => navigate('/deliveries')}
                    >
                        Cancel
                    </button>
                    <button
                        className='submit-button'
                        type='submit'
                    >
                        Update Delivery
                    </button>
                </div>
            </form>
        </div>
    );
}
