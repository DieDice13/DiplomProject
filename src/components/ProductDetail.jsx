import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/product_detail.scss';

import { useCart } from '../context/CartContext';  // Импортируем хук корзины
import { useFavorites } from '../context/FavoritesContext';  // Импортируем хук избранного

const ProductDetail = () => {
  const { category, id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);  // Добавляем состояние для управления описанием

  const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
  const { cartItems, addToCart, updateQuantity, removeFromCart } = useCart();  // Добавлен removeFromCart
  const isFavorite = favorites.some((item) => item.id === product?.id);
  const cartItem = cartItems.find((item) => item.id === product?.id); // Проверяем, есть ли товар в корзине

  // Загружаем корзину из localStorage при монтировании компонента
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductInCart = savedCart.find((item) => item.id === product?.id);
    if (existingProductInCart) {
      setQuantity(existingProductInCart.quantity);
      setIsInCart(true);
    }
  }, [product?.id]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!category || !id) {
        setError("Категория или ID не указаны");
        setLoading(false);
        return;
      }

      try {
        const productResponse = await fetch(`http://localhost:5000/api/products/${category}/${id}`);
        const productData = await productResponse.json();

        if (productResponse.ok) {
          setProduct(productData);
        } else {
          setError(productData.error || "Ошибка загрузки данных о продукте");
        }

        const reviewsResponse = await fetch(`http://localhost:5000/api/reviews/${id}`);
        const reviewsData = await reviewsResponse.json();

        if (reviewsResponse.ok) {
          setReviews(reviewsData);
        } else {
          console.error("Ошибка загрузки отзывов");
        }
      } catch (error) {
        setError("Ошибка при загрузке данных о продукте или отзывах");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [category, id]);

  const calculateAverageRating = () => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  const toggleDescription = () => {
    setIsExpanded(prevState => !prevState);
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorite) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (cartItem) {
      // Если товар уже в корзине, обновляем его количество
      updateQuantity(cartItem.id, quantity);
    } else {
      // Если товара нет в корзине, добавляем его с выбранным количеством
      addToCart(product, quantity);
    }
    
    setIsInCart(true);
    localStorage.setItem('cart', JSON.stringify(cartItems));  // Сохраняем корзину в localStorage
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      if (cartItem) {
        updateQuantity(cartItem.id, quantity - 1);  // Обновляем количество в корзине
      }
    } else {
      // Удаляем товар из корзины, если его количество стало 0
      removeFromCart(cartItem.id);
      setIsInCart(false);
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));  // Сохраняем обновленное количество в localStorage
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
    if (cartItem) {
      updateQuantity(cartItem.id, quantity + 1);  // Обновляем количество в корзине
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));  // Сохраняем обновленное количество в localStorage
  };

  const renderProductFeatures = () => {
    if (category === 'smartphones') {
      return (
        <>
          <li><strong>Цвет: </strong>{product.features[0].color}</li>
          <li><strong>Размер экрана: </strong>{product.features[0].screen_size}</li>
          <li><strong>Разрешение экрана: </strong>{product.features[0].screen_resolution}</li>
          <li><strong>Оперативная память: </strong>{product.features[0].ram} GB</li>
          <li><strong>Объем памяти: </strong>{product.features[0].storage} GB</li>
          <li><strong>Интерфейсы: </strong>{product.features[0].interfaces}</li>
        </>
      );
    }

    if (category === 'laptops') {
      return (
        <>
          <li><strong>Процессор: </strong>{product.features[0].processor}</li>
          <li><strong>Оперативная память: </strong>{product.features[0].ram} GB</li>
          <li><strong>Объем памяти: </strong>{product.features[0].storage} GB</li>
          <li><strong>Видеокарта: </strong>{product.features[0].graphics}</li>
        </>
      );
    }

    if (category === 'microwaves') {
      return (
        <>
          <li><strong>Цвет: </strong>{product.features[0].color}</li>
          <li><strong>Мощность: </strong>{product.features[0].power} Вт</li>
          <li><strong>Объем: </strong>{product.features[0].capacity} л</li>
          <li><strong>Размеры: </strong>{product.features[0].dimensions}</li>
          <li><strong>Вес: </strong>{product.features[0].weight} кг</li>
          <li><strong>Интерфейсы: </strong>{product.features[0].interfaces}</li>
        </>
      );
    }

    // Добавьте другие категории по аналогии
  };

  if (loading) {
    return <div className="downloading container">Загрузка...</div>;
  }

  if (error) {
    return <div className="container">{error}</div>;
  }

  if (product) {
    const newPrice = product.discount
      ? (product.price - (product.price * product.discount) / 100).toFixed(2)
      : product.price;

    return (
      <div className="product container">
        <h2 className='product__title'>{product.name}</h2>

        <div className='product__area-user-controls'>
          <ul className='star-rating'>
            {Array.from({ length: 5 }, (_, index) => (
              <li key={index} className={index < calculateAverageRating() ? 'filled' : ''}>★</li>
            ))}
            <p className='star-rating__indicator'>({reviews.length})</p>
          </ul>

          <button className='add-to-favorite' onClick={handleFavoriteClick}>
            <svg
              className={`favorite-icon ${isFavorite ? 'favorite-icon--active' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill={isFavorite ? '#FF0000' : '#5f6368'}
            >
              <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
            </svg>
            {isFavorite ? 'В избранном' : 'В избранное'}
          </button>

        </div>

        <div className="product-detail">
          <div className='product-detail__img_area'>
            <img src={product.image} alt={product.name} />
          </div>

          <div className='product-detail__info'>
            <h2 className='product-detail__title'>Характеристики</h2>
            <ul>
              {renderProductFeatures()}
            </ul>

            <div className="description">
              <h2 className='description__title'>Описание</h2>
              <p className={`description__text ${isExpanded ? 'expanded' : ''}`}>{product.description}</p>
              <button className="description__toggle" onClick={toggleDescription}>
                {isExpanded ? 'Скрыть' : 'Показать полностью'}
              </button>
            </div>
          </div>

          <div className="product-detail__area-buy">
            {product.discount && (
              <>
                <p className="old-price">{product.price.toFixed(2)} ₸</p>
                <p className="new-price">
                  {newPrice} ₸ <span className="sticker-discount">{product.discount}%</span>
                </p>
              </>
            )}
            {!product.discount && (
              <p className="new-price">{product.price.toFixed(2)} ₸</p>
            )}

            {!isInCart ? (
              <div className="area-buy-button">
                <button className="buy-button" onClick={handleAddToCart}>В корзину</button>
              </div>
            ) : (
              <div className="area-buy-button">
                <button className="quantity-button" onClick={decreaseQuantity}>-</button>
                <button className="go-to-cart-button">В корзине {quantity} шт</button>
                <button className="quantity-button" onClick={increaseQuantity}>+</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductDetail;