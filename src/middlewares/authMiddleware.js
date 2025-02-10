const jwt = require('jsonwebtoken'); // Убедитесь, что установили библиотеку: npm install jsonwebtoken

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  // console.log("Заголовок Authorization:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: "Токен авторизации не предоставлен." });
  }

  const token = authHeader.split(" ")[1]; // Убираем "Bearer "
  try {
    const decoded = jwt.verify(token, "aG3^jk29@N#b82kVmO82!zKmqT%7^mPlQ&"); // Используйте тот же ключ
    // console.log("Декодированный токен:", decoded);
    req.user = { id: decoded.id }; // Добавляем ID пользователя
    next();
  } catch (err) {
    console.error("Ошибка проверки токена:", err.message);
    return res.status(401).json({ error: "Неверный или истёкший токен." });
  }
};

module.exports = authMiddleware;