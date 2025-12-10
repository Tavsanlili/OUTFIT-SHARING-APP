import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA ---
const MOCK_OUTFITS = [
  { id: 1, name: "Yaz Esintisi", description: "Sahil yürüyüşleri için mükemmel, hafif ve rahat bir kombin.", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", tags: ["Summer", "Casual"], date: "2023-12-01" },
  { id: 2, name: "Ofis Şıklığı", description: "Kurumsal hayat için ciddi ama modern bir görünüm.", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500", tags: ["Formal", "Winter"], date: "2023-11-20" },
  { id: 3, name: "Sokak Modası", description: "Şehrin ritmine ayak uyduran, dinamik ve havalı.", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500", tags: ["Streetwear", "Casual"], date: "2024-01-10" },
  
  // 👇 GÜNCELLENDİ: Kesin çalışan, şık bir Vintage ceket fotoğrafı
  { id: 4, name: "Vintage Ruhu", description: "90'lardan esintiler taşıyan retro bir tarz.", image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=500&auto=format&fit=crop&q=60", tags: ["Vintage"], date: "2023-10-05" },
  
  { id: 5, name: "Spor Gün", description: "Antrenman veya koşu için en rahat seçim.", image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=500", tags: ["Sport"], date: "2024-01-15" },
  { id: 6, name: "Akşam Yemeği", description: "Şık restoranlar için ideal, zarif bir kombin.", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500", tags: ["Formal"], date: "2023-09-15" },
  { id: 7, name: "Hafta Sonu", description: "Arkadaşlarla kahve içerken giyilecek rahat parçalar.", image: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=500", tags: ["Casual", "Streetwear"], date: "2024-02-01" },
];

const AVAILABLE_TAGS = ["Hepsi", "Casual", "Vintage", "Streetwear", "Sport", "Formal", "Summer", "Winter"];

const ExplorePage = () => {
  const navigate = useNavigate();

  // --- STATE ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("Hepsi");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // --- LOGİKA ---
  const getProcessedData = () => {
    let filtered = MOCK_OUTFITS.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTag = selectedTag === "Hepsi" || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });

    filtered.sort((a, b) => {
      if (sortOption === "newest") return new Date(b.date) - new Date(a.date);
      if (sortOption === "oldest") return new Date(a.date) - new Date(b.date);
      if (sortOption === "az") return a.name.localeCompare(b.name);
      return 0;
    });

    return filtered;
  };

  const processedData = getProcessedData();
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = processedData.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/40 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        
        {/* 👇 GÜNCELLENDİ: İsim "SharingAPP" oldu */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          <span className="text-indigo-600">SharingAPP</span> Keşfet
        </h1>

        {/* --- KONTROL PANELİ --- */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-5 items-center justify-between border border-white/50">
          
          {/* Arama */}
          <div className="w-full md:w-1/3 relative">
            <input 
              type="text" 
              placeholder="Outfit ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-2 border-indigo-100 bg-indigo-50/50 text-indigo-900 placeholder-indigo-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>

          {/* Kaydırma Çubuğu ve Tagler */}
          <div className="w-full md:w-auto overflow-x-auto flex gap-2 pb-3 md:pb-0 
                          [&::-webkit-scrollbar]:h-2
                          [&::-webkit-scrollbar-track]:bg-indigo-50/50
                          [&::-webkit-scrollbar-track]:rounded-full
                          [&::-webkit-scrollbar-thumb]:bg-indigo-200
                          hover:[&::-webkit-scrollbar-thumb]:bg-indigo-300
                          [&::-webkit-scrollbar-thumb]:rounded-full">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border ${
                  selectedTag === tag 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105" 
                  : "bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Sıralama */}
          <div className="w-full md:w-auto">
            <select 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full md:w-48 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors shadow-sm"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="az">İsim (A-Z)</option>
            </select>
          </div>
        </div>

        {/* --- KART LİSTESİ --- */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((outfit) => (
              <div 
                key={outfit.id} 
                onClick={() => navigate(`/outfit/${outfit.id}`)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100/80 flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className="aspect-w-4 aspect-h-3 overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-900 opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                  <img 
                    src={outfit.image} 
                    alt={outfit.name} 
                    className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-700"
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
                     {outfit.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs font-bold bg-white/95 text-indigo-900 px-2 py-1 rounded-md backdrop-blur-md shadow-sm">
                          {tag}
                        </span>
                     ))}
                  </div>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {outfit.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {outfit.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                     <span className="text-xs text-gray-400 font-medium">
                        {outfit.date}
                     </span>
                     <span className="text-sm font-semibold text-indigo-600 group-hover:underline">
                        İncele →
                     </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-2xl border-2 border-dashed border-indigo-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">Sonuç Bulunamadı</h3>
            <p className="text-gray-500 mt-1">Farklı anahtar kelimeler veya filtreler deneyebilirsiniz.</p>
            <button 
                onClick={() => {setSearchTerm(""); setSelectedTag("Hepsi");}}
                className="mt-4 text-indigo-600 font-semibold hover:text-indigo-800"
            >
                Filtreleri Temizle
            </button>
          </div>
        )}

        {/* --- SAYFALAMA --- */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-3">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors bg-white shadow-sm"
            >
              Önceki
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm ${
                  currentPage === index + 1
                    ? "bg-indigo-600 text-white shadow-indigo-200"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors bg-white shadow-sm"
            >
              Sonraki
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;