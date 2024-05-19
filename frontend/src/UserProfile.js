// src/UserProfile.js
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

const UserProfile = () => {
  const { user, logout } = useContext(UserContext);

  if (!user) {
    return <p>No user logged in</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Welcome, {user.username}!</h1>
      <button onClick={logout} className="btn btn-secondary">Logout</button>
    </div>
  );
};

export default UserProfile;
