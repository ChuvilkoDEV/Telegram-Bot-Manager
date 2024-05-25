import React, { useState } from 'react';

const AddSession = () => {
  const [proxyFile, setProxyFile] = useState(null);
  const [sessionFiles, setSessionFiles] = useState([]);
  const [accountId, setAccountId] = useState('');
  const [accountsPerProxy, setAccountsPerProxy] = useState('5');

  const handleProxyFileChange = (e) => {
    setProxyFile(e.target.files[0]);
  };

  const handleSessionFilesChange = (e) => {
    setSessionFiles(Array.from(e.target.files));
  };

  const handleAddAccountSubmit = (e) => {
    e.preventDefault();
    // Handle the form submission logic here
    console.log('Add Account', proxyFile, sessionFiles, accountsPerProxy);
  };

  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    // Handle the account deletion logic here
    console.log('Delete Account', accountId);
  };

  return (
    <div className="content">
      <div className="form-container">
        <div className="form-section">
          <h2>Add Account</h2>
          <form onSubmit={handleAddAccountSubmit}>
            <div className="form-group">
              <label>Company</label>
              <input type="text" value="default" readOnly className="form-control" />
            </div>
            <div className="form-group">
              <label>Group</label>
              <input type="text" value="default" readOnly className="form-control" />
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
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>

        <div className="form-section">
          <h2>Delete Account</h2>
          <form onSubmit={handleDeleteAccountSubmit}>
            <div className="form-group">
              <label>Account id</label>
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
