import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CatalogPage from './pages/CatalogPage';
import FavoritesPage from './pages/FavoritesPage';
import CartPage from './pages/CartPage';
import ProfilePage from './pages/ProfilePage';

import { FavoritesProvider } from './context/FavoritesContext'; // Импорт провайдера для избранного
import { CartProvider } from './context/CartContext'; // Импорт провайдера для корзины
import { AuthProvider } from './context/AuthContext';

import { ToastContainer } from "react-toastify"; // Импорт контейнера уведомлений
import "react-toastify/dist/ReactToastify.css"; // Стили для уведомлений

function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider> {/* Окружаем все приложение провайдером корзины */}
          <Router>
            <ToastContainer /> {/* Добавляем контейнер для уведомлений */}
            <Routes>
              {/* Для главной страницы используем путь "/" */}
              <Route path="/" element={<HomePage />} />

              {/* Страница профиля с авторизацией и регистрацией */}
              <Route path='/profile' element={<ProfilePage />} />

              {/* Страница с подробной информацией о продукте */}
              <Route path="/product/:category/:id" element={<ProductDetailPage />} />

              {/* Каталог по категориям */}
              <Route path="/products/:category" element={<CatalogPage />} />

              {/* Страница с понравившимися товарами */}
              <Route path="/favorites" element={<FavoritesPage />} />

              {/* Страница с корзиной */}
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </Router>
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  );
}

export default App;