import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, Tag, Receipt, FileDown } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface Category {
  id: string;
  name: string;
  type: string;
  icon: string | null;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  note: string;
  date: string;
  category: Category;
}

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states untuk transaksi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'EXPENSE',
    note: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });

  // Modal Custom Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // States untuk fitur tambah kategori baru
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('💰');
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txRes, catRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/categories')
      ]);
      setTransactions(txRes.data.data);
      setCategories(catRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error('Gagal mengambil data dari server');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      toast.error('Pilih kategori transaksi terlebih dahulu!');
      return;
    }

    // Bersihkan format input berupa titik atau koma (e.g. 5.000.000 menjadi 5000000)
    const rawAmount = String(formData.amount).replace(/\D/g, '');

    try {
      await api.post('/transactions', {
        ...formData,
        amount: Number(rawAmount),
        date: new Date(formData.date).toISOString()
      });
      toast.success('Transaksi berhasil dicatat!');
      setIsModalOpen(false);
      setFormData({ ...formData, amount: '', note: '', categoryId: '' });
      fetchData(); // Refresh list
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan transaksi');
    }
  };

  const handleSaveCategory = async () => {
    if (!newCatName.trim()) {
      toast.error('Nama kategori tidak boleh kosong!');
      return;
    }
    
    setIsSavingCategory(true);
    try {
      const { data } = await api.post('/categories', {
        name: newCatName,
        type: formData.type,
        icon: newCatIcon
      });
      toast.success('Kategori baru berhasil ditambahkan!');
      setCategories([...categories, data.data]);
      setFormData({ ...formData, categoryId: data.data.id });
      setIsAddingCategory(false);
      setNewCatName('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal membuat kategori');
    } finally {
      setIsSavingCategory(false);
    }
  };

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;
    setIsDeleteModalOpen(false);
    const toastId = toast.loading('Menghapus...');
    try {
      await api.delete(`/transactions/${transactionToDelete}`);
      toast.success('Transaksi dihapus', { id: toastId });
      setTransactionToDelete(null);
      fetchData();
    } catch (err) {
      toast.error('Gagal menghapus', { id: toastId });
      setTransactionToDelete(null);
    }
  };

  // Formatter Rupiah yang proper sesuai lokal ID
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Formatter input uang saat mengetik
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Hanya ambil angka
    if (!value) {
      setFormData({ ...formData, amount: '' });
      return;
    }
    // Setel dgn format pakai titik (ribuan separator lokal id)
    const formatted = new Intl.NumberFormat('id-ID').format(Number(value));
    setFormData({ ...formData, amount: formatted });
  };

  const formatDate = (ds: string) => {
    return new Date(ds).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  const handleExportExcel = () => {
    if (transactions.length === 0) {
      toast.error('Tidak ada data yang bisa diekspor');
      return;
    }

    const toastId = toast.loading('Menyiapkan Excel...');
    try {
      // 1. Siapkan data baris untuk sheet excel
      const excelData = transactions.map(tx => ({
        'Tanggal': new Date(tx.date).toLocaleDateString('id-ID'),
        'Tipe': tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
        'Kategori': tx.category.name,
        'Jumlah (Rp)': tx.amount,
        'Keterangan': tx.note || '-',
      }));

      // 2. Buat workbook dan worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      // Mengatur lebar kolom agar rapih (dalam karakter)
      worksheet['!cols'] = [
        { wch: 15 }, // Tanggal
        { wch: 15 }, // Tipe
        { wch: 20 }, // Kategori
        { wch: 15 }, // Jumlah
        { wch: 40 }, // Keterangan
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Transaksi');

      // 3. Simpan dan download
      XLSX.writeFile(workbook, `SakuBumi_Transaksi_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Laporan Excel berhasil diunduh!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat file Excel', { id: toastId });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Daftar Transaksi</h1>
          <p className="text-primary/60 mt-1">Kelola pergerakan uang masuk dan keluar.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportExcel} className="btn-secondary flex items-center justify-center gap-2 px-6 shadow-sm border-cream-dark/60 bg-white">
            <FileDown size={18} className="text-sage" /> Export Excel
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center justify-center gap-2 px-6">
            <Plus size={18} /> Transaksi Baru
          </button>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-primary/60 animate-pulse">Memuat data transaksi...</div>
        ) : transactions.length === 0 ? (
          <div className="p-16 text-center text-primary/50 flex flex-col items-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <Receipt className="w-8 h-8 text-primary/30" />
            </div>
            <p className="text-lg font-medium text-primary/70">Belum ada riwayat transaksi</p>
            <p className="text-sm mt-1">Catat pemasukan atau pengeluaran pertama Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-cream border-b border-cream-dark/50 text-sm font-semibold text-primary/80">
                  <th className="p-4 pl-6">Tanggal</th>
                  <th className="p-4">Kategori</th>
                  <th className="p-4">Keterangan</th>
                  <th className="p-4 text-right">Jumlah</th>
                  <th className="p-4 pr-6 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-cream-dark/30 hover:bg-cream/20 transition-colors group">
                    <td className="p-4 pl-6 text-sm text-primary/80 whitespace-nowrap">{formatDate(tx.date)}</td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-primary/10 text-primary shadow-sm hover:shadow transition-all">
                        <span className="text-base">{tx.category.icon ? tx.category.icon : <Tag size={12} />}</span>
                        {tx.category.name}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-primary max-w-[200px] truncate" title={tx.note}>{tx.note || '-'}</td>
                    <td className="p-4 text-right font-semibold whitespace-nowrap">
                      <span className={tx.type === 'INCOME' ? 'text-sage-dark flex items-center justify-end gap-1 font-bold' : 'text-accent-orange text-right flex items-center justify-end gap-1 font-bold'}>
                        {tx.type === 'INCOME' ? <ArrowUpRight size={16} strokeWidth={2.5} /> : <ArrowDownRight size={16} strokeWidth={2.5} />}
                        {formatRupiah(tx.amount)}
                      </span>
                    </td>
                    <td className="p-4 pr-6 flex justify-center gap-2 opacity-50 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                      <button onClick={() => confirmDelete(tx.id)} className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Tulis Transaksi & Kategori Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card w-full max-w-lg p-0 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="p-6 border-b border-cream">
              <h2 className="text-xl font-bold text-primary">Catat Keuangan</h2>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSaveTransaction} className="space-y-5">
                
                {/* Switcher Pemasukan/Pengeluaran */}
                <div className="flex gap-2 p-1.5 bg-cream rounded-xl">
                  <button 
                    type="button"
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${formData.type === 'EXPENSE' ? 'bg-white text-accent-orange shadow-sm scale-100' : 'text-primary/50 hover:text-primary scale-95'}`}
                    onClick={() => setFormData({...formData, type: 'EXPENSE', categoryId: ''})}
                  >
                    Pengeluaran
                  </button>
                  <button 
                    type="button"
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${formData.type === 'INCOME' ? 'bg-white text-sage shadow-sm scale-100' : 'text-primary/50 hover:text-primary scale-95'}`}
                    onClick={() => setFormData({...formData, type: 'INCOME', categoryId: ''})}
                  >
                    Pemasukan
                  </button>
                </div>

                {/* Input Jumlah Uang */}
                <div>
                  <label className="label-text">Jumlah Uang</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 font-semibold">Rp</span>
                    <input type="text" required className="input-field pl-12 text-lg font-bold text-primary" 
                      value={formData.amount} onChange={handleAmountChange} placeholder="0" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label-text">Tanggal Transaksi</label>
                    <input type="date" required className="input-field" 
                      value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  
                  {/* Pilihan Kategori dengan Add New */}
                  <div>
                    <label className="label-text flex justify-between">
                      <span>Kategori</span>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingCategory(!isAddingCategory)}
                        className="text-xs text-accent-orange hover:underline font-semibold"
                      >
                        {isAddingCategory ? 'Batal Tambah' : '+ Kategori Baru'}
                      </button>
                    </label>
                    
                    {isAddingCategory ? (
                      <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                        <div className="flex gap-2">
                          <input type="text" className="input-field px-3" placeholder="Nama Kategori" value={newCatName} onChange={e => setNewCatName(e.target.value)} autoFocus />
                          <button type="button" onClick={handleSaveCategory} disabled={isSavingCategory} className="bg-sage whitespace-nowrap text-white rounded-xl px-4 hover:bg-sage-dark transition shadow-sm font-medium">
                            Simpan
                          </button>
                        </div>
                        <div className="flex gap-1.5 overflow-x-auto pb-1 mt-1">
                           {['🏷️', '🛒', '🍽️', '🚗', '⛽', '🎮', '👕', '🏥', '🏠', '✈️', '💰', '💼', '💵'].map(emoji => (
                             <button key={emoji} type="button" onClick={() => setNewCatIcon(emoji)} 
                               className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-lg transition-all ${newCatIcon === emoji ? 'bg-sage/20 border border-sage scale-110' : 'hover:bg-cream border border-transparent hover:scale-105'}`}
                               title="Pilih Ikon"
                             >
                               {emoji}
                             </button>
                           ))}
                        </div>
                      </div>
                    ) : (
                      <select required className="input-field bg-white cursor-pointer" 
                        value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})}>
                        <option value="" disabled>-- Pilih --</option>
                        {filteredCategories.length === 0 && <option disabled>Belum ada kategori</option>}
                        {filteredCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Input Catatan */}
                <div>
                  <label className="label-text">Keterangan Opsional</label>
                  <textarea className="input-field resize-none h-20 placeholder:text-sm" 
                    value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} placeholder={`Contoh: Beli sayur bayam, topup emoney, dll...`} />
                </div>

                {/* Footer Modal */}
                <div className="flex justify-end gap-3 pt-4 border-t border-cream mt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6">
                    Batal
                  </button>
                  <button type="submit" className="btn-primary px-8 flex items-center gap-2">
                    Simpan Data
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
            <h3 className="text-xl font-bold text-primary mb-2 text-center">Hapus Transaksi?</h3>
            <p className="text-primary/70 text-center text-sm mb-6">
              Data transaksi ini akan dihapus secara permanen dan tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 btn-secondary py-2.5">
                Batal
              </button>
              <button onClick={handleDelete} className="flex-1 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors py-2.5 shadow-soft">
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TransactionPage;
