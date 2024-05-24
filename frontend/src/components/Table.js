import React, { useMemo, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination } from 'react-table';

export default function Table() {
  const [sessions, setSessions] = useState([]);
  const [filterStatus, setFilterStatus] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.post(
          'http://147.45.111.226:8000/api/getAllSessions',
          { token }
        );
        if (response.data.status !== 'ok')
          throw new Error('Что-то пошло не так...');

        Cookies.set('AllSessions', response.data.sessions);
        setSessions(response.data.sessions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSessions();
  }, []);

  const filteredData = useMemo(() => {
    if (!filterStatus) return sessions;
    return sessions.filter(session => session.ban === filterStatus);
  }, [sessions, filterStatus]);

  const data = useMemo(() => filteredData, [filteredData]);

  const columns = useMemo(
    () => [
      {
        Header: 'Номер телефона',
        accessor: 'tagName',
      },
      {
        Header: 'BAN status',
        accessor: 'ban',
        Cell: ({ value }) => (
          <span className={value === 'Бан' ? 'text-danger' : 'text-success'}>{value}</span>
        ),
      },
      {
        Header: 'Группа',
        accessor: 'group',
      },
      {
        Header: 'Прокси',
        accessor: 'proxy',
      },
      {
        Header: 'Дата',
        accessor: 'dateAdd',
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination
  );

  const total = sessions.length;
  const working = sessions.filter(session => session.ban === 1).length;
  const recovered = sessions.filter(session => session.ban === 2).length;
  const banned = sessions.filter(session => session.ban === 0).length;
  const proxy = sessions.filter(session => session.ban === 3).length;

  return (
    <div className="content">
      <div className="header">
        <h4>Список сессий</h4>
        <div className="filters">
          <button className="btn btn-primary" onClick={() => setFilterStatus(null)}>Всего: {total}</button>
          <button className="btn btn-success" onClick={() => setFilterStatus(1)}>Работают: {working}</button>
          <button className="btn btn-info" onClick={() => setFilterStatus(2)}>Восстановлено: {recovered}</button>
          <button className="btn btn-danger" onClick={() => setFilterStatus(0)}>Забанено: {banned}</button>
          <button className="btn btn-secondary" onClick={() => setFilterStatus(3)}>Прокси: {proxy}</button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-white table-striped" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            Предыдущая
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            Следующая
          </button>{' '}
          <span>
            Страница{' '}
            <strong>
              {pageIndex + 1} из {pageOptions.length}
            </strong>{' '}
          </span>
        </div>
      </div>
    </div>
  );
}
