// src/App.js
import './css/bootstrap.min.css';
import './css/style.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './components/UserContext';
import Login from './components/Login';
import Register from './components/Register';
import Panel from './components/Panel';

const App = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </UserProvider>
  );
};

export default App;