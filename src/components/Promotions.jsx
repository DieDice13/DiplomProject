import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/promotions.scss';

const promo1 = '/images/promo_1.jpg';
const promo2 = '/images/promo_2.jpg';
const promo3 = '/images/promo_3.jpg';

const Promotions = () => {
  const promotions = [
    { id: 1, image: promo1, alt: 'Акция 1' },
    { id: 2, image: promo2, alt: 'Акция 2' },
    { id: 3, image: promo3, alt: 'Акция 3' },
  ];

  return (
    <>
      <h3 className='promotions-title container'>Акции</h3>
      <div className="promotions-wrapper container">
        <div className="promotions-grid">
          {promotions.map((promo) => (
            <div className="promotions-grid__item" key={promo.id}>
              <img src={promo.image} alt={promo.alt} className="promotions-grid__image" />
            </div>
          ))}
        </div>

        {/* Слайдер для мобильных устройств */}
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          className="promotions-slider"
        >
          {promotions.map((promo) => (
            <SwiperSlide key={promo.id}>
              <img src={promo.image} alt={promo.alt} className="promotions-slider__image" />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Promotions;
