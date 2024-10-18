import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../Styles/Components-Styles/Manager.css';

export default function Manager({ manager }) {
    const firstName = manager?.firstName?.S || "First Name";
    const lastName = manager?.lastName?.S || "Last Name";
    const phoneNumber = manager?.phoneNumber?.S || "No phone number available";

    return (
        <div className='Manager'>
            <h3>
                {`${firstName} ${lastName}`}
                <EditIcon titleAccess="Edit Manager" />
                <DeleteIcon titleAccess="Delete Manager" />
            </h3>
            <p>{phoneNumber}</p>
        </div>
    );
}
