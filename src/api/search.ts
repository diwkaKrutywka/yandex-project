import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'

export function SearchApi<T = any>(
    url: string,
    data?: Record<string, any>,
    method: Method = 'GET'
  ): Promise<AxiosResponse<T>> {
    const config: AxiosRequestConfig = {
      url: `terminal-search${url}`,
      method,
    }
  
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data
    } else if (method.toUpperCase() === 'GET') {
      config.params = data
    }
  
    return http(config)
  }

// Типы для поиска
export interface SearchDoctor {
  doctor_id: number;
  full_name: string;
  specialty: string;
  specialty_id: number;
  clinic_id: number;
  clinic_name: string;
  experience_years: number;
  rating: number;
  cabinet: string;
  education: string;
  certificates: string;
  schedule_string?: string;
}

export interface SearchResponse {
  doctors: SearchDoctor[];
  total: number;
  search_query: string;
}

// Функция поиска врачей
export async function searchDoctors(query: string, clinicId?: number): Promise<SearchDoctor[]> {
  try {
    const params: Record<string, any> = { q: query };
    
    if (clinicId) {
      params.clinic_id = clinicId;
    } else {
      params.clinic_id = '3';
    }
    
    console.log('🔍 Поиск врачей с параметрами:', params);
    const response = await SearchApi<SearchResponse>('', params, 'GET');
    console.log('📊 Ответ API поиска:', response);
    
    // API возвращает объект с полем doctors, извлекаем массив
    const doctors = response.data?.doctors || [];
    console.log('👥 Найдено врачей:', doctors.length);
    return doctors;
  } catch (error) {
    console.error('❌ Ошибка поиска врачей:', error);
    throw error;
  }
}
