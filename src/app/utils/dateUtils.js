// utils/dateUtils.ts
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDateVN = (
  value,
  fallback = 'Không có dữ liệu' // <-- chuỗi trả về khi time = null/undefined
) => {
  if (!value) return fallback;
  try {
    const date = typeof value === 'string' ? new Date(value) : value;
    return format(date, 'dd/MM/yyyy HH:mm:ss', { locale: vi });
  } catch {
    return fallback;
  }
};
