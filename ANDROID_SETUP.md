# Настройка для Android устройств

## 🚨 Важно для Android!

Приложение **НЕ будет работать** с камерой на Android устройствах без HTTPS соединения.

## 🔧 Решения для Android

### 1. HTTPS соединение (ОБЯЗАТЕЛЬНО)

#### Вариант A: Локальная разработка
```bash
# Установите mkcert для локальных SSL сертификатов
npm install -g mkcert

# Создайте локальный SSL сертификат
mkcert -install
mkcert localhost

# Запустите приложение с HTTPS
HTTPS=true SSL_CRT_FILE=localhost.pem SSL_KEY_FILE=localhost-key.pem npm start
```

#### Вариант B: Ngrok (для тестирования)
```bash
# Установите ngrok
npm install -g ngrok

# Запустите приложение
npm start

# В другом терминале создайте HTTPS туннель
ngrok http 3000
```

#### Вариант C: Vercel/Netlify (для продакшена)
```bash
# Соберите приложение
npm run build

# Разверните на Vercel
npx vercel --prod

# Или на Netlify
npx netlify deploy --prod --dir=build
```

### 2. Настройка браузера

#### Chrome (рекомендуется)
1. Откройте `chrome://flags/`
2. Найдите `Insecure origins treated as secure`
3. Добавьте `http://localhost:3000` и `http://192.168.x.x:3000`
4. Перезапустите браузер

#### Firefox
1. Откройте `about:config`
2. Найдите `media.devices.insecure.enabled`
3. Установите значение `true`

### 3. Разрешения камеры

1. **Разрешите доступ к камере** в настройках браузера
2. **Разрешите доступ к камере** в настройках Android
3. **Закройте другие приложения**, использующие камеру

## 📱 Тестирование на Android

### Шаг 1: Подготовка
```bash
# Убедитесь, что у вас HTTPS соединение
# Запустите приложение
npm start
```

### Шаг 2: Откройте на Android
1. Откройте браузер Chrome на Android
2. Перейдите по HTTPS адресу вашего приложения
3. Разрешите доступ к камере

### Шаг 3: Проверка
- Камера должна запуститься
- Должно появиться видео с камеры
- Распознавание должно работать

## 🐛 Устранение проблем

### Камера не запускается
```
Ошибка: NotAllowedError
Решение: Разрешите доступ к камере в настройках браузера
```

### Камера не найдена
```
Ошибка: NotFoundError
Решение: Убедитесь, что устройство имеет камеру
```

### Браузер не поддерживается
```
Ошибка: NotSupportedError
Решение: Используйте Chrome или Safari
```

### Камера занята
```
Ошибка: NotReadableError
Решение: Закройте другие приложения, использующие камеру
```

### Проблемы с HTTPS
```
Ошибка: TypeError
Решение: Убедитесь в правильном HTTPS соединении
```

## 🌐 Альтернативные решения

### 1. PWA (Progressive Web App)
```bash
# Добавьте PWA функциональность
npm install workbox-webpack-plugin
```

### 2. Capacitor (нативное приложение)
```bash
# Создайте нативное приложение
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add android
npx cap sync
```

### 3. React Native
```bash
# Создайте React Native приложение
npx react-native init ARTouristApp
```

## 📋 Чек-лист для Android

- [ ] HTTPS соединение настроено
- [ ] Браузер поддерживает getUserMedia API
- [ ] Разрешения камеры предоставлены
- [ ] Другие приложения не используют камеру
- [ ] Устройство имеет камеру
- [ ] Используется Chrome или Safari

## 🔍 Отладка

### Консоль браузера
```javascript
// Проверьте поддержку камеры
console.log('mediaDevices:', navigator.mediaDevices);
console.log('getUserMedia:', navigator.mediaDevices.getUserMedia);

// Проверьте разрешения
navigator.permissions.query({name: 'camera'})
  .then(result => console.log('Camera permission:', result.state));
```

### Network tab
- Проверьте HTTPS соединение
- Убедитесь, что модель загружается
- Проверьте отсутствие блокировщиков

## 📚 Полезные ссылки

- [MediaDevices API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices)
- [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [HTTPS на localhost](https://web.dev/how-to-use-local-https/)
- [Android WebView](https://developer.android.com/guide/webapps/webview)
