// Скрипт для создания тестовых пользователей
// Запуск: node scripts/create-test-users.js

const { createClient } = require('@supabase/supabase-js')

// Замените на ваши данные из Supabase
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_SERVICE_ROLE_KEY = 'YOUR_SERVICE_ROLE_KEY'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const testUsers = [
  {
    email: 'user1@examplemail.com',
    password: 'user123',
    full_name: 'User One',
    company: 'Nike'
  },
  {
    email: 'user2@examplemail.com',
    password: 'user213',
    full_name: 'User Two',
    company: 'Adidas'
  }
]

async function createTestUsers() {
  console.log('Создание тестовых пользователей...')
  
  for (const userData of testUsers) {
    try {
      console.log(`\nСоздание пользователя: ${userData.email}`)
      
      // Создаем пользователя
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: {
          full_name: userData.full_name,
          company: userData.company
        }
      })

      if (authError) {
        console.error(`Ошибка создания пользователя ${userData.email}:`, authError.message)
        continue
      }

      console.log(`✅ Пользователь ${userData.email} создан успешно`)
      console.log(`   ID: ${authData.user.id}`)
      console.log(`   Имя: ${userData.full_name}`)
      console.log(`   Компания: ${userData.company}`)

      // Обновляем профиль в таблице profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          email: userData.email,
          full_name: userData.full_name,
          company: userData.company
        })

      if (profileError) {
        console.error(`Ошибка обновления профиля для ${userData.email}:`, profileError.message)
      } else {
        console.log(`✅ Профиль для ${userData.email} обновлен`)
      }

    } catch (error) {
      console.error(`Ошибка при создании пользователя ${userData.email}:`, error.message)
    }
  }

  console.log('\n🎉 Создание тестовых пользователей завершено!')
  console.log('\nТестовые аккаунты:')
  console.log('1. user1@examplemail.com / user123 (Nike)')
  console.log('2. user2@examplemail.com / user213 (Adidas)')
}

// Запуск скрипта
createTestUsers().catch(console.error) 