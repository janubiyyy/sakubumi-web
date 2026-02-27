import { useEffect, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Clock } from 'lucide-react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/useAuthStore';

interface SummaryData {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

const DashboardPage = () => {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<SummaryData>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [loading, setLoading] = useState(true);

  const [chartData, setChartData] = useState<any[]>([]);
  const [recentTx, setRecentTx] = useState<any[]>([]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 11) return 'Selamat Pagi';
    if (hour < 15) return 'Selamat Siang';
    if (hour < 18) return 'Selamat Sore';
    return 'Selamat Malam';
  };

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, []);

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/transactions/summary');
      if (data.success) {
        setSummary(data.data);
      }
    } catch (error) {
      toast.error('Gagal memuat ringkasan keuangan');
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data } = await api.get('/transactions');
      if (data.success) {
        const txs = data.data;
        setRecentTx(txs.slice(0, 5));
        const days: any[] = [];
        // Buat array 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          days.push({
            date: d.toISOString().split('T')[0],
            name: d.toLocaleDateString('id-ID', { weekday: 'short' }),
            Pemasukan: 0,
            Pengeluaran: 0
          });
        }
        
        // Agregasi transaksi ke dalam hari yang sesuai
        txs.forEach((tx: any) => {
          const txDate = tx.date.split('T')[0];
          const dayObj = days.find(d => d.date === txDate);
          if (dayObj) {
            if (tx.type === 'INCOME') dayObj.Pemasukan += tx.amount;
            if (tx.type === 'EXPENSE') dayObj.Pengeluaran += tx.amount;
          }
        });
        
        setChartData(days);
      }
    } catch (error) {
      toast.error('Gagal memuat data grafik transaksi');
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="mb-2">
        <h1 className="text-3xl font-bold text-primary tracking-tight">{getGreeting()}, {user?.name || 'Kawan'}! 👋</h1>
        <p className="text-primary/60 mt-1">Pantau arus kas Anda dalam sekali tatap hari ini coya coya</p>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary to-primary-dark text-white border-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-cream/80 text-sm font-medium mb-1">Total Saldo Aktif</p>
              <h2 className="text-3xl font-bold tracking-tight">{formatRupiah(summary.balance)}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Wallet className="text-white w-5 h-5" />
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/10 flex text-xs text-cream/70 items-center justify-between">
            <span>Diperbarui baru saja</span>
            <span className="font-semibold text-sage-light flex items-center">
              Total riil bersih
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary/60 text-sm font-medium mb-1">Pemasukan Global</p>
              <h2 className="text-2xl font-bold text-primary tracking-tight">{formatRupiah(summary.totalIncome)}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-sage/20 flex items-center justify-center">
              <ArrowUpRight className="text-sage-dark w-5 h-5" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-primary/60 text-sm font-medium mb-1">Pengeluaran Global</p>
              <h2 className="text-2xl font-bold text-primary tracking-tight">{formatRupiah(summary.totalExpense)}</h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-accent-orange/20 flex items-center justify-center">
              <ArrowDownRight className="text-accent-orange w-5 h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="card p-6 mt-8 overflow-hidden">
        <h3 className="text-lg font-bold text-primary mb-6">Aktivitas 7 Hari Terakhir</h3>
        <div className="h-80 w-full overflow-x-auto overflow-y-hidden pb-4 -mb-4">
          <div className="min-w-[500px] h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B4F3B', opacity: 0.6}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B4F3B', opacity: 0.6}} tickFormatter={(val) => `Rp${val/1000}k`} />
                <Tooltip 
                  cursor={{fill: '#F5EBDD', opacity: 0.4}}
                  contentStyle={{ borderRadius: '12px', borderColor: '#F5EBDD', color: '#6B4F3B' }}
                  formatter={(value: number) => formatRupiah(value)}
                />
                <Legend iconType="circle" />
                <Bar dataKey="Pemasukan" fill="#A3B18A" radius={[4, 4, 0, 0]} barSize={24} />
                <Bar dataKey="Pengeluaran" fill="#D4A373" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="card p-6 mt-8 overflow-hidden">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Clock size={20} className="text-sage" /> Transaksi Terakhir
          </h3>
        </div>
        
        {recentTx.length === 0 ? (
          <div className="text-center text-primary/50 py-6 text-sm">Belum ada transaksi di akun ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-cream/50 text-sm font-semibold text-primary/70">
                  <th className="p-3 pl-4 rounded-tl-lg">Kategori</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3 text-right rounded-tr-lg">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map((tx: any) => (
                  <tr key={tx.id} className="border-b border-cream/50 last:border-0 hover:bg-cream/20 transition-colors">
                    <td className="p-3 pl-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center text-sm shadow-sm">
                        {tx.category?.icon || '🏷️'}
                      </div>
                      <span className="font-semibold text-primary">{tx.category?.name}</span>
                    </td>
                    <td className="p-3 text-sm text-primary/70">{new Date(tx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</td>
                    <td className={`p-3 text-right font-bold ${tx.type === 'INCOME' ? 'text-sage' : 'text-primary'}`}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatRupiah(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default DashboardPage;
