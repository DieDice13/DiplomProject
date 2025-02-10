import React, { useState, useEffect } from 'react';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import ProductCard from './ProductCard';
import '../styles/special_products.scss';

const SwiperSection = ({ category }) => {
  const [products, setProducts] = useState([]);

  const transformCategoryName = (category) => {
    const categoryMap = {
      smartphones: 'Смартфоны',
      laptops: 'Ноутбуки',
      microwaves: 'Микроволновки',
    };
    return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products?category=${category}`);
        if (!response.ok) {
          throw new Error('Ошибка при запросе к серверу');
        }
  
        const data = await response.json();
  
        if (Array.isArray(data)) {
          setProducts(data); // Если это массив, сохраняем в состояние
        } else {
          console.error('Полученные данные не являются массивом:', data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    };
  
    fetchProducts();
  }, [category]);
  

  return (
    <div className="swiper__section container">
      <h2 className="swiper__title">{transformCategoryName(category)}</h2>

      <div className="swiper">
        <SwiperComponent
          modules={[Navigation]}
          spaceBetween={10}
          slidesPerView={4}
          navigation={false}
          loop={false}
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 5 },
          }}
        >
          {products.map((product, index) => (
            <SwiperSlide key={product.id || index}>
              <ProductCard
                product={product}
                className={`${category === 'laptops'
                  ? 'product-card--laptop'
                  : category === 'microwaves'
                    ? 'product-card--microwave'
                    : 'product-card--phone'
                  }`}
              />
            </SwiperSlide>
          ))}
        </SwiperComponent>
      </div>
    </div>
  );
};

export default SwiperSection;
