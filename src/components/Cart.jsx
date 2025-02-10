import React from 'react';
import { useCart } from '../context/CartContext';
import ProductCard from './ProductCard';
import '../styles/cart.scss';

function Cart() {
    const { cartItems } = useCart();

    // Функция для подсчета общей суммы
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="cart container">
            <h2 className="cart__title">Товары в корзине</h2>

            {/* Контейнер для списка товаров и итогов */}
            <div className="cart__content">

                {/* Левая часть: список товаров */}
                <div className="cart__grid">
                    {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                            <div className="cart__product" key={item.id}>
                                <ProductCard
                                    product={item}
                                    className="cart__product-card"
                                />
                            </div>
                        ))
                    ) : (
                        <p>Корзина пуста</p>
                    )}
                </div>

                {/* Правая часть: итоговая сумма и кнопка */}
                <div className="cart__summary">
                    <h2>Итог</h2>
                    <p>Общая сумма: {calculateTotal()} ₽</p>
                    <button className="cart__order-button">Оформить заказ</button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
