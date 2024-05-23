import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTable, useSortBy, useResizeColumns, useFilters } from 'react-table';


const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions');
  const [ sessions, setSessions ] = useState('');

  function Menu({ verboseName, name }) {
    return (
      <li class="nav-item">
        <button 
          className={`nav-link ${currentMenu === name ? 'active' : ''}`} 
          onClick={() => setCurrentMenu(name)}>
          {verboseName}
        </button>
      </li>
      );
  }


  function Sidebar() {
    return (
      <div class="sidebar d-flex flex-column p-3">
        <h4 class="mb-4">Telegram Bot Manager</h4>
        <ul class="nav flex-column">
        <Menu verboseName='Сессии' name='Sessions' />
        <Menu verboseName='Задачи' name='Tasks' />
        <Menu verboseName='Авто-задачи' name='AutoTasks' />
        <Menu verboseName='Обновить' name='Update' />
        </ul>
      </div>
    )
  }

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.post(
          'http://147.45.111.226:8000/api/getAllSessions',
          { token }
        );
        console.log(token);
        console.log(response.data);
        if (response.data.status !== 'ok')
          throw new Error('Что-то пошло не так...')

        Cookies.set('AllSessions', response.data.sessions);
        setSessions(response.data.sessions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSessions();
  }, []); 

  if (!user) {
    return <p>No user logged in</p>;
  }

  return (
    < >
      <Sidebar/>
      <p>{currentMenu}</p>
      {/* <h1>Welcome, {user.token}!</h1>
      <button onClick={logout} className="btn btn-secondary">Logout</button> */}
    </>
  );
}

export default Panel;
