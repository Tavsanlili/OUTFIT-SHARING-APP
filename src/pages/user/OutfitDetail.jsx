import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import itemService from '../../services/itemService';

const OutfitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // UI State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeletingPhoto, setIsDeletingPhoto] = useState(false); // Foto silinirken butonu kilitlemek için

  useEffect(() => {
    fetchOutfit();
  }, [id]);

  const fetchOutfit = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItem(id);
      // Veri yapısını normalize et (data.data veya data)
      const data = response.data || response;
      setOutfit(data);
    } catch (err) {
      console.error('Outfit yükleme hatası:', err);
      setError('Outfit bilgileri yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutfit = async () => {
    try {
      await itemService.deleteItem(id);
      // Başarılı silme sonrası yönlendirme
      navigate('/organization/outfits', { replace: true });
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Outfit silinirken hata oluştu!');
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;

    try {
      setIsDeletingPhoto(true);
      await itemService.deleteItemPhoto(id, imageId);
      
      // OPTİMİZASYON: Sayfayı yenilemek yerine state'i güncelle
      setOutfit(prev => {
        const newImages = prev.images.filter(img => (img.id || img) !== imageId);
        return { ...prev, images: newImages };
      });

      // Index koruması: Eğer son fotoğrafı sildiysek, bir öncekini seç
      if (selectedImageIndex >= outfit.images.length - 1) {
        setSelectedImageIndex(Math.max(0, outfit.images.length - 2));
      }

      // alert('Fotoğraf silindi'); // Kullanıcıyı her seferinde alert ile durdurmaya gerek yok, görsel olarak kaybolması yeterli
    } catch (err) {
      console.error('Fotoğraf silme hatası:', err);
      alert('Fotoğraf silinemedi.');
    } finally {
      setIsDeletingPhoto(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !outfit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4 border-l-4 border-red-500">
          {error || 'Outfit bulunamadı!'}
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium">
          ← Geri Dön
        </button>
      </div>
    );
  }

  const images = outfit.images || [];
  const currentImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors"
          >
            ← Listeye Dön
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Sol Taraf - Fotoğraf Galerisi */}
          <div className="space-y-4">
            {/* Ana Fotoğraf */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative group aspect-[4/5] bg-gray-100">
              {images.length > 0 && currentImage ? (
                <>
                  <img
                    src={currentImage.url || currentImage}
                    alt={outfit.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Fotoğraf Silme Butonu */}
                  <button
                    onClick={() => handleImageDelete(currentImage.id || currentImage)}
                    disabled={isDeletingPhoto}
                    className="absolute top-4 right-4 bg-white/90 text-red-600 p-2.5 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 disabled:opacity-50"
                    title="Bu fotoğrafı sil"
                  >
                    {isDeletingPhoto ? '⏳' : '🗑️'}
                  </button>
                  
                  {/* Fotoğraf Sayacı */}
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                  <span className="text-6xl mb-2">📷</span>
                  <span>Fotoğraf Yok</span>
                </div>
              )}
            </div>

            {/* Thumbnail'ler */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index 
                        ? 'border-blue-600 shadow-md ring-2 ring-blue-100' 
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url || image}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sağ Taraf - Detaylar */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full">
              {/* Başlık ve Meta */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{outfit.name}</h1>
                  <span className="text-sm text-gray-400 whitespace-nowrap bg-gray-50 px-2 py-1 rounded">
                    ID: #{id.slice(0, 6)}
                  </span>
                </div>
                
                {/* Tarih */}
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <span>📅</span>
                  <span>
                    {outfit.createdAt 
                      ? new Date(outfit.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })
                      : 'Tarih bilgisi yok'
                    }
                  </span>
                </div>
              </div>

              {/* Tag'ler */}
              {outfit.tags && outfit.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {outfit.tags.map((tag, index) => (
                      <span
                        key={tag.id || index}
                        className="px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
                        style={{ backgroundColor: tag.color || '#3B82F6' }}
                      >
                        {tag.name || tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Açıklama */}
              <div className="flex-grow">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 uppercase tracking-wider">Açıklama</h3>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed min-h-[100px]">
                  {outfit.description || 'Bu outfit için açıklama girilmemiş.'}
                </div>
              </div>

              {/* İstatistikler (Opsiyonel) */}
              <div className="grid grid-cols-2 gap-4 my-6 pt-6 border-t border-gray-100">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{images.length}</div>
                  <div className="text-xs text-blue-800 font-medium">Fotoğraf</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{outfit.views || 0}</div>
                  <div className="text-xs text-purple-800 font-medium">Görüntülenme</div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="grid grid-cols-2 gap-4 mt-auto pt-4">
                <button
                  onClick={() => navigate(`/organization/outfits/edit/${id}`)}
                  className="px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  ✏️ Düzenle
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 transition-all font-semibold flex items-center justify-center gap-2"
                >
                  🗑️ Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 transform transition-all scale-100">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚠️</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Outfit Silinecek</h2>
              <p className="text-gray-500 text-sm">
                "<strong>{outfit.name}</strong>" silinecek. Bu işlem geri alınamaz. Onaylıyor musunuz?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteOutfit();
                }}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-200"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitDetail;