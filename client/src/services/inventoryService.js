
import api from './api';

/**
 * INVENTORY LOGISTICS SERVICE
 * Abstraction layer for procurement data.
 */

export const fetchInventoryItems = async () => {
  const { data } = await api.get('/inventory');
  return data;
};

export const getAIForecast = async () => {
  const { data } = await api.get('/inventory/forecast');
  return data.forecast;
};

export const adjustStockLevel = async (id, qtyChange) => {
  const { data } = await api.patch(`/inventory/${id}/adjust`, { qtyChange });
  return data;
};

/**
 * Business Rule: Identify items requiring immediate procurement
 */
export const getCriticalStock = (items) => {
  return items.filter(item => item.currentStock <= item.minimumThreshold);
};

/**
 * Formats lead time strings
 */
export const formatLeadTime = (days) => `${days} Day Cycle`;
