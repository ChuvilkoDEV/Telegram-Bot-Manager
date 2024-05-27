import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination, useRowSelect } from 'react-table';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import '../css/Tasks.css';

export default function Tasks({ tasks }) {
  const taskType = {
    subs: 'Подписки',
    view: 'Просмотры',
    react: 'Реакции',
  };

  const data = useMemo(() => tasks || [], [tasks]);

  const columns = useMemo(
    () => [
      {
        id: 'selection',
        Header: ({ getToggleAllPageRowsSelectedProps }) => (
          <div className="checkbox-column-header">
            <input type="checkbox" {...getToggleAllPageRowsSelectedProps()} />
          </div>
        ),
        Cell: ({ row }) => (
          <div className="checkbox-column">
            <input type="checkbox" {...row.getToggleRowSelectedProps()} />
          </div>
        ),
        width: 10,
      },
      {
        Header: 'Тип задачи',
        accessor: 'task_type',
        Cell: ({ value }) => <span>{taskType[value]}</span>,
      },
      {
        Header: 'Цель',
        accessor: 'task_target',
        Cell: ({ value }) => <Link to={value}>{value}</Link>,
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
        Cell: ({ value }) => <span>{value === 0 ? 'Активен' : 'Неактивна'}</span>,
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
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50, sortBy: [{ id: 'dateAdd', desc: true }] },
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination,
    useRowSelect
  );

  const hasSelectedRows = Object.keys(selectedRowIds).length > 0;

  const handleAutoTask = async () => {
    const selectedTasks = Object.keys(selectedRowIds).map(id => tasks[id]);
    const token = Cookies.get('token');

    try {
      const promises = selectedTasks.map((task) =>
        axios.post('http://147.45.111.226:8000/api/switchAuto', {
          token,
          auto_task_id: task.id,
        })
      );
      await Promise.all(promises);
      alert('Авто-задачи успешно обновлены.');
    } catch (error) {
      alert('Ошибка при обновлении авто-задач.');
    }
  };

  return (
    <div className="content">
      <div className="header">
        <h4>Список задач</h4>
        <div className="actions">
          {hasSelectedRows && (
            <button className="btn btn-primary" onClick={handleAutoTask}>Сменить на авто-задачу</button>
          )}
        </div>
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
                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
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
            </button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
            <span>
              Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
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
