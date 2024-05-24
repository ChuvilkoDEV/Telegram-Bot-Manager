import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserContext } from './UserContext';
import Sessions from './Sessions';
import Tasks from './Tasks';
import AutoTasks from './AutoTasks';
import { Link } from 'react-router-dom';

const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions');
  const menus = {
    Sessions: { verboseName: 'Сессии', icon: 'fas fa-home', view: <Sessions /> },
    Tasks: { verboseName: 'Задачи', icon: 'fas fa-tasks', view: <Tasks /> },
    AutoTasks: { verboseName: 'Авто-задачи', icon: 'fas fa-bolt', view: <AutoTasks /> },
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.post(
          'http://147.45.111.226:8000/api/authWithToken',
          { token }
        );
        setData(response.data.status);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      }
    };

    fetchData();
  }, []);

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
    <div>
      {data === 'ok' ? (
        <div className="wrapper">
          <Sidebar />
          {menus[currentMenu].view}
        </div>
      ) : data === 'fail' ? (
        <div className="alert-container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-warning mt-5 text-center">
                <h4 clclassNameass="alert-heading">Доступ запрещен</h4>
                <p>Для просмотра этой страницы необходимо войти в учетную запись.</p>
                <Link to="/login" className="btn btn-primary">Войти</Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>

  );
};

export default Panel;