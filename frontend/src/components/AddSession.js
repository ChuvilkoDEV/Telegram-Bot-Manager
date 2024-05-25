import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AddSession = () => {
  const [proxyFile, setProxyFile] = useState(null);
  const [sessionFiles, setSessionFiles] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [accountsPerProxy, setAccountsPerProxy] = useState('5');
  const [group, setGroup] = useState('default');
  const [loading, setLoading] = useState(false);

  const handleProxyFileChange = (e) => {
    setProxyFile(e.target.files[0]);
  };

  const handleSessionFilesChange = (e) => {
    setSessionFiles(Array.from(e.target.files));
  };

  const handleAddAccountSubmit = async (e) => {
    e.preventDefault();
    if (!proxyFile || sessionFiles.length === 0) {
      alert('Please select a proxy file and at least one session file.');
      return;
    }

    setLoading(true);
    const token = Cookies.get('token');
    const category = 'default';

    const proxies = await proxyFile.text();
    const proxyList = proxies.split('\n').filter(Boolean);

    let accountIndex = 0;

    try {
      for (const proxy of proxyList) {
        for (let i = 0; i < accountsPerProxy; i++) {
          if (accountIndex >= sessionFiles.length) break;

          const formData = new FormData();
          formData.append('token', token);
          formData.append('file', sessionFiles[accountIndex]);
          formData.append('proxy', proxy);
          formData.append('group', group);
          formData.append('category', category);

          const response = await axios.post('http://147.45.111.226:8000/api/uploadSession', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          console.log(response.data)
          console.log(sessionFiles[accountIndex], proxy)
          accountIndex++;
        }
        if (accountIndex >= sessionFiles.length) break;
      }
      alert('Accounts uploaded successfully');
    } catch (error) {
      console.error('Error uploading accounts:', error);
      alert('Failed to upload accounts.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    if (!accountId) {
      alert('Please enter an account ID.');
      return;
    }

    const token = Cookies.get('token');

    try {
      const response = await axios.post('http://147.45.111.226:8000/api/delMySession', {
        token,
        account_id: accountId,
      });

      if (response.data.status === 'ok') {
        alert('Account deleted successfully');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Не удалось удалить аккаунт');
    }
  };

  return (
    <div className="content">
      <div className="form-container">
        <div className="form-section">
          <h2>Добавить аккаунты</h2>
          <form onSubmit={handleAddAccountSubmit}>
            <div className="form-group">
              <label>Группа</label>
              <input
                type="text"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label>Один файл с proxy (*.txt)</label>
              <input type="file" accept=".txt" onChange={handleProxyFileChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Файлы сессий (*.session)</label>
              <input type="file" accept=".session" multiple onChange={handleSessionFilesChange} className="form-control" />
            </div>
            <div className="form-group">
              <label>Количество аккаунтов на одно прокси</label>
              <input
                type="number"
                value={accountsPerProxy}
                onChange={(e) => setAccountsPerProxy(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Uploading...' : 'Submit'}
            </button>
          </form>
        </div>

        <div className="form-section">
          <h2>Удалить аккаунт</h2>
          <form onSubmit={handleDeleteAccountSubmit}>
            <div className="form-group">
              <label>ID аккаунта</label>
              <input
                type="text"
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="form-control"
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSession;
