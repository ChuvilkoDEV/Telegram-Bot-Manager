import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserContext } from './UserContext';
import Sessions from './Sessions';
import Tasks from './Tasks';
import AutoTasks from './AutoTasks';

const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions');
  const menus = {
    Sessions: { verboseName: 'Сессии', icon: 'fas fa-home', view: <Sessions /> },
    Tasks: { verboseName: 'Задачи', icon: 'fas fa-tasks', view: <Tasks /> },
    AutoTasks: { verboseName: 'Авто-задачи', icon: 'fas fa-bolt', view: <AutoTasks /> },
    Update: { verboseName: 'Обновить', icon: 'fas fa-sync' },
  };

  function Menu({ verboseName, name, icon }) {
    return (
      <li className="nav-item">
        <button
          className={`nav-link ${currentMenu === name ? 'active' : ''}`}
          onClick={() => setCurrentMenu(name)}>
          <i className={`${icon} menu-icon`}></i>
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
          {
            Object.keys(menus).map(key => (
              <Menu
                key={key}
                verboseName={menus[key].verboseName}
                name={key}
                icon={menus[key].icon}
              />
            ))
          }
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

  return (
    <div className="wrapper">
      <Sidebar />
      {menus[currentMenu].view}
    </div>
  );
};

export default Panel;