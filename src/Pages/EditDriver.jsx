import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../Styles/Page-Styles/EditDriver.css';

export default function EditDriver() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const validatePhoneNumber = (value) => {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        return phonePattern.test(value) || 'Phone number must be in the format 123-456-7890.';
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get(`http://localhost:3000/drivers/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                // Set the form values
                const driverData = response.data;
                setValue('firstName', driverData.firstName.S);
                setValue('lastName', driverData.lastName.S);
                setValue('phoneNumber', driverData.phoneNumber.S);
            } catch (err) {
                console.error('Error fetching driver:', err);
                setError(err.response?.data?.message || 'Failed to fetch driver.');
            } finally {
                setLoading(false);
            }
        };
        fetchDriver();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.put(`http://localhost:3000/drivers/${id}/edit`, {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log('Driver updated successfully:', response.data);
            navigate('/drivers');
        } catch (err) {
            console.error('Error updating driver:', err);
            setError(err.response?.data?.message || 'Failed to update driver. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='edit-driver'>
            <h2>Edit driver</h2>
            <form className='driver-form' onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        {...register('firstName', { required: 'First name is required.' })}
                        placeholder="e.g., John"
                    />
                    {errors.firstName && <p className='error-message'>{errors.firstName.message}</p>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        {...register('lastName', { required: 'Last name is required.' })}
                        placeholder="e.g., Smith"
                    />
                    {errors.lastName && <p className='error-message'>{errors.lastName.message}</p>}
                </div>
                <div>
                    <label>Phone Number:</label>
                    <input
                        type="text"
                        {...register('phoneNumber', {
                            required: 'Phone number is required.',
                            validate: validatePhoneNumber,
                        })}
                        placeholder="e.g., 123-456-7890"
                    />
                    {errors.phoneNumber && <p className='error-message'>{errors.phoneNumber.message}</p>}
                </div>
                <div className='bottom-buttons'>
                    <button
                        type='button'
                        onClick={() => navigate('/drivers')}
                    >
                        Cancel
                    </button>
                    <button
                        className='submit-button'
                        type='submit'
                    >
                        Update Driver
                    </button>
                </div>
            </form>
        </div>
    );
}