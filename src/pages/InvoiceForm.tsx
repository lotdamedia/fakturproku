import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { generateInvoiceNumber, formatCurrency } from '../utils';
import { InvoiceItem } from '../types';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';

export default function InvoiceForm() {
  const navigate = useNavigate();
  const { customers, products, invoices, addInvoice } = useStore();

  const [customInvoiceNumber, setCustomInvoiceNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14); // 14 days default
    return d.toISOString().split('T')[0];
  });
  
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [taxRate, setTaxRate] = useState(11); // 11% PPN default in ID
  const [discountAmount, setDiscountAmount] = useState(0);
  const [notes, setNotes] = useState('');

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);

  const addItem = () => {
    if (!selectedProductId) return;
    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    const newItem: InvoiceItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      total: product.price * quantity,
    };

    setItems([...items, newItem]);
    setSelectedProductId('');
    setQuantity(1);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + taxAmount - discountAmount;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customerId || items.length === 0) {
      alert('Pilih pelanggan dan minimal cantumkan 1 item produk.');
      return;
    }

    const finalInvoiceNumber = customInvoiceNumber.trim() || generateInvoiceNumber(invoices.length);

    // Validate uniqueness of the invoice number
    const isDuplicate = invoices.some(
      (inv) => inv.invoiceNumber.toLowerCase() === finalInvoiceNumber.toLowerCase()
    );
    
    if (isDuplicate) {
      alert(`Nomor faktur "${finalInvoiceNumber}" sudah digunakan. Silakan gunakan nomor lain.`);
      return;
    }

    const newInvoice = {
      id: crypto.randomUUID(),
      invoiceNumber: finalInvoiceNumber,
      date,
      dueDate,
      customerId,
      items,
      subtotal,
      taxRate,
      taxAmount,
      discountAmount,
      total,
      notes,
    };

    addInvoice(newInvoice);
    navigate(`/invoices/${newInvoice.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Buat Faktur Baru</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-8">
        {/* Info Faktur */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pelanggan</label>
              <select
                required
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Pilih Pelanggan</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            {customerId && (
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                {(() => {
                  const c = customers.find(x => x.id === customerId);
                  return c ? (
                    <>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p>{c.email}</p>
                      <p>{c.phone}</p>
                      <p className="mt-1">{c.address}</p>
                    </>
                  ) : null;
                })()}
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Faktur</label>
              <input
                type="text"
                value={customInvoiceNumber}
                onChange={(e) => setCustomInvoiceNumber(e.target.value)}
                placeholder="Kosongkan untuk otomatis"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Faktur</label>
              <input
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jatuh Tempo</label>
              <input
                required
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Tambah Item Produk */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Item Produk/Layanan</h3>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">Pilih Produk</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">-- Pilih --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} - {formatCurrency(p.price)}</option>
                ))}
              </select>
            </div>
            <div className="w-24">
              <label className="block text-xs text-gray-500 mb-1">Kuantitas</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={addItem}
              disabled={!selectedProductId}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              <Plus size={18} /> Tambah
            </button>
          </div>

          {/* List Items */}
          <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 font-medium">Produk</th>
                  <th className="px-4 py-2 font-medium">Harga</th>
                  <th className="px-4 py-2 font-medium">Kuantitas</th>
                  <th className="px-4 py-2 font-medium text-right">Total</th>
                  <th className="px-4 py-2 font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      Belum ada item ditambahkan.
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="bg-white">
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{formatCurrency(item.price)}</td>
                      <td className="px-4 py-3">{item.quantity}</td>
                      <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.total)}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan & Total */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pt-6 border-t border-gray-100">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Catatan</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan untuk pelanggan..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>
          
          <div className="w-full sm:w-1/2 lg:w-1/3 space-y-3">
            <div className="flex justify-between items-center text-gray-600">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            
            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 flex-1 whitespace-nowrap">Pajak (%):</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={taxRate}
                onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                className="w-20 px-2 py-1 text-right border border-gray-300 rounded focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="flex justify-between items-center text-gray-600">
              <span>Nilai Pajak:</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>

            <div className="flex justify-between items-center gap-4">
              <span className="text-gray-600 flex-1">Diskon (Rp):</span>
              <input
                type="number"
                min="0"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                className="w-32 px-2 py-1 text-right border border-gray-300 rounded focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div className="pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center font-bold text-gray-900 text-lg">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Simpan & Preview Faktur
          </button>
        </div>
      </form>
    </div>
  );
}
