export interface PaymentMethod {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}

export interface CompanySettings {
  companyName: string;
  companyLogo: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  paymentMethods: PaymentMethod[];
  googleAppsScriptUrl?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  notes: string;
}
