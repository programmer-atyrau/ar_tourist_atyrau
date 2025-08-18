# 🚀 Быстрый запуск AR Tourist с HTTPS

## ✅ Что уже готово:
- SSL сертификаты созданы (`localhost.pem` и `localhost-key.pem`)
- Скрипты для запуска настроены
- Приложение готово к работе с HTTPS

## 🖥️ Запуск на Windows:

### Вариант 1: Автоматический скрипт (рекомендуется)
```bash
start-https.bat
```

### Вариант 2: PowerShell
```bash
.\start-https.ps1
```

### Вариант 3: Командная строка
```bash
npm run start:https
```

## 🐧 Запуск на Linux/Mac:
```bash
chmod +x start-https.sh
./start-https.sh
```

## 🌐 Доступ к приложению:
После запуска приложение будет доступно по адресу:
- **HTTPS**: `https://localhost:3000` ✅
- HTTP: `http://localhost:3000` (не рекомендуется для Android)

## 📱 Тестирование на Android:
1. **Запустите приложение с HTTPS** (один из способов выше)
2. **Откройте Chrome на Android**
3. **Перейдите по адресу**: `https://YOUR_COMPUTER_IP:3000`
4. **Разрешите доступ к камере**

## 🔍 Проверка SSL:
- В браузере должен быть зеленый замок 🔒
- Адрес должен начинаться с `https://`
- Предупреждения о небезопасном соединении не должно быть

## 🐛 Если не работает:

### Проверьте наличие файлов:
```bash
ls -la *.pem
```

### Пересоздайте сертификаты:
```bash
mkcert -install
mkcert localhost
```

### Проверьте переменные окружения:
```bash
echo $HTTPS
echo $SSL_CRT_FILE
echo $SSL_KEY_FILE
```

## 📞 Поддержка:
Если проблемы остаются, см. файл `ANDROID_SETUP.md`
