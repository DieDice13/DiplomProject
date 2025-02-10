import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/product_card.scss';

import { useFavorites } from '../context/FavoritesContext'; // Импорт хука контекста избранных товаров
import { useCart } from '../context/CartContext'; // Импорт хука контекста корзины

const ProductCard = ({ product, className }) => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { cartItems, addToCart, updateQuantity } = useCart(); // Добавлено `cartItems` и `updateQuantity`
  const isFavorite = favorites.some((item) => item.id === product.id);
  const cartItem = cartItems.find((item) => item.id === product.id); // Проверяем, есть ли товар в корзине

  // Рассчитываем новую цену с учетом скидки
  const newPrice = product.discount
    ? (product.price - (product.price * product.discount) / 100).toFixed(2)
    : product.price;

  // Обработчик для добавления/удаления из избранного
  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  // Обработчик для добавления товара в корзину
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <Link to={`/product/${product.category}/${product.id}`} className={`product-card ${className || ''}`.trim()}>
      <div className="img_area">
        <img src={product.image} alt={product.name} className="product-card__image" />
        {product.discount && <div className="sticker-discount">- {product.discount}%</div>}
        <svg
          className={`favorite-icon ${isFavorite ? 'favorite-icon--active' : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill={isFavorite ? '#FF0000' : '#5f6368'}
          onClick={handleFavoriteClick}
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
        </svg>
      </div>

      <h3 className="product-card__title">{product.name}</h3>

      <div className="price-block">
        {product.discount && <p className="old-price">{product.price.toFixed(2)} ₸</p>}
        <p className="new-price">{newPrice} ₸</p>
      </div>

      {/* Если товар в корзине, отображаем управление количеством */}
      {cartItem ? (
        <div className="product-card__quantity">
          <button onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity - 1); }}>-</button>
          <span>{cartItem.quantity}</span>
          <button onClick={(e) => { e.preventDefault(); updateQuantity(product.id, cartItem.quantity + 1); }}>+</button>
        </div>
      ) : (
        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          <svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 -960 960 960" width="26px" fill="#5f6368">
            <path d="M440-600v-120H320v-80h120v-120h80v120h120v80H520v120h-80ZM280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM40-800v-80h131l170 360h280l156-280h91L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68.5-39t-1.5-79l54-98-144-304H40Z" />
          </svg>
        </button>
      )}
    </Link>
  );
};

export default ProductCard;