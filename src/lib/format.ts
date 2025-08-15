export const formatINR = (value: number | string | null | undefined) => {
  const num = typeof value === 'string' ? Number(value) : value;
  if (num == null || isNaN(num as number)) return '₹0';
  
  // All prices are already in rupees across the app and DB
  const amount = num as number;
  
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toFixed(2)}`;
  }
};
