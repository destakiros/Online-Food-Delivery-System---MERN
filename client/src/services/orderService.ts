
import api from './api';

export const createOrder = async (orderData: any) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const updateStatus = async (id: string, status: string) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const getAiLogisticsReport = async () => {
  const response = await api.post('/orders/report');
  return response.data;
};

const orderService = { createOrder, updateStatus, getAiLogisticsReport };
export default orderService;
