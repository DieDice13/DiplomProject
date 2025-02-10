import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/brands.scss';

function Brands() {
    const brandImages = [
        { id: 1, src: "/images/Brands/apple.jpg", alt: "Apple" },
        { id: 2, src: "/images/Brands/BOSCH.jpg", alt: "BOSCH" },
        { id: 3, src: "/images/Brands/Haier.jpg", alt: "Haier" },
        { id: 4, src: "/images/Brands/HONOR.jpg", alt: "HONOR" },
        { id: 5, src: "/images/Brands/hp.jpg", alt: "HP" },
        { id: 6, src: "/images/Brands/HUAWEI.jpg", alt: "HUAWEI" },
        { id: 7, src: "/images/Brands/KitchenAid.jpg", alt: "KitchenAid" },
        { id: 8, src: "/images/Brands/LGElectronics.jpg", alt: "LG Electronics" },
        { id: 9, src: "/images/Brands/logitech.jpg", alt: "Logitech" },
        { id: 10, src: "/images/Brands/MI.jpg", alt: "MI" },
        { id: 11, src: "/images/Brands/oppo.jpg", alt: "Oppo" },
        { id: 12, src: "/images/Brands/samsung.jpg", alt: "Samsung" },
        { id: 13, src: "/images/Brands/SONY.jpg", alt: "SONY" },
        { id: 14, src: "/images/Brands/Tefal.jpg", alt: "Tefal" },
        { id: 15, src: "/images/Brands/WhirlPool.jpg", alt: "WhirlPool" },
        { id: 16, src: "/images/Brands/wmf.jpg", alt: "WMF" },
    ];

    return (
        <div className="brands container">
            <h2 className="brands__title">Популярные бренды</h2>
            <div className="brands-wrapper">
                {/* Сетка для больших экранов */}
                <div className="brands__items">
                    {brandImages.map((brand) => (
                        <img key={brand.id} src={brand.src} alt={brand.alt} />
                    ))}
                </div>

                {/* Слайдер для мобильных устройств */}
                <Swiper
                    spaceBetween={20}
                    slidesPerView={2}
                    breakpoints={{
                        480: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                    }}
                    pagination={{ clickable: true }}
                    className="brands-slider"
                >
                    {brandImages.map((brand) => (
                        <SwiperSlide key={brand.id}>
                            <img src={brand.src} alt={brand.alt} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}

export default Brands;
