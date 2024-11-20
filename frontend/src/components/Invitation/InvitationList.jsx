import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitations, acceptInvitation } from '../../redux/slices/invitationSlice';

const InvitationList = () => {
  const dispatch = useDispatch();

  // Access state from Redux
  const { invitations, status, error } = useSelector((state) => state.invitations);

  // Fetch invitations when the component mounts
  useEffect(() => {
    dispatch(fetchInvitations());
  }, [dispatch]);

  // Handle accepting an invitation
  const handleAccept = (invitationId) => {
    dispatch(acceptInvitation(invitationId));
  };

  // Render loading state
  if (status === 'loading') {
    return <p>Loading invitations...</p>;
  }

  // Render error state
  if (status === 'failed') {
    return <p>Error: {error}</p>;
  }

  // Render the invitations list
  return (
    <div>
      <h3>Pending Invitations</h3>
      {invitations.length === 0 ? (
        <p>No pending invitations.</p>
      ) : (
        <ul>
          {invitations.map((inv) => (
            <li key={inv.id}>
              <span>
                Assessment ID: {inv.assessment_id} - Status: {inv.status}
              </span>
              {inv.status === 'pending' && (
                <button onClick={() => handleAccept(inv.id)}>Accept</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InvitationList;
