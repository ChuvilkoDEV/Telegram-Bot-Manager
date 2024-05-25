import React, { useMemo, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination } from 'react-table';
import { Link } from 'react-router-dom';
import '../css/Tasks.css'; // Импортируем CSS файл с нашим классом

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const taskType = {
    subs: 'Подписки',
    view: 'Просмотры',
    react: 'Реакции',
  }

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = Cookies.get('token');
        const response = await axios.post(
          'http://147.45.111.226:8000/api/getTasks',
          { token }
        );
        if (response.data.status !== 'ok')
          throw new Error('Что-то пошло не так...');

        setTasks(response.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const data = useMemo(() => tasks, [tasks]);

  const columns = useMemo(
    () => [
      {
        Header: 'Тип задачи',
        accessor: 'task_type',
        Cell: ({ value }) => (
          <span>{taskType[value]}</span>
        ),
      },
      {
        Header: 'Цель',
        accessor: 'task_target',
        Cell: ({ value }) => (
          <Link to={value}>{value}</Link>
        ),
      },
      {
        Header: 'Выполнение',
        accessor: 'task_count_actions_and_completed',
        Cell: ({ row }) => {
          const { task_count_actions, task_count_actions_compite } = row.original;
          return `${task_count_actions_compite} / ${task_count_actions}`;
        },
      },
      {
        Header: 'Объекты задачи',
        accessor: 'task_obj',
        Cell: ({ value }) => {
          const objects = JSON.parse(value);
          return objects && objects.length > 0 ? (
            <span className="emoji-small">{objects.join(' ')}</span>
          ) : 'Нет объектов';
        },
      },
      {
        Header: 'Время выполнения',
        accessor: 'task_time_out',
      },
      {
        Header: 'Активность',
        accessor: 'active',
        Cell: ({ value }) => (
          <span>{value === 0 ? 'Активен' : 'Неактивна'}</span>
        ),
      },
      {
        Header: 'Канал',
        accessor: 'task_id_channel',
      },
      {
        Header: 'Количество действий',
        accessor: 'count_action_per_timeout',
      },
      {
        Header: 'Процент волны',
        accessor: 'percetn_wave',
      },
      {
        Header: 'Разброс',
        accessor: 'percent_markup_spread',
      },
      {
        Header: 'Группа',
        accessor: 'task_group',
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
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50, sortBy: [{ id: 'dateAdd', desc: true }] }, // Сортировка по дате
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination
  );

  return (
    <div className="content">
      <div className="header">
        <h4>Список задач</h4>
      </div>

      <div className="table-responsive fixed-table-container">
        <table className="table table-white table-striped fixed-table" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  const { key, ...rest } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th key={index} {...rest}>
                      {column.render('Header')}
                      <span>
                        {column.isSorted
                          ? column.isSortedDesc
                            ? ' 🔽'
                            : ' 🔼'
                          : ''}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, rowIndex) => {
              prepareRow(row);
              return (
                <tr key={rowIndex} {...row.getRowProps()}>
                  {row.cells.map((cell, cellIndex) => {
                    const { key, ...rest } = cell.getCellProps();
                    return (
                      <td key={cellIndex} {...rest}>
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination-container">
          <div className="pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>{' '}
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
          </div>
          <div className="page-size-options">
            <span>Show </span>
            {[10, 25, 50, 100, data.length].map(size => (
              <button key={size} onClick={() => setPageSize(size)} className="btn btn-link">
                {size === data.length ? 'All' : size}
              </button>
            ))}
            <span>rows</span>
          </div>
        </div>
      </div>
    </div>
  );
}
