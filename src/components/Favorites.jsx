import React from "react";
import { useFavorites } from '../context/FavoritesContext';  // Импортируем хук контекста
import ProductCard from "./ProductCard";  // Компонент карточки товара

import "../styles/favorites.scss"

const FavoritesList = () => {
    const { favorites } = useFavorites();  // Получаем избранные товары из контекста

    return (
        <div className="favorites container">
            <h2 className="favorites__title text-xl font-bold mb-4">Избранное</h2>
            {favorites.length > 0 ? (
                <div className="favorites__grid">
                    {favorites.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">Список избранного пуст.</p>
            )}
        </div>
    );
};

export default FavoritesList;
