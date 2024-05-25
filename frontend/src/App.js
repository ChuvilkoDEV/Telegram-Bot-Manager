// src/App.js
import './css/bootstrap.min.css';
import './css/style.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Login from './components/Login';
import Panel from './components/Panel';

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<Panel />} />
      </Routes>
    </UserProvider>
  );
};

export default App;