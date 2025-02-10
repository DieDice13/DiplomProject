const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const app = express();
const port = 5000;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authMiddleware = require('../middlewares/authMiddleware'); // Импортируем middleware авторизации

// Разрешаем доступ с фронтенда
app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

// Подключение к базе данных
const dbPath = path.join(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

//----------------------------------------------------------------------------------------

// Обработка запроса на получение всех продуктов с их характеристиками по категории
app.get('/api/products/', (req, res) => {
  const { category } = req.query;

  if (!category) {
    return res.status(400).json({ error: 'Не указана категория' });
  }

  // Формируем запрос с объединением таблиц
  const query = `
    SELECT products.*, ${category}_features.*
    FROM products
    LEFT JOIN ${category}_features ON products.id = ${category}_features.product_id
    WHERE products.category = ?
  `;

  db.all(query, [category], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

//----------------------------------------------------------------------------------------

// Обработка запроса на получение продукта по категории и ID с характеристиками
app.get('/api/products/:category/:id', (req, res) => {
  const { category, id } = req.params;
  // console.log('Получен запрос на продукт:', category, id);


  // Запрос на получение данных о продукте из таблицы "products"
  const productQuery = `SELECT * FROM products WHERE id = ? AND category = ?`;

  // Запрос на получение характеристик из таблицы "{category}_features"
  const featureQuery = `SELECT * FROM ${category}_features WHERE product_id = ?`;

  // console.log('Запрос на получение продукта:', productQuery, [id, category]);
  // console.log('Запрос на получение характеристик:', featureQuery, [id]);

  // Получаем данные о продукте
  db.get(productQuery, [id, category], (err, product) => {
    if (err) {
      console.error('Ошибка запроса данных о продукте:', err);
      return res.status(500).json({ error: 'Ошибка получения данных о продукте' });
    }

    if (!product) {
      console.log(`Продукт с ID ${id} не найден`);
      return res.status(404).json({ error: 'Продукт не найден' });
    }

    // console.log(`Данные о продукте:`, product);

    // Получаем характеристики продукта
    db.all(featureQuery, [id], (err, features) => {
      if (err) {
        console.error('Ошибка запроса характеристик:', err);
        return res.status(500).json({ error: 'Ошибка получения характеристик' });
      }

      // console.log('Характеристики продукта:', features);

      // Добавляем характеристики к объекту продукта
      product.features = features;
      res.json(product); // Возвращаем продукт с характеристиками
    });
  });
});

//----------------------------------------------------------------------------------------

// Получение всех харкатеристик продуктов по категории
app.get('/api/product-features/:category', (req, res) => {
  const { category } = req.params;

  // Запрос для получения всех характеристик продуктов по категории
  const featureQuery = `
      SELECT f.*
      FROM ${category}_features f
      INNER JOIN products p ON f.product_id = p.id
      WHERE p.category = ?
  `;

  // Выполняем запрос
  db.all(featureQuery, [category], (err, features) => {
    if (err) {
      console.error('Ошибка получения характеристик продуктов:', err);
      return res.status(500).json({ error: 'Ошибка получения характеристик' });
    }

    if (features.length === 0) {
      console.log(`Для категории "${category}" нет характеристик`);
      return res.status(404).json({ error: 'Характеристики не найдены' });
    }

    // Группируем данные по характеристикам для подсчёта количества
    const aggregatedFeatures = {};
    features.forEach((feature) => {
      for (const [key, value] of Object.entries(feature)) {
        if (key === 'product_id') continue; // Пропускаем поле product_id

        if (!aggregatedFeatures[key]) {
          aggregatedFeatures[key] = {};
        }

        if (!aggregatedFeatures[key][value]) {
          aggregatedFeatures[key][value] = 0;
        }

        aggregatedFeatures[key][value] += 1; // Увеличиваем счётчик
      }
    });

    // Возвращаем сгруппированные данные
    res.json(aggregatedFeatures);
  });
});

//----------------------------------------------------------------------------------------

// Получение всех продуктов с характеристиками
app.get('/api/products-with-features', async (req, res) => {
  const { category } = req.query; // Используем req.query для получения категории

  // Проверяем, что категория существует
  if (!category) {
      return res.status(400).json({ error: 'Не указана категория' });
  }

  try {
      // Динамический запрос, который объединяет таблицу продуктов с таблицей характеристик
      const query = `
          SELECT p.*, f.*
          FROM products p
          LEFT JOIN ${category}_features f ON p.id = f.product_id
          WHERE p.category = ?
      `;

      const products = await db.all(query, [category]);
      res.json(products); // Отправляем ответ с продуктами и их характеристиками
  } catch (err) {
      res.status(500).json({ error: 'Не удалось загрузить продукты с характеристиками' });
  }
});

//----------------------------------------------------------------------------------------

// Получение отзывов по продуктам
app.get('/api/reviews/:id', (req, res) => {
  const { id } = req.params;
  // console.log(`Получен запрос для productId: ${id}`);  // Логируем id

  db.all('SELECT * FROM reviews WHERE product_id = ?', [id], (err, rows) => {
    if (err) {
      console.error('Ошибка запроса:', err);
      return res.status(500).json({ error: err.message });
    }

    if (rows.length === 0) {
      //console.log('Нет отзывов для этого продукта');
      return res.status(404).json({ message: 'Отзывов не найдено' });
    }

    // console.log('Найдено отзывов:', rows);  // Логируем данные перед отправкой
    res.json(rows);  // Отправляем отзывы в ответ
  });
});

//----------------------------------------------------------------------------------------

// Добавление отзыва
app.post('/api/reviews/:id', authMiddleware, express.json(), (req, res) => {
  const product_id = req.params.id; // ID продукта
  const { rating, comment } = req.body; // Данные отзыва
  const user_id = req.user?.id; // ID пользователя из middleware

  // Проверка обязательных полей
  if (!product_id || !user_id || !rating || !comment) {
    return res.status(400).json({ error: 'Все поля обязательны для заполнения.' });
  }

  // Проверка рейтинга
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Рейтинг должен быть числом от 1 до 5.' });
  }

  // SQL-запрос для добавления отзыва
  const insertReviewQuery = `
    INSERT INTO reviews (user_id, product_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, datetime('now'))
  `;

  db.run(insertReviewQuery, [user_id, product_id, rating, comment], function (err) {
    if (err) {
      console.error('Ошибка при добавлении отзыва:', err);
      return res.status(500).json({ error: 'Ошибка добавления отзыва.' });
    }

    // Возвращаем успешный ответ с данными
    res.status(201).json({
      id: this.lastID,
      user_id,
      product_id,
      rating,
      comment,
      created_at: new Date().toISOString()
    });
  });
});

//----------------------------------------------------------------------------------------

// Маршрут авторизации
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Проверка обязательных полей
  if (!email || !password) {
    return res.status(400).json({ message: "Все поля обязательны!" });
  }

  // Проверка пользователя
  const query = `SELECT * FROM users WHERE email = ?`;
  db.get(query, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Ошибка сервера!" });
    }

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден!" });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный пароль!" });
    }

    // Генерация токена
    const token = jwt.sign({ id: user.id, email: user.email }, "aG3^jk29@N#b82kVmO82!zKmqT%7^mPlQ&", { expiresIn: "1h" });
    res.json({ token });
  });
});

//----------------------------------------------------------------------------------------

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  // Проверка обязательных полей
  if (!email || !password) {
    return res.status(400).json({ message: "Все поля обязательны!" });
  }

  // Хеширование пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Вставка в базу данных
  const query = `INSERT INTO users (email, password) VALUES (?, ?)`;
  db.run(query, [email, hashedPassword], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE constraint failed")) {
        return res.status(400).json({ message: "Пользователь уже существует!" });
      }
      return res.status(500).json({ message: "Ошибка сервера!" });
    }
    res.status(201).json({ message: "Регистрация успешна!" });
  });
});


//----------------------------------------------------------------------------------------

// const listEndpoints = require('express-list-endpoints');
// console.log(listEndpoints(app)); // Все возможные эндпоинты на сервере

// Запуск сервера
app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});