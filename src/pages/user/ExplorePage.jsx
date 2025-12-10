import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// --- MOCK DATA (Backend gelene kadar test için) ---
// Tarihleri sıralamayı test etmek için ekledik.
const MOCK_OUTFITS = [
  { id: 1, name: "Yaz Esintisi", description: "Sahil yürüyüşleri için mükemmel, hafif ve rahat bir kombin.", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500", tags: ["Summer", "Casual"], date: "2023-12-01" },
  { id: 2, name: "Ofis Şıklığı", description: "Kurumsal hayat için ciddi ama modern bir görünüm.", image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=500", tags: ["Formal", "Winter"], date: "2023-11-20" },
  { id: 3, name: "Sokak Modası", description: "Şehrin ritmine ayak uyduran, dinamik ve havalı.", image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500", tags: ["Streetwear", "Casual"], date: "2024-01-10" },
  { id: 4, name: "Vintage Ruhu", description: "90'lardan esintiler taşıyan retro bir tarz.", image: "https://images.unsplash.com/photo-1550614000-4b9519e0037a?w=500", tags: ["Vintage"], date: "2023-10-05" },
  { id: 5, name: "Spor Gün", description: "Antrenman veya koşu için en rahat seçim.", image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=500", tags: ["Sport"], date: "2024-01-15" },
  { id: 6, name: "Akşam Yemeği", description: "Şık restoranlar için ideal, zarif bir kombin.", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500", tags: ["Formal"], date: "2023-09-15" },
  { id: 7, name: "Hafta Sonu", description: "Arkadaşlarla kahve içerken giyilecek rahat parçalar.", image: "https://images.unsplash.com/photo-1589363360147-4f2d5154a54c?w=500", tags: ["Casual", "Streetwear"], date: "2024-02-01" },
];

const AVAILABLE_TAGS = ["Hepsi", "Casual", "Vintage", "Streetwear", "Sport", "Formal", "Summer", "Winter"];

const ExplorePage = () => {
  const navigate = useNavigate();

  // --- STATE YÖNETİMİ ---
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("Hepsi");
  const [sortOption, setSortOption] = useState("newest"); // newest, oldest, az
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Sayfa başına kaç kart

  // --- FİLTRELEME & SIRALAMA MANTIĞI ---
  const getProcessedData = () => {
    let filtered = MOCK_OUTFITS.filter(item => {
      // 1. Arama (Başlık içinde)
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      // 2. Filtreleme (Tag)
      const matchesTag = selectedTag === "Hepsi" || item.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });

    // 3. Sıralama
    filtered.sort((a, b) => {
      if (sortOption === "newest") return new Date(b.date) - new Date(a.date); // Yeni -> Eski
      if (sortOption === "oldest") return new Date(a.date) - new Date(b.date); // Eski -> Yeni
      if (sortOption === "az") return a.name.localeCompare(b.name); // A -> Z
      return 0;
    });

    return filtered;
  };

  const processedData = getProcessedData();

  // --- SAYFALAMA HESABI ---
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = processedData.slice(startIndex, startIndex + itemsPerPage);

  // Arama veya filtre değişince 1. sayfaya dön
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Kıyafetleri Keşfet</h1>

        {/* --- KONTROL PANELİ (Arama, Filtre, Sıralama) --- */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          
          {/* Arama */}
          <div className="w-full md:w-1/3">
            <input 
              type="text" 
              placeholder="Outfit ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tag Filtreleme */}
          <div className="w-full md:w-auto overflow-x-auto flex gap-2 no-scrollbar">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTag === tag 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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
              className="w-full md:w-48 border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="newest">En Yeni</option>
              <option value="oldest">En Eski</option>
              <option value="az">İsim (A-Z)</option>
            </select>
          </div>
        </div>

        {/* --- KART LİSTESİ --- */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((outfit) => (
              <div 
                key={outfit.id} 
                onClick={() => navigate(`/outfit/${outfit.id}`)} // Detay sayfasına yönlendirme
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                {/* Kart Fotoğrafı */}
                <div className="aspect-w-4 aspect-h-3 overflow-hidden">
                  <img 
                    src={outfit.image} 
                    alt={outfit.name} 
                    className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-500"
                  />
                </div>
                
                {/* Kart İçeriği */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      {outfit.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-grow">
                    {outfit.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-auto">
                    {outfit.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun kombin bulunamadı.</p>
          </div>
        )}

        {/* --- SAYFALAMA (PAGINATION) --- */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-10 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Önceki
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-md font-medium ${
                  currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-gray-50 text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-gray-50"
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