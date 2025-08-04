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

-- Создание индексов для оптимизации запросов
CREATE INDEX idx_tickets_company ON tickets(company);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);

-- Создание RLS (Row Level Security) политик
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Политика для чтения: пользователи могут читать тикеты своей компании
CREATE POLICY "Users can view tickets from their company" ON tickets
  FOR SELECT USING (company = (
    SELECT company FROM profiles WHERE id = auth.uid()
  ));

-- Политика для вставки: пользователи могут создавать тикеты для своей компании
CREATE POLICY "Users can create tickets for their company" ON tickets
  FOR INSERT WITH CHECK (
    company = (SELECT company FROM profiles WHERE id = auth.uid()) AND
    user_id = auth.uid()
  );

-- Политика для обновления: пользователи могут обновлять свои тикеты
CREATE POLICY "Users can update their own tickets" ON tickets
  FOR UPDATE USING (user_id = auth.uid());

-- Политика для удаления: пользователи могут удалять свои тикеты
CREATE POLICY "Users can delete their own tickets" ON tickets
  FOR DELETE USING (user_id = auth.uid());

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Создание bucket для хранения изображений тикетов
-- Примечание: этот bucket нужно создать вручную в Supabase Dashboard
-- Storage > Create bucket > Name: ticket-images > Public bucket: true 