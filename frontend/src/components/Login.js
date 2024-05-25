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
    <div className="login-container-custom">
      <div className="login-form-custom">
        <h2>Войдите в аккаунт</h2>
        <div className="nav-buttons-custom">
          <Link to="/login" className="nav-button-custom active">Вход</Link>
          <Link to="/register" className="nav-button-custom">Регистрация</Link>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <input
              type="email"
              className="form-control-custom"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group-custom">
            <input
              type="password"
              className="form-control-custom"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-primary-custom">
            Войти
          </button>
        </form>
        <div className="additional-links-custom">
          <Link to="/forgot-password" className="forgot-password-link-custom">
            Не помню пароль
          </Link>
        </div>
        <p className="terms-custom">
          Нажимая "Войти", вы соглашаетесь с нашими <a href="/terms">Условиями обслуживания</a> и <a href="/privacy">Политикой конфиденциальности</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
