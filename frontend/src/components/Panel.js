import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserContext } from './UserContext';
import Table from './Table';

const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions');

  function Menu({ verboseName, name }) {
    return (
      <li className="nav-item">
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
      <div className="sidebar d-flex flex-column p-3">
        <h4 className="mb-4">Telegram Bot Manager</h4>
        <ul className="nav flex-column">
          <Menu verboseName='Сессии' name='Sessions' />
          <Menu verboseName='Задачи' name='Tasks' />
          <Menu verboseName='Авто-задачи' name='AutoTasks' />
          <Menu verboseName='Обновить' name='Update' />
        </ul>
        <div className="mt-auto">
          <div className="user-info">
            <span>admin</span>
          </div>
          <button className="btn btn-link" onClick={logout}>Выйти</button>
        </div>
      </div>
    );
  }

  
  // useEffect(() => {
  //   const fetchSessions = async () => {
  //     const token = Cookies.get('token');
  //     const response = await axios.post(
  //       'http://147.45.111.226:8000/api/authWithToken',
  //       { token }
  //     );
  //     if (response.data.status !== 'ok')
  //       user = false;
  //   };

  //   fetchSessions();
  // }, []);

  return (
    <div className="wrapper">
      <Sidebar />
      <Table />
    </div>
  );
}

export default Panel;
