import type { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import http from '../utils/https'

export function ScheduleApi<T = any>(
    url: string,
    data?: Record<string, any>,
    method: Method = 'POST'
  ): Promise<AxiosResponse<T>> {
    console.log('🔧 ScheduleApi вызван:', { url, data, method });
    
    const config: AxiosRequestConfig = {
      url: `doctors${url}`,
      method,
    }
  
    if (['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      config.data = data
    } else if (method.toUpperCase() === 'GET') {
      config.params = data
    }
    
    console.log('🔧 ScheduleApi config:', config);
  
    return http(config)
  }

// Типы для врачей
export interface Doctor {
  id: string;
  full_name: string;
  specialty: string;
  cabinet: string;
  schedule_string: string;
  type?: 'oms' | 'paid';
}

export interface DoctorsResponse {
  doctors: Doctor[];
  specialityName?: string;
  total?: number;
}