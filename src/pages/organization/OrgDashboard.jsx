import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import itemService from '../../services/itemService'; // ✅ API servisleri
import tagService from '../../services/tagService';
import useAuthStore from '../../store/authStore'; // ✅ Auth store

const OrgDashboard = () => {
  const [stats, setStats] = useState({
    totalOutfits: 0,
    totalTags: 0,
    recentOutfits: 0,
    totalViews: 0
  });
  
  const [recentOutfits, setRecentOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = useAuthStore((state) => state.user); // ✅ Kullanıcı bilgisi

  // ✅ API'den verileri çek
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ Tüm verileri paralel olarak çek
      const [outfitsResponse, tagsResponse] = await Promise.all([
        itemService.getItems(),
        tagService.getTags()
      ]);

      console.log('Outfits response:', outfitsResponse);
      console.log('Tags response:', tagsResponse);
      
      // ✅ Outfit'leri al (backend yapısına göre)
      const outfitsData = outfitsResponse.data?.items || outfitsResponse.data || outfitsResponse;
      const outfits = Array.isArray(outfitsData) ? outfitsData : [];
      
      // ✅ Tag'leri al
      const tagsData = tagsResponse.data?.tags || tagsResponse.data || tagsResponse;
      const tags = Array.isArray(tagsData) ? tagsData : [];
      
      // ✅ Son 3 outfit'i al (en yeniler)
      const sortedOutfits = [...outfits].sort((a, b) => 
        new Date(b.createdAt || b.created_date) - new Date(a.createdAt || a.created_date)
      );
      const recent = sortedOutfits.slice(0, 3);
      
      // ✅ İstatistikleri hesapla
      setStats({
        totalOutfits: outfits.length,
        totalTags: tags.length,
        recentOutfits: outfits.length, // TODO: Son 7 günü hesapla
        totalViews: 0 // TODO: Backend'den al
      });
      
      setRecentOutfits(recent);
      
    } catch (err) {
      console.error('Dashboard veri çekme hatası:', err);
      setError('Dashboard verileri yüklenirken bir hata oluştu.');
      
      // Demo verilerle devam et
      setStats({
        totalOutfits: 0,
        totalTags: 0,
        recentOutfits: 0,
        totalViews: 0
      });
      setRecentOutfits([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Outfit silme fonksiyonu
  const handleDeleteOutfit = async (id) => {
    if (!window.confirm('Bu outfit\'i silmek istediğinize emin misiniz?')) {
      return;
    }

    try {
      await itemService.deleteItem(id);
      // ✅ Silme başarılı olursa listeyi güncelle
      setRecentOutfits(prev => prev.filter(outfit => outfit.id !== id));
      setStats(prev => ({ ...prev, totalOutfits: prev.totalOutfits - 1 }));
      
      alert('Outfit başarıyla silindi!');
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Outfit silinirken bir hata oluştu.');
    }
  };

  // ✅ Outfit detayı göster
  const handleShowDetails = async (id) => {
    try {
      const response = await itemService.getItem(id);
      console.log('Outfit detayı:', response);
      alert(`Outfit detayları:\n${JSON.stringify(response.data || response, null, 2)}`);
    } catch (err) {
      console.error('Detay çekme hatası:', err);
      alert('Outfit detayları yüklenirken bir hata oluştu.');
    }
  };

  // ✅ Yeni outfit ekle sayfasına yönlendir
  const handleAddNewOutfit = () => {
    // Burada add outfit sayfasına yönlendirme yapabilirsin
    alert('Yeni outfit ekleme sayfasına yönlendiriliyor...');
    // navigate('/organization/add-outfit');
  };

  // ✅ LOADING DURUMU
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  // ✅ ERROR DURUMU
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <div className="text-3xl">⚠️</div>
              <div>
                <h3 className="font-bold text-lg text-red-900 mb-2">Hata</h3>
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={fetchDashboardData}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Tekrar Dene
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Organization Dashboard
          </h1>
          <p className="text-gray-600">
            {user?.email && `Hoş geldiniz, ${user.email}`} • Outfit ve tag yönetimi için kontrol paneliniz
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Outfits */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Toplam Outfit</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOutfits}</p>
              </div>
              <div className="text-4xl">👗</div>
            </div>
          </div>

          {/* Total Tags */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Toplam Tag</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalTags}</p>
              </div>
              <div className="text-4xl">🏷️</div>
            </div>
          </div>

          {/* Recent Outfits */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Toplam Outfit</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalOutfits}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Toplam Görüntüleme</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalViews}</p>
              </div>
              <div className="text-4xl">👁️</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Outfit Management */}
          <Link
            to="/organization/outfits"
            className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">👗</div>
            <h2 className="text-2xl font-bold mb-2">Outfit Yönetimi</h2>
            <p className="text-blue-100 mb-4">
              Tüm outfit'leri görüntüle, düzenle ve yönet ({stats.totalOutfits} outfit)
            </p>
            <div className="flex items-center text-sm font-semibold">
              <span>Yönetim Paneline Git</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          {/* Tag Management */}
          <Link
            to="/organization/tags"
            className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="text-5xl mb-4">🏷️</div>
            <h2 className="text-2xl font-bold mb-2">Tag Yönetimi</h2>
            <p className="text-green-100 mb-4">
              Tag'leri ekle, düzenle ve kategori oluştur ({stats.totalTags} tag)
            </p>
            <div className="flex items-center text-sm font-semibold">
              <span>Tag Paneline Git</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          {/* Add New Outfit */}
          <div 
            onClick={handleAddNewOutfit}
            className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
          >
            <div className="text-5xl mb-4">➕</div>
            <h2 className="text-2xl font-bold mb-2">Yeni Outfit Ekle</h2>
            <p className="text-purple-100 mb-4">
              Yeni bir outfit kombinasyonu oluştur
            </p>
            <div className="flex items-center text-sm font-semibold">
              <span>Oluşturmaya Başla</span>
              <span className="ml-2">→</span>
            </div>
          </div>
        </div>

        {/* Recent Outfits */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📸 Son Eklenen Outfit'ler</h2>
            <Link
              to="/organization/outfits"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
            >
              Tümünü Gör ({stats.totalOutfits}) <span>→</span>
            </Link>
          </div>

          {recentOutfits.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-xl text-gray-500 mb-2">Henüz outfit yok</p>
              <p className="text-gray-400 mb-6">İlk outfit'inizi ekleyerek başlayın!</p>
              <button
                onClick={handleAddNewOutfit}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 font-semibold"
              >
                Yeni Outfit Ekle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
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

                    {/* Description */}
                    {outfit.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {outfit.description}
                      </p>
                    )}

                    {/* Tags */}
                    {outfit.tags && outfit.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {outfit.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {typeof tag === 'string' ? tag : tag.name || tag.id}
                          </span>
                        ))}
                        {outfit.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{outfit.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Date */}
                    {outfit.createdAt && (
                      <p className="text-gray-500 text-xs mb-3">
                        {new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleShowDetails(outfit.id)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                      >
                        Detay
                      </button>
                      <button
                        onClick={() => handleDeleteOutfit(outfit.id)}
                        className="px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💡</div>
            <div>
              <h3 className="font-bold text-lg text-blue-900 mb-2">İpucu</h3>
              <p className="text-blue-800">
                Outfit'lerinizi daha etkili yönetmek için tag'leri kullanmayı unutmayın.
                İyi organize edilmiş tag'ler, kullanıcıların aradıkları kombinleri daha kolay
                bulmalarını sağlar. Şu anda <strong>{stats.totalTags} tag</strong> ve <strong>{stats.totalOutfits} outfit</strong> mevcut.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;