# Tickefy

Современная платформа для управления задачами и проектами, построенная на React + Vite.

## Технологии

- **React 18** с TypeScript
- **Vite** для быстрой разработки
- **TailwindCSS** для стилизации
- **Shadcn/ui** для компонентов
- **React Router DOM** для навигации
- **Supabase** для бэкенда и авторизации

## Установка

1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте проект в Supabase:
   - Перейдите на [supabase.com](https://supabase.com)
   - Создайте новый проект
   - Получите URL и anon key из настроек

4. Настройте базу данных в Supabase:
   - Откройте SQL Editor в вашем проекте
   - Выполните SQL скрипт для создания таблицы profiles (см. раздел "Настройка базы данных")
   - Выполните SQL скрипт для создания таблицы tickets (см. раздел "Настройка тикетов")

5. Создайте Storage bucket для изображений:
   - В Supabase Dashboard перейдите в Storage
   - Создайте bucket с именем `ticket-images`
   - Установите Public bucket: true

6. Создайте файл `.env` в корне проекта:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   ```

7. Запустите проект:
   ```bash
   npm run dev
   ```

## Настройка базы данных

Выполните следующий SQL запрос в Supabase SQL Editor:

```sql
-- Создание таблицы profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание RLS (Row Level Security) политик
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Политика для чтения: пользователи могут читать только свой профиль
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Политика для вставки: пользователи могут создавать только свой профиль
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Политика для обновления: пользователи могут обновлять только свой профиль
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Функция для автоматического создания профиля при регистрации
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'company', COALESCE(NEW.raw_user_meta_data->>'role', 'user'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Триггер для автоматического создания профиля
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Настройка тикетов

Выполните SQL скрипт из файла `scripts/setup-tickets-table.sql` в Supabase SQL Editor:

```sql
-- Создание таблицы tickets
CREATE TABLE tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'closed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assigned_to TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов и политик безопасности
-- (полный скрипт в файле scripts/setup-tickets-table.sql)
```

## Создание тестовых пользователей

### Вариант 1: Через Supabase Dashboard
1. Откройте Authentication > Users в Supabase Dashboard
2. Нажмите "Add User"
3. Создайте пользователей:
   - **user1@examplemail.com** / **user123** (компания: Nike, роль: user)
   - **user2@examplemail.com** / **user213** (компания: Adidas, роль: user)
   - **admin@tickefy.com** / **admin123** (компания: Tickefy, роль: admin)

### Вариант 2: Через скрипт
1. Получите Service Role Key в настройках проекта Supabase
2. Обновите `scripts/create-user1.js` с вашими данными
3. Запустите скрипт:
   ```bash
   node scripts/create-user1.js
   ```

## Маршрутизация

Приложение использует React Router с следующей структурой маршрутов:

- **"/"** → Автоматический редирект:
  - Если пользователь авторизован → `/dashboard`
  - Если не авторизован → `/login`
- **/login** — Страница входа/регистрации
- **/dashboard** — Панель управления пользователя (требует авторизации)
- **/create-ticket** — Создание нового тикета (требует авторизации)
- **/admin** — Админ панель (требует роль admin)
- **/test** — Тестовая страница

### Защита маршрутов

- **ProtectedRoute** — защищает маршруты для авторизованных пользователей
- **AdminRoute** — защищает админ маршруты (только для пользователей с ролью admin)

## Функциональность

### Авторизация
- ✅ Регистрация с email/password и информацией о компании
- ✅ Вход в систему
- ✅ Выход из системы
- ✅ Защищенные маршруты
- ✅ Отображение имени пользователя и компании в Header
- ✅ Автоматический редирект после входа
- ✅ Сохранение профиля в таблице profiles
- ✅ Система ролей (user/admin)

### Тикеты
- ✅ Создание тикетов с заголовком, описанием и изображением
- ✅ Загрузка изображений в Supabase Storage
- ✅ Отображение тикетов по компании пользователя
- ✅ Статистика по статусам и приоритетам
- ✅ Красивые карточки тикетов с изображениями
- ✅ Состояние "Нет тикетов" с кнопкой создания

### Админ панель
- ✅ Доступ только для пользователей с ролью admin
- ✅ Статистика по пользователям, тикетам и компаниям
- ✅ Управление пользователями и тикетами
- ✅ Информация о системе

### Страницы
- **/** - Главная страница с редиректом
- **/login** - Страница входа/регистрации
- **/dashboard** - Панель управления с тикетами
- **/create-ticket** - Создание нового тикета
- **/admin** - Админ панель (только для админов)

## Структура проекта

```
src/
├── components/     # React компоненты
│   ├── ui/        # UI компоненты (shadcn/ui)
│   ├── Header.tsx # Компонент заголовка
│   ├── TicketCard.tsx # Карточка тикета
│   ├── CreateTicketForm.tsx # Форма создания тикета
│   ├── ProtectedRoute.tsx # Защита маршрутов
│   ├── AdminRoute.tsx # Защита админ маршрутов
│   └── HomeRedirect.tsx # Редирект с главной страницы
├── contexts/      # React контексты
│   └── AuthContext.tsx # Контекст авторизации
├── layouts/       # Layout компоненты
├── pages/         # Страницы приложения
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── CreateTicket.tsx
│   └── Admin.tsx
├── lib/           # Утилиты и конфигурация
│   ├── supabase.ts # Конфигурация Supabase
│   ├── auth.ts    # Функции авторизации
│   ├── mockTickets.ts # Мок-данные тикетов
│   └── utils.ts   # Общие утилиты
└── assets/        # Статические ресурсы
```

## Скрипты

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка для продакшена
- `npm run preview` - Предварительный просмотр сборки
- `npm run lint` - Проверка кода

## Тестовые аккаунты

Для тестирования доступны следующие аккаунты:

### Обычные пользователи:
- **user1@examplemail.com** / **user123** (Nike)
- **user2@examplemail.com** / **user213** (Adidas)

### Администратор:
- **admin@tickefy.com** / **admin123** (Tickefy)

## Особенности

- ✅ Современный UI с TailwindCSS
- ✅ Готовые компоненты shadcn/ui
- ✅ Настроенная маршрутизация с редиректами
- ✅ Полная интеграция с Supabase Auth
- ✅ Таблица profiles для хранения дополнительной информации
- ✅ Таблица tickets для управления тикетами
- ✅ Supabase Storage для загрузки изображений
- ✅ TypeScript для типобезопасности
- ✅ Адаптивный дизайн
- ✅ Защищенные маршруты с проверкой ролей
- ✅ Контекст для управления состоянием авторизации
- ✅ Поддержка информации о компании пользователя
- ✅ Система создания и отображения тикетов
- ✅ Админ панель с расширенными возможностями 