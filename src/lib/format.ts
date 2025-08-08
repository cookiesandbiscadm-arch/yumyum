export const formatINR = (value: number | string | null | undefined) => {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num == null || isNaN(num as number)) return '₹0';
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(num as number);
  } catch {
    return `₹${Number(num).toFixed(2)}`;
  }
};
