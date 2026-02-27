import { useEffect, useState, useRef } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Tag, TrendingDown, ArrowUpRight, ArrowDownRight, FileDown, FileText } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ['#6B4F3B', '#A3B18A', '#D4A373', '#8C7462', '#C6D2B1', '#E8C5A5'];

const ReportPage = () => {
  const [loading, setLoading] = useState(true);
  const [expenseData, setExpenseData] = useState<CategoryData[]>([]);
  const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
  const [allTx, setAllTx] = useState<any[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/transactions');
      if (data.success) {
        const txs = data.data;
        setAllTx(txs);

        const expenseMap: Record<string, number> = {};
        const incomeMap: Record<string, number> = {};

        txs.forEach((tx: any) => {
          const catName = `${tx.category.icon || '🏷️'} ${tx.category.name}`;
          if (tx.type === 'EXPENSE') {
            expenseMap[catName] = (expenseMap[catName] || 0) + tx.amount;
          } else {
            incomeMap[catName] = (incomeMap[catName] || 0) + tx.amount;
          }
        });

        const formattedExpense = Object.keys(expenseMap).map(key => ({
          name: key,
          value: expenseMap[key],
        })).sort((a, b) => b.value - a.value);

        const formattedIncome = Object.keys(incomeMap).map(key => ({
          name: key,
          value: incomeMap[key],
        })).sort((a, b) => b.value - a.value);

        setExpenseData(formattedExpense);
        setIncomeData(formattedIncome);
      }
    } catch (error) {
      toast.error('Gagal memuat data laporan');
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

  const renderCustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-cream-dark p-3 rounded-xl shadow-soft">
          <p className="font-bold text-primary mb-1">{payload[0].name}</p>
          <p className="text-sm font-semibold" style={{ color: payload[0].payload.fill }}>
            {formatRupiah(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleExportExcel = () => {
    if (allTx.length === 0) {
      toast.error('Tidak ada data yang bisa diekspor');
      return;
    }

    const toastId = toast.loading('Menyiapkan Excel...');
    try {
      const excelData = allTx.map(tx => ({
        'Tanggal': new Date(tx.date).toLocaleDateString('id-ID'),
        'Tipe': tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran',
        'Kategori': tx.category.name,
        'Jumlah (Rp)': tx.amount,
        'Keterangan': tx.note || '-',
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      
      worksheet['!cols'] = [
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
        { wch: 15 },
        { wch: 40 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Riwayat Transaksi');

      XLSX.writeFile(workbook, `SakuBumi_Laporan_${new Date().toISOString().split('T')[0]}.xlsx`);
      
      toast.success('Laporan Excel berhasil diunduh!', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Gagal membuat file Excel', { id: toastId });
    }
  };

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    const toastId = toast.loading('Memproses PDF...');
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save(`SakuBumi_Laporan_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Laporan PDF berhasil diunduh!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error('Gagal membuat file PDF', { id: toastId });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="mb-2 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Laporan Detail</h1>
          <p className="text-primary/60 mt-1">Analisis distribusi pemasukan dan pengeluaran Anda.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExportExcel} disabled={allTx.length === 0} className="btn-secondary flex items-center justify-center gap-2 px-4 shadow-sm border-cream-dark/60 bg-white hover:bg-cream transition-colors">
            <FileText size={18} className="text-sage" /> Excel
          </button>
          <button onClick={handleExportPDF} disabled={allTx.length === 0} className="btn-primary flex items-center justify-center gap-2 px-4 shadow-sm relative z-10">
            <FileDown size={18} className="text-cream" /> PDF
          </button>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-background p-2 -m-2 rounded-xl">
          
          {/* Card Pengeluaran */}
          <div className="card p-6 border-t-4 border-t-accent-orange">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-accent-orange/10 flex items-center justify-center">
                <TrendingDown className="text-accent-orange w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-primary">Distribusi Pengeluaran</h2>
            </div>
            
            {expenseData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-primary/40">
                <Tag size={32} className="mb-2 opacity-50" />
                <p>Belum ada data pengeluaran</p>
              </div>
            ) : (
              <div className="h-80 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {expenseData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
            
            <div className="space-y-3">
              {expenseData.map((item, index) => (
                <div key={item.name} className="flex justify-between items-center text-sm p-3 bg-cream/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="font-medium text-primary">{item.name}</span>
                  </div>
                  <span className="font-bold text-primary/80">{formatRupiah(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card Pemasukan */}
          <div className="card p-6 border-t-4 border-t-sage">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-sage/10 flex items-center justify-center">
                <ArrowUpRight className="text-sage w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-primary">Sumber Pemasukan</h2>
            </div>

            {incomeData.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-primary/40">
                <ArrowDownRight size={32} className="mb-2 opacity-50" />
                <p>Belum ada data pemasukan</p>
              </div>
            ) : (
              <div className="h-80 w-full mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomeData.map((_entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={renderCustomTooltip} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="space-y-3">
              {incomeData.map((item, index) => (
                <div key={item.name} className="flex justify-between items-center text-sm p-3 bg-cream/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                    <span className="font-medium text-primary">{item.name}</span>
                  </div>
                  <span className="font-bold text-primary/80">{formatRupiah(item.value)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ReportPage;
