import React, { useMemo, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination } from 'react-table';

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
          throw new Error('Что-то пошло не так...');

        Cookies.set('AllSessions', response.data.sessions);
        setSessions(response.data.sessions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSessions();
  }, []);

  const data = useMemo(() => sessions, [sessions]);

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
      initialState: { pageIndex: 0, pageSize: 10 }, // Установите начальные значения индекса страницы и размера страницы
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination
  );

  return (
    <div className="content">
      <div className="header">
        <h4>Список сессий</h4>
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
