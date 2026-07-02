import { useState } from 'react';
import { useStore } from '../store';
import { formatCurrency } from '../utils';
import { Plus, Eye, Trash2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Modal } from '../components/Modal';

export default function Invoices() {
  const { invoices, customers, deleteInvoice } = useStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      deleteInvoice(deleteId);
      setDeleteId(null);
    }
  };

  const handleExportCSV = () => {
    if (invoices.length === 0) {
      alert('Tidak ada data faktur untuk diekspor.');
      return;
    }

    const headers = ['ID', 'No Faktur', 'ID Pelanggan', 'Nama Pelanggan', 'Tanggal', 'Jatuh Tempo', 'Subtotal', 'Pajak (%)', 'Nominal Pajak', 'Diskon', 'Total', 'Catatan'];
    
    const csvRows = invoices.map(inv => {
      const customer = customers.find(c => c.id === inv.customerId);
      const row = [
        inv.id,
        inv.invoiceNumber,
        inv.customerId,
        customer ? `"${customer.name}"` : 'Unknown',
        inv.date,
        inv.dueDate,
        inv.subtotal,
        inv.taxRate,
        inv.taxAmount,
        inv.discountAmount,
        inv.total,
        `"${(inv.notes || '').replace(/"/g, '""')}"`
      ];
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Eksport_Faktur_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Faktur</h1>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
          >
            <Download size={18} />
            Eksport CSV
          </button>
          <Link
            to="/invoices/new"
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={18} />
            Buat Faktur Baru
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-6 py-3 font-medium">No. Faktur</th>
                <th className="px-6 py-3 font-medium">Pelanggan</th>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Jatuh Tempo</th>
                <th className="px-6 py-3 font-medium">Total</th>
                <th className="px-6 py-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Belum ada data faktur.
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => {
                  const customer = customers.find(c => c.id === invoice.customerId);
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {invoice.invoiceNumber}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{customer?.name || 'Unknown'}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(invoice.date).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 text-gray-600">{new Date(invoice.dueDate).toLocaleDateString('id-ID')}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{formatCurrency(invoice.total)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-3">
                          <Link
                            to={`/invoices/${invoice.id}`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(invoice.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Hapus Faktur"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Apakah Anda yakin ingin menghapus faktur ini? Data yang dihapus tidak dapat dikembalikan.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setDeleteId(null)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
