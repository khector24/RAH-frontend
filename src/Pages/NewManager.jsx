import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import '../Styles/Page-Styles/NewManager.css';

export default function NewManager() {
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
    const validatePassword = (value) => {
        const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
        return strongPasswordPattern.test(value) || 'Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.';
    };

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

            const response = await axios.post('http://localhost:3000/managers', {
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                password: data.password,
                title: data.title
            }, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            console.log('Manager created successfully:', response.data);
            navigate('/managers');
        } catch (err) {
            console.error('Error creating manager:', err);
            setError('submit', { type: 'manual', message: 'Failed to create manager. Please try again.' });
        }
    };

    return (
        <div className='new-manager'>
            <h2>Create New Manager</h2>
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
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        {...register('password', {
                            required: 'Password is required.',
                            validate: validatePassword
                        })}
                        placeholder="Enter a secure password"
                    />
                    {errors.password && <p className='error-message'>{errors.password.message}</p>}
                </div>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        {...register('title', { required: 'Title is required.' })}
                        placeholder="e.g., Assistant Manager"
                    />
                    {errors.title && <p className='error-message'>{errors.title.message}</p>}
                </div>
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
                        Create Manager
                    </button>
                </div>
            </form>
        </div>
    );
}


// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import '../Styles/Page-Styles/NewManager.css';

// export default function NewManager() {
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [phoneNumber, setPhoneNumber] = useState('');
//     const [password, setPassword] = useState('');
//     const [title, setTitle] = useState('');
//     const [error, setError] = useState('');
//     const navigate = useNavigate();

//     // Password validation function
//     const isStrongPassword = (password) => {
//         const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
//         return strongPasswordPattern.test(password);
//     };

//     const handleCreateManager = async (e) => {
//         e.preventDefault();

//         // Validate the password before making the API call
//         if (!isStrongPassword(password)) {
//             setError('Password must be at least 8 characters long, contain one uppercase letter, one lowercase letter, one number, and one special character.');
//             return;
//         }

//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 throw new Error('Token not found');
//             }

//             const response = await axios.post('http://localhost:3000/managers', {
//                 firstName,
//                 lastName,
//                 phoneNumber,
//                 password,
//                 title
//             }, {
//                 headers: {
//                     'Authorization': `${token}`,
//                 },
//             });

//             console.log('Manager created successfully:', response.data);
//             navigate('/managers');
//         } catch (err) {
//             console.error('Error creating manager:', err);
//             setError('Failed to create manager. Please try again.');
//         }
//     };

//     return (
//         <div className='new-manager'>
//             <h2>Create New Manager</h2>
//             {error && <p className='error-message'>{error}</p>}
//             <form onSubmit={handleCreateManager}>
//                 <div>
//                     <label>First Name:</label>
//                     <input
//                         type="text"
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                         required
//                         placeholder="e.g., John"
//                     />
//                 </div>
//                 <div>
//                     <label>Last Name:</label>
//                     <input
//                         type="text"
//                         value={lastName}
//                         onChange={(e) => setLastName(e.target.value)}
//                         required
//                         placeholder="e.g., Smith"
//                     />
//                 </div>
//                 <div>
//                     <label>Phone Number:</label>
//                     <input
//                         type="text"
//                         value={phoneNumber}
//                         onChange={(e) => setPhoneNumber(e.target.value)}
//                         required
//                         placeholder="e.g., 123-456-7890"
//                     />
//                 </div>
//                 <div>
//                     <label>Password:</label>
//                     <input
//                         type="password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                         placeholder="Enter a secure password"
//                     />
//                 </div>
//                 <div>
//                     <label>Title:</label>
//                     <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                         placeholder="e.g., Assistant Manager"
//                     />
//                 </div>
//                 <div className='bottom-buttons'>
//                     <button
//                         type='button'
//                         onClick={() => navigate('/managers')}
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         className='submit-button'
//                         type='submit'
//                     >
//                         Create Manager
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

