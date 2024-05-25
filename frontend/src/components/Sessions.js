import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination } from 'react-table';
import Cookies from 'js-cookie';
import { FaFilter, FaSync, FaList } from 'react-icons/fa'; // Импорт иконок

export default function Sessions({ sessions = [], allSessions = [], refreshData }) {
  const [filterStatus, setFilterStatus] = useState(null);
  const [isAllSessions, setIsAllSessions] = useState(false);
  const [showFilters, setShowFilters] = useState(false); // Состояние для отображения фильтров

  const statuses = {
    0: ['Работает', 'text-success'],
    1: ['Бан', 'text-danger'],
    2: ['Восстановлено', 'text-warning'],
  };

  const currentSessions = isAllSessions ? allSessions : sessions;

  const filteredData = useMemo(() => {
    if (!filterStatus) return currentSessions.slice().reverse();
    return currentSessions.filter(session => session.ban === filterStatus).slice().reverse();
  }, [currentSessions, filterStatus]);

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
          <span className={statuses[value][1]}>{statuses[value][0]}</span>
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
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination
  );

  const total = currentSessions.length;
  const working = currentSessions.filter(session => session.ban === 0).length;
  const recovered = currentSessions.filter(session => session.ban === 2).length;
  const banned = currentSessions.filter(session => session.ban === 1).length;
  const proxy = currentSessions.filter(session => session.ban === 3).length;

  const isAdmin = Cookies.get('userData') == 'admin';
  return (
    <div className="content">
      <div className="header">
        <h4>Список сессий</h4>
        <div className="actions">
          {isAdmin ? (
            <button
              className="btn btn-info sessions-btn"
              onClick={() => setIsAllSessions(!isAllSessions)}
            >
              <FaList /> {isAllSessions ? 'Мои сессии' : 'Все сессии'}
            </button>
          ) : ""}
          <button
            className="btn btn-secondary refresh-btn"
            onClick={refreshData}
          >
            <FaSync /> Обновить данные
          </button>
          <div className="filter-icon">
            <button
              className="btn btn-primary filter-btn"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter /> Фильтры
            </button>
            {showFilters && (
              <div className="filter-popup">
                <button className="btn btn-primary filter-option-btn" onClick={() => setFilterStatus(null)}>Всего: {total}</button>
                <button className="btn btn-success filter-option-btn" onClick={() => setFilterStatus(0)}>Работают: {working}</button>
                <button className="btn btn-danger filter-option-btn" onClick={() => setFilterStatus(1)}>Забанено: {banned}</button>
                <button className="btn btn-warning filter-option-btn" onClick={() => setFilterStatus(2)}>Восстановлено: {recovered}</button>
                <button className="btn btn-secondary filter-option-btn" onClick={() => setFilterStatus(3)}>Прокси: {proxy}</button>
              </div>
            )}
          </div>
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
          <div className="page-size-options">
            <span>Показать </span>
            {[10, 25, 50, 100, total].map(size => (
              <button key={size} onClick={() => setPageSize(size)} className="btn btn-link">
                {size === total ? 'Все' : size}
              </button>
            ))}
            <span>строк</span>
          </div>
        </div>
      </div>
    </div>
  );
}
