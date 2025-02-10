    import React, { createContext, useContext, useState, useEffect } from 'react';

    // Создаем контекст
    const CartContext = createContext();

    // Хук для использования контекста корзины
    export const useCart = () => {
        return useContext(CartContext);
    };

    // Провайдер для контекста корзины
    export const CartProvider = ({ children }) => {
        const [cartItems, setCartItems] = useState(() => {
            // Загружаем данные корзины из localStorage при первой загрузке
            const savedCart = localStorage.getItem('cart');
            return savedCart ? JSON.parse(savedCart) : [];
        });

        // Сохраняем данные корзины в localStorage при каждом изменении
        useEffect(() => {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }, [cartItems]);

        // Добавление товара в корзину
        const addToCart = (product) => {
            setCartItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.id === product.id);
                if (existingItem) {
                    // Увеличиваем количество, если товар уже в корзине
                    return prevItems.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                // Добавляем новый товар в корзину
                return [...prevItems, { ...product, quantity: 1 }];
            });
        };

        // Удаление товара из корзины
        const removeFromCart = (id) => {
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        };

        // Очистка корзины
        const clearCart = () => {
            setCartItems([]);
        };

        // Обновление количества товара
        const updateQuantity = (id, quantity) => {
            setCartItems((prevItems) =>
                prevItems
                    .map((item) =>
                        item.id === id ? { ...item, quantity: quantity } : item
                    )
                    .filter((item) => item.quantity > 0) // Удаляем товары с количеством 0
            );
        };

        return (
            <CartContext.Provider
                value={{ cartItems, addToCart, removeFromCart, clearCart, updateQuantity }}
            >
                {children}
            </CartContext.Provider>
        );
    };