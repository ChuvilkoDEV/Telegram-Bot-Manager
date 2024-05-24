import React, { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import Table from './Table';

const Panel = () => {
  const { user, logout } = useContext(UserContext);
  const [currentMenu, setCurrentMenu] = useState('Sessions');

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


  if (!user) {
    return <p>No user logged in</p>;
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <Table />
    </div>
  );
}

export default Panel;
