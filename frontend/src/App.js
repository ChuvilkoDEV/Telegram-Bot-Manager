import React from 'react';
import { UserProvider } from './UserContext';
import Login from './Login';
import UserProfile from './UserProfile';

function App() {
  return (
    <UserProvider>
      <div className="container">
        <h1 className="mt-5">My App</h1>
        <Login />
        <UserProfile />
      </div>
    </UserProvider>
  );
}

export default App;
