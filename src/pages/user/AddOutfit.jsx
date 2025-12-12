import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import itemService from '../../services/itemService';
import tagService from '../../services/tagService';

const AddOutfit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    selectedTags: [],
    images: []
  });

  // Image preview
  const [imagePreviews, setImagePreviews] = useState([]);

  // Tag'leri yükle
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      const response = await tagService.getTags();
      console.log('🏷️ RAW API Response:', response);
      console.log('🏷️ Response keys:', Object.keys(response || {}));
      console.log('🏷️ Response.data:', response?.data);
      console.log('🏷️ Response.tags:', response?.tags);
      
      let tagsData = [];
      
      // Tüm olası yolları dene
      if (Array.isArray(response)) {
        console.log('✅ Case 1: Direct array');
        tagsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        console.log('✅ Case 2: response.data is array');
        tagsData = response.data;
      } else if (response?.data?.tags && Array.isArray(response.data.tags)) {
        console.log('✅ Case 3: response.data.tags is array');
        tagsData = response.data.tags;
      } else if (response?.tags && Array.isArray(response.tags)) {
        console.log('✅ Case 4: response.tags is array');
        tagsData = response.tags;
      } else if (response && typeof response === 'object') {
        console.log('⚠️ Object detected, trying to extract...');
        console.log('Object values:', Object.values(response));
        
        // Tüm nested object'leri kontrol et
        for (const key in response) {
          if (Array.isArray(response[key])) {
            console.log(`✅ Found array in key: ${key}`);
            tagsData = response[key];
            break;
          }
        }
        
        // Hala bulamadıysak, object values'ları dene
        if (tagsData.length === 0) {
          const values = Object.values(response);
          if (values.length > 0 && values[0]?.id && values[0]?.name) {
            console.log('✅ Converted object to array using values');
            tagsData = values;
          }
        }
      }
      
      console.log('🎯 FINAL Processed tags:', tagsData);
      console.log('🎯 Tags count:', tagsData.length);
      setTags(tagsData);
    } catch (err) {
      console.error('❌ Tag yükleme hatası:', err);
      setTags([]);
    }
  };

  // Input değişikliklerini handle et
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Tag seçimi
  const handleTagToggle = (tagId) => {
    console.log('🏷️ Toggling tag:', tagId);
    console.log('🏷️ Current selected tags:', formData.selectedTags);
    
    if (!tagId) {
      console.warn('⚠️ Tag ID is null or undefined!');
      return;
    }
    
    setFormData(prev => {
      const isCurrentlySelected = prev.selectedTags.includes(tagId);
      const newSelectedTags = isCurrentlySelected
        ? prev.selectedTags.filter(id => id !== tagId)
        : [...prev.selectedTags, tagId];
      
      console.log('🏷️ Was selected:', isCurrentlySelected);
      console.log('🏷️ New selected tags:', newSelectedTags);
      
      return {
        ...prev,
        selectedTags: newSelectedTags
      };
    });
  };

  // Resim seçimi
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + formData.images.length > 5) {
      alert('Maksimum 5 fotoğraf yükleyebilirsiniz!');
      return;
    }

    // Preview için URL oluştur
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);

    // Dosyaları state'e ekle
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  // Resim silme
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Form gönderimi
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      // Validasyon
      if (!formData.name.trim()) {
        throw new Error('Outfit adı zorunludur!');
      }

      console.log('📤 Gönderilen data:', {
        name: formData.name,
        description: formData.description,
        tags: formData.selectedTags,
        imageCount: formData.images.length
      });

      // Null tag'leri filtrele
      const validTags = formData.selectedTags.filter(tagId => tagId != null);
      console.log('✅ Valid tags:', validTags);

      // 1. Önce outfit'i oluştur
      const submitData = {
        name: formData.name,
        description: formData.description || 'Outfit açıklaması',
        value: 0,
        tags: validTags,
      };

      console.log('📤 Creating outfit:', submitData);
      const createResponse = await itemService.addItem(submitData);
      console.log('✅ Outfit created:', createResponse);

      const newOutfitId = createResponse.id || createResponse.data?.id;

      // 2. Eğer resim varsa, sırayla yükle
      if (formData.images.length > 0 && newOutfitId) {
        console.log('📸 Uploading images...');
        
        for (let i = 0; i < formData.images.length; i++) {
          const image = formData.images[i];
          
          // FormData oluştur (resim için)
          const imageFormData = new FormData();
          imageFormData.append('itemId', newOutfitId);
          imageFormData.append('photo', image);
          
          try {
            await itemService.addItemPhoto(newOutfitId, imageFormData);
            console.log(`✅ Image ${i + 1}/${formData.images.length} uploaded`);
          } catch (imgError) {
            console.error(`❌ Image ${i + 1} upload failed:`, imgError);
          }
        }
      }

      setSuccess('Outfit başarıyla eklendi! Yönlendiriliyorsunuz...');
      
      setTimeout(() => {
        navigate('/my-outfits');
      }, 2000);

    } catch (err) {
      console.error('❌ Outfit ekleme hatası:', err);
      console.error('❌ Error response:', err.response?.data);
      
      const errorMsg = err.response?.data?.message 
        || err.response?.data?.error 
        || err.message 
        || 'Outfit eklenirken bir hata oluştu!';
      
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold mb-2">➕ Yeni Outfit Ekle</h1>
        <p className="text-gray-600">Yeni bir kıyafet kombinasyonu oluşturun</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border-l-4 border-green-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span>{success}</span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border-l-4 border-red-500">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        
        {/* Outfit Adı */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Outfit Adı <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Örn: Yaz Kombini 2024"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            required
          />
        </div>

        {/* Açıklama */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Açıklama
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Outfit hakkında detaylı açıklama yazın..."
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Tag Seçimi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tag'ler
          </label>
          <div className="flex flex-wrap gap-2">
            {!Array.isArray(tags) || tags.length === 0 ? (
              <p className="text-gray-400 text-sm">Tag yükleniyor veya mevcut değil...</p>
            ) : (
              tags.map((tag, index) => {
                const tagId = tag.id || tag._id || `tag-${index}`;
                const isSelected = formData.selectedTags.includes(tagId);
                
                return (
                  <button
                    key={`tag-${tagId}-${index}`}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      console.log('🏷️ Clicked tag:', tag.name, 'ID:', tagId);
                      handleTagToggle(tagId);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    style={isSelected && tag.color ? { backgroundColor: tag.color } : {}}
                  >
                    {tag.name}
                  </button>
                );
              })
            )}
          </div>
          {formData.selectedTags.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {formData.selectedTags.length} tag seçildi
            </p>
          )}
          {/* Debug: Seçili tag'leri göster */}
          {formData.selectedTags.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">
              Seçili: {formData.selectedTags.join(', ')}
            </p>
          )}
        </div>

        {/* Fotoğraf Yükleme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Fotoğraflar <span className="text-red-500">*</span>
          </label>
          
          {/* Upload Button */}
          <div className="mb-4">
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <div className="text-5xl mb-2">📸</div>
                <p className="text-gray-600 font-medium mb-1">Fotoğraf Yükle</p>
                <p className="text-sm text-gray-400">veya sürükle bırak</p>
                <p className="text-xs text-gray-400 mt-2">Maksimum 5 fotoğraf</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                disabled={formData.images.length >= 5}
              />
            </label>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={`preview-${index}`} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Sil"
                  >
                    🗑️
                  </button>
                  {index === 0 && (
                    <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Kapak Fotoğrafı
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            disabled={loading}
          >
            İptal
          </button>
          <button
            type="submit"
            disabled={loading || formData.images.length === 0}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Ekleniyor...' : '✅ Outfit Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddOutfit;