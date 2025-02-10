const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Создаем правильный путь к базе данных
const dbPath = path.join(__dirname, 'database.db');

// Подключаемся к базе данных
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err.message);
    return;
  }
  console.log('Успешное подключение к базе данных');
});

db.serialize(() => {

  // Создаем таблицы

  // Общая таблица со всеми продуктами
  db.run(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        discount INTEGER DEFAULT NULL,
        image TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT DEFAULT ''
  )`);

  // Создание таблицы для характеристик смартфонов
  db.run(`CREATE TABLE IF NOT EXISTS smartphones_features (
  product_id INTEGER PRIMARY KEY,
  color TEXT NOT NULL,
  screen_size REAL NOT NULL,
  screen_resolution TEXT NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  interfaces TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Создание таблицы для характеристик ноутбуков
  db.run(`CREATE TABLE IF NOT EXISTS laptops_features (
  product_id INTEGER PRIMARY KEY,
  color TEXT NOT NULL,
  screen_size REAL NOT NULL,
  screen_resolution TEXT NOT NULL,
  ram TEXT NOT NULL,
  storage TEXT NOT NULL,
  interfaces TEXT NOT NULL,
  processor TEXT NOT NULL,
  battery_life REAL NOT NULL,
  graphics TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  // Создание таблицы для характеристик микроволновок
  db.run(`CREATE TABLE IF NOT EXISTS microwaves_features (
  product_id INTEGER PRIMARY KEY,
  color TEXT NOT NULL,
  capacity REAL NOT NULL,
  power INTEGER NOT NULL,
  dimensions TEXT NOT NULL,
  weight REAL NOT NULL,
  interfaces TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,      
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5), 
      comment TEXT NOT NULL,                   
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );`);

    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );`)

  const smartphones = [
    {
      name: 'Honor 9A',
      price: 9990,
      discount: 10,
      image: '/images/Smartphones/sh9a.webp',
      category: 'smartphones',
      description: 'Компактный и стильный смартфон с длительным временем автономной работы и отличной камерой.'
    },
    {
      name: 'Samsung Galaxy S21 128gb',
      price: 49990,
      discount: 9,
      image: '/images/Smartphones/sgs21_128gb.webp',
      category: 'smartphones',
      description: 'Флагман с потрясающим дисплеем AMOLED, мощной камерой и стильным дизайном.'
    },
    {
      name: 'Samsung Galaxy S21 256gb',
      price: 54990,
      image: '/images/Smartphones/sgs21_256gb.webp',
      category: 'smartphones',
      description: 'Расширенная версия Galaxy S21 с большим объёмом памяти для хранения важных данных.'
    },
    {
      name: 'Samsung Galaxy A31',
      price: 17990,
      discount: 15,
      image: '/images/Smartphones/sga31.webp',
      category: 'smartphones',
      description: 'Отличный выбор для повседневного использования, с большим экраном и ёмкой батареей.'
    },
    {
      name: 'Samsung Galaxy A12',
      price: 12990,
      image: '/images/Smartphones/sga12_32gb.webp',
      category: 'smartphones',
      description: 'Доступный смартфон с хорошей камерой, подходящий для решения повседневных задач.'
    },
    {
      name: 'Xiaomi Mi 10T 8+128gb Black',
      price: 29990,
      discount: 14,
      image: '/images/Smartphones/xm10t_8+128gb.webp',
      category: 'smartphones',
      description: 'Мощный смартфон для игр и работы, с большим объёмом памяти и высокой производительностью.'
    },
    {
      name: 'Xiaomi Redmi',
      price: 11990,
      discount: 8,
      image: '/images/Smartphones/xr.webp',
      category: 'smartphones',
      description: 'Доступный смартфон с базовым набором функций, подходящий для звонков и интернета.'
    },
    {
      name: 'Xiaomi Redmi 9',
      price: 13990,
      image: '/images/Smartphones/xr9.webp',
      category: 'smartphones',
      description: 'Сбалансированный смартфон с хорошей камерой и ёмким аккумулятором.'
    },
    {
      name: 'Xiaomi Redmi 9A',
      price: 10990,
      discount: 5,
      image: '/images/Smartphones/xr9a.webp',
      category: 'smartphones',
      description: 'Экономичный смартфон с длительным временем работы от батареи и стильным дизайном.'
    },
    {
      name: 'iPhone 13 128GB',
      price: 79990,
      image: '/images/Smartphones/sh9a.webp',
      category: 'smartphones',
      description: 'Флагман Apple с инновационными функциями, превосходной камерой и потрясающим дисплеем.'
    },
    {
      name: 'iPhone 14 Pro Max 256GB',
      price: 119990,
      discount: 12,
      image: '/images/Smartphones/sgs21_128gb.webp',
      category: 'smartphones',
      description: 'Современный iPhone с мощным процессором, большим экраном и расширенными функциями камеры.'
    },
    // Дублирую несколько телефонов для увеличения числа товаров
    {
      name: 'Samsung Galaxy A31',
      price: 17990,
      discount: 15,
      image: '/images/Smartphones/sga31.webp',
      category: 'smartphones',
      description: 'Отличный выбор для повседневного использования, с большим экраном и ёмкой батареей.'
    },
    {
      name: 'Xiaomi Mi 10T 8+128gb Black',
      price: 29990,
      discount: 14,
      image: '/images/Smartphones/xm10t_8+128gb.webp',
      category: 'smartphones',
      description: 'Мощный смартфон для игр и работы, с большим объёмом памяти и высокой производительностью.'
    },
    {
      name: 'Xiaomi Redmi 9A',
      price: 10990,
      discount: 5,
      image: '/images/Smartphones/xr9a.webp',
      category: 'smartphones',
      description: 'Экономичный смартфон с длительным временем работы от батареи и стильным дизайном.'
    },
    {
      name: 'iPhone 13 128GB',
      price: 79990,
      image: '/images/Smartphones/sh9a.webp',
      category: 'smartphones',
      description: 'Флагман Apple с инновационными функциями, превосходной камерой и потрясающим дисплеем.'
    },
    {
      name: 'iPhone 14 Pro Max 256GB',
      price: 119990,
      discount: 12,
      image: '/images/Smartphones/sgs21_128gb.webp',
      category: 'smartphones',
      description: 'Современный iPhone с мощным процессором, большим экраном и расширенными функциями камеры.'
    },
    {
      name: 'Honor 9A',
      price: 9990,
      discount: 10,
      image: '/images/Smartphones/sh9a.webp',
      category: 'smartphones',
      description: 'Компактный и стильный смартфон с длительным временем автономной работы и отличной камерой.'
    },
    {
      name: 'Samsung Galaxy S21 128gb',
      price: 49990,
      discount: 9,
      image: '/images/Smartphones/sgs21_128gb.webp',
      category: 'smartphones',
      description: 'Флагман с потрясающим дисплеем AMOLED, мощной камерой и стильным дизайном.'
    }
  ];

  const smartphoneFeatures = [
    {
      product_id: 1,
      color: 'Белый',
      screen_size: 6.2,
      screen_resolution: '2400x1080 Пикс',
      ram: '8 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 2,
      color: 'Черный',
      screen_size: 6.1,
      screen_resolution: '2400x1080 Пикс',
      ram: '8 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 3,
      color: 'Синий',
      screen_size: 6.5,
      screen_resolution: '2400x1080 Пикс',
      ram: '6 GB',
      storage: '64 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 4,
      color: 'Зеленый',
      screen_size: 6.4,
      screen_resolution: '2340x1080 Пикс',
      ram: '4 GB',
      storage: '64 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 5,
      color: 'Красный',
      screen_size: 6.0,
      screen_resolution: '2560x1440 Пикс',
      ram: '8 GB',
      storage: '256 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.1'
    },
    {
      product_id: 6,
      color: 'Черный',
      screen_size: 6.3,
      screen_resolution: '2220x1080 Пикс',
      ram: '6 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 7,
      color: 'Белый',
      screen_size: 6.1,
      screen_resolution: '2400x1080 Пикс',
      ram: '4 GB',
      storage: '64 GB',
      interfaces: 'Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 8,
      color: 'Серебристый',
      screen_size: 6.7,
      screen_resolution: '3200x1440 Пикс',
      ram: '12 GB',
      storage: '512 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 9,
      color: 'Титан',
      screen_size: 6.3,
      screen_resolution: '2340x1080 Пикс',
      ram: '8 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.1'
    },
    {
      product_id: 10,
      color: 'Золотой',
      screen_size: 6.2,
      screen_resolution: '2480x1080 Пикс',
      ram: '6 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 11,
      color: 'Темно-синий',
      screen_size: 6.5,
      screen_resolution: '2400x1080 Пикс',
      ram: '8 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 12,
      color: 'Фиолетовый',
      screen_size: 6.8,
      screen_resolution: '3200x1440 Пикс',
      ram: '16 GB',
      storage: '512 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.2'
    },
    {
      product_id: 13,
      color: 'Серый',
      screen_size: 6.6,
      screen_resolution: '2400x1080 Пикс',
      ram: '8 GB',
      storage: '256 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 14,
      color: 'Черный',
      screen_size: 6.9,
      screen_resolution: '3200x1440 Пикс',
      ram: '12 GB',
      storage: '512 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.2'
    },
    {
      product_id: 15,
      color: 'Розовый',
      screen_size: 6.4,
      screen_resolution: '2400x1080 Пикс',
      ram: '6 GB',
      storage: '128 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.1'
    },
    {
      product_id: 16,
      color: 'Синий',
      screen_size: 6.5,
      screen_resolution: '2340x1080 Пикс',
      ram: '8 GB',
      storage: '128 GB',
      interfaces: 'Wi-Fi, Bluetooth 5.0'
    },
    {
      product_id: 17,
      color: 'Зеленый',
      screen_size: 6.2,
      screen_resolution: '2560x1440 Пикс',
      ram: '8 GB',
      storage: '256 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.1'
    },
    {
      product_id: 18,
      color: 'Белый',
      screen_size: 6.3,
      screen_resolution: '2220x1080 Пикс',
      ram: '4 GB',
      storage: '64 GB',
      interfaces: 'NFC, Wi-Fi, Bluetooth 5.0'
    }
  ];

  const laptops = [
    {
      name: 'Apple Macbook Air M1',
      price: 9990,
      discount: 10,
      image: '/images/Laptops/Apple_Macbook_Air_M1.webp',
      category: 'laptops',
      description: 'Лёгкий и мощный ноутбук с процессором M1, обеспечивающий высокую производительность и продолжительное время автономной работы.'
    },
    {
      name: 'ASUS E406NABV014T',
      price: 49990,
      discount: 15,
      image: '/images/Laptops/ASUS_E406NABV014T.webp',
      category: 'laptops',
      description: 'Компактный ноутбук для повседневных задач, с эргономичным дизайном и удобной клавиатурой.'
    },
    {
      name: 'ASUS VivoBook X415JA-EK220T',
      price: 54990,
      image: '/images/Laptops/ASUS_VivoBook_X415JA-EK220T.webp',
      category: 'laptops',
      description: 'Универсальный ноутбук с большим экраном и высокой производительностью для работы и развлечений.'
    },
    {
      name: 'Digma EVE 10 A201',
      price: 17990,
      discount: 20,
      image: '/images/Laptops/Digma_EVE_10_A201.webp',
      category: 'laptops',
      description: 'Доступный ноутбук с оптимальным набором функций для обучения и работы.'
    },
    {
      name: 'Digma EVE 14 C411',
      price: 12990,
      image: '/images/Laptops/Digma_EVE_14_C411.webp',
      category: 'laptops',
      description: 'Недорогой ноутбук с лёгким корпусом и хорошей автономностью для базовых задач.'
    },
    {
      name: 'HAIER A1410EM',
      price: 29990,
      discount: 25,
      image: '/images/Laptops/HAIER_A1410EM.webp',
      category: 'laptops',
      description: 'Мощный ноутбук для офиса и дома, с большим экраном и длительным временем работы от аккумулятора.'
    },
    {
      name: 'HAIER U1520EM',
      price: 11990,
      discount: 8,
      image: '/images/Laptops/HAIER_U1520EM.webp',
      category: 'laptops',
      description: 'Компактный ноутбук для мобильной работы, с удобным экраном и базовой производительностью.'
    },
    {
      name: 'Honor MagicBook Pro',
      price: 13990,
      image: '/images/Laptops/Honor_MagicBook_Pro.webp',
      category: 'laptops',
      description: 'Ноутбук с современным дизайном, мощной графикой и отличным дисплеем для работы и игр.'
    },
    {
      name: 'HP 15-DB1240ur',
      price: 10990,
      discount: 12,
      image: '/images/Laptops/HP_15-DB1240ur.webp',
      category: 'laptops',
      description: 'Ноутбук с большим экраном, подходящий для работы, учёбы и просмотра мультимедиа.'
    },
    {
      name: 'Lenovo IdP3 17ITL6',
      price: 79990,
      discount: 18,
      image: '/images/Laptops/Lenovo_IdP3_17ITL6.webp',
      category: 'laptops',
      description: 'Производительный ноутбук с большим экраном и современными характеристиками для требовательных задач.'
    },
    {
      name: 'Lenovo Idp3 17ITL7',
      price: 119990,
      image: '/images/Laptops/Lenovo_Idp3_17ITL7.webp',
      category: 'laptops',
      description: 'Флагманский ноутбук с отличной производительностью, большим объёмом памяти и стильным дизайном.'
    },
    {
      name: 'Lenovo V15-IGL',
      price: 119990,
      discount: 5,
      image: '/images/Laptops/Lenovo_V15-IGL.webp',
      category: 'laptops',
      description: 'Надёжный ноутбук с удобной клавиатурой и отличной автономностью для работы и отдыха.'
    }
  ];

  const laptopFeatures = [
    {
      product_id: 12,
      color: 'Черный',
      screen_size: 15.6,
      screen_resolution: '1920x1080',
      ram: '8 GB',
      storage: '512 GB',
      interfaces: 'USB 3.0, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i7',
      battery_life: 10,
      graphics: 'NVIDIA GeForce GTX 1650'
    },
    {
      product_id: 13,
      color: 'Серебристый',
      screen_size: 14.0,
      screen_resolution: '2560x1440',
      ram: '16 GB',
      storage: '1024 GB',
      interfaces: 'USB-C, HDMI, Wi-Fi, Bluetooth 5.1',
      processor: 'AMD Ryzen 5',
      battery_life: 12,
      graphics: 'AMD Radeon RX 5700M'
    },
    {
      product_id: 14,
      color: 'Золотой',
      screen_size: 13.3,
      screen_resolution: '1920x1080',
      ram: '8 GB',
      storage: '256 GB',
      interfaces: 'USB 3.0, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i5',
      battery_life: 8,
      graphics: 'Intel UHD Graphics 620'
    },
    {
      product_id: 15,
      color: 'Серый',
      screen_size: 15.6,
      screen_resolution: '1920x1080',
      ram: '8 GB',
      storage: '512 GB',
      interfaces: 'USB 3.0, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i5',
      battery_life: 9,
      graphics: 'NVIDIA GeForce MX250'
    },
    {
      product_id: 16,
      color: 'Белый',
      screen_size: 13.3,
      screen_resolution: '2560x1600',
      ram: '16 GB',
      storage: '512 GB',
      interfaces: 'USB-C, HDMI, Wi-Fi, Bluetooth 5.1',
      processor: 'Apple M1',
      battery_life: 18,
      graphics: 'Apple M1 GPU'
    },
    {
      product_id: 17,
      color: 'Черный',
      screen_size: 17.3,
      screen_resolution: '1920x1080',
      ram: '32 GB',
      storage: '2048 GB',
      interfaces: 'USB 3.1, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i9',
      battery_life: 6,
      graphics: 'NVIDIA GeForce RTX 3080'
    },
    {
      product_id: 18,
      color: 'Серебристый',
      screen_size: 14.0,
      screen_resolution: '1920x1080',
      ram: '8 GB',
      storage: '256 GB',
      interfaces: 'USB 3.0, Wi-Fi, Bluetooth 5.0',
      processor: 'AMD Ryzen 7',
      battery_life: 10,
      graphics: 'AMD Radeon RX 6700M'
    },
    {
      product_id: 19,
      color: 'Темно-синий',
      screen_size: 15.6,
      screen_resolution: '3840x2160',
      ram: '16 GB',
      storage: '1024 GB',
      interfaces: 'USB-C, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i7',
      battery_life: 8,
      graphics: 'NVIDIA GeForce RTX 3060'
    },
    {
      product_id: 20,
      color: 'Красный',
      screen_size: 13.3,
      screen_resolution: '1920x1080',
      ram: '8 GB',
      storage: '512 GB',
      interfaces: 'USB 3.0, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i5',
      battery_life: 7,
      graphics: 'Intel UHD Graphics 630'
    },
    {
      product_id: 21,
      color: 'Зеленый',
      screen_size: 14.0,
      screen_resolution: '2560x1600',
      ram: '16 GB',
      storage: '512 GB',
      interfaces: 'USB-C, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'AMD Ryzen 9',
      battery_life: 11,
      graphics: 'AMD Radeon RX 6800M'
    },
    {
      product_id: 22,
      color: 'Серебристый',
      screen_size: 15.6,
      screen_resolution: '1920x1080',
      ram: '8 GB',
      storage: '256 GB',
      interfaces: 'USB 3.0, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i5',
      battery_life: 9,
      graphics: 'NVIDIA GeForce MX330'
    },
    {
      product_id: 23,
      color: 'Черный',
      screen_size: 16.0,
      screen_resolution: '1920x1080',
      ram: '32 GB',
      storage: '1024 GB',
      interfaces: 'USB 3.1, HDMI, Wi-Fi, Bluetooth 5.0',
      processor: 'Intel Core i7',
      battery_life: 10,
      graphics: 'NVIDIA GeForce GTX 1650'
    }
  ];

  const microwaves = [
    {
      name: 'Microwave BBK 17MWS-782M B black',
      price: 9990,
      discount: 10,
      image: '/images/Microwaves/Microwave_BBK_17MWS-782M_B_black.webp',
      category: 'microwaves',
      description: 'Компактная микроволновая печь с механическим управлением и стильным чёрным дизайном.'
    },
    {
      name: 'Microwave Caso SMG 20',
      price: 49990,
      discount: 20,
      image: '/images/Microwaves/Microwave_Caso_SMG_20.webp',
      category: 'microwaves',
      description: 'Современная микроволновая печь с функцией гриля, идеально подходящая для приготовления разнообразных блюд.'
    },
    {
      name: 'Microwave Gorenje MO20MW white',
      price: 54990,
      image: '/images/Microwaves/Microwave_Gorenje_MO20MW_white.webp',
      category: 'microwaves',
      description: 'Надёжная микроволновая печь с лаконичным белым дизайном, идеально вписывающаяся в любую кухню.'
    },
    {
      name: 'Microwave Huyndai HYM-M2003 white',
      price: 17990,
      discount: 15,
      image: '/images/Microwaves/Microwave_Huyndai_HYM-M2003_white.webp',
      category: 'microwaves',
      description: 'Эргономичная микроволновка с простым управлением и белым корпусом для повседневного использования.'
    },
    {
      name: 'Microwave Hyundai HYM-M2039 black',
      price: 12990,
      image: '/images/Microwaves/Microwave_Hyundai_HYM-M2039_black.webp',
      category: 'microwaves',
      description: 'Компактная и мощная микроволновая печь с современным чёрным дизайном.'
    },
    {
      name: 'Microwave Oursson MM2005 DC vinous',
      price: 29990,
      discount: 25,
      image: '/images/Microwaves/Microwave_Oursson_MM2005_DC_vinous.webp',
      category: 'microwaves',
      description: 'Элегантная микроволновая печь в винном цвете, оснащённая множеством режимов приготовления.'
    },
    {
      name: 'Microwave Oursson MM2005 GA green',
      price: 11990,
      image: '/images/Microwaves/Microwave_Oursson_MM2005_GA_green.webp',
      category: 'microwaves',
      description: 'Яркая микроволновая печь зелёного цвета с отличной функциональностью и компактными размерами.'
    },
    {
      name: 'Microwave Samsung MS23K351AS silvery',
      price: 13990,
      discount: 8,
      image: '/images/Microwaves/Microwave_Samsung_MS23K351AS_silvery.webp',
      category: 'microwaves',
      description: 'Серебристая микроволновая печь Samsung с эко-режимом и стильным дизайном.'
    },
    {
      name: 'Microwave STARWIND SMW 2520 black silver',
      price: 10990,
      discount: 5,
      image: '/images/Microwaves/Microwave_STARWIND_SMW_2520_black_silver.webp',
      category: 'microwaves',
      description: 'Микроволновка с чёрно-серебристым корпусом и мощным грилем для быстрого приготовления пищи.'
    },
    {
      name: 'Microwave TESLER ME-2044 green',
      price: 79990,
      image: '/images/Microwaves/Microwave_TESLER_ME-2044_green.webp',
      category: 'microwaves',
      description: 'Эффективная микроволновая печь ярко-зелёного цвета, идеально подходящая для современной кухни.'
    },
    {
      name: 'Microwave TESLER MM-2002',
      price: 119990,
      discount: 18,
      image: '/images/Microwaves/Microwave_TESLER_MM-2002.webp',
      category: 'microwaves',
      description: 'Мощная микроволновая печь премиум-класса с множеством программ и удобным управлением.'
    }
  ];

  const microwaveFeatures = [
    {
      product_id: 24,
      color: 'Белый',
      power: 800,
      capacity: 20,
      dimensions: '45x34x26 см',
      weight: 12.5,
      interfaces: 'Механическое управление'
    },
    {
      product_id: 25,
      color: 'Серебристый',
      power: 900,
      capacity: 25,
      dimensions: '48x39x28 см',
      weight: 15.2,
      interfaces: 'Электронное управление'
    },
    {
      product_id: 26,
      color: 'Черный',
      power: 1000,
      capacity: 30,
      dimensions: '50x40x30 см',
      weight: 18.0,
      interfaces: 'Механическое управление, Гриль'
    },
    {
      product_id: 27,
      color: 'Серебристый',
      power: 700,
      capacity: 22,
      dimensions: '44x36x25 см',
      weight: 14.0,
      interfaces: 'Электронное управление'
    },
    {
      product_id: 28,
      color: 'Белый',
      power: 800,
      capacity: 28,
      dimensions: '46x38x27 см',
      weight: 16.5,
      interfaces: 'Механическое управление, Гриль'
    },
    {
      product_id: 29,
      color: 'Черный',
      power: 1200,
      capacity: 35,
      dimensions: '55x45x35 см',
      weight: 20.0,
      interfaces: 'Электронное управление, Гриль'
    },
    {
      product_id: 30,
      color: 'Серебристый',
      power: 1000,
      capacity: 23,
      dimensions: '47x38x28 см',
      weight: 17.0,
      interfaces: 'Механическое управление'
    },
    {
      product_id: 31,
      color: 'Белый',
      power: 900,
      capacity: 20,
      dimensions: '45x35x26 см',
      weight: 13.5,
      interfaces: 'Электронное управление, Гриль'
    },
    {
      product_id: 32,
      color: 'Черный',
      power: 1000,
      capacity: 30,
      dimensions: '50x40x30 см',
      weight: 18.5,
      interfaces: 'Механическое управление, Гриль'
    },
    {
      product_id: 33,
      color: 'Серебристый',
      power: 800,
      capacity: 25,
      dimensions: '47x37x28 см',
      weight: 16.0,
      interfaces: 'Электронное управление, Гриль'
    },
    {
      product_id: 34,
      color: 'Белый',
      power: 900,
      capacity: 20,
      dimensions: '44x36x25 см',
      weight: 14.5,
      interfaces: 'Механическое управление'
    }
  ];

  // Вставляем все продукты в таблицу `products`
  const insertProduct = (product) => {
    const query = `
        INSERT INTO products (name, price, discount, image, category, description) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    db.run(query, [
      product.name,
      product.price,
      product.discount || null, // Если скидка не указана, то устанавливается null
      product.image,            // Путь к изображению
      product.category,         // Категория товара
      product.description || '' // Если описание не указано, то устанавливается пустая строка
    ], (err) => {
      if (err) console.error('Ошибка при добавлении данных в таблицу products:', err.message);
    });
  };

  // Вставка характеристик смартфона
  const insertSmartphoneFeature = (feature) => {
    const query = `INSERT INTO smartphones_features (product_id, color, screen_size, screen_resolution, ram, storage, interfaces)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [
      feature.product_id,
      feature.color,
      feature.screen_size,
      feature.screen_resolution,
      feature.ram,
      feature.storage,
      feature.interfaces
    ], (err) => {
      if (err) {
        console.error('Ошибка при добавлении данных в таблицу smartphone_features:', err.message);
      }
    });
  };

  // Вставляем характеристики для смартфонов
  smartphoneFeatures.forEach(insertSmartphoneFeature);

  // Вставка характеристик ноутбуков с добавлением поля graphics
  const insertLaptopFeature = (feature) => {
    const query = `INSERT INTO laptops_features (product_id, color, screen_size, screen_resolution, ram, storage, interfaces, processor, battery_life, graphics)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [
      feature.product_id,
      feature.color,
      feature.screen_size,
      feature.screen_resolution,
      feature.ram,
      feature.storage,
      feature.interfaces,
      feature.processor,
      feature.battery_life,
      feature.graphics  // добавлено поле graphics
    ], (err) => {
      if (err) {
        console.error('Ошибка при добавлении данных в таблицу laptops_features:', err.message);
      }
    });
  };

  // Добавление данных
  laptopFeatures.forEach(insertLaptopFeature);


  // Вставка данных в таблицу microwave_features
  const insertMicrowaveFeature = (feature) => {
    const query = `INSERT INTO microwaves_features (product_id, color, capacity, power, dimensions, weight, interfaces)
                VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(query, [
      feature.product_id,
      feature.color,
      feature.capacity,
      feature.power,
      feature.dimensions,
      feature.weight,
      feature.interfaces
    ], (err) => {
      if (err) {
        console.error('Ошибка при добавлении данных в таблицу microwaves_features:', err.message);
      }
    });
  };

  // Вставка всех характеристик микроволновок
  microwaveFeatures.forEach(insertMicrowaveFeature);

  // Вставляем все товары
  smartphones.forEach((product) => insertProduct(product));
  laptops.forEach((product) => insertProduct(product));
  microwaves.forEach((product) => insertProduct(product));
});

// Закрываем соединение с базой данных
db.close((err) => {
  if (err) {
    console.error('Ошибка при закрытии базы данных:', err.message);
    return;
  }
  console.log('Соединение с базой данных закрыто');
});