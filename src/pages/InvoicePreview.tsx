import { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { formatCurrency } from '../utils';
import { ArrowLeft, Download, Building2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export default function InvoicePreview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { invoices, customers, settings } = useStore();
  const [isDownloading, setIsDownloading] = useState(false);
  
  const componentRef = useRef<HTMLDivElement>(null);
  
  const handleDownloadPdf = async () => {
    if (!componentRef.current) return;
    try {
      setIsDownloading(true);
      const element = componentRef.current;
      
      const dataUrl = await toPng(element, { 
        quality: 1, 
        pixelRatio: 2,
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfProps = pdf.getImageProperties(dataUrl);
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (pdfProps.height * pdfWidth) / pdfProps.width;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Faktur_${invoice?.invoiceNumber || id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Gagal membuat PDF. Coba ulangi lagi.');
    } finally {
      setIsDownloading(false);
    }
  };

  const invoice = invoices.find(i => i.id === id);
  const customer = customers.find(c => c.id === invoice?.customerId);

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Faktur Tidak Ditemukan</h2>
        <button onClick={() => navigate('/invoices')} className="mt-4 text-blue-600 hover:underline">
          Kembali ke Daftar Faktur
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/invoices')} className="p-2 text-gray-500 hover:text-gray-700 bg-white rounded-full shadow-sm">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Preview Faktur</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-75 disabled:cursor-wait transition-colors font-medium shadow-sm"
          >
            <Download size={18} />
            {isDownloading ? 'Memproses PDF...' : 'Unduh PDF'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Printable Area starts here */}
        <div ref={componentRef} className="p-10 sm:p-14 bg-white text-gray-900">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-gray-100 pb-10 mb-10">
            <div className="flex items-center gap-4">
              {settings.companyLogo ? (
                <img src={settings.companyLogo} alt="Logo Perusahaan" className="h-16 w-auto object-contain" />
              ) : (
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Building2 size={32} />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{settings.companyName || 'Perusahaan Saya'}</h1>
                <p className="text-sm text-gray-500 mt-1 whitespace-pre-wrap leading-relaxed">{settings.companyAddress}</p>
                <div className="text-sm text-gray-500 mt-1 flex gap-4">
                  {settings.companyPhone && <span>Tel: {settings.companyPhone}</span>}
                  {settings.companyEmail && <span>Email: {settings.companyEmail}</span>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-black text-gray-100 uppercase tracking-widest mb-2 relative">
                <span className="absolute -top-1 right-0 text-gray-800 text-3xl">INVOICE</span>
                INVOICE
              </h2>
              <div className="mt-8 space-y-2">
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-gray-500 font-medium">No. Faktur:</span>
                  <span className="font-semibold text-gray-900">{invoice.invoiceNumber}</span>
                </div>
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-gray-500 font-medium">Tgl. Terbit:</span>
                  <span className="font-semibold text-gray-900">{new Date(invoice.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex justify-end gap-6 text-sm">
                  <span className="text-gray-500 font-medium">Jatuh Tempo:</span>
                  <span className="font-semibold text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Subheader: Billed To */}
          <div className="mb-10">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Tagihan Kepada:</h3>
            <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 max-w-sm">
              <p className="font-bold text-lg text-gray-900">{customer?.name}</p>
              {customer?.email && <p className="text-gray-600 mt-1">{customer.email}</p>}
              {customer?.phone && <p className="text-gray-600">{customer.phone}</p>}
              {customer?.address && <p className="text-gray-600 mt-2 text-sm leading-relaxed">{customer.address}</p>}
            </div>
          </div>

          {/* Table */}
          <div className="mb-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-900">Deskripsi Layanan / Produk</th>
                  <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-900 text-right">Harga Satuan</th>
                  <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-900 text-center w-24">Kuantitas</th>
                  <th className="py-3 px-2 font-bold text-sm uppercase tracking-wider text-gray-900 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-4 px-2 font-medium text-gray-800">{item.name}</td>
                    <td className="py-4 px-2 text-right text-gray-600">{formatCurrency(item.price)}</td>
                    <td className="py-4 px-2 text-center text-gray-600">{item.quantity}</td>
                    <td className="py-4 px-2 text-right font-medium text-gray-800">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Totals */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-10">
            <div className="w-full md:w-1/2">
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Catatan / Instruksi Pembayaran:</h4>
              <p className="text-gray-600 text-sm whitespace-pre-wrap bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[100px]">
                {invoice.notes || 'Terima kasih atas kerja samanya.'}
              </p>

              {settings.paymentMethods && settings.paymentMethods.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pilihan Pembayaran:</h4>
                  <div className="space-y-3">
                    {settings.paymentMethods.map(pm => (
                      <div key={pm.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100 flex flex-col items-start gap-1">
                        <span className="font-bold text-gray-900 leading-none">{pm.bankName}</span>
                        <span className="text-gray-800 text-lg tracking-wider font-mono my-1 leading-none">{pm.accountNumber}</span>
                        <span className="text-gray-500 text-sm leading-none">a.n. {pm.accountName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="w-full md:w-80">
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between text-gray-600 px-2">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">{formatCurrency(invoice.subtotal)}</span>
                </div>
                {invoice.taxRate > 0 && (
                  <div className="flex justify-between text-gray-600 px-2">
                    <span>Pajak ({invoice.taxRate}%)</span>
                    <span className="font-medium text-gray-900">{formatCurrency(invoice.taxAmount)}</span>
                  </div>
                )}
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between text-gray-600 px-2">
                    <span>Diskon</span>
                    <span className="font-medium text-red-600">-{formatCurrency(invoice.discountAmount)}</span>
                  </div>
                )}
              </div>
              <div className="bg-gray-900 text-white p-4 rounded-xl flex justify-between font-bold text-lg items-center">
                <span>Total Tagihan</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-gray-100 text-center text-gray-400 text-xs">
            <p className="mb-1">Dokumen ini diterbitkan oleh {settings.companyName || 'Perusahaan Saya'} dan merupakan dokumen penagihan yang sah.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
