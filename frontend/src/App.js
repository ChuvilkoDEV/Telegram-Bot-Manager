// src/App.js
import './css/bootstrap.min.css';
import './css/style.css';
import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserContext, UserProvider } from './components/UserContext';
import Login from './components/Login';
import Panel from './components/Panel';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  console.log(user);
  return user ? children : <Navigate to="/login" />;
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        {/* <div className="container">
          <h1 className="mt-5">My App</h1> */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/panel" element={<Panel />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        {/* </div> */}
      </Router>
    </UserProvider>
  );
};

export default App;
