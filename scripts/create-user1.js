// Скрипт для создания пользователя user1
// Запуск: node scripts/create-user1.js

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

async function createUser1() {
  console.log('Создание пользователя user1...')
  
  try {
    // Создаем пользователя
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'user1@examplemail.com',
      password: 'user123',
      email_confirm: true,
      user_metadata: {
        full_name: 'User One',
        company: 'Nike'
      }
    })

    if (authError) {
      console.error('Ошибка создания пользователя:', authError.message)
      return
    }

    console.log('✅ Пользователь user1@examplemail.com создан успешно')
    console.log(`   ID: ${authData.user.id}`)
    console.log(`   Имя: User One`)
    console.log(`   Компания: Nike`)

    // Обновляем профиль в таблице profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email: 'user1@examplemail.com',
        full_name: 'User One',
        company: 'Nike'
      })

    if (profileError) {
      console.error('Ошибка обновления профиля:', profileError.message)
    } else {
      console.log('✅ Профиль для user1 обновлен')
    }

    console.log('\n🎉 Пользователь user1 создан!')
    console.log('Теперь вы можете войти с:')
    console.log('Email: user1@examplemail.com')
    console.log('Password: user123')

  } catch (error) {
    console.error('Ошибка:', error.message)
  }
}

// Запуск скрипта
createUser1().catch(console.error) 