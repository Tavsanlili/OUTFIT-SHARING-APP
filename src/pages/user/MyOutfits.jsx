import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ EKLENEN
import { 
  Plus, 
  Heart, 
  Trash2, 
  MoreVertical, 
  Layers, 
  Grid,
  Loader2
} from 'lucide-react';
import itemService from '../../services/itemService';
import useAuthStore from '../../store/authStore';

const MyOutfits = () => {
  const navigate = useNavigate(); // ✅ EKLENEN
  const [activeTab, setActiveTab] = useState('combinations');
  const [combinations, setCombinations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await itemService.getItems({});
      
      console.log('Outfits response:', response);
      
      const outfitsData = response.data?.items || response.data || response;
      
      if (Array.isArray(outfitsData)) {
        const userOutfits = outfitsData.filter(outfit => 
          outfit.userId === user?.id || outfit.userEmail === user?.email
        );
        
        setCombinations(userOutfits.map(outfit => ({
          id: outfit.id || outfit._id,
          name: outfit.name || 'İsimsiz Kombin',
          items: outfit.tags?.length || outfit.itemsCount || 0,
          image: outfit.image || outfit.photoUrl || 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=800&q=80',
          date: formatDate(outfit.createdAt || outfit.created_date),
          outfitData: outfit
        })));
        
        setFavorites([]);
      } else {
        console.warn('Beklenen array formatı gelmedi:', outfitsData);
        setCombinations([]);
        setFavorites([]);
      }
      
    } catch (err) {
      console.error('Outfit çekme hatası:', err);
      setError('Outfit\'ler yüklenirken bir hata oluştu.');
      setCombinations([]);
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Yakın zamanda';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Bugün';
    if (diffDays === 1) return 'Dün';
    if (diffDays < 7) return `${diffDays} gün önce`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} hafta önce`;
    
    return date.toLocaleDateString('tr-TR');
  };

  const handleDeleteCombo = async (id) => {
    if (!window.confirm("Bu kombini silmek istediğine emin misin?")) {
      return;
    }

    try {
      await itemService.deleteItem(id);
      setCombinations(prev => prev.filter(item => item.id !== id));
      alert('Kombin başarıyla silindi!');
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Kombin silinirken bir hata oluştu.');
    }
  };

  const handleDeleteFavorite = (id) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
  };

  // ✅ DEĞİŞTİRİLDİ: Yeni sayfaya yönlendir
  const handleAddCombo = () => {
    navigate('/my-outfits/add');
  };

  // ✅ DEĞİŞTİRİLDİ: Detay sayfasına yönlendir
  const handleShowDetails = (outfitId) => {
    navigate(`/my-outfits/${outfitId}`);
  };

  // ✅ EKLENEN: Düzenleme sayfasına yönlendir
  const handleEditOutfit = (outfitId, e) => {
    e.stopPropagation();
    navigate(`/my-outfits/edit/${outfitId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
          <p className="text-indigo-600 font-medium">Kombinler yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200">
          <p className="font-bold mb-2">⚠️ Hata</p>
          <p>{error}</p>
          <button 
            onClick={fetchOutfits}
            className="mt-4 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-medium"
          >
            Tekrar Dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-900 tracking-tight">Dolabım</h1>
          <p className="text-indigo-600/80 text-sm mt-1 font-medium">
            {user?.email && `Hoş geldin, ${user.email.split('@')[0]}`} • Kaydettiğin kombinler ve favori parçaların burada.
          </p>
        </div>
        
        <button 
          onClick={handleAddCombo}
          disabled={adding}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {adding ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Ekleniyor...</span>
            </>
          ) : (
            <>
              <Plus size={20} />
              <span>Yeni Kombin Oluştur</span>
            </>
          )}
        </button>
      </div>

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
          Kombinlerim ({combinations.length})
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
          Favorilerim ({favorites.length})
        </button>
      </div>

      {activeTab === 'combinations' && (
        <>
          {combinations.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-3xl border border-indigo-100">
              <div className="text-6xl mb-4">👗</div>
              <p className="text-xl text-indigo-800 mb-2">Henüz kombin yok</p>
              <p className="text-indigo-400 mb-6">İlk kombinini oluşturarak başla!</p>
              <button 
                onClick={handleAddCombo}
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/20"
              >
                İlk Kombinimi Oluştur
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {combinations.map((combo) => (
                <div key={combo.id} className="group bg-white rounded-3xl border border-indigo-50 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 cursor-pointer">
                  <div 
                    className="relative h-56 overflow-hidden cursor-pointer"
                    onClick={() => handleShowDetails(combo.id)} // ✅ DEĞİŞTİRİLDİ
                  >
                    <img 
                      src={combo.image} 
                      alt={combo.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1504198458649-3128b932f49e?w=800&q=80';
                      }}
                    />
                    
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCombo(combo.id);
                      }}
                      className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer text-indigo-400 hover:text-red-500 hover:bg-red-50 shadow-sm"
                    >
                      <Trash2 size={18} />
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 
                        onClick={() => handleShowDetails(combo.id)} // ✅ DEĞİŞTİRİLDİ
                        className="text-lg font-bold text-indigo-900 group-hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {combo.name}
                      </h3>
                      <button 
                        onClick={(e) => handleEditOutfit(combo.id, e)} // ✅ DEĞİŞTİRİLDİ
                        className="!bg-transparent !p-2 rounded-full !text-indigo-300 hover:!bg-indigo-50 hover:!text-indigo-600 transition-colors"
                        title="Düzenle"
                      >
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-indigo-400 font-semibold bg-indigo-50/50 p-3 rounded-xl border border-indigo-50/50">
                      <span className="flex items-center gap-1.5">
                        <Grid size={16}/> {combo.items} Parça
                      </span>
                      <span className="text-indigo-300">•</span>
                      <span>{combo.date}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={handleAddCombo}
                disabled={adding}
                className="relative overflow-hidden rounded-3xl h-full min-h-[300px] flex flex-col items-center justify-center transition-all duration-300 group
                            bg-white/60 border-2 border-indigo-100 hover:border-indigo-500
                            hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-500/20 hover:-translate-y-2
                            disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {adding ? (
                  <div className="text-center">
                    <Loader2 className="animate-spin w-20 h-20 text-indigo-600 mb-5" />
                    <span className="text-xl font-bold text-indigo-900">Ekleniyor...</span>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'favorites' && (
        <>
          {favorites.length === 0 ? (
            <div className="text-center py-16 bg-white/60 rounded-3xl border border-indigo-100">
              <div className="text-6xl mb-4">❤️</div>
              <p className="text-xl text-indigo-800 mb-2">Henüz favori parça yok</p>
              <p className="text-indigo-400">Keşfet sayfasından beğendiğin parçaları ekleyebilirsin</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((fav) => (
                <div key={fav.id} className="bg-white rounded-2xl border border-indigo-50 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 group relative cursor-pointer">
                  <div className="aspect-square overflow-hidden bg-indigo-50/30 relative">
                    <img 
                      src={fav.image} 
                      alt={fav.name} 
                      className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1520975916090-3105956dac38?w=600&q=80';
                      }}
                    />
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteFavorite(fav.id)}
                    className="absolute top-3 right-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-sm text-red-500 hover:bg-red-50 hover:scale-110 transition-all border border-indigo-50"
                    title="Favorilerden Çıkar"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>

                  <div className="p-5">
                    <p className="text-[10px] text-indigo-400 font-bold mb-1 uppercase tracking-widest">
                      {fav.brand}
                    </p>
                    <h3 className="text-sm font-bold text-indigo-900 line-clamp-1 mb-3 group-hover:text-indigo-600 transition-colors">
                      {fav.name}
                    </h3>
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
                      {fav.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-8 text-center">
        <button
          onClick={fetchOutfits}
          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
        >
          <span>Güncelle</span>
          <span>🔄</span>
        </button>
      </div>
    </div>
  );
};

export default MyOutfits;