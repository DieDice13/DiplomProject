import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../styles/reviews.scss';

const ProductReviews = () => {
  const { id } = useParams(); // Получаем productId из URL
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWritingReview, setIsWritingReview] = useState(false); // Управление состоянием формы
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
  });
  const [hoveredRating, setHoveredRating] = useState(0); // Добавлено состояние для наведения

  const handleRatingChange = (rating) => {
    setFormData((prevState) => ({ ...prevState, rating })); // Сохраняем рейтинг
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/reviews/${id}`);
        const data = await response.json();
        setReviews(data); // Устанавливаем полученные отзывы в состояние
      } catch (err) {
        setError(err.message); // Обработка ошибок
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchReviews();
  }, [id]); // Монтирование компонента и изменение productId

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsUserLoggedIn(!!token);
    };

    handleStorageChange();

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const payload = {
      product_id: id, // ID продукта
      rating: formData.rating, // Рейтинг
      comment: formData.comment, // Комментарий
    };
  
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Отправляем токен для проверки авторизации
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при отправке отзыва');
      }
  
      const newReview = await response.json();
      setReviews((prevReviews) => (Array.isArray(prevReviews) ? [...prevReviews, newReview] : [newReview]));
      setIsWritingReview(false); // Закрываем форму
    } catch (err) {
      console.error(err);
      alert(`Не удалось отправить отзыв: ${err.message}`); // Выводим ошибку пользователю
    }
  };
  

  if (loading) {
    return <div>Загрузка отзывов...</div>;
  }

  if (error) {
    return <div className='container'>{error}</div>;
  }

  return (
    <div className="product-reviews container">
      <h3 className='product-reviews__title'>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368">
            <path d="m363-390 117-71 117 71-31-133 104-90-137-11-53-126-53 126-137 11 104 90-31 133ZM80-80v-720q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H240L80-80Zm126-240h594v-480H160v525l46-45Zm-46 0v-480 480Z" />
          </svg>
          Отзывы
        </div>

        <div>
          {isUserLoggedIn && !isWritingReview && (
            <button
              className="write-review"
              onClick={() => setIsWritingReview(true)}
            >
              Написать отзыв
            </button>
          )}

          {!isUserLoggedIn && (
            <p className="login-prompt">Отзывы могут оставлять только авторизованные пользователи. <Link to={`/profile`}>Войти</Link></p>
          )}
        </div>
      </h3>

      {isWritingReview && (
        <form className="review-form" onSubmit={handleFormSubmit}>
          <button
            type="button"
            className="form-close-btn"
            onClick={() => setIsWritingReview(false)}
          >
            Отмена
          </button>

          <div className="rating-group">
            <div className="rating-stars">
              {Array.from({ length: 5 }, (_, i) => (
                <span
                  key={i}
                  className={`star ${i + 1 <= (hoveredRating || formData.rating) ? 'filled' : 'empty'}`}
                  onMouseEnter={() => setHoveredRating(i + 1)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => handleRatingChange(i + 1)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <div className="review-group">
            <label htmlFor="comment">Отзыв*</label>
            <textarea
              id="comment"
              name="comment"
              placeholder="Напишите ваш отзыв"
              value={formData.comment}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          <button type="submit" className="submit-review">
            Оставить отзыв
          </button>
        </form>
      )}

      {reviews && reviews.length > 0 ? (
        <div className="review-list">
          {reviews.map((review, index) => (
            <div className="product-review" key={index}>
              <div className="autor-meta">
                <div className="review-header">
                  <span className="review-author">{review.user_name}</span> {/* Имя пользователя из таблицы users */}
                </div>

                <div className="review-meta">
                  <span className="review-rating">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`star ${5 - i <= Number(review.rating) ? 'filled' : 'empty'}`}
                      >
                        ★
                      </span>
                    ))}
                  </span>

                  <span className="review-date">
                    {review.created_at ?
                      new Date(review.created_at).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                      : 'Загрузка...'}
                  </span>
                </div>
              </div>

              <p className="review-comment">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-reviews">Отзывов о продукте пока нет.</p>
      )}
    </div>
  );
};

export default ProductReviews;