// src/components/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

// Создаем контекст для пользователя
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Хук состояния для хранения данных пользователя
  const navigate = useNavigate(); // Хук для навигации

  // useEffect срабатывает при монтировании компонента
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser)); 
    }
  }, []);

  // Функция для логина
  const login = (userData) => {
    setUser(userData); 
    localStorage.setItem('user', JSON.stringify(userData)); 
  };

  // Функция для логаута
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    Cookies.remove('token');
    navigate('/login'); 
  };

  // Передаем значение контекста и функции в провайдер
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children} {/* Рендерим дочерние компоненты */}
    </UserContext.Provider>
  );
};
