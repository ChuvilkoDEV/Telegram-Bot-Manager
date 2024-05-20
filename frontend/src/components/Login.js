import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom'
import { UserContext } from './UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://147.45.111.226:8000/api/auth/', {
        'email': email,
        "password": password,
      });
      const userData = response.data;
      if (userData.status !== 'success') {
        throw new Error('Неверный логин и/или пароль.')
      }
      
      // Сохраняем значение в куки
      Cookies.set('username', userData.username, { expires: 7 }); // expires в днях
      Cookies.set('token', userData.token, { expires: 7 }); // expires в днях

      login(userData);
      navigate('/panel')
    } catch (err) {
        console.log(err);
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <div className="container mt-5">
    <h2>Login</h2>
    {error && <div className="alert alert-danger" role="alert">{error}</div>}
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="exampleInputEmail1">Email address</label>
        <input
          type="email"
          className="form-control"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <small id="emailHelp" className="form-text text-muted">
          We'll never share your email with anyone else.
        </small>
      </div>
      <div className="form-group">
        <label htmlFor="exampleInputPassword1">Password</label>
        <input
          type="password"
          className="form-control"
          id="exampleInputPassword1"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="exampleCheck1"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        <label className="form-check-label" htmlFor="exampleCheck1">
          Check me out
        </label>
      </div>
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  </div>
  );
};

export default Login;
