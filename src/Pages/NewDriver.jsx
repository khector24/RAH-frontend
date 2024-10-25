import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../Styles/Page-Styles/NewDriver.css';

export default function NewDriver() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors },
    } = useForm({ mode: "onchange" });

    const password = watch('password');
    const phoneNumber = watch('phoneNumber');

    // Password validation function
    // const validatePassword = (value) => {
    //     const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    //     return strongPasswordPattern.test(value) || 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.';
    // };

    const validatePhoneNumber = (value) => {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        return phonePattern.test(value) || 'Phone number must be in the format 123-456-7890.';
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.post('http://localhost:3000/drivers', {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log('Driver created successfully:', response.data);
            navigate('/drivers');
        } catch (err) {
            console.error('Error creating driver:', err);
            setError('submit', { type: 'manual', message: 'Failed to create driver. Please try again.' });
        }
    };

    return (
        <div className='new-driver'>
            <h2>Create New Driver</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <label>First Name:</label>
                    <input
                        type="text"
                        {...register('firstName',
                            { required: 'First name is required.' })}
                        placeholder="e.g., John"
                    />
                    {errors.firstName && <p className='error-message'>{errors.firstName.message}</p>}
                </div>
                <div>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        {...register('lastName',
                            { required: 'Last name is required.' })}
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
                            validate: validatePhoneNumber
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
                        Create Driver
                    </button>
                </div>
            </form>
        </div>
    );
}