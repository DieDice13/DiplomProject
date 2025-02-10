import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import ProductCard from './ProductCard';
import SortAndFilter from './SortAndFilter';

import '../styles/catalog.scss';
import '../styles/sorting_and_filter.scss';

const Catalog = () => {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 12;

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
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/products?category=${category}`);
                if (!response.ok) {
                    throw new Error('Ошибка загрузки продуктов.');
                }
                const data = await response.json();
                console.log(data);
                setProducts(data);
                setFilteredProducts(data); // Устанавливаем продукты без фильтрации
                setError(null);
            } catch (err) {
                setError('Не удалось загрузить продукты. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [category]);

    // Обработчик для сортировки
    const handleSortChange = (option) => {
        const sorted = [...filteredProducts].sort((a, b) => {
            switch (option) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name-asc':
                    return a.name.localeCompare(b.name);
                case 'name-desc':
                    return b.name.localeCompare(a.name);
                default:
                    return 0;
            }
        });
        setFilteredProducts(sorted);
    };

    // Обработчик для фильтрации с приведением параметров к строке
    const handleFilterChange = (filters) => {
        console.log('Продукты до фильтрации:', products); // Логируем начальные данные
        console.log('Применяемые фильтры:', filters);

        let filtered = [...products];
        for (const [param, values] of Object.entries(filters)) {
            console.log(`Фильтрация по параметру: ${param} с возможными значениями: ${values}`);
            filtered = filtered.filter((product) => {
                console.log(`Проверка продукта ${param}: ${product[param]}`);
                // Приведение значений к строке для сравнения
                return values.has(String(product[param])); // Все значения приводятся к строке
            });
        }
        console.log('Отфильтрованные продукты:', filtered); // Логируем результат фильтрации
        console.log('Текущие фильтры:', filters);

        setFilteredProducts(filtered);
    };


    // Сбрасываем текущую страницу при изменении фильтров или сортировки
    useEffect(() => {
        setCurrentPage(0);
    }, [filteredProducts]);

    const offset = currentPage * itemsPerPage;
    const currentProducts = filteredProducts.slice(offset, offset + itemsPerPage);

    if (loading) return <p>Загрузка продуктов...</p>;
    if (error) return (
        <div className='catalog container'>
            {error}
            <button onClick={() => window.location.reload()} className='retry-button'>Попробовать снова</button>
        </div>
    );
    if (filteredProducts.length === 0) return <div className='catalog container'>По заданным параметрам ничего не найдено.</div>;

    return (
        <div className='catalog container'>
            <h2>Каталог: {transformCategoryName(category)}</h2>
            <div className="catalog__layout">
                {/* Сортировка и фильтры */}
                <div className="catalog__sidebar">
                    <SortAndFilter
                        onSortChange={handleSortChange}
                        onFilterChange={handleFilterChange}
                    />
                </div>

                {/* Сетка продуктов */}
                <div className="catalog__main">
                    <div className="catalog__product-grid">
                        {currentProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Пагинация */}
                    <ReactPaginate
                        previousLabel={'<'}
                        nextLabel={'>'}
                        breakLabel={'...'}
                        pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={({ selected }) => setCurrentPage(selected)}
                        forcePage={currentPage} // Синхронизация с текущей страницей
                        containerClassName={'catalog__pagination'}
                        activeClassName={'catalog__pagination-active'}
                        previousClassName={'catalog__pagination-btn'}
                        nextClassName={'catalog__pagination-btn'}
                        disabledClassName={'catalog__pagination-disabled'}
                    />
                </div>
            </div>
        </div>
    );
};

export default Catalog;