import React, { useState, useEffect } from 'react';
import { Home, PlusCircle, Calendar, Download, Search, Activity } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterKec, setFilterKec] = useState('');
  
  // Form State
  const [formData, setFormData] = useState({
    sheetName: 'Sheet1', namaPdp: '', desa: '', kecamatan: '', dataBulan: '', linkBukti: ''
  });

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbzFAjIFkasFhbkga1CWj2jenA6ZlNy7z1kkIRg7phil3ktBwn3kscdIZiL1tx9CkYx6aQ/execURL_WEB_APP_GAS_ANDA_DISINI'; // WAJIB GANTI

  // Fetch Data Awal (Sekali Load)
  useEffect(() => {
    fetch(GAS_URL)
      .then(res => res.json())
      .then(res => {
        if(res.status === 'success') setData(res.data);
        setIsLoading(false);
      }).catch(() => setIsLoading(false));
  }, []);

  // Handle Input Cepat & Optimistic Update
  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // 1. Update State Langsung (Tanpa Loading untuk UI)
    const newData = { ...formData, bulan: formData.dataBulan, link: formData.linkBukti };
    setData([...data, newData]);
    
    // 2. Reset Form & Pindah ke Agenda
    const currentTab = activeTab;
    setActiveTab('agenda');
    setFormData({...formData, namaPdp: '', desa: '', linkBukti: ''}); // Kosongkan sebagian agar cepat isi lagi

    // 3. Kirim ke Background
    fetch(GAS_URL, { method: 'POST', body: JSON.stringify(formData) })
      .catch(() => alert('Sinkronisasi background gagal, periksa koneksi.'));
  };

  // Filter & Rekap Logika
  const filteredData = filterKec ? data.filter(d => d.kecamatan.toLowerCase().includes(filterKec.toLowerCase())) : data;
  const totalKecamatan = [...new Set(data.map(d => d.kecamatan))].length;
  
  // Fungsi Export CSV
  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nama PDP,Desa,Kecamatan,Bulan,Link Bukti\n"
      + filteredData.map(e => `${e.namaPdp},${e.desa},${e.kecamatan},${e.bulan},${e.link}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Rekap_SDM_Kabupaten.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-50 via-white to-blue-50 flex flex-col font-sans text-slate-800 overflow-hidden">
      
      {/* Header Glassmorphism */}
      <header className="pt-8 pb-4 px-6 bg-white/70 backdrop-blur-md border-b border-white shadow-sm z-10 shrink-0">
        <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight">
          E-SDM Tapin
        </h1>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sistem Monitoring Terpusat</p>
      </header>

      {/* Konten Utama - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-hide">
        
        {/* VIEW: DASHBOARD & ANALITIK */}
        {activeTab === 'dashboard' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Kartu Statistik */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 text-white shadow-[0_8px_20px_rgba(59,130,246,0.3)] border border-blue-400/50">
                <Activity className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-3xl font-black">{data.length}</p>
                <p className="text-xs font-medium opacity-90">Total Entri SDM</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-4 text-white shadow-[0_8px_20px_rgba(168,85,247,0.3)] border border-purple-400/50">
                <Activity className="w-6 h-6 mb-2 opacity-80" />
                <p className="text-3xl font-black">{totalKecamatan}</p>
                <p className="text-xs font-medium opacity-90">Kecamatan Aktif</p>
              </div>
            </div>

            {/* Area Monitor & Filter */}
            <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 border border-white shadow-sm mt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">Monitor Cepat</h3>
                <button onClick={handleExport} className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-100 py-1.5 px-3 rounded-lg hover:bg-blue-200 transition">
                  <Download className="w-4 h-4" /> Export CSV
                </button>
              </div>
              
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input 
                  type="text" placeholder="Filter Kecamatan..." 
                  value={filterKec} onChange={(e) => setFilterKec(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-400 outline-none transition"
                />
              </div>

              <div className="space-y-3">
                {isLoading ? <p className="text-center text-xs text-slate-400">Memuat data...</p> : 
                  filteredData.slice(0, 5).map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.namaPdp}</p>
                      <p className="text-xs text-slate-500">{item.desa} • {item.kecamatan}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 bg-purple-100 text-purple-600 rounded-md uppercase">{item.bulan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: FORM INPUT CEPAT */}
        {activeTab === 'input' && (
          <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white shadow-[0_8px_32px_0_rgba(31,38,135,0.05)] space-y-4 animate-in zoom-in-95 duration-300">
            <h2 className="text-lg font-black text-slate-800 border-b border-slate-200 pb-2 mb-4">Input Data Baru</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <input type="text" name="namaPdp" value={formData.namaPdp} onChange={handleInputChange} required placeholder="Nama PDP" className="col-span-2 px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
              <input type="text" name="kecamatan" value={formData.kecamatan} onChange={handleInputChange} required placeholder="Kecamatan" className="px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
              <input type="text" name="desa" value={formData.desa} onChange={handleInputChange} required placeholder="Desa" className="px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
            </div>
            
            <select name="dataBulan" value={formData.dataBulan} onChange={handleInputChange} required className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none text-slate-600">
              <option value="">Pilih Bulan</option>
              <option value="JANUARI">Januari</option>
              <option value="FEBRUARI">Februari</option>
              <option value="MARET">Maret</option>
            </select>
            
            <input type="url" name="linkBukti" value={formData.linkBukti} onChange={handleInputChange} placeholder="Link G-Drive (Opsional)" className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
            
            <button type="submit" className="w-full py-3.5 mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-[0_4px_15px_rgba(99,102,241,0.3)] active:scale-95 transition-transform">
              Simpan Instan
            </button>
          </form>
        )}

        {/* VIEW: AGENDA */}
        {activeTab === 'agenda' && (
          <div className="animate-in fade-in duration-300">
            <h2 className="text-lg font-black text-slate-800 mb-4 px-1">Daftar Agenda & Riwayat</h2>
            <div className="space-y-3">
              {data.map((item, i) => (
                <div key={i} className="p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800">{item.namaPdp}</h4>
                    <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-600 rounded-md">{item.bulan}</span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2">
                    <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">{item.kecamatan}</span>
                    <span className="px-2 py-1 bg-slate-100 rounded-md border border-slate-200">{item.desa}</span>
                  </div>
                </div>
              )).reverse()} {/* Reverse agar data terbaru di atas */}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation (Floating App Shell) */}
      <nav className="absolute bottom-0 w-full px-6 py-4 bg-white/80 backdrop-blur-xl border-t border-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] flex justify-between items-center z-20 pb-safe">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-400'}`}>
          <Home className={`w-6 h-6 ${activeTab === 'dashboard' ? 'fill-blue-100' : ''}`} />
          <span className="text-[10px] font-bold">Dasbor</span>
        </button>
        
        <button onClick={() => setActiveTab('input')} className="-mt-8 bg-gradient-to-tr from-blue-600 to-purple-600 p-4 rounded-full text-white shadow-[0_8px_20px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-transform border-4 border-white/50 backdrop-blur-sm">
          <PlusCircle className="w-7 h-7" />
        </button>
        
        <button onClick={() => setActiveTab('agenda')} className={`flex flex-col items-center gap-1 transition-colors ${activeTab === 'agenda' ? 'text-purple-600' : 'text-slate-400'}`}>
          <Calendar className={`w-6 h-6 ${activeTab === 'agenda' ? 'fill-purple-100' : ''}`} />
          <span className="text-[10px] font-bold">Agenda</span>
        </button>
      </nav>
      
    </div>
  );
}
