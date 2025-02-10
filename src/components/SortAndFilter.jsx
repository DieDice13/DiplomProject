import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SortAndFilter = ({ onSortChange, onFilterChange }) => {
    const { category } = useParams();
    const [parameters, setParameters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});  // Изменяем на объект для нескольких открытых фильтров
    const [selectedFilters, setSelectedFilters] = useState({});

    const transformLabel = (parameter) => {
        const labelsMap = {
            color: 'Цвет',
            screen_size: 'Размер экрана',
            screen_resolution: 'Разрешение экрана',
            ram: 'Оперативная память',
            storage: 'Накопитель',
            interfaces: 'Интерфейсы',
            processor: 'Процессор',
            battery_life: 'Срок службы батареи',
            graphics: 'Графика',
            capacity: 'Обьем',
            power: 'Мощность', 
            dimensions: 'Размеры',
            weight: 'Вес'
        };
    
        return labelsMap[parameter] || parameter.charAt(0).toUpperCase() + parameter.slice(1).replace(/_/g, ' ');
    };
    

    useEffect(() => {
        const fetchParameters = async () => {
            try {
                setLoading(true);
        
                // Получение характеристик для фильтрации
                const featuresResponse = await fetch(`http://localhost:5000/api/product-features/${category}`);
                if (!featuresResponse.ok) throw new Error('Ошибка при загрузке характеристик продуктов');
                const featuresData = await featuresResponse.json();
        
                // Трансформируем данные о характеристиках
                const transformedFeaturesData = Object.entries(featuresData).map(([parameter, values]) => ({
                    parameter,
                    label: transformLabel(parameter), // Человекочитаемые названия
                    values: Object.entries(values)
                        .map(([value, count]) => ({
                            value,
                            count,
                        }))
                        // Сортируем значения (учитывая числовую часть для памяти)
                        .sort((a, b) => {
                            // Функция для извлечения числовой части из строки (например, "16 GB" -> 16)
                            const extractNumber = (str) => parseFloat(str.match(/\d+/)?.[0] || 0);
        
                            const valA = extractNumber(a.value);
                            const valB = extractNumber(b.value);
                            return valA - valB; // Сравниваем как числа
                        }),
                }));
        
                setParameters([...transformedFeaturesData]);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        
    
        fetchParameters();
    }, [category]);
    

    const handleSortChange = (value) => {
        onSortChange(value);
    };

    const handleFilterChange = (parameter, value, isChecked) => {
        setSelectedFilters((prevFilters) => {
            const updatedFilters = { ...prevFilters };
            if (!updatedFilters[parameter]) updatedFilters[parameter] = new Set();

            if (isChecked) {
                updatedFilters[parameter].add(value);
            } else {
                updatedFilters[parameter].delete(value);
                if (updatedFilters[parameter].size === 0) delete updatedFilters[parameter];
            }

            onFilterChange(updatedFilters); // Передаем обновленные фильтры в компонент-родитель
            return updatedFilters;
        });
    };

    const handleResetFilters = () => {
        setSelectedFilters({});
        onFilterChange({}); // Передаем пустые фильтры в компонент-родитель

        // Закрываем все фильтры при сбросе
        setExpanded({});
    };

    const toggleExpand = (parameter) => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [parameter]: !prevExpanded[parameter], // Переключаем состояние фильтра для каждого параметра
        }));
    };

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;

    return (
        <div className="sorting-and-filters">
            <div className="catalog__sorting">
                <select
                    className="catalog__sorting-select"
                    onChange={(e) => handleSortChange(e.target.value)}
                >
                    <option value="default">Сортировка</option>
                    <option value="price-asc">По цене: низкая → высокая</option>
                    <option value="price-desc">По цене: высокая → низкая</option>
                    <option value="name-asc">По названию: A → Z</option>
                    <option value="name-desc">По названию: Z → A</option>
                </select>
            </div>

            <div className="filters">
                {parameters.map((param) => (
                    <div key={param.parameter} className="filter-item">
                        <div
                            className="filter-header"
                            onClick={() => toggleExpand(param.parameter)}
                        >
                            {param.label}
                        </div>
                        {expanded[param.parameter] && (  // Изменяем условие, чтобы проверять состояние каждого фильтра
                            <div className="filter-options">
                                {param.values.length > 0 ? (
                                    param.values.map((value) => (
                                        <label key={value.value}>
                                            <input
                                                type="checkbox"
                                                value={value.value}
                                                onChange={(e) =>
                                                    handleFilterChange(param.parameter, value.value, e.target.checked)
                                                }
                                                checked={selectedFilters[param.parameter]?.has(value.value) || false}
                                            />
                                            {value.value} ( {value.count} )
                                        </label>
                                    ))
                                ) : (
                                    <div>Нет доступных значений для фильтрации</div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Кнопка сброса фильтров */}
                <button
                    className="reset-filters-button"
                    onClick={handleResetFilters}
                >
                    Сбросить фильтры
                </button>
            </div>
        </div>
    );
};

export default SortAndFilter;