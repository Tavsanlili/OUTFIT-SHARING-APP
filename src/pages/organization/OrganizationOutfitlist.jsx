import { useState, useEffect } from 'react'; // ✅ useEffect ekle
import itemService from '../../services/itemService'; // ✅ API servisini import et

const OrganizationOutfitList = () => {
  const [outfits, setOutfits] = useState([]); // ✅ Demo verileri kaldır, API'den al
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ Loading state ekle
  const [error, setError] = useState(null); // ✅ Error state ekle
  const itemsPerPage = 6;

  // ✅ API'den outfit'leri çek
  useEffect(() => {
    fetchOutfits();
  }, []); // ✅ Sadece component mount olduğunda çalışsın

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ API'ye istek gönder
      const response = await itemService.getItems({
        // İstersen buraya filtreleme parametreleri ekleyebilirsin
        // sort: sortOrder,
        // page: currentPage,
        // limit: itemsPerPage
      });
      
      // ✅ Response yapısına göre outfits'i al
      console.log('API Response:', response); // Debug için
      
      // Backend'in response yapısına göre ayarla:
      // Eğer response.data içinde array varsa: response.data.items || response.data
      // Eğer direkt array ise: response
      const outfitsData = response.data?.items || response.data || response;
      
      if (Array.isArray(outfitsData)) {
        setOutfits(outfitsData);
      } else {
        console.warn('Beklenen array formatı gelmedi:', outfitsData);
        setOutfits([]);
      }
      
    } catch (err) {
      console.error('Outfit çekme hatası:', err);
      setError('Outfit\'ler yüklenirken bir hata oluştu.');
      setOutfits([]); // Hata durumunda boş array
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete fonksiyonunu API ile çalışır hale getir
  const handleDelete = async (id) => {
    if (!window.confirm('Bu outfit\'i silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      // ✅ API'ye silme isteği gönder
      await itemService.deleteItem(id);
      
      // ✅ Başarılı olursa local state'den kaldır
      setOutfits(prev => prev.filter(outfit => outfit.id !== id));
      
      alert('Outfit başarıyla silindi!');
      
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Outfit silinirken bir hata oluştu.');
    }
  };

  // ✅ Detay göster fonksiyonu
  const handleShowDetails = async (id) => {
    try {
      // ✅ API'den tek outfit detayını al
      const response = await itemService.getItem(id);
      console.log('Outfit detayı:', response);
      
      // Burada modal açabilir veya detay sayfasına yönlendirebilirsin
      alert(`Outfit detayları:\n${JSON.stringify(response.data || response, null, 2)}`);
      
    } catch (err) {
      console.error('Detay çekme hatası:', err);
      alert('Outfit detayları yüklenirken bir hata oluştu.');
    }
  };

  // ✅ Düzenle fonksiyonu
  const handleEdit = (id) => {
    // Düzenleme sayfasına yönlendir veya modal aç
    alert(`Outfit #${id} düzenleme sayfasına yönlendiriliyor...`);
    // navigate(`/edit-outfit/${id}`);
  };

  // Filtreleme ve sıralama (LOCAL - API'den gelmiş veriler üzerinde)
  const getFilteredOutfits = () => {
    let filtered = [...outfits];

    // Arama
    if (searchTerm) {
      filtered = filtered.filter(outfit =>
        outfit.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outfit.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt || b.created_date) - new Date(a.createdAt || a.created_date);
        case 'oldest':
          return new Date(a.createdAt || a.created_date) - new Date(b.createdAt || b.created_date);
        case 'a-z':
          return (a.name || '').localeCompare(b.name || '');
        case 'z-a':
          return (b.name || '').localeCompare(a.name || '');
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredOutfits = getFilteredOutfits();
  const totalPages = Math.ceil(filteredOutfits.length / itemsPerPage);
  const paginatedOutfits = filteredOutfits.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ✅ LOADING DURUMU
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Outfit'ler yükleniyor...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR DURUMU
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg">
          <p className="font-bold mb-2">⚠️ Hata</p>
          <p>{error}</p>
          <button 
            onClick={fetchOutfits}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">👗 Outfit Yönetimi</h1>
          <p className="text-gray-600">
            Toplam {filteredOutfits.length} outfit bulundu
          </p>
        </div>
        <button
          onClick={fetchOutfits} // ✅ Yenile butonu
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          🔄 Yenile
        </button>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Outfit ara... (isim veya açıklama)"
                value={searchTerm}
                onChange={handleSearch}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort */}
          <div className="w-full md:w-64">
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="newest">📅 Yeni → Eski</option>
              <option value="oldest">📅 Eski → Yeni</option>
              <option value="a-z">🔤 A → Z</option>
              <option value="z-a">🔤 Z → A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Outfit Grid */}
      {paginatedOutfits.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-500 mb-2">Hiç outfit bulunamadı</p>
          <p className="text-gray-400">Yeni outfit eklemeyi deneyin</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onDelete={handleDelete}
                onShowDetails={handleShowDetails} // ✅ Yeni prop
                onEdit={handleEdit} // ✅ Yeni prop
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

// Outfit Card Component - Props güncellendi
const OutfitCard = ({ outfit, onDelete, onShowDetails, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
        <img
          src={outfit.image || outfit.photoUrl || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400'}
          alt={outfit.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400';
          }}
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">
          {outfit.name || 'İsimsiz Outfit'}
        </h3>

        {/* Tags */}
        {outfit.tags && outfit.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {outfit.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
              >
                {typeof tag === 'string' ? tag : tag.name || tag.id}
              </span>
            ))}
            {outfit.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{outfit.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Description */}
        {outfit.description && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {outfit.description}
          </p>
        )}

        {/* Date */}
        {outfit.createdAt && (
          <p className="text-gray-400 text-xs mb-4">
            {new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onShowDetails(outfit.id)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Detay
          </button>
          <button
            onClick={() => onEdit(outfit.id)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            title="Düzenle"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(outfit.id)}
            className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            title="Sil"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// Pagination Component (Aynı kalıyor)
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        ← Önceki
      </button>

      {/* Page Numbers */}
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
      >
        Sonraki →
      </button>
    </div>
  );
};

export default OrganizationOutfitList;