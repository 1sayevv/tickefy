// Простое шифрование паролей (для демонстрации)
// В реальном проекте используйте bcrypt или аналогичные библиотеки

const ENCRYPTION_KEY = 'tickefy-secure-key-2024'

export const encryptPassword = (password: string): string => {
  // Простое шифрование для демонстрации
  // В реальном проекте используйте bcrypt.hash()
  return btoa(password + ENCRYPTION_KEY)
}

export const decryptPassword = (encryptedPassword: string): string => {
  // Простое расшифрование для демонстрации
  // В реальном проекте пароли не расшифровываются
  try {
    const decoded = atob(encryptedPassword)
    return decoded.replace(ENCRYPTION_KEY, '')
  } catch {
    return encryptedPassword // Возвращаем как есть, если не удалось расшифровать
  }
}

export const hashPassword = (password: string): string => {
  // В реальном проекте используйте bcrypt.hash(password, 10)
  return encryptPassword(password)
}

export const verifyPassword = (password: string, hashedPassword: string): boolean => {
  // В реальном проекте используйте bcrypt.compare(password, hashedPassword)
  return password === decryptPassword(hashedPassword)
} 