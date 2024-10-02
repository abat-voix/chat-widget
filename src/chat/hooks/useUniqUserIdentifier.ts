import { useEffect, useState } from 'react'

// Функция для генерации уникального идентификатора
const generateUniqueIdentifier = () => {
  const { userAgent } = navigator
  const timestamp = Date.now().toString()
  const rawId = userAgent + timestamp
  return btoa(rawId) // кодирование в base64
}

// хук для работы с уникальным идентификатором сессии
const useSessionId = () => {
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    const existingSessionId = localStorage.getItem('GENERATE_USER_ID')
    if (existingSessionId) {
      setSessionId(existingSessionId)
    } else {
      const newSessionId = generateUniqueIdentifier()
      localStorage.setItem('GENERATE_USER_ID', newSessionId)
      setSessionId(newSessionId)
    }
  }, [])

  return sessionId
}

export default useSessionId
