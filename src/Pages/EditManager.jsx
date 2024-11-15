import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../Styles/Page-Styles/EditManager.css';

export default function EditManager() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Password validation function
    // const validatePassword = (value) => {
    //     const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    //     return strongPasswordPattern.test(value) || 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.';
    // };

    const validatePhoneNumber = (value) => {
        const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
        return phonePattern.test(value) || 'Phone number must be in the format 123-456-7890.';
    };

    // Function to validate email address
    const validateEmail = (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value) || 'Please enter a valid email address.';
    };

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ mode: "onChange" });

    useEffect(() => {
        const fetchManager = async () => {
            try {
                const token = localStorage.getItem('token');

                if (!token) {
                    throw new Error('Token not found');
                }

                const response = await axios.get(`http://localhost:3000/managers/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });

                // Set the form values
                const managerData = response.data;
                setValue('firstName', managerData.firstName?.S);
                setValue('lastName', managerData.lastName?.S);
                setValue('phoneNumber', managerData.phoneNumber?.S);
                setValue('email', managerData.email?.S);
                // setValue('title', managerData.title);
            } catch (err) {
                console.error('Error fetching manager:', err);
                setError(err.response?.data?.message || 'Failed to fetch manager.');
            } finally {
                setLoading(false);
            }
        };
        fetchManager();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            const response = await axios.put(`http://localhost:3000/managers/${id}/edit`, {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phoneNumber: data.phoneNumber
                // title: data.title
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log('Manager updated successfully:', response.data);
            navigate('/managers');
        } catch (err) {
            console.error('Error updating manager:', err);
            setError(err.response?.data?.message || 'Failed to update manager. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className='edit-manager'>
            <h2>Edit Manager</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                    <label>Email:</label>
                    <input
                        type="text"
                        {...register('email', {
                            required: 'Email is required.',
                            validate: validateEmail,
                        })}
                        placeholder="e.g., johnsmith@gmail.com"
                    />
                    {errors.email && <p className='error-message'>{errors.email.message}</p>}
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
                {/* <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        {...register('title', { required: 'Title is required.' })}
                        placeholder="e.g., Assistant Manager"
                    />
                    {errors.title && <p className='error-message'>{errors.title.message}</p>}
                </div> */}
                <div className='bottom-buttons'>
                    <button
                        type='button'
                        onClick={() => navigate('/managers')}
                    >
                        Cancel
                    </button>
                    <button
                        className='submit-button'
                        type='submit'
                    >
                        Update Manager
                    </button>
                </div>
            </form>
        </div>
    );
}

