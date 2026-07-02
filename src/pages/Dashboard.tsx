import { useStore } from '../store';
import { formatCurrency } from '../utils';
import { FileText, Users, Package, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { customers, products, invoices } = useStore();

  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const recentInvoices = invoices.slice(-5).reverse();

  const stats = [
    { label: 'Total Pendapatan', value: formatCurrency(totalRevenue), icon: CreditCard, color: 'bg-green-500' },
    { label: 'Total Faktur', value: invoices.length, icon: FileText, color: 'bg-blue-500' },
    { label: 'Total Pelanggan', value: customers.length, icon: Users, color: 'bg-purple-500' },
    { label: 'Total Produk', value: products.length, icon: Package, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`${stat.color} p-3 rounded-lg text-white`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Faktur Terbaru</h2>
          <Link to="/invoices" className="text-sm font-medium text-blue-600 hover:text-blue-700">
            Lihat Semua
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">No. Faktur</th>
                <th className="px-6 py-3 font-medium">Pelanggan</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentInvoices.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada faktur.
                  </td>
                </tr>
              ) : (
                recentInvoices.map((invoice) => {
                  const customer = customers.find(c => c.id === invoice.customerId);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        <Link to={`/invoices/${invoice.id}`} className="hover:text-blue-600">
                          {invoice.invoiceNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{customer?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(invoice.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(invoice.total)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
