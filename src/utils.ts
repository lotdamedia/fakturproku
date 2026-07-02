export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const generateInvoiceNumber = (invoicesCount: number) => {
  const prefix = 'INV';
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  return `${prefix}-${year}${month}-${String(invoicesCount + 1).padStart(4, '0')}`;
};
