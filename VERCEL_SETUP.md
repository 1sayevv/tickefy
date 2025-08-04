# 🚀 Настройка Vercel Storage для Tickefy

## 📋 **Что нужно настроить:**

### **1. Vercel Blob Storage (для изображений)**
```bash
# В терминале Vercel CLI
vercel env add BLOB_READ_WRITE_TOKEN
```

### **2. Vercel KV (для тикетов)**
```bash
# В терминале Vercel CLI
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
vercel env add KV_REST_API_READ_ONLY_TOKEN
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

### **Шаг 4: Создайте KV Database**
1. В Vercel Dashboard перейдите в **Storage** → **KV**
2. Создайте новую KV Database
3. Скопируйте все токены и URL
4. Добавьте их в переменные окружения

### **Шаг 5: Добавьте переменные окружения**
```bash
# Blob Storage
vercel env add BLOB_READ_WRITE_TOKEN

# KV Database
vercel env add KV_URL
vercel env add KV_REST_API_URL
vercel env add KV_REST_API_TOKEN
vercel env add KV_REST_API_READ_ONLY_TOKEN
```

## 🎯 **Преимущества Vercel Storage:**

### **✅ Blob Storage:**
- **CDN** - быстрая доставка изображений
- **Автоматическое масштабирование**
- **Глобальное распространение**
- **Простая интеграция**

### **✅ KV Database:**
- **In-memory хранилище** - очень быстрый доступ
- **Автоматическое резервное копирование**
- **Redis совместимость**
- **Простой API**

## 🔄 **Fallback система:**

Если Vercel Storage недоступен, система автоматически переключается на:
1. **Supabase** (если настроен)
2. **Локальное хранилище** (mock данные)

## 📊 **Структура данных:**

### **Тикеты в KV:**
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
git commit -m "Add Vercel Storage integration"
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

### **Проверка KV:**
```javascript
// В консоли браузера
fetch('/api/tickets').then(r => r.json()).then(console.log)
```

## 📝 **Примечания:**

- **Бесплатный план:** 100MB Blob Storage, 100MB KV
- **Платный план:** Неограниченное хранилище
- **CDN:** Автоматически включен для Blob Storage
- **Backup:** Автоматический для KV Database 