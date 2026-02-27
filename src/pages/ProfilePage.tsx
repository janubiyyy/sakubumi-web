import { User as UserIcon, Calendar, Bell, Shield } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const ProfilePage = () => {
  const { user } = useAuthStore();
  
  // Tanggal fiksi untuk dummy UI
  const joinDate = user ? new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '-';

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      <header className="mb-2">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Profil Pengguna</h1>
        <p className="text-primary/60 mt-1">Kelola data probadi dan pengaturan akun Anda.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Kiri: Avatar & Info Dasar */}
        <div className="md:col-span-1 space-y-6">
          <div className="card p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-sage/20 rounded-full flex items-center justify-center mb-4 text-sage border-4 border-white shadow-sm">
              <UserIcon className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-primary mb-1">{user?.name}</h2>
            <p className="text-primary/60 text-sm">{user?.email}</p>
            <div className="w-full h-px bg-cream my-6"></div>
            <div className="w-full flex justify-between text-sm">
              <span className="text-primary/60 flex items-center gap-2"><Calendar size={14} /> Bergabung</span>
              <span className="font-semibold text-primary">{joinDate}</span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan */}
        <div className="md:col-span-2 space-y-6">
          <div className="card overflow-hidden">
            <div className="p-6 border-b border-cream">
              <h3 className="text-lg font-bold text-primary">Preferensi Akun</h3>
            </div>
            <div className="p-0">
              
              <div className="p-6 border-b border-cream/50 hover:bg-cream/20 flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-orange/10 flex items-center justify-center text-accent-orange">
                    <Bell size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Notifikasi Email</h4>
                    <p className="text-sm text-primary/60">Terima rekap mingguan transaksi.</p>
                  </div>
                </div>
                <div className="w-12 h-6 bg-sage rounded-full relative shadow-inner cursor-pointer">
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                </div>
              </div>

              <div className="p-6 hover:bg-cream/20 flex items-center justify-between cursor-pointer transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">Keamanan & Sandi</h4>
                    <p className="text-sm text-primary/60">Ubah kata sandi dan aktifkan 2FA.</p>
                  </div>
                </div>
                <button className="btn-secondary py-2 px-4 text-sm">Ubah</button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
