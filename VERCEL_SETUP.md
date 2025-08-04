# 🚀 Настройка Vercel Storage для Tickefy

## 📋 **Что нужно настроить:**

### **1. Vercel Blob Storage (для изображений)**
```bash
# В терминале Vercel CLI
vercel env add BLOB_READ_WRITE_TOKEN
```

## 🔧 **Пошаговая настройка:**

### **Шаг 1: Установите Vercel CLI**
```bash
npm i -g vercel
```

### **Шаг 2: Войдите в Vercel**
```bash
vercel login
```

### **Шаг 3: Создайте Blob Storage**
1. Перейдите в [Vercel Dashboard](https://vercel.com/dashboard)
2. Выберите ваш проект
3. Перейдите в **Storage** → **Blob**
4. Создайте новый Blob Store
5. Скопируйте токен и добавьте в переменные окружения

### **Шаг 4: Добавьте переменные окружения**
```bash
# Blob Storage
vercel env add BLOB_READ_WRITE_TOKEN
```

## 🎯 **Преимущества Vercel Storage:**

### **✅ Blob Storage:**
- **CDN** - быстрая доставка изображений
- **Автоматическое масштабирование**
- **Глобальное распространение**
- **Простая интеграция**

### **✅ localStorage для тикетов:**
- **Быстрый доступ** - данные хранятся в браузере
- **Простота** - не требует дополнительной настройки
- **Автоматическая синхронизация** - работает сразу
- **Безопасность** - данные не покидают браузер

## 🔄 **Fallback система:**

Если Vercel Storage недоступен, система автоматически переключается на:
1. **Vercel Blob Storage** (основной для изображений)
2. **localStorage** (основной для тикетов)
3. **Supabase** (если настроен)
4. **Локальное хранилище** (mock данные)

## 📊 **Структура данных:**

### **Тикеты в localStorage:**
```json
{
  "id": "1234567890",
  "title": "Проблема с принтером",
  "description": "Принтер не печатает",
  "image_url": "https://blob.vercel-storage.com/tickets/1234567890-image.jpg",
  "user_id": "user123",
  "company": "Nike",
  "status": "open",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### **Изображения в Blob:**
- **Путь:** `tickets/{timestamp}-{filename}`
- **Доступ:** Публичный
- **CDN:** Автоматический

## 🚀 **Деплой:**

После настройки всех переменных окружения:

```bash
git add .
git commit -m "Add Vercel Blob Storage integration"
git push origin main
```

Vercel автоматически пересоберет и задеплоит проект с новой функциональностью!

## 🔍 **Отладка:**

### **Проверка Blob Storage:**
```javascript
// В консоли браузера
fetch('/api/upload-image', {
  method: 'POST',
  body: formData
}).then(r => r.json()).then(console.log)
```

### **Проверка localStorage:**
```javascript
// В консоли браузера
console.log(JSON.parse(localStorage.getItem('tickefy_tickets') || '[]'))
```

## 📝 **Примечания:**

- **Бесплатный план:** 100MB Blob Storage
- **Платный план:** Неограниченное хранилище
- **CDN:** Автоматически включен для Blob Storage
- **localStorage:** Неограниченно (в рамках браузера)
- **Безопасность:** Данные тикетов хранятся локально в браузере

## 🎯 **Преимущества этой схемы:**

### **✅ Простота настройки:**
- Нужен только Blob Storage
- localStorage работает сразу
- Минимум конфигурации

### **✅ Надежность:**
- Изображения в CDN
- Тикеты в браузере
- Fallback система

### **✅ Производительность:**
- Быстрая загрузка изображений
- Мгновенный доступ к тикетам
- Нет сетевых запросов для тикетов 