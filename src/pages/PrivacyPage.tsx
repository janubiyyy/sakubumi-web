import { Link } from 'react-router-dom';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFCF0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-[#E8C49A]/30 p-8 sm:p-12">
        <Link to="/" className="text-[#A3B18A] hover:text-[#588157] font-medium mb-8 inline-block">
          ← Kembali ke Beranda
        </Link>
        
        <h1 className="text-3xl font-bold text-[#4B2F1B] mb-6">Kebijakan Privasi Saku Bumi</h1>
        <p className="text-gray-600 mb-8 italic">Terakhir diperbarui: 13 Maret 2026</p>

        <section className="space-y-6 text-[#4B2F1B]/80 leading-relaxed">
          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">1. Informasi yang Kami Kumpulkan</h2>
            <p>
              Aplikasi Saku Bumi dirancang untuk membantu Anda mencatat keuangan secara pribadi. 
              Data yang Anda masukkan (transaksi, kategori, dan catatan keuangan) disimpan secara aman 
              untuk keperluan penggunaan fitur aplikasi. Kami tidak menjual data pribadi Anda kepada pihak ketiga.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">2. Penggunaan Informasi</h2>
            <p>
              Informasi yang dikumpulkan digunakan semata-mata untuk:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Menampilkan riwayat transaksi Anda.</li>
              <li>Menghasilkan laporan statistik keuangan bagi Anda.</li>
              <li>Meningkatkan fungsionalitas dan pengalaman pengguna aplikasi.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">3. Keamanan Data</h2>
            <p>
              Kami mengutamakan keamanan data Anda. Meskipun tidak ada metode transmisi atau penyimpanan 
              elektronik yang 100% aman, kami berupaya menggunakan cara yang wajar secara komersial 
              untuk melindungi informasi pribadi Anda.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">4. Persetujuan</h2>
            <p>
              Dengan menggunakan aplikasi Saku Bumi, Anda menyatakan setuju dengan Kebijakan Privasi ini.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-[#4B2F1B] mb-2">5. Hubungi Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami melalui support@sakubumi.com.
            </p>
          </div>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">© 2026 Saku Bumi. Hak Cipta Dilindungi.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
