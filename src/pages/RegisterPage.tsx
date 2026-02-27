import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', { name, email, password });
      if (data.success) {
        toast.success('Registrasi berhasil! Silakan login.', { icon: '🌱' });
        navigate('/login');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.');
      toast.error('Registrasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-accent-orange rounded-full flex items-center justify-center mb-4">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Daftar Saku Bumi</h1>
          <p className="text-primary/60 text-sm mt-1">Mulai perjalanan finansialmu hari ini</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-text">Nama Lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              placeholder="Budi Santoso"
              required
            />
          </div>

          <div>
            <label className="label-text">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="nama@email.com"
              required
            />
          </div>

          <div>
            <label className="label-text">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full pt-4 mt-4"
          >
            {loading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-primary/70">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-sage font-semibold hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
