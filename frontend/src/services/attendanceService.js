import api from './api'; // ton axios configuré

// Pointer l'arrivée
export const clockIn = async () => {
  const res = await api.post('/attendance/clock-in');
  return res.data;
};

// Pointer la sortie
export const clockOut = async () => {
  const res = await api.post('/attendance/clock-out');
  return res.data;
};

// Mes pointages
export const getMyAttendance = async (month) => {
  const res = await api.get('/attendance/me', { params: { month } });
  return res.data;
};

// Résumé du jour (admin/chef)
export const getTodaySummary = async () => {
  const res = await api.get('/attendance/today-summary');
  return res.data;
};
