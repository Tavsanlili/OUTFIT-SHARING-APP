import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import itemService from '../../services/itemService';

const OutfitDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchOutfit();
  }, [id]);

  const fetchOutfit = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItem(id);
      const data = response.data || response;
      setOutfit(data);
    } catch (err) {
      console.error('Hata:', err);
      setError('Outfit yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOutfit = async () => {
    try {
      await itemService.deleteItem(id);
      navigate('/organization/outfits');
    } catch (err) {
      console.error('Silme hatası:', err);
      alert('Silinemedi');
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!window.confirm('Fotoğrafı sil?')) return;

    try {
      await itemService.deleteItemPhoto(id, imageId);
      setOutfit(prev => ({
        ...prev,
        images: prev.images.filter(img => (img.id || img) !== imageId)
      }));
      
      if (selectedImageIndex >= outfit.images.length - 1) {
        setSelectedImageIndex(Math.max(0, outfit.images.length - 2));
      }
    } catch (err) {
      console.error('Fotoğraf silinemedi:', err);
      alert('Fotoğraf silinemedi');
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
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-4">
          {error || 'Outfit bulunamadı'}
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600">
          ← Geri Dön
        </button>
      </div>
    );
  }

  const images = outfit.images || [];
  const currentImage = images[selectedImageIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
          >
            ← Geri
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          
          {/* Sol - Fotoğraflar */}
          <div className="space-y-4">
            {/* Ana fotoğraf */}
            <div className="bg-white rounded-lg border overflow-hidden relative">
              {images.length > 0 && currentImage ? (
                <>
                  <img
                    src={currentImage.url || currentImage}
                    alt={outfit.name}
                    className="w-full h-auto"
                  />
                  <button
                    onClick={() => handleImageDelete(currentImage.id || currentImage)}
                    className="absolute top-2 right-2 bg-white text-red-600 p-2 rounded hover:bg-red-50"
                    title="Sil"
                  >
                    🗑️
                  </button>
                  
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </>
              ) : (
                <div className="w-full h-64 flex items-center justify-center text-gray-400">
                  📷 Fotoğraf Yok
                </div>
              )}
            </div>

            {/* Thumbnail'ler */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border ${
                      selectedImageIndex === index ? 'border-blue-500' : 'border-gray-300'
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

          {/* Sağ - Bilgiler */}
          <div>
            <div className="bg-white rounded-lg border p-6">
              {/* Başlık */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{outfit.name}</h1>
                <div className="text-sm text-gray-500">
                  {outfit.createdAt && new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
                </div>
              </div>

              {/* Tag'ler */}
              {outfit.tags && outfit.tags.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Etiketler</h3>
                  <div className="flex flex-wrap gap-2">
                    {outfit.tags.map((tag, index) => (
                      <span
                        key={tag.id || index}
                        className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag.name || tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Açıklama */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Açıklama</h3>
                <div className="text-gray-700">
                  {outfit.description || 'Açıklama yok'}
                </div>
              </div>

              {/* İstatistikler */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-lg font-bold">{images.length}</div>
                  <div className="text-xs text-gray-600">Fotoğraf</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-lg font-bold">{outfit.views || 0}</div>
                  <div className="text-xs text-gray-600">Görüntülenme</div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => navigate(`/my-outfits/edit/${id}`)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Düzenle
                </button>

                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Silme Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Outfit Sil</h2>
            <p className="text-gray-600 mb-6">
              "{outfit.name}" silinecek. Onaylıyor musunuz?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteOutfit();
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OutfitDetail;