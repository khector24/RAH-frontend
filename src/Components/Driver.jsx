// Components/Driver

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../Styles/Components-Styles/Driver.css';

export default function Driver({ driver }) {
    const firstName = driver?.firstName?.S || "First Name";
    const lastName = driver?.lastName?.S || "Last Name";
    const phoneNumber = driver?.phoneNumber?.S || "No phone number available";

    return (
        <div className='driver'>
            <h3>
                {`${firstName} ${lastName}`}
                <EditIcon titleAccess="Edit Driver" />
                <DeleteIcon titleAccess="Delete Driver" />
            </h3>
            <p>{phoneNumber}</p>
        </div>
    );
}