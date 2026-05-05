import React, { useState } from 'react';

export default function App() {
  const [formData, setFormData] = useState({
    sheetName: 'Sheet1',
    namaPdp: '',
    desa: '',
    kecamatan: '',
    dataBulan: '',
    linkBukti: ''
  });
  const [loading, setLoading] = useState(false);

  // GANTI DENGAN URL WEB APP GAS ANDA
  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzFAjIFkasFhbkga1CWj2jenA6ZlNy7z1kkIRg7phil3ktBwn3kscdIZiL1tx9CkYx6aQ/exec'; 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if(result.status === 'success') {
        alert('Data berhasil diinput ke ' + formData.sheetName);
        // Reset form setelah sukses
        setFormData({...formData, namaPdp: '', desa: '', kecamatan: '', linkBukti: ''});
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Struktur Fit-to-Screen dengan Background Gradient Soft Purple & Blue
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-100 via-white to-blue-100 flex items-center justify-center p-4 overflow-hidden text-slate-800">
      
      {/* Container Glassmorphism */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-2xl p-6 flex flex-col max-h-full overflow-y-auto">
        
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            E-Input Pelaporan
          </h1>
          <p className="text-sm text-slate-500 mt-1">Sistem Terpusat SDM</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          
          {/* Pilihan Target Sheet */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Target Penyimpanan</label>
            <select 
              name="sheetName" 
              value={formData.sheetName} 
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all"
            >
              <option value="Sheet1">Sheet 1 (Kehadiran KPM)</option>
              <option value="Sheet2">Sheet 2 (Laporan SKP)</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Nama PDP</label>
            <input 
              type="text" 
              name="namaPdp" 
              value={formData.namaPdp} 
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all placeholder-slate-400"
              placeholder="Contoh: M. ZAEN SYACHRULLAH"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-1">Kecamatan</label>
              <input 
                type="text" 
                name="kecamatan" 
                value={formData.kecamatan} 
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all"
                placeholder="Tapin Utara"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-600 mb-1">Desa</label>
              <input 
                type="text" 
                name="desa" 
                value={formData.desa} 
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all"
                placeholder="Kupang"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Bulan Laporan</label>
            <select 
              name="dataBulan" 
              value={formData.dataBulan} 
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all"
            >
              <option value="">Pilih Bulan...</option>
              <option value="JANUARI">Januari</option>
              <option value="FEBRUARI">Februari</option>
              <option value="MARET">Maret</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-600 mb-1">Link Bukti Dukung (G-Drive)</label>
            <input 
              type="url" 
              name="linkBukti" 
              value={formData.linkBukti} 
              onChange={handleChange}
              className="px-4 py-3 rounded-xl bg-white/50 border border-white focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition-all placeholder-slate-400"
              placeholder="https://drive.google.com/..."
            />
          </div>

          {/* Tombol 3D Glossy */}
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold tracking-wide shadow-[0_4px_15px_rgba(99,102,241,0.4)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.6)] transform hover:-translate-y-0.5 transition-all active:translate-y-1 active:shadow-inner disabled:opacity-70"
          >
            {loading ? 'Mengirim Data...' : 'Kirim Laporan'}
          </button>
          
        </form>
      </div>
    </div>
  );
}
