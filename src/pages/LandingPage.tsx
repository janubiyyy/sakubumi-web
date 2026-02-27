import { Link, Navigate } from 'react-router-dom';
import { Leaf, ArrowRight, ShieldCheck, Wallet, LineChart } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const LandingPage = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navigation */}
      <nav className="px-6 py-4 flex items-center justify-between border-b border-cream">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">Saku Bumi</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="px-5 py-2 text-primary font-medium hover:text-primary-dark transition-colors">
            Masuk
          </Link>
          <Link to="/register" className="px-5 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-all shadow-soft">
            Daftar
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-accent-brown text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-sage animate-pulse"></span>
          Aplikasi Manajemen Keuangan #1
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-primary mb-6 max-w-4xl tracking-tight leading-tight">
          Catat Uangmu, <span className="text-sage">Sayangi Bumimu.</span>
        </h1>
        
        <p className="text-lg text-primary/70 mb-10 max-w-2xl leading-relaxed">
          Mengelola keuangan tidak pernah seindah dan semudah ini. Lacak pengeluaran, capai target finansial, dan pantau kekayaan Anda dengan antarmuka yang dirancang untuk kedamaian pikiran.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/register" className="btn-primary flex items-center justify-center gap-2 text-lg px-8">
            Mulai Gratis <ArrowRight className="w-5 h-5" />
          </Link>
          <a href="#features" className="btn-secondary flex items-center justify-center text-lg px-8">
            Pelajari Fitur
          </a>
        </div>

        {/* Feature Highlights Mini */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full" id="features">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-sage/20 flex items-center justify-center mb-4 text-sage">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Pencatatan Mudah</h3>
            <p className="text-sm text-primary/70">Catat setiap transaksi masuk dan keluar hanya dalam hitungan detik.</p>
          </div>
          
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-orange/20 flex items-center justify-center mb-4 text-accent-orange">
              <LineChart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Laporan Visual</h3>
            <p className="text-sm text-primary/70">Pantau pergerakan uang Anda melalui grafik interaktif yang memanjakan mata.</p>
          </div>

          <div className="card p-6 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 text-primary">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Aman & Nyaman</h3>
            <p className="text-sm text-primary/70">Data dijamin aman dengan menggunakan enkripsi standar industri.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
