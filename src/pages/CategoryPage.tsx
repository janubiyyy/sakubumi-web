import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Tag, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
  type: string;
  icon: string | null;
}

const EMOJI_LIST = ['🏷️', '🛒', '🍽️', '🚗', '🚕', '⛽', '🎬', '🎮', '👕', '🏥', '💊', '🏠', '🧹', '🎓', '✈️', '🏝️', '🎁', '💰', '📈', '💼', '💵', '💳', '📱', '💻'];

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE',
    icon: '🏷️',
  });

  // Delete Modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data.data);
    } catch (error) {
      toast.error('Gagal mengambil daftar kategori');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Nama kategori wajib diisi');
      return;
    }

    try {
      await api.post('/categories', formData);
      toast.success('Kategori baru berhasil ditambahkan');
      setIsModalOpen(false);
      setFormData({ name: '', type: 'EXPENSE', icon: '🏷️' });
      fetchCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kategori');
    }
  };

  const confirmDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    const toastId = toast.loading('Menghapus kategori...');
    setIsDeleteModalOpen(false);
    
    try {
      await api.delete(`/categories/${categoryToDelete}`);
      toast.success('Kategori berhasil dihapus', { id: toastId });
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err: any) {
      // Menangani error jika kategori sedang dipakai di transaksi
      const errorMsg = err.response?.data?.message || 'Gagal menghapus kategori';
      toast.error(errorMsg, { id: toastId });
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Kategori Transaksi</h1>
          <p className="text-primary/60 mt-1">Kelola label untuk mengelompokkan arus kas Anda.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center justify-center gap-2 px-6">
          <Plus size={18} /> Kategori Baru
        </button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-primary/60 animate-pulse">Memuat data kategori...</div>
        ) : categories.length === 0 ? (
          <div className="p-16 text-center text-primary/50 flex flex-col items-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-lg font-medium text-primary/70">Belum ada kategori</p>
            <p className="text-sm mt-1">Buat kategori pertama Anda sekarang.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {categories.map((cat) => (
              <div key={cat.id} className="group relative bg-white border border-cream-dark/60 rounded-xl p-5 hover:shadow-soft hover:border-cream/50 transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                    cat.type === 'INCOME' ? 'bg-sage/10 text-sage-dark' : 'bg-accent-orange/10 text-accent-orange'
                  }`}>
                    {cat.icon || '🏷️'}
                  </div>
                  <div>
                    <h3 className="font-bold text-primary text-lg">{cat.name}</h3>
                    <div className="flex items-center gap-1 mt-0.5 text-xs font-medium text-primary/60">
                      {cat.type === 'INCOME' ? (
                         <><ArrowUpRight size={14} className="text-sage"/> Pemasukan</>
                      ) : (
                         <><ArrowDownRight size={14} className="text-accent-orange"/> Pengeluaran</>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => confirmDelete(cat.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all absolute top-4 right-4" 
                  title="Hapus Kategori"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Tambah Kategori */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-sm p-0 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-cream">
              <h2 className="text-xl font-bold text-primary">Buat Kategori Baru</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSaveCategory} className="space-y-5">
                
                {/* Switcher Tipe */}
                <div className="flex gap-2 p-1.5 bg-cream rounded-xl">
                  <button 
                    type="button"
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.type === 'EXPENSE' ? 'bg-white text-accent-orange shadow-sm scale-100' : 'text-primary/50 hover:text-primary scale-95'}`}
                    onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                  >
                    Pengeluaran
                  </button>
                  <button 
                    type="button"
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${formData.type === 'INCOME' ? 'bg-white text-sage shadow-sm scale-100' : 'text-primary/50 hover:text-primary scale-95'}`}
                    onClick={() => setFormData({...formData, type: 'INCOME'})}
                  >
                    Pemasukan
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="label-text">Ikon Kategori</label>
                  <div className="flex gap-2 flex-wrap bg-white/60 p-3 rounded-xl border border-cream/80 max-h-36 overflow-y-auto shadow-inner">
                    {EMOJI_LIST.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({...formData, icon: emoji})}
                        className={`text-2xl w-10 h-10 flex items-center justify-center rounded-lg transition-all ${formData.icon === emoji ? 'bg-sage/20 border-2 border-sage scale-110 shadow-sm' : 'hover:bg-cream border border-transparent hover:scale-105'}`}
                        title="Pilih Ikon"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="label-text">Nama Kategori</label>
                  <input type="text" required className="input-field shadow-sm" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Contoh: Belanja Bulanan" autoFocus/>
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end gap-3 pt-4 border-t border-cream mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6">
                    Batal
                  </button>
                  <button type="submit" className="btn-primary px-8">
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Custom Konfirmasi Hapus */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-sm p-6 animate-in zoom-in-95 duration-200 overflow-hidden">
            <h3 className="text-xl font-bold text-primary mb-2 text-center">Hapus Kategori?</h3>
            <p className="text-primary/70 text-center text-sm mb-6">
              Apakah Anda yakin ingin menghapus kategori ini? Kategori tidak dapat dihapus jika masih ada transaksi yang menggunakannya.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 btn-secondary py-2.5">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors py-2.5 shadow-soft">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryPage;
