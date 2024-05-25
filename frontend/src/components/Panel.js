import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserContext } from './UserContext';
import Sessions from './Sessions';
import Tasks from './Tasks';
import AutoTasks from './AutoTasks';
import AddSession from './AddSession';
import { Link } from 'react-router-dom';

const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions');
  const [userStatus, setUserStatus] = useState(null);
  const [userData, setUserData] = useState(null);
  const [allSessions, setAllSessions] = useState([]);
  const [sessions, setSessions] = useState([]);

  const fetchData = async () => {
    const token = Cookies.get('token');
    console.log(token);
    try {
      const response = await axios.post(
        'http://147.45.111.226:8000/api/authWithToken',
        { token }
      );
      setUserData(response.data);
      Cookies.set('userData', response.data.role);
      setUserStatus(response.data.status);
    } catch (error) {
      setUserStatus('fail');
      console.error('Ошибка при получении данных:', error);
    }
    try {
      const response = await axios.post(
        'http://147.45.111.226:8000/api/getMySessions',
        { token }
      );
      if (response.data.status !== 'ok')
        throw new Error('Что-то пошло не так...');

      setSessions(response.data.sessions);
    } catch (err) {
      console.error(err);
    }
    try {
      const response = await axios.post(
        'http://147.45.111.226:8000/api/getAllSessions',
        { token }
      );
      if (response.data.status !== 'ok')
        throw new Error('Что-то пошло не так...');
      setAllSessions(response.data.sessions);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = () => {
    fetchData();
  };

  const menus = {
    Sessions: { verboseName: 'Сессии', icon: 'fas fa-home', view: <Sessions sessions={sessions} allSessions={allSessions} refreshData={refreshData} /> },
    Tasks: { verboseName: 'Задачи', icon: 'fas fa-tasks', view: <Tasks /> },
    AutoTasks: { verboseName: 'Авто-задачи', icon: 'fas fa-bolt', view: <AutoTasks /> },
    AddSession: { verboseName: 'Добавить сессию', icon: 'fas fa-bolt', view: <AddSession /> },
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
            <span>{userData.role}</span>
          </div>
          <button className="btn btn-link" onClick={logout}>Выйти</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {userStatus === 'ok' ? (
        <div className="wrapper">
          <Sidebar />
          {menus[currentMenu].view}
        </div>
      ) : userStatus === 'fail' ? (
        <div className="alert-container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-warning mt-5 text-center">
                <h4 className="alert-heading">Доступ запрещен</h4>
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
