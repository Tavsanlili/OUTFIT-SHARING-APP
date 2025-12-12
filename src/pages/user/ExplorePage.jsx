import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import itemService from '../../services/itemService'; // ✅ API servisi
import tagService from '../../services/tagService'; // ✅ Tag servisi
import useAuthStore from '../../store/authStore'; // ✅ Auth store
import { 
  Search,
  Filter,
  Calendar,
  ArrowUpDown,
  Loader2,
  RefreshCw
} from 'lucide-react';

const ExplorePage = () => {
  const navigate = useNavigate();
  
  // --- STATE ---
  const [outfits, setOutfits] = useState([]);
  const [tags, setTags] = useState(["Hepsi"]); // Başlangıçta "Hepsi" tag'i
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("Hepsi");
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  
  const itemsPerPage = 6;

  // ✅ API'den verileri çek
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Tüm verileri paralel çek
      const [outfitsResponse, tagsResponse] = await Promise.all([
        itemService.getItems(),
        tagService.getTags()
      ]);

      console.log('Outfits response:', outfitsResponse);
      console.log('Tags response:', tagsResponse);
      
      // ✅ Outfit'leri işle
      const outfitsData = outfitsResponse.data?.items || outfitsResponse.data || outfitsResponse;
      if (Array.isArray(outfitsData)) {
        setOutfits(outfitsData.map(outfit => ({
          id: outfit.id || outfit._id,
          name: outfit.name || 'İsimsiz Outfit',
          description: outfit.description || 'Açıklama yok',
          image: outfit.image || outfit.photoUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500',
          tags: outfit.tags ? 
            outfit.tags.map(tag => typeof tag === 'string' ? tag : tag.name || tag.id)
            : [],
          date: outfit.createdAt || outfit.created_date || new Date().toISOString(),
          value: outfit.value || 0,
          likes: outfit.likes || 0,
          views: outfit.views || 0,
          outfitData: outfit
        })));
      } else {
        console.warn('Beklenen array formatı gelmedi:', outfitsData);
        setOutfits([]);
      }
      
      // ✅ Tag'leri işle
      const tagsData = tagsResponse.data?.tags || tagsResponse.data || tagsResponse;
      if (Array.isArray(tagsData)) {
        const tagNames = ["Hepsi"]; // İlk tag "Hepsi"
        tagsData.forEach(tag => {
          const tagName = tag.name || tag.tagName;
          if (tagName && !tagNames.includes(tagName)) {
            tagNames.push(tagName);
          }
        });
        setTags(tagNames);
      }
      
    } catch (err) {
      console.error('Veri çekme hatası:', err);
      setError('Outfit\'ler yüklenirken bir hata oluştu.');
      setOutfits([]);
      setTags(["Hepsi"]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // ✅ Refresh fonksiyonu
  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchData();
  };

  // ✅ Filtreleme ve sıralama işlemi
  const getProcessedData = () => {
    let filtered = [...outfits];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Tag filtresi
    if (selectedTag !== "Hepsi") {
      filtered = filtered.filter(item =>
        item.tags?.some(tag => tag === selectedTag)
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return new Date(b.date) - new Date(a.date);
        case "oldest":
          return new Date(a.date) - new Date(b.date);
        case "az":
          return (a.name || '').localeCompare(b.name || '');
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        case "views":
          return (b.views || 0) - (a.views || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  // ✅ Tarihi formatla
  const formatDate = (dateString) => {
    if (!dateString) return 'Yeni';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Bugün';
      if (diffDays === 1) return 'Dün';
      if (diffDays < 7) return `${diffDays} gün önce`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
      
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long'
      });
    } catch {
      return 'Yeni';
    }
  };

  // ✅ Outfit detayına git
  const handleOutfitClick = (outfitId) => {
    navigate(`/outfit/${outfitId}`);
  };

  // ✅ Outfit beğen
  const handleLike = async (outfitId, e) => {
    e.stopPropagation();
    // TODO: API'ye like isteği gönder
    console.log('Like outfit:', outfitId);
    alert('Like özelliği yakında eklenecek!');
  };

  const processedData = getProcessedData();
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = processedData.slice(startIndex, startIndex + itemsPerPage);

  // ✅ Sayfa değiştiğinde filtreler sıfırlansın
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTag]);

  // ✅ LOADING DURUMU
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-indigo-600 font-medium">Outfit'ler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR DURUMU
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200">
            <p className="font-bold mb-2">⚠️ Hata</p>
            <p>{error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              <span className="text-indigo-600">SharingAPP</span> Keşfet
            </h1>
            <p className="text-indigo-600/80">
              {processedData.length} outfit bulundu • En yeni kombinleri keşfet
            </p>
          </div>
          
          {/* Refresh Butonu */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium transition-all"
          >
            {refreshing ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <RefreshCw size={18} />
            )}
            <span>{refreshing ? 'Yenileniyor...' : 'Yenile'}</span>
          </button>
        </div>

        {/* --- KONTROL PANELİ --- */}
        <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl shadow-sm mb-8 flex flex-col md:flex-row gap-5 items-center justify-between border border-white/50">
          
          {/* Arama */}
          <div className="w-full md:w-1/3 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-indigo-400" size={20} />
            <input 
              type="text" 
              placeholder="Outfit, tag veya açıklama ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 border-2 border-indigo-100 bg-indigo-50/50 text-indigo-900 placeholder-indigo-400 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
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
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 border flex items-center gap-2 ${
                  selectedTag === tag 
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105" 
                  : "bg-white text-indigo-600 border-indigo-100 hover:bg-indigo-50 hover:border-indigo-200"
                }`}
              >
                {tag === "Hepsi" ? (
                  <>
                    <Filter size={14} />
                    {tag}
                  </>
                ) : tag}
              </button>
            ))}
          </div>

          {/* Sıralama */}
          <div className="w-full md:w-auto">
            <div className="relative">
              <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="w-full md:w-48 pl-10 pr-4 border border-gray-200 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-gray-700 cursor-pointer hover:border-indigo-300 transition-colors shadow-sm appearance-none"
              >
                <option value="newest">En Yeni</option>
                <option value="oldest">En Eski</option>
                <option value="az">İsim (A-Z)</option>
                <option value="popular">En Popüler</option>
                <option value="views">En Çok Görüntülenen</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- KART LİSTESİ --- */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map((outfit) => (
              <div 
                key={outfit.id} 
                onClick={() => handleOutfitClick(outfit.id)}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100/80 flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className="aspect-w-4 aspect-h-3 overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-900 opacity-0 group-hover:opacity-10 transition-opacity z-10"></div>
                  <img 
                    src={outfit.image} 
                    alt={outfit.name} 
                    className="w-full h-72 object-cover transform group-hover:scale-110 transition duration-700"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500';
                    }}
                  />
                  <div className="absolute top-3 right-3 flex flex-col gap-1 z-20">
                    {outfit.tags?.slice(0, 2).map((tag, index) => (
                      <span 
                        key={index} 
                        className="text-xs font-bold bg-white/95 text-indigo-900 px-2 py-1 rounded-md backdrop-blur-md shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Like Button */}
                  <button
                    onClick={(e) => handleLike(outfit.id, e)}
                    className="absolute top-3 left-3 p-2 bg-white/90 backdrop-blur-md rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-all z-20"
                  >
                    ❤️
                  </button>
                </div>
                
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {outfit.name}
                    </h3>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {outfit.value || 0} puan
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow leading-relaxed">
                    {outfit.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={14} />
                      <span>{formatDate(outfit.date)}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">
                        ❤️ {outfit.likes || 0}
                      </span>
                      <span className="text-sm font-semibold text-indigo-600 group-hover:underline">
                        İncele →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/60 backdrop-blur-md rounded-2xl border-2 border-dashed border-indigo-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900">
              {searchTerm || selectedTag !== "Hepsi" ? 'Sonuç Bulunamadı' : 'Henüz outfit yok'}
            </h3>
            <p className="text-gray-500 mt-1">
              {searchTerm || selectedTag !== "Hepsi" 
                ? 'Farklı anahtar kelimeler veya filtreler deneyebilirsiniz.'
                : 'İlk outfit\'leri eklemek için organizasyon panelini kullanın.'}
            </p>
            <button 
              onClick={() => {setSearchTerm(""); setSelectedTag("Hepsi");}}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
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
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors bg-white shadow-sm flex items-center gap-2"
            >
              ← Önceki
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              // Sadece ilk, son ve yakın sayfaları göster
              if (
                pageNum === 1 ||
                pageNum === totalPages ||
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm ${
                      currentPage === pageNum
                        ? "bg-indigo-600 text-white shadow-indigo-200"
                        : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }
              return null;
            })}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-colors bg-white shadow-sm flex items-center gap-2"
            >
              Sonraki →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;