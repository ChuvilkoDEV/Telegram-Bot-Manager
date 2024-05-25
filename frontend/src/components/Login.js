import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import '../css/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://147.45.111.226:8000/api/auth/', {
        email: email,
        password: password,
      });
      const userData = response.data;
      if (userData.status !== 'success') {
        throw new Error('Неверный логин и/или пароль.');
      }

      Cookies.set('username', userData.username, { expires: 7 });
      Cookies.set('token', userData.token, { expires: 7 });

      login(userData);
      navigate('/panel');
    } catch (err) {
      console.log(err);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="login-container">
      <div className="nav-buttons">
        <Link to="/login" className="nav-button active">Вход</Link>
        <Link to="/register" className="nav-button">Регистрация</Link>
      </div>
      <div className="login-form">
        <h2>Войдите в аккаунт</h2>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Войти
          </button>
        </form>
        <div className="additional-links">
          <Link to="/forgot-password" className="forgot-password-link">
            Не помню пароль
          </Link>
        </div>
        <p className="terms">
          Нажимая "Войти", вы соглашаетесь с нашими <a href="/terms">Условиями обслуживания</a> и <a href="/privacy">Политикой конфиденциальности</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
