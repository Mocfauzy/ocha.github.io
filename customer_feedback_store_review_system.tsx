import React, { useState, useMemo } from 'react';
import { 
  Star, 
  Store, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  BarChart3, 
  UserCheck, 
  Sparkles,
  Filter,
  Clock,
  ThumbsUp,
  Building2,
  Coffee,
  Sparkle,
  ShieldCheck,
  Search,
  ArrowRight
} from 'lucide-react';

// Sample Data Awal Ulasan
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Budi Santoso",
    transactionId: "TRX-8921",
    rating: 5,
    aspects: ["Pelayanan Kasir", "Kualitas Produk", "Kebersihan Tempat"],
    comment: "Kopi dan gigitan camilannya luar biasa! Tempatnya bersih banget dan stafnya ramah melayani dengan senyuman.",
    date: "10 menit yang lalu"
  },
  {
    id: 2,
    name: "Siti Rahmawati",
    transactionId: "Meja 04",
    rating: 4,
    aspects: ["Suasana/Ambiance", "Kualitas Produk"],
    comment: "Suasananya sangat nyaman untuk kerja remote. AC pas dan Wi-Fi lumayan kencang. Penyajian agak sedikit lama tapi dimaafkan karena rasanya enak.",
    date: "1 jam yang lalu"
  },
  {
    id: 3,
    name: "Anonim",
    transactionId: "TRX-8801",
    rating: 5,
    aspects: ["Kecepatan Penyajian", "Pelayanan Kasir"],
    comment: "Pesan via drive-thru cepat banget! Baristanya paham betul rekomendasi menu yang cocok sama selera saya.",
    date: "3 jam yang lalu"
  },
  {
    id: 4,
    name: "Dedi Prasetyo",
    transactionId: "Meja 12",
    rating: 3,
    aspects: ["Kualitas Produk"],
    comment: "Rasa makanan enak, tapi kebersihan di area meja outdoor tolong lebih ditingkatkan lagi ya.",
    date: "Yesterday"
  }
];

// Pilihan Aspek Layanan
const SERVICE_ASPECTS = [
  { id: 'pelayanan', label: 'Pelayanan Barista/Kasir', icon: '😊' },
  { id: 'kualitas', label: 'Kualitas Produk', icon: '☕' },
  { id: 'kebersihan', label: 'Kebersihan Tempat', icon: '✨' },
  { id: 'kecepatan', label: 'Kecepatan Penyajian', icon: '⚡' },
  { id: 'suasana', label: 'Suasana/Ambiance', icon: '🛋️' }
];

export default function App() {
  // State Utama
  const [activeTab, setActiveTab] = useState('customer'); // 'customer' | 'admin'
  const [storeName, setStoreName] = useState('Kopi Senja & Co.');
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedAspects, setSelectedAspects] = useState([]);
  const [customerName, setCustomerName] = useState('');
  const [transactionInfo, setTransactionInfo] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Admin Filter State
  const [selectedFilterRating, setSelectedFilterRating] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Kalkulasi Statistik Rating
  const stats = useMemo(() => {
    const total = reviews.length;
    if (total === 0) return { average: '0.0', counts: [0, 0, 0, 0, 0] };
    
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    const average = (sum / total).toFixed(1);
    
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach(r => {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1]++;
      }
    });

    return { average, counts, total };
  }, [reviews]);

  // Handle Select/Deselect Aspect Tag
  const toggleAspect = (label) => {
    if (selectedAspects.includes(label)) {
      setSelectedAspects(selectedAspects.filter(a => a !== label));
    } else {
      setSelectedAspects([...selectedAspects, label]);
    }
  };

  // Submit Handler
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const newReview = {
        id: Date.now(),
        name: customerName.trim() || 'Pelanggan Anonim',
        transactionId: transactionInfo.trim() || 'Umum',
        rating,
        aspects: selectedAspects,
        comment: comment.trim(),
        date: 'Baru saja'
      };

      setReviews([newReview, ...reviews]);
      setIsSubmitting(false);
      setShowSuccessModal(true);

      // Reset Form
      setRating(0);
      setHoverRating(0);
      setSelectedAspects([]);
      setCustomerName('');
      setTransactionInfo('');
      setComment('');
    }, 800);
  };

  // Filter Ulasan di Admin View
  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchRating = selectedFilterRating === 'all' || r.rating === Number(selectedFilterRating);
      const matchSearch = r.comment.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRating && matchSearch;
    });
  }, [reviews, selectedFilterRating, searchQuery]);

  return (
    <div className="min-h-screen bg-amber-50/40 text-stone-800 font-sans antialiased pb-12">
      {/* Top Navigation Bar */}
      <header className="bg-stone-900 text-amber-50 sticky top-0 z-30 shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap justify-between items-center gap-4">
          
          {/* Logo & Info Toko */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-stone-900 shadow-md shadow-amber-500/20 font-bold">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <input 
                type="text" 
                value={storeName} 
                onChange={(e) => setStoreName(e.target.value)}
                className="bg-transparent text-lg font-bold text-amber-100 hover:bg-stone-800/80 px-2 py-0.5 rounded border border-transparent hover:border-stone-700 transition focus:outline-none focus:border-amber-400"
                title="Klik untuk mengubah nama toko"
              />
              <div className="flex items-center text-xs text-amber-400/90 space-x-2 px-2">
                <span className="flex items-center">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {stats.average} / 5.0
                </span>
                <span>•</span>
                <span>{stats.total} Ulasan Pelanggan</span>
              </div>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-stone-800 p-1 rounded-xl border border-stone-700/60">
            <button
              onClick={() => setActiveTab('customer')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'customer' 
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Kirim Ulasan</span>
            </button>

            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'admin' 
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard Toko</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 mt-8">
        
        {/* TAB 1: FORM ULSAN CUSTOMER */}
        {activeTab === 'customer' && (
          <div className="max-w-2xl mx-auto">
            {/* Banner Sambutan */}
            <div className="text-center mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-200/60 text-amber-900 mb-3 border border-amber-300/50">
                <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-700" /> Suara Anda Sangat Berharga
              </span>
              <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
                Bagaimana Pengalaman Anda?
              </h1>
              <p className="text-stone-600 mt-2 text-sm max-w-md mx-auto">
                Bantu {storeName} menyajikan pelayanan terbaik dengan memberikan umpan balik sejujurnya.
              </p>
            </div>

            {/* Form Card */}
            <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-200/80 p-6 md:p-8 space-y-6">
              
              {/* Rating Bintang */}
              <div className="bg-amber-50/50 rounded-xl p-6 border border-amber-100 text-center">
                <label className="block text-sm font-bold text-stone-700 mb-3">
                  Berapa bintang yang ingin Anda berikan? <span className="text-rose-500">*</span>
                </label>
                <div className="flex justify-center items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transform hover:scale-125 transition-transform duration-150"
                    >
                      <Star 
                        className={`w-9 h-9 md:w-11 md:h-11 transition-colors duration-200 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-stone-300 fill-stone-100'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <div className="h-6 mt-2">
                  { (hoverRating || rating) > 0 && (
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-800 animate-fade-in">
                      {['Sangat Kecewa 😞', 'Kurang Memuaskan 🙁', 'Cukup Baik 😐', 'Sangat Bagus 😊', 'Luar Biasa Memuaskan! 🎉'][(hoverRating || rating) - 1]}
                    </span>
                  )}
                </div>
              </div>

              {/* Tag Aspek Layanan */}
              <div>
                <label className="block text-sm font-bold text-stone-700 mb-2">
                  Apa saja yang menurut Anda menonjol atau perlu diperhatikan?
                </label>
                <p className="text-xs text-stone-500 mb-3">Pilih satu atau beberapa aspek di bawah ini:</p>
                <div className="flex flex-wrap gap-2">
                  {SERVICE_ASPECTS.map((aspect) => {
                    const isSelected = selectedAspects.includes(aspect.label);
                    return (
                      <button
                        key={aspect.id}
                        type="button"
                        onClick={() => toggleAspect(aspect.label)}
                        className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-all ${
                          isSelected
                            ? 'bg-amber-800 text-amber-50 border-amber-800 shadow-sm scale-105'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                        }`}
                      >
                        <span>{aspect.icon}</span>
                        <span>{aspect.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Input Nama & Transaksi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Nama Anda <span className="text-stone-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Budi Santoso"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    No. Meja / ID Transaksi <span className="text-stone-400 font-normal">(Opsional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Meja 05 / TRX-102"
                    value={transactionInfo}
                    onChange={(e) => setTransactionInfo(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                  />
                </div>
              </div>

              {/* Input Ulasan Teks */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Ulasan Detail / Saran Tambahan
                </label>
                <textarea
                  rows="4"
                  placeholder="Ceritakan pengalaman Anda secara lebih rinci..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className={`w-full py-3.5 px-6 rounded-xl text-white font-bold text-sm shadow-md flex items-center justify-center space-x-2 transition-all ${
                  rating === 0 || isSubmitting
                    ? 'bg-stone-300 cursor-not-allowed text-stone-500'
                    : 'bg-amber-600 hover:bg-amber-700 active:scale-[0.99] shadow-amber-600/30'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Penilaian</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: DASHBOARD ADMIN & Ulasan */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            
            {/* Header Dashboard */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-900 text-amber-50 p-6 rounded-2xl shadow-lg">
              <div>
                <h2 className="text-2xl font-bold">Ringkasan Ulasan Toko</h2>
                <p className="text-stone-400 text-xs mt-1">
                  Pantau performa kepuasan pelanggan secara rinci dan real-time.
                </p>
              </div>
              <div className="flex items-center space-x-3 bg-stone-800/80 px-4 py-2.5 rounded-xl border border-stone-700">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold">{storeName}</span>
              </div>
            </div>

            {/* Metrics Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Score Average Card */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Rating Rata-rata</span>
                <div className="text-5xl font-extrabold text-stone-900 my-1">{stats.average}</div>
                <div className="flex items-center space-x-1 my-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= Math.round(Number(stats.average))
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-200 fill-stone-100'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-500">Berdasarkan {stats.total} penilaian</span>
              </div>

              {/* Rating Breakdown Bar Chart */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm md:col-span-2 flex flex-col justify-center">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">Distribusi Bintang</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = stats.counts[star - 1] || 0;
                    const percent = stats.total ? (count / stats.total) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center text-xs space-x-3">
                        <div className="flex items-center w-12 text-stone-600 font-semibold">
                          <span>{star}</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 ml-1" />
                        </div>
                        <div className="flex-1 bg-stone-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-amber-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="w-10 text-right text-stone-500 font-medium">
                          {count} ({Math.round(percent)}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              
              {/* Filter Stars */}
              <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                <Filter className="w-4 h-4 text-stone-400 flex-shrink-0 ml-1" />
                <span className="text-xs font-bold text-stone-600 flex-shrink-0">Filter Rating:</span>
                <button
                  onClick={() => setSelectedFilterRating('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedFilterRating === 'all'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Semua ({stats.total})
                </button>
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSelectedFilterRating(String(star))}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 transition ${
                      selectedFilterRating === String(star)
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Cari ulasan atau nama..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

            </div>

            {/* List Ulasan Card */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                  <MessageSquare className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-stone-700">Belum Ada Ulasan</h4>
                  <p className="text-xs text-stone-500 mt-1">Tidak ada ulasan yang sesuai dengan kriteria filter saat ini.</p>
                </div>
              ) : (
                filteredReviews.map((rev) => (
                  <div key={rev.id} className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm hover:shadow-md transition">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-stone-900 text-base">{rev.name}</h4>
                          <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded font-mono">
                            {rev.transactionId}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-4 h-4 ${
                                s <= rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-stone-200 fill-stone-100'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center text-xs text-stone-400">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        <span>{rev.date}</span>
                      </div>
                    </div>

                    {/* Aspect Chips */}
                    {rev.aspects && rev.aspects.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {rev.aspects.map((aspect, idx) => (
                          <span key={idx} className="text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                            ✓ {aspect}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Comments */}
                    {rev.comment && (
                      <p className="text-stone-700 text-sm bg-stone-50/70 p-3.5 rounded-xl border border-stone-100 italic">
                        "{rev.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </main>

      {/* Success Modal Pop-up */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-amber-100 animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-extrabold text-stone-900 mb-2">Terima Kasih!</h3>
            <p className="text-xs text-stone-600 mb-6">
              Ulasan Anda sangat berharga untuk kemajuan layanan <span className="font-semibold text-stone-800">{storeName}</span>.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm transition shadow-md shadow-amber-600/20"
            >
              Tutup & Kembali
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-4 mt-16 text-center text-xs text-stone-400">
        <p>© {new Date().getFullYear()} {storeName} • Customer Experience & Feedback System</p>
      </footer>
    </div>
  );
}