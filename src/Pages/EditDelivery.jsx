// EditDelivery.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../Styles/Page-Styles/EditDelivery.css';

export default function EditDelivery() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

                const response = await axios.get(`http://localhost:3000/deliveries/${id}`, {
                    headers: {
                        'Authorization': `${token}`,
                    },
                });
                const deliveryData = response.data;
                setValue('title', deliveryData.title);
                setValue('description', deliveryData.description);
            } catch (err) {
                console.error('Error fetching delivery:', err);
                setError(err.response?.data?.message || 'Failed to fetch delivery.');
            } finally {
                setLoading(false);
            }
        };
        fetchDelivery();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }

            await axios.put(`http://localhost:3000/deliveries/${id}/edit`, {
                title: data.title,
                description: data.description
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

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
                    <label>Title:</label>
                    <input
                        type="text"
                        {...register('title', { required: 'Title is required.' })}
                    />
                    {errors.title && <p className='error-message'>{errors.title.message}</p>}
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        {...register('description', { required: 'Description is required.' })}
                    />
                    {errors.description && <p className='error-message'>{errors.description.message}</p>}
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
