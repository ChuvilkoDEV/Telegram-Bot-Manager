import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../css/Register.css'; 

const Register = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      navigate('/login');
    } catch (err) {
      console.error(err);
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-container-custom">
      <div className="register-form-custom">
        <h2>Регистрация</h2>
        <div className="nav-buttons-custom">
          <Link to="/login" className="nav-button-custom">Вход</Link>
          <Link to="/register" className="nav-button-custom active">Регистрация</Link>
        </div>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group-custom">
            <input
              type="text"
              className="form-control-custom"
              placeholder="Имя пользователя"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required
            />
          </div>
          <div className="form-group-custom">
            <input
              type="email"
              className="form-control-custom"
              placeholder="email@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group-custom">
            <input
              type="password"
              className="form-control-custom"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group-custom">
            <input
              type="password"
              className="form-control-custom"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-primary-custom">
            Зарегистрироваться
          </button>
        </form>
        <p className="terms-custom">
          Нажимая "Зарегистрироваться", вы соглашаетесь с нашими <a href="/terms">Условиями обслуживания</a> и <a href="/privacy">Политикой конфиденциальности</a>.
        </p>
      </div>
    </div>
  );
};

export default Register;
