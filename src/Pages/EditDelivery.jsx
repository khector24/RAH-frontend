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

                // Set form values based on the fetched delivery data
                setValue('customerName', deliveryData.customerName?.S || '');
                setValue('customerPhoneNumber', deliveryData.customerPhoneNumber?.S || '');
                setValue('customerAddress', deliveryData.customerAddress?.S || '');
                setValue('deliveryDate', deliveryData.deliveryDate?.S || '');
                setValue('timeRange', deliveryData.timeRange?.S || '');
                setValue('deliveryNotes', deliveryData.deliveryNotes?.S || '');
                // Assuming 'driverId' is part of the delivery data
                setValue('driverId', deliveryData.driverId?.S || '');
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
                customerName: data.customerName,
                customerPhoneNumber: data.customerPhoneNumber,
                customerAddress: data.customerAddress,
                deliveryDate: data.deliveryDate,
                timeRange: data.timeRange,
                deliveryNotes: data.deliveryNotes,
                driverId: data.driverId, // Include driverId if it's part of the update
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
                    <input
                        type="text"
                        {...register('timeRange', { required: 'Time Range is required.' })}
                    />
                    {errors.timeRange && <p className='error-message'>{errors.timeRange.message}</p>}
                </div>
                <div>
                    <label>Delivery Notes:</label>
                    <textarea
                        {...register('deliveryNotes')}
                    />
                </div>
                <div>
                    <label>Assign Driver:</label>
                    <select {...register('driverId')}>
                        <option value="">--Please choose an option--</option>
                        {/* Add driver options here */}
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


// // EditDelivery.jsx
// import { useParams, useNavigate } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import '../Styles/Page-Styles/EditDelivery.css';

// export default function EditDelivery() {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     const {
//         register,
//         handleSubmit,
//         setValue,
//         formState: { errors },
//     } = useForm({ mode: "onChange" });

//     useEffect(() => {
//         const fetchDelivery = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     throw new Error('Token not found');
//                 }

//                 const response = await axios.get(`http://localhost:3000/deliveries/${id}`, {
//                     headers: {
//                         'Authorization': `${token}`,
//                     },
//                 });
//                 const deliveryData = response.data;
//                 //setValue('title', deliveryData.title);
//                 //setValue('description', deliveryData.description);
//             } catch (err) {
//                 console.error('Error fetching delivery:', err);
//                 setError(err.response?.data?.message || 'Failed to fetch delivery.');
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchDelivery();
//     }, [id, setValue]);

//     const onSubmit = async (data) => {
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('Token not found');
//             }

//             await axios.put(`http://localhost:3000/deliveries/${id}/edit`, {
//                 title: data.title,
//                 description: data.description
//             }, {
//                 headers: {
//                     'Authorization': `${token}`,
//                 },
//             });

//             navigate('/deliveries');
//         } catch (err) {
//             console.error('Error updating delivery:', err);
//             setError(err.response?.data?.message || 'Failed to update delivery. Please try again.');
//         }
//     };

//     if (loading) {
//         return <p>Loading...</p>;
//     }

//     if (error) {
//         return <p>{error}</p>;
//     }

//     return (
//         <div className='edit-delivery'>
//             <h2>Edit Delivery</h2>
//             <form onSubmit={handleSubmit(onSubmit)}>
//                 <div>
//                     <label>Title:</label>
//                     <input
//                         type="text"
//                         {...register('title', { required: 'Title is required.' })}
//                     />
//                     {errors.title && <p className='error-message'>{errors.title.message}</p>}
//                 </div>
//                 <div>
//                     <label>Description:</label>
//                     <textarea
//                         {...register('description', { required: 'Description is required.' })}
//                     />
//                     {errors.description && <p className='error-message'>{errors.description.message}</p>}
//                 </div>
//                 <div className='bottom-buttons'>
//                     <button
//                         type='button'
//                         onClick={() => navigate('/deliveries')}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         className='submit-button'
//                         type='submit'
//                     >
//                         Update Delivery
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }
