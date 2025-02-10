import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "../styles/auth.scss";

const Auth = () => {
  const { user, login, logout } = useContext(AuthContext); // Используем контекст авторизации
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth container">
      {user ? (
        <div>
          <h1>Добро пожаловать в личный кабинет!</h1>
          <button
            className="btn-exit"
            onClick={() => {
              logout(); // Используем функцию из контекста
              toast.info("Вы вышли из аккаунта.");
            }}
          >
            Выйти
          </button>
        </div>
      ) : (
        <>
          <h1 className="auth__title">
            {isLogin ? "Вход в кабинет покупателя" : "Регистрация"}
          </h1>
          {isLogin ? (
            <Login toggleAuthMode={toggleAuthMode} login={login} />
          ) : (
            <Register toggleAuthMode={toggleAuthMode} />
          )}
        </>
      )}
    </div>
  );
};

const Login = ({ toggleAuthMode, login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (data.token) {
      login(data); // Устанавливаем состояние через контекст
      toast.success("Авторизация успешна!");
    } else {
      toast.error(data.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth__form">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Введите email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        type="password"
        placeholder="Введите пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="auth__actions">
        <button className="btn-submit" type="submit">
          Войти
        </button>
        <button type="button" onClick={toggleAuthMode}>
          Зарегистрироваться
        </button>
      </div>
    </form>
  );
};

const Register = ({ toggleAuthMode }) => {
  const { login } = useContext(AuthContext); // Доступ к функции логина из контекста
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают!");
      return;
    }

    const registerResponse = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const registerData = await registerResponse.json();

    if (registerResponse.ok) {
      toast.success(registerData.message);

      // Автоматический логин после успешной регистрации
      const loginResponse = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.token) {
        login(loginData); // Авторизуем пользователя
        toast.success("Вы успешно вошли в аккаунт!");
      } else {
        toast.error("Ошибка при автоматическом входе!");
      }
    } else {
      toast.error(registerData.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="auth__form">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Введите email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Пароль</label>
      <input
        id="password"
        type="password"
        placeholder="Введите пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <label htmlFor="confirmPassword">Подтвердите пароль</label>
      <input
        id="confirmPassword"
        type="password"
        placeholder="Подтвердите пароль"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <div className="auth__actions">
        <button className="btn-submit" type="submit">
          Зарегистрироваться
        </button>
        <button type="button" onClick={toggleAuthMode}>
          У меня уже есть аккаунт
        </button>
      </div>
    </form>
  );
};

export default Auth;