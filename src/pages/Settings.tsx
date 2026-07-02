import { useState, ChangeEvent, FormEvent } from 'react';
import { useStore } from '../store';
import { Settings as SettingsIcon, Upload, Trash2, Plus, FileSpreadsheet } from 'lucide-react';
import { PaymentMethod } from '../types';

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const [formData, setFormData] = useState({
    ...settings,
    paymentMethods: settings.paymentMethods || [],
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) { // 1MB limit for localStorage
      alert('Ukuran gambar terlalu besar. Maksimal 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, companyLogo: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, companyLogo: '' }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const addPaymentMethod = () => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: [
        ...prev.paymentMethods,
        { id: crypto.randomUUID(), bankName: '', accountName: '', accountNumber: '' }
      ]
    }));
  };

  const updatePaymentMethod = (id: string, field: keyof PaymentMethod, value: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.map(pm => 
        pm.id === id ? { ...pm, [field]: value } : pm
      )
    }));
  };

  const removePaymentMethod = (id: string) => {
    setFormData(prev => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter(pm => pm.id !== id)
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <SettingsIcon size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Pengaturan Perusahaan</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-8">
            <div className="sm:w-1/3 flex flex-col items-center sm:items-start gap-4">
              <label className="block text-sm font-medium text-gray-700">Logo Perusahaan</label>
              
              <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 overflow-hidden relative group">
                {formData.companyLogo ? (
                  <>
                    <img
                      src={formData.companyLogo}
                      alt="Logo"
                      className="w-full h-full object-contain p-2"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-xs text-gray-500">Klik untuk upload</span>
                  </div>
                )}
                {!formData.companyLogo && (
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/svg+xml"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                )}
              </div>
              <p className="text-xs text-gray-500 text-center sm:text-left">
                Gunakan gambar persegi (PNG/JPG).<br/>Maksimal ukuran 1MB.
              </p>
            </div>

            <div className="sm:w-2/3 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
                <input
                  required
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="PT Bina Maju Bersama"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.companyPhone}
                    onChange={(e) => setFormData({ ...formData, companyPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="0812-3456-7890"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Perusahaan</label>
                  <input
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => setFormData({ ...formData, companyEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="info@perusahaan.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={4}
                  value={formData.companyAddress}
                  onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Jl. Sudirman Kav. 123&#10;Jakarta Pusat, DKI Jakarta 10220"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Metode Pembayaran / Rekening</h3>
                <p className="text-sm text-gray-500">Rekening ini akan ditampilkan pada bagian bawah faktur Anda.</p>
              </div>
              <button
                type="button"
                onClick={addPaymentMethod}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
              >
                <Plus size={16} />
                Tambah Rekening
              </button>
            </div>

            <div className="space-y-4">
              {formData.paymentMethods.length === 0 ? (
                <div className="text-center p-6 border-2 border-dashed border-gray-200 rounded-xl text-gray-500">
                  Belum ada metode pembayaran. Klik "Tambah Rekening" untuk menambahkan.
                </div>
              ) : (
                formData.paymentMethods.map((pm, index) => (
                  <div key={pm.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 rounded-xl bg-gray-50 relative">
                    <div className="absolute top-4 right-4 sm:static sm:mt-8">
                      <button
                        type="button"
                        onClick={() => removePaymentMethod(pm.id)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank / Metode Dompet Digital <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        value={pm.bankName}
                        onChange={(e) => updatePaymentMethod(pm.id, 'bankName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="BCA / Mandiri / GoPay"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        value={pm.accountNumber}
                        onChange={(e) => updatePaymentMethod(pm.id, 'accountNumber', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="1234567890"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Atas Nama (Pemilik) <span className="text-red-500">*</span></label>
                      <input
                        required
                        type="text"
                        value={pm.accountName}
                        onChange={(e) => updatePaymentMethod(pm.id, 'accountName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="PT Bina Maju Bersama"
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-green-600" />
              Integrasi Google Sheets
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Masukkan URL Web App Google Apps Script Anda untuk mencadangkan data secara otomatis setiap ada faktur, pelanggan, atau produk baru ke dalam Google Sheets.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Apps Script Web App URL</label>
              <input
                type="url"
                value={formData.googleAppsScriptUrl || ''}
                onChange={(e) => setFormData({ ...formData, googleAppsScriptUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                placeholder="https://script.google.com/macros/s/.../exec"
              />
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex items-center justify-end gap-4">
            {isSaved && <span className="text-sm text-green-600 font-medium">Berhasil disimpan!</span>}
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
