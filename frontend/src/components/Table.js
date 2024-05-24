import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTable, useSortBy, useResizeColumns, useFilters } from 'react-table';


export default function Table() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.post(
          'http://147.45.111.226:8000/api/getAllSessions',
          { token }
        );
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

  

  return (
    <div className="content">
      <div className="header">
        <h4>My account List</h4>
        <div className="filters">
          <button className="btn btn-primary">Всего: 6610</button>
          <button className="btn btn-success">Работают: 3629</button>
          <button className="btn btn-info">Восстановлено: 906</button>
          <button className="btn btn-danger">Забанено: 2075</button>
          <button className="btn btn-secondary">Прокси: 0</button>
          {/* <button className="btn btn-outline-secondary"><FontAwesomeIcon icon={faSync} /></button> */}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>#ID</th>
              <th>BAN status</th>
              <th>Filename</th>
              <th>Group</th>
              <th>Category</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(item => (
              <tr key={item.id}>
                <td><input type="checkbox" /></td>
                <td>#{item.id}</td>
                <td className={item.status === 'Бан' ? 'text-danger' : 'text-success'}>{item.status}</td>
                <td>{item.filename}</td>
                <td>{item.group}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
