import React, { useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import Cookies from 'js-cookie';
import axios from 'axios';

const Panel = () => {
  const { user, logout } = useContext(UserContext);

  useEffect(() => {
    const token = Cookies.get('token');

    const fetchSessions = async () => {
      try {
        const response = await axios.post(
          'http://147.45.111.226:8000/api/getAllSessions',
          { token }
        );
        Cookies.set('AllSessions', response);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSessions();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится только один раз при монтировании компонента

  if (!user) {
    return <p>No user logged in</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Welcome, {user.token}!</h1>
      <button onClick={logout} className="btn btn-secondary">Logout</button>
    </div>
  );
}

export default Panel;
