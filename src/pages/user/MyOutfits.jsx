import React, { useState } from 'react';
import { 
  Plus, 
  Heart, 
  Trash2, 
  MoreVertical, 
  Layers, 
  Grid 
} from 'lucide-react';

// --- SABİT BAŞLANGIÇ VERİLERİ (Artık State içine koyacağız) ---
const INITIAL_COMBINATIONS = [
  {
    id: 1,
    name: "Sonbahar Yürüyüşü",
    items: 4,
    image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=800&q=80",
    date: "2 gün önce"
  },
  {
    id: 2,
    name: "İş Görüşmesi",
    items: 3,
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500",
    date: "1 hafta önce"
  },
  {
    id: 3,
    name: "Kahve Buluşması",
    items: 5,
    image: "https://images.unsplash.com/photo-1601933470096-0e34634ffcde?w=600&q=80",
    date: "3 hafta önce"
  }
];

const INITIAL_FAVORITES = [
  { id: 101, name: "Deri Ceket", brand: "Zara", image: "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80", price: "₺1.200" },
  { id: 102, name: "Sneaker", brand: "Nike", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500", price: "₺3.400" },
  { id: 103, name: "Kot Pantolon", brand: "Mavi", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500", price: "₺890" },
  { id: 104, name: "Güneş Gözlüğü", brand: "RayBan", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500", price: "₺4.500" },
];

const MyOutfits = () => {
  const [activeTab, setActiveTab] = useState('combinations');
  
  // --- STATE YÖNETİMİ (Veriler artık canlı) ---
  const [combinations, setCombinations] = useState(INITIAL_COMBINATIONS);
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES);

  // 🗑️ FONKSİYON: Kombin Sil
  const handleDeleteCombo = (id) => {
    if (window.confirm("Bu kombini silmek istediğine emin misin?")) {
      setCombinations(combinations.filter(item => item.id !== id));
    }
  };

  // ❤️ FONKSİYON: Favori Sil
  const handleDeleteFavorite = (id) => {
    setFavorites(favorites.filter(item => item.id !== id));
  };

  // ➕ FONKSİYON: Yeni Kombin Ekle (Demo için)
  const handleAddCombo = () => {
    const newCombo = {
      id: Date.now(), // Benzersiz ID
      name: `Yeni Kombin #${combinations.length + 1}`,
      items: Math.floor(Math.random() * 5) + 1,
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", // Rastgele bir foto
      date: "Az önce"
    };
    setCombinations([newCombo, ...combinations]); // Listeyi güncelle
    // Normalde burada bir "Kombin Oluşturma Sayfası"na yönlendiririz, şimdilik demo ekliyor.
    alert("Listeye demo bir kombin eklendi! 🚀"); 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      
      {/* BAŞLIK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Dolabım</h1>
          <p className="text-indigo-600/80 text-sm mt-1 font-medium">Kaydettiğin kombinler ve favori parçaların burada.</p>
        </div>
        
        {/* Üstteki Yeni Ekle Butonu */}
        <button 
          onClick={handleAddCombo}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Yeni Kombin Oluştur</span>
        </button>
      </div>

      {/* TAB BUTONLARI */}
      <div className="bg-white/60 backdrop-blur-sm p-1.5 rounded-2xl shadow-sm border border-indigo-50 inline-flex mb-8 w-full md:w-auto">
        <button 
          onClick={() => setActiveTab('combinations')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'combinations' 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Layers size={18} />
          Kombinlerim
        </button>
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
            activeTab === 'favorites' 
            ? 'bg-indigo-600 text-white shadow-md' 
            : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Heart size={18} />
          Favorilerim
        </button>
      </div>

      {/* --- KOMBİNLERİM SEKMESİ --- */}
      {activeTab === 'combinations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combinations.map((combo) => (
            <div key={combo.id} className="group bg-white rounded-3xl border border-indigo-50 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 cursor-pointer">
              <div className="relative h-56 overflow-hidden">
                 <img src={combo.image} alt={combo.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                 
                 {/* 🗑️ SİLME BUTONU - ARTIK ÇALIŞIYOR */}
                 <div 
                    onClick={(e) => {
                      e.stopPropagation(); // Tıklama karta gitmesin, sadece silme çalışsın
                      handleDeleteCombo(combo.id);
                    }}
                    className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-indigo-400 hover:text-red-500 hover:bg-red-50 shadow-sm"
                 >
                    <Trash2 size={18} />
                 </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                   <h3 className="text-lg font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors">{combo.name}</h3>
                   <button 
                      onClick={() => alert("Detay menüsü yakında eklenecek!")}
                      className="!bg-transparent !p-2 rounded-full !text-indigo-300 hover:!bg-indigo-50 hover:!text-indigo-600 transition-colors"
                   >
                      <MoreVertical size={20} />
                   </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-indigo-400 font-semibold bg-indigo-50/50 p-3 rounded-xl border border-indigo-50/50">
                  <span className="flex items-center gap-1.5"><Grid size={16}/> {combo.items} Parça</span>
                  <span className="text-indigo-300">•</span>
                  <span>{combo.date}</span>
                </div>
              </div>
            </div>
          ))}
          
          {/* Kart İçindeki Yeni Ekle Butonu */}
          <button 
             onClick={handleAddCombo}
             className="relative overflow-hidden rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center transition-all duration-300 group
                             bg-white/60 border-2 border-indigo-100 hover:border-indigo-500
                             hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2"
          >
             <div className="w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 shadow-sm 
                             group-hover:bg-white group-hover:scale-110 group-hover:rotate-90 transition-all duration-500">
               <Plus size={36} strokeWidth={2.5} />
             </div>
             <span className="text-xl font-bold text-indigo-900 group-hover:text-white transition-colors duration-300">
               Yeni Kombin Ekle
             </span>
             <span className="text-sm text-indigo-400 mt-2 font-medium group-hover:text-indigo-100 transition-colors duration-300">
               Hayalindeki tarzı oluştur
             </span>
          </button>
        </div>
      )}

      {/* --- FAVORİLERİM SEKMESİ --- */}
      {activeTab === 'favorites' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((fav) => (
             <div key={fav.id} className="bg-white rounded-2xl border border-indigo-50 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 group relative cursor-pointer">
                <div className="aspect-square overflow-hidden bg-indigo-50/30 relative">
                   <img src={fav.image} alt={fav.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                </div>
                
                {/* ❤️ KALP BUTONU - ARTIK SİLİYOR */}
                <button 
                  onClick={() => handleDeleteFavorite(fav.id)}
                  className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-red-500 hover:bg-red-50 hover:scale-110 transition-all border border-indigo-50"
                  title="Favorilerden Çıkar"
                >
                   <Heart size={18} fill="currentColor" />
                </button>

                <div className="p-5">
                   <p className="text-[10px] text-indigo-400 font-bold mb-1 uppercase tracking-widest">{fav.brand}</p>
                   <h3 className="text-sm font-bold text-indigo-900 line-clamp-1 mb-3 group-hover:text-indigo-600 transition-colors">{fav.name}</h3>
                   <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                     {fav.price}
                   </span>
                </div>
             </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyOutfits;