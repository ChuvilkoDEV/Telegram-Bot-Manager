import React, { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { UserContext } from './UserContext';
import Sessions from './Sessions';
import Tasks from './Tasks';
import AddSession from './AddSession';
import AddTask from './AddTask';
import { Link } from 'react-router-dom';

const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions'); // Текущее выбранное меню
  const [userData, setUserData] = useState(null); // Данные пользователя
  const [sessions, setSessions] = useState([]); // Сессии текущего пользователя
  const [allSessions, setAllSessions] = useState([]); // Все сессии
  const [tasks, setTasks] = useState([]); // Задачи пользователя
  const [autoTasks, setAutoTasks] = useState([]); // Автоматические задачи

  // Функция для отправки запросов на сервер
  const requestToServer = async ({ link, handler }) => {
    const token = Cookies.get('token');
    try {
      const response = await axios.post(link, { token });
      handler(response);
    } catch (error) {
      console.error('Ошибка при получении данных:', error);
    }
  };

  // Обработчики для различных типов данных
  const handleUserData = (response) => {
    setUserData(response.data);
  };

  const handleSessions = (response) => {
    setSessions(response.data.sessions);
  };

  const handleAllSessions = (response) => {
    setAllSessions(response.data.sessions);
  };

  const handleTasks = (response) => {
    setTasks(response.data.data);
  };

  const handleAutoTasks = (response) => {
    setAutoTasks(response.data.data);
  };

  // Функция для получения данных с сервера
  const fetchData = async () => {
    requestToServer({
      link: 'http://147.45.111.226:8000/api/authWithToken',
      handler: handleUserData,
    });
    requestToServer({
      link: 'http://147.45.111.226:8000/api/getMySessions',
      handler: handleSessions,
    });
    requestToServer({
      link: 'http://147.45.111.226:8000/api/getAllSessions',
      handler: handleAllSessions,
    });
    requestToServer({
      link: 'http://147.45.111.226:8000/api/getTasks',
      handler: handleTasks,
    });
    requestToServer({
      link: 'http://147.45.111.226:8000/api/getAutoTasks',
      handler: handleAutoTasks,
    });
  };

  // Использование хука useEffect для первоначальной загрузки данных
  useEffect(() => {
    fetchData();
  }, []);

  // Функция для обновления данных
  const refreshData = () => {
    fetchData();
  };

  // Конфигурация меню
  const menus = {
    Sessions: { verboseName: 'Мои аккаунты', icon: 'fas fa-home', view: <Sessions sessions={sessions} refreshData={refreshData} />, forAdmin: false },
    AllSessions: { verboseName: 'Все аккаунты', icon: 'fas fa-home', view: <Sessions sessions={allSessions} refreshData={refreshData} />, forAdmin: true },
    AddSession: { verboseName: 'Добавить сессию', icon: 'fas fa-bolt', view: <AddSession />, forAdmin: false },
    Tasks: { verboseName: 'Задачи', icon: 'fas fa-tasks', view: <Tasks tasks={tasks} />, forAdmin: false },
    AutoTasks: { verboseName: 'Авто-задачи', icon: 'fas fa-bolt', view: <Tasks tasks={autoTasks} />, forAdmin: false },
    AddTask: { verboseName: 'Добавить задачу', icon: 'fas fa-bolt', view: <AddTask />, forAdmin: false },
  };

  // Компонент меню
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

  // Компонент боковой панели
  function Sidebar() {
    return (
      <div className="sidebar d-flex flex-column p-3">
        <h4 className="mb-4">Telegram Bot Manager</h4>
        <ul className="nav flex-column">
          {Object.keys(menus).map((key) => (
            !menus[key].forAdmin || userData?.role === 'admin' ? (
              <Menu key={key} verboseName={menus[key].verboseName} name={key} icon={menus[key].icon} />
            ) : null
          ))}
        </ul>
        <div className="mt-auto">
          <div className="user-info">
            <span>{userData?.role}</span>
          </div>
          <button className="btn btn-link" onClick={logout}>Выйти</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {userData === null ? (
        <p>Loading...</p>
      ) : userData.status === 'ok' ? (
        <div className="wrapper">
          <Sidebar />
          {menus[currentMenu].view}
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Panel;
