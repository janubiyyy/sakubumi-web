import { Link } from 'react-router-dom';

const DeleteAccountPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-[#E8C49A]/30 p-8 sm:p-12">
        <Link to="/" className="text-[#A3B18A] hover:text-[#588157] font-medium mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>
        
        <h1 className="text-3xl font-bold text-[#4B2F1B] mb-6">Permintaan Penghapusan Akun & Data</h1>
        <p className="text-gray-600 mb-8">
          Kami menghargai privasi Anda. Jika Anda ingin menghapus akun Saku Bumi dan semua data terkait, silakan ikuti panduan di bawah ini.
        </p>

        <section className="space-y-8 text-[#4B2F1B]/80 leading-relaxed">
          <div className="bg-[#F5EBDD]/30 p-6 rounded-2xl border border-[#E8C49A]/20">
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-4">Langkah-langkah Penghapusan:</h2>
            <ol className="list-decimal ml-6 space-y-3">
              <li>Kirimkan email ke <strong>support@sakubumi.com</strong> dengan subjek <strong>"Permintaan Penghapusan Akun - [Username Anda]"</strong>.</li>
              <li>Sertakan alamat email yang Anda gunakan saat mendaftar di Saku Bumi.</li>
              <li>Tim kami akan memproses permintaan Anda dalam waktu maksimal 7 hari kerja.</li>
              <li>Setelah diproses, Anda akan menerima email konfirmasi bahwa akun dan data Anda telah dihapus secara permanen.</li>
            </ol>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">Data Apa yang Dihapus?</h2>
            <p>
              Saat Anda meminta penghapusan akun, data berikut akan dihapus secara permanen dari server kami:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Informasi profil (Nama, Email, Password yang di-hash).</li>
              <li>Seluruh riwayat transaksi (Pemasukan & Pengeluaran).</li>
              <li>Kategori khusus yang Anda buat.</li>
              <li>Pengaturan personalisasi lainnya.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">Data yang Mungkin Disimpan</h2>
            <p>
              Kami mungkin menyimpan data transaksi anonim (tanpa identitas) untuk keperluan statistik internal 
              atau jika diwajibkan oleh hukum yang berlaku untuk pelaporan keuangan legal. Data ini tidak akan bisa 
              dihubungkan kembali ke identitas Anda setelah akun dihapus.
            </p>
          </div>

          <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
            <strong>Peringatan:</strong> Tindakan ini bersifat permanen. Setelah data dihapus, Anda tidak dapat memulihkan kembali riwayat keuangan Anda.
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">© 2026 Saku Bumi. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
