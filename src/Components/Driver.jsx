// Components/Driver

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../Styles/Components-Styles/Driver.css';

export default function Driver({ driver, onDelete, onEdit }) {
    const firstName = driver?.firstName?.S || "First Name";
    const lastName = driver?.lastName?.S || "Last Name";
    const phoneNumber = driver?.phoneNumber?.S || "No phone number available";

    return (
        <div className='driver'>
            <h3>
                {`${firstName} ${lastName}`}
                <EditIcon titleAccess="Edit Driver" onClick={() => onEdit(driver.id.S)} />
                <DeleteIcon titleAccess="Delete Driver" onClick={() => onDelete(driver.id.S)} />
            </h3>
            <p>{phoneNumber}</p>
        </div>
    );
}