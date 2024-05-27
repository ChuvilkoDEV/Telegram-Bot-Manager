import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Register.css';

const Register = () => {
  const [name, setName] = useState(''); // Состояние для имени пользователя
  const [email, setEmail] = useState(''); // Состояние для email
  const [password, setPassword] = useState(''); // Состояние для пароля
  const [confirmPassword, setConfirmPassword] = useState(''); // Состояние для подтверждения пароля
  const [error, setError] = useState(''); // Состояние для отображения ошибок
  const navigate = useNavigate(); // Хук для навигации

  // Обработчик отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    try {
      const response = await axios.post('http://147.45.111.226:8000/api/registration/', {
        name,
        email,
        password,
      });
      if (response.data.status !== 'ok') {
        throw new Error(response.data.message || 'Ошибка при регистрации.');
      }
      navigate('/login'); // Переход на страницу входа после успешной регистрации
    } catch (err) {
      setError('Регистрация не удалась. Пожалуйста, попробуйте снова.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Регистрация</h2>
        <div className="nav-buttons">
          <Link to="/login" className="nav-button">Вход</Link>
          <Link to="/register" className="nav-button active">Регистрация</Link>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>} {/* Отображение ошибки */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Имя пользователя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary">
            Зарегистрироваться
          </button>
        </form>
        <p className="terms">
          Нажимая "Зарегистрироваться", вы соглашаетесь с нашими <a href="/terms">Условиями обслуживания</a> и <a href="/privacy">Политикой конфиденциальности</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;
