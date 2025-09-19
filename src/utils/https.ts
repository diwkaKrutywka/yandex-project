import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import baseUrl from '../config/index'

// Создаем экземпляр axios с базовой конфигурацией
const http: AxiosInstance = axios.create({
  baseURL: baseUrl.baseURL,
  timeout: 10000, // 10 секунд таймаут
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'sk_Y2x8vAhgGKmU4rpqWdQ9TbLxZz1OcRDNtUasEHJZr4uoPaPk',
  },
})

// Интерцептор для запросов
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Убеждаемся, что API ключ всегда присутствует
    config.headers['api-key'] = 'sk_Y2x8vAhgGKmU4rpqWdQ9TbLxZz1OcRDNtUasEHJZr4uoPaPk'
    
    console.log('🚀 Отправляем запрос:', config.method?.toUpperCase(), config.url)
    console.log('🔑 С API ключом:', config.headers['api-key'] ? 'Да' : 'Нет')
    return config
  },
  (error: any) => {
    console.error('❌ Ошибка в запросе:', error)
    return Promise.reject(error)
  }
)

// Интерцептор для ответов
http.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('✅ Получен ответ:', response.status, response.config.url)
    return response
  },
  (error: any) => {
    console.error('❌ Ошибка в ответе:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default http
