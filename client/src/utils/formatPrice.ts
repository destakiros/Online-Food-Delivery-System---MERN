
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0
  }).format(price).replace('ETB', 'ETB ');
};
