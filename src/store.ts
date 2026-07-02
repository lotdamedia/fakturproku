import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Customer, Product, Invoice, CompanySettings } from './types';
import { syncToGoogleSheets } from './services/googleSheets';

interface AppState {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
  settings: CompanySettings;
  updateSettings: (settings: CompanySettings) => void;
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  addCustomer: (customer: Customer) => void;
  updateCustomer: (customer: Customer) => void;
  deleteCustomer: (id: string) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  addInvoice: (invoice: Invoice) => void;
  updateInvoice: (invoice: Invoice) => void;
  deleteInvoice: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      settings: {
        companyName: 'Perusahaan Saya',
        companyLogo: '',
        companyAddress: 'Jl. Contoh Alamat No. 123\nKota, Negara 12345',
        companyPhone: '08123456789',
        companyEmail: 'kontak@perusahaan.com',
        paymentMethods: [],
        googleAppsScriptUrl: '',
      },
      updateSettings: (settings) => set({ settings }),
      customers: [],
      products: [],
      invoices: [],
      addCustomer: (customer) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Customers', { action: 'ADD', ...customer });
          }
          return { customers: [...state.customers, customer] };
        }),
      updateCustomer: (customer) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Customers', { action: 'UPDATE', ...customer });
          }
          return {
            customers: state.customers.map((c) =>
              c.id === customer.id ? customer : c
            ),
          };
        }),
      deleteCustomer: (id) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Customers', { action: 'DELETE', id });
          }
          return {
            customers: state.customers.filter((c) => c.id !== id),
          };
        }),
      addProduct: (product) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Products', { action: 'ADD', ...product });
          }
          return { products: [...state.products, product] };
        }),
      updateProduct: (product) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Products', { action: 'UPDATE', ...product });
          }
          return {
            products: state.products.map((p) =>
              p.id === product.id ? product : p
            ),
          };
        }),
      deleteProduct: (id) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Products', { action: 'DELETE', id });
          }
          return {
            products: state.products.filter((p) => p.id !== id),
          };
        }),
      addInvoice: (invoice) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Invoices', { action: 'ADD', ...invoice });
          }
          return { invoices: [...state.invoices, invoice] };
        }),
      updateInvoice: (invoice) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Invoices', { action: 'UPDATE', ...invoice });
          }
          return {
            invoices: state.invoices.map((i) =>
              i.id === invoice.id ? invoice : i
            ),
          };
        }),
      deleteInvoice: (id) =>
        set((state) => {
          if (state.settings.googleAppsScriptUrl) {
            syncToGoogleSheets(state.settings.googleAppsScriptUrl, 'Invoices', { action: 'DELETE', id });
          }
          return {
            invoices: state.invoices.filter((i) => i.id !== id),
          };
        }),
    }),
    {
      name: 'faktur-pro-storage',
    }
  )
);
