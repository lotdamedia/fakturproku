import { ReactNode, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, Settings as SettingsIcon, LogOut } from 'lucide-react';
import { useStore } from '../store';
import { Modal } from './Modal';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/invoices', label: 'Faktur', icon: FileText },
  { path: '/customers', label: 'Pelanggan', icon: Users },
  { path: '/products', label: 'Produk', icon: Package },
  { path: '/settings', label: 'Pengaturan', icon: SettingsIcon },
];

export default function Layout() {
  const { setAuthenticated } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const confirmLogout = () => {
    setIsLogoutModalOpen(false);
    // Needs a slight delay for the modal animation to finish cleanly if possible, 
    // but executing directly works too. Using setTimeout ensures state update runs smoothly.
    setTimeout(() => {
      setAuthenticated(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Collapsed by default, expands on hover */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 ease-in-out z-40 ${isHovered ? 'w-64' : 'w-20'}`}
      >
        <div className="flex items-center justify-center h-16 h-16 px-6 border-b border-gray-200 overflow-hidden whitespace-nowrap">
          {isHovered ? (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-opacity duration-300">
              FakturPro
            </span>
          ) : (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FP
            </span>
          )}
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto pb-24 overflow-x-hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${!isHovered ? 'justify-center px-0' : ''}`
              }
            >
              <item.icon size={20} className="shrink-0" />
              <span className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className={`flex items-center gap-3 w-full py-2.5 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap ${isHovered ? 'px-3' : 'justify-center'}`}
            title="Keluar"
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0 hidden'}`}>
              Keluar
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 h-screen overflow-hidden">
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="flex-1">
            <Outlet />
          </div>
          
          {/* Footer */}
          <footer className="mt-12 pt-6 pb-2 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <div>
              &copy; {new Date().getFullYear()} <span className="font-semibold text-gray-700">FakturPro</span>. Hak Cipta Dilindungi.
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              Membantu bisnis lokal bertumbuh dengan
              <svg className="w-3.5 h-3.5 text-red-500 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
          </footer>
        </main>
      </div>

      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Konfirmasi Keluar"
      >
        <div className="space-y-6">
          <p className="text-gray-600">
            Apakah Anda yakin ingin keluar dari aplikasi FakturPro? Sesi Anda akan berakhir.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Batal
            </button>
            <button
              onClick={confirmLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
            >
              Ya, Keluar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
