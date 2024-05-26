import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useResizeColumns, useFilters, usePagination, useRowSelect } from 'react-table';
import Cookies from 'js-cookie';
import { FaFilter, FaSync } from 'react-icons/fa';
import axios from 'axios';
import '../css/Sessions.css';

export default function Sessions({ sessions = [], refreshData }) {
  const [filterStatus, setFilterStatus] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [accountsPerProxy, setAccountsPerProxy] = useState('');

  const statuses = {
    0: ['Работает', 'text-success'],
    1: ['Бан', 'text-danger'],
    2: ['Восстановлено', 'text-warning'],
  };

  const filteredData = useMemo(() => {
    if (!filterStatus) return sessions.slice().reverse();
    return sessions.filter(session => session.ban === filterStatus).slice().reverse();
  }, [sessions, filterStatus]);

  const data = useMemo(() => filteredData, [filteredData]);

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
        Header: 'ID',
        accessor: 'id',
      },
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
    state: { pageIndex, pageSize, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 50 },
    },
    useFilters,
    useSortBy,
    useResizeColumns,
    usePagination,
    useRowSelect
  );

  const total = sessions.length;
  const working = sessions.filter(session => session.ban === 0).length;
  const recovered = sessions.filter(session => session.ban === 2).length;
  const banned = sessions.filter(session => session.ban === 1).length;
  const proxy = sessions.filter(session => session.ban === 3).length;

  const hasSelectedRows = Object.keys(selectedRowIds).length > 0;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleAccountsPerProxyChange = (event) => {
    setAccountsPerProxy(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file || !accountsPerProxy) {
      alert('Пожалуйста, выберите файл и укажите количество аккаунтов на одно прокси.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;
      const proxies = content.split('\n').filter(proxy => proxy.trim() !== '');

      const selectedSessions = Object.keys(selectedRowIds).map(id => sessions[id]);
      const token = Cookies.get('token');

      const proxyUsage = proxies.reduce((acc, proxy) => {
        acc[proxy] = 0;
        return acc;
      }, {});

      const promises = selectedSessions.map((session) => {
        const availableProxy = proxies.find(proxy => proxyUsage[proxy] < accountsPerProxy);
        if (!availableProxy) {
          alert('Не хватает прокси для назначения аккаунтов.');
          return Promise.resolve();
        }

        proxyUsage[availableProxy]++;

        return axios.post(
          'http://147.45.111.226:8000/api/editProxyAccount',
          {
            token,
            session_id: session.id,
            new_proxy: availableProxy
          }
        );
      });

      try {
        await Promise.all(promises);
        alert('Прокси успешно обновлены.');
        setShowModal(false);
        refreshData();
      } catch (error) {
        alert('Ошибка при обновлении прокси.');
        console.error('Ошибка при обновлении прокси:', error);
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="content">
      <div className="header">
        <h4>Список сессий</h4>
        <div className="actions">
          {hasSelectedRows && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>Изменить прокси</button>
          )}
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

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h4>Изменить прокси</h4>
            <div className="form-group">
              <label>Выберите файл (TXT):</label>
              <input type="file" accept=".txt" onChange={handleFileChange} />
            </div>
            <div className="form-group">
              <label>Количество аккаунтов на одно прокси:</label>
              <input
                type="number"
                value={accountsPerProxy}
                onChange={handleAccountsPerProxyChange}
                min="1"
              />
            </div>
            <button className="btn btn-primary" onClick={handleSubmit}>Сохранить</button>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Отмена</button>
          </div>
        </div>
      )}

      <div className="table-responsive fixed-table-container">
        <table className="table table-white table-striped fixed-table" {...getTableProps()}>
          <thead className="fixed-header">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, index) => {
                  const { key, ...rest } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th key={index} {...rest} style={{ width: column.width }}>
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
                      <td key={cellIndex} {...rest} style={{ width: cell.column.width }}>
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
