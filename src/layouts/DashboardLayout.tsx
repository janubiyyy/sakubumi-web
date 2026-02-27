import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, LineChart, User as UserIcon, LogOut, Leaf, Tag, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';
import toast from 'react-hot-toast';

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Berhasil keluar!', { icon: '👋' });
    } catch (error) {
      toast.error('Gagal saat mencoba keluar');
    } finally {
      logout();
      navigate('/');
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Transaksi', path: '/dashboard/transactions', icon: <Receipt size={20} /> },
    { name: 'Kategori', path: '/dashboard/categories', icon: <Tag size={20} /> },
    { name: 'Laporan', path: '/dashboard/report', icon: <LineChart size={20} /> },
    { name: 'Profil', path: '/dashboard/profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      
      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-cream-dark flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">Saku Bumi</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-primary">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-primary/40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out w-64 bg-white border-r border-cream-dark flex flex-col shadow-soft z-50 shrink-0`}>
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-cream">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center shrink-0">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight truncate">Saku Bumi</span>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto mt-16 md:mt-0">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm
                    ${isActive 
                      ? 'bg-primary text-cream shadow-sm' 
                      : 'text-primary/70 hover:bg-cream/50 hover:text-primary'
                    }
                  `}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-cream">
          <div className="px-4 py-3 mb-2">
            <p className="text-xs text-primary/50 font-medium">Masuk sebagai</p>
            <p className="text-sm font-semibold text-primary truncate" title={user?.name}>{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut size={20} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-y-auto overflow-x-hidden bg-background p-4 pt-20 md:p-8">
        <div className="max-w-6xl mx-auto pb-12 w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
