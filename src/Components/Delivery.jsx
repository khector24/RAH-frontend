// Components/Delivery.jsx

import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import '../Styles/Components-Styles/Delivery.css';

const Delivery = ({ delivery, drivers, onDelete, onEdit }) => {
    return (
        <div className='delivery'>
            <h3>
                Customer: {delivery.customerName?.S || 'N/A'}
                <EditIcon
                    titleAccess="Edit Delivery"
                    onClick={() => onEdit(delivery.id)}
                />
                <DeleteIcon
                    titleAccess="Delete Delivery"
                    onClick={() => onDelete(delivery.id)}
                />
                <FlagIcon titleAccess="Flag Delivery" />
            </h3>

            <p>Phone: {delivery.customerPhoneNumber?.S || 'N/A'}</p>
            <p>Address: {delivery.customerAddress?.S || 'N/A'}</p>
            <p>Date: {delivery.deliveryDate?.S || 'N/A'}</p>
            <p>Time Range: {delivery.timeRange?.S || 'N/A'}</p>
            <p>Delivery Notes: {delivery.deliveryNotes?.S || 'N/A'}</p>

            <label htmlFor="driver-select">Assign Driver:</label>
            <select name="drivers" id="driver-select">
                <option value="">--Please choose an option--</option>
                {drivers.map((driver) => (
                    <option key={driver.id.S} value={driver.id.S}>
                        {driver.firstName.S} {driver.lastName.S}
                    </option>
                ))}
            </select>

            <div>
                <button>Out for Delivery</button>
                <button>Mark as Completed</button>
            </div>
        </div>
    );
};

export default Delivery;



// // Components/Delivery.jsx

// import React from 'react';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import FlagIcon from '@mui/icons-material/Flag';

// const Delivery = ({ delivery }) => {
//     return (
//         // <div className='delivery'>
//         //     <li>
//         //         <h3>
//         //             Customer: {delivery.customerName.S}
//         //             <EditIcon titleAccess="Edit Delivery" />
//         //             <DeleteIcon titleAccess="Delete Delivery" />
//         //             <FlagIcon titleAccess="Flag Delivery" />
//         //         </h3>
//         //         <p>Phone: {delivery.customerPhoneNumber.S}</p>
//         //         <p>Address: {delivery.customerAddress.S}</p>
//         //         <p>Date: {delivery.deliveryDate.S}</p>
//         //         <p>Time Range: {delivery.timeRange.S}</p>
//         //     </li>
//         //     <div>
//         //         <button>Out for Delivery</button>
//         //         <button>Mark as Completed</button>
//         //     </div>

//         //     <label htmlFor="driver-select">Assign Driver:</label>
//         //     <select name="drivers" id="driver-select">
//         //         <option value="">--Please choose an option--</option>
//         //         {/* You can populate options here dynamically */}
//         //     </select>

//         //     <p>Created by: {delivery.managerId}</p>
//         // </div>
//         <h1>delivery.customerName.S</h1>
//     );
// };

// export default Delivery;

