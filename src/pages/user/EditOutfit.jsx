import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import itemService from '../../services/itemService';
import tagService from '../../services/tagService';

const EditOutfit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // State yönetimi (Senin AddOutfit yapınla aynı)
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedTags: [],
    existingImages: [], // Edit sayfasına özel: Mevcut fotolar
    newImages: []       // Edit sayfasına özel: Yeni eklenecekler
  });

  // Image preview (Yeni yüklenenler için)
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  // Verileri yükle
  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // 1. Tag'leri yükle (Senin detaylı mantığınla)
      const tagsResponse = await tagService.getTags();
      console.log('🏷️ RAW Tag Response:', tagsResponse);
      
      let tagsData = [];
      
      // Senin yazdığın "Case" mantığı
      if (Array.isArray(tagsResponse)) {
        console.log('✅ Case 1: Direct array');
        tagsData = tagsResponse;
      } else if (tagsResponse?.data && Array.isArray(tagsResponse.data)) {
        console.log('✅ Case 2: response.data is array');
        tagsData = tagsResponse.data;
      } else if (tagsResponse?.tags && Array.isArray(tagsResponse.tags)) {
        console.log('✅ Case 4: response.tags is array');
        tagsData = tagsResponse.tags;
      } else if (tagsResponse && typeof tagsResponse === 'object') {
        console.log('⚠️ Object detected, trying to extract...');
        const values = Object.values(tagsResponse);
        if (values.length > 0 && values[0]?.id) tagsData = values;
      }
      
      console.log('🎯 Processed tags:', tagsData);
      setTags(tagsData);

      // 2. Outfit detaylarını yükle
      const outfitResponse = await itemService.getItem(id);
      const outfit = outfitResponse.data || outfitResponse;
      console.log('👗 Outfit Data:', outfit);

      // Formu doldur
      setFormData({
        name: outfit.name || '',
        description: outfit.description || '',
        // Tagler obje gelirse ID'ye çevir, string gelirse direkt al
        selectedTags: outfit.tags ? outfit.tags.map(t => (typeof t === 'object' ? t.id : t)) : [],
        existingImages: outfit.images || [],
        newImages: []
      });

    } catch (err) {
      console.error('❌ Veri yükleme hatası:', err);
      setError('Veriler yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  // Input değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Tag seçimi (Senin yazdığın logic)
  const handleTagToggle = (tagId) => {
    console.log('🏷️ Toggling tag:', tagId);
    if (!tagId) return;
    
    setFormData(prev => ({
      ...prev,
      selectedTags: prev.selectedTags.includes(tagId)
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId]
    }));
  };

  // Yeni resim seçimi
  const handleNewImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalCount = formData.existingImages.length + formData.newImages.length + files.length;
    
    if (totalCount > 5) {
      alert('Maksimum 5 fotoğraf olabilir!');
      return;
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setNewImagePreviews(prev => [...prev, ...newPreviews]);

    setFormData(prev => ({
      ...prev,
      newImages: [...prev.newImages, ...files]
    }));
  };

  // Mevcut resim silme
  const handleRemoveExistingImage = async (imageId) => {
    if (!window.confirm('Bu fotoğrafı silmek istediğinize emin misiniz?')) return;

    try {
      await itemService.deleteItemPhoto(id, imageId);
      setFormData(prev => ({
        ...prev,
        existingImages: prev.existingImages.filter(img => img.id !== imageId)
      }));
      console.log('🗑️ Existing image deleted:', imageId);
    } catch (err) {
      console.error('❌ Silme hatası:', err);
      alert('Fotoğraf silinemedi.');
    }
  };

  // Yeni (henüz yüklenmemiş) resim silme
  const handleRemoveNewImage = (index) => {
    setFormData(prev => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index)
    }));
    // Memory leak önlemi
    if (newImagePreviews[index]) URL.revokeObjectURL(newImagePreviews[index]);
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      // Validasyon
      if (!formData.name.trim()) throw new Error('Outfit adı zorunludur!');

      const validTags = formData.selectedTags.filter(tagId => tagId != null);
      console.log('✅ Valid tags:', validTags);

      // 1. JSON Body Hazırla (Senin AddOutfit yapın gibi)
      const updatePayload = {
        name: formData.name,
        description: formData.description || '',
        value: 0,
        tags: validTags // ID Array
      };

      console.log('📤 Updating outfit:', updatePayload);
      
      // Update isteği at
      await itemService.updateItem(id, updatePayload);
      console.log('✅ Outfit updated');

      // 2. Yeni Resimleri Yükle (Varsa)
      if (formData.newImages.length > 0) {
        console.log('📸 Uploading new images...');
        
        // Hızlı yükleme için Promise.all kullanıyoruz ama mantık aynı
        const uploadPromises = formData.newImages.map((image, i) => {
          const imageFormData = new FormData();
          imageFormData.append('itemId', id);
          imageFormData.append('file', image); // DİKKAT: 'photo' değil 'file' (Postman'e göre)
          
          return itemService.addItemPhoto(id, imageFormData)
            .then(() => console.log(`✅ New Image ${i + 1} uploaded`))
            .catch(err => console.error(`❌ New Image ${i + 1} failed`, err));
        });

        await Promise.all(uploadPromises);
      }

      setSuccess('Outfit başarıyla güncellendi! Yönlendiriliyorsunuz...');
      
      setTimeout(() => {
        navigate('/organization/outfits');
      }, 2000);

    } catch (err) {
      console.error('❌ Update hatası:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Güncelleme hatası!';
      
      // 404 Hatası kontrolü
      if (err.response?.status === 404) {
         setError('Hata: API endpoint bulunamadı (404). Backend URL yapısını kontrol edin.');
      } else {
         setError(errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-xl text-gray-600">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
        >
          ← Geri Dön
        </button>
        <h1 className="text-3xl font-bold mb-2">✏️ Outfit Düzenle</h1>
        <p className="text-gray-600">Outfit bilgilerini güncelleyin</p>
      </div>

      {/* Success & Error */}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border-l-4 border-green-500 flex items-center gap-2">
          <span className="text-xl">✅</span> <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500 flex items-center gap-2">
          <span className="text-xl">⚠️</span> <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        
        {/* İsim */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Outfit Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
            disabled={submitting}
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Açıklama</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            disabled={submitting}
          />
        </div>

        {/* Tagler */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Tag'ler</label>
          <div className="flex flex-wrap gap-2">
            {tags.length === 0 ? (
              <p className="text-gray-400 text-sm">Tag yok...</p>
            ) : (
              tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  disabled={submitting}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.selectedTags.includes(tag.id)
                      ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={formData.selectedTags.includes(tag.id) ? { backgroundColor: tag.color } : {}}
                >
                  {tag.name}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Mevcut Fotoğraflar */}
        {formData.existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Mevcut Fotoğraflar</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.existingImages.map((image, index) => (
                <div key={image.id || index} className="relative group aspect-square">
                  <img
                    src={image.url || image}
                    alt="Existing"
                    className="w-full h-full object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Yeni Fotoğraf Ekleme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Yeni Fotoğraf Ekle</label>
          <div className="mb-4">
            <label className={`cursor-pointer block ${submitting ? 'opacity-50 pointer-events-none' : ''}`}>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                <div className="text-4xl mb-2">📸</div>
                <p className="text-gray-600 font-medium">Yeni Fotoğraf Seç</p>
                <p className="text-xs text-gray-400 mt-1">
                  Kalan hak: {5 - formData.existingImages.length - formData.newImages.length}
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleNewImageChange}
                className="hidden"
                disabled={formData.existingImages.length + formData.newImages.length >= 5}
              />
            </label>
          </div>

          {/* New Image Previews */}
          {newImagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {newImagePreviews.map((preview, index) => (
                <div key={`new-${index}`} className="relative group aspect-square">
                  <img
                    src={preview}
                    alt="New Preview"
                    className="w-full h-full object-cover rounded-lg border-2 border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                  <span className="absolute bottom-2 left-2 bg-green-600 text-white text-[10px] px-2 py-1 rounded">YENİ</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Butonlar */}
        <div className="flex gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 font-medium"
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex justify-center items-center gap-2"
          >
            {submitting ? '⏳ Kaydediliyor...' : '✅ Değişiklikleri Kaydet'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default EditOutfit;