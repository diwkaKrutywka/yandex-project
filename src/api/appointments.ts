import http from '../utils/https';

export interface CreateAppointmentRequest {
  date: string;
  doctor_id: number;
  patient_code: number;
  time: string;
}

export interface AppointmentResponse {
  id: number;
  date: string;
  time: string;
  doctor_id: number;
  patient_code: number;
  status: string;
  created_at: string;
}

export const createAppointment = async (appointmentData: CreateAppointmentRequest): Promise<AppointmentResponse> => {
  try {
    console.log('🔍 API: createAppointment вызван с данными:', appointmentData);
    console.log('🔍 API: отправляем POST запрос на /appointments');
    const response = await http.post('/appointments', appointmentData);
    console.log('🔍 API: получен ответ:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ API: ошибка при создании записи:', error);
    throw error;
  }
};
