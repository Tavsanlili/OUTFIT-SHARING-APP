import { useState, useEffect } from 'react';
import tagService from '../../services/tagService'; // ✅ API servisi

const TagManagement = () => {
  const [tags, setTags] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ API'den tag'leri çek
  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await tagService.getTags();
      console.log('Tags response:', response); // Debug için
      
      // ✅ Backend yapısına göre tag'leri al
      const tagsData = response.data?.tags || response.data || response;
      
      if (Array.isArray(tagsData)) {
        // ✅ Tag'leri backend formatına göre dönüştür
        const formattedTags = tagsData.map(tag => ({
          id: tag.id || tag._id,
          name: tag.name || tag.tagName,
          color: tag.color || '#3B82F6',
          count: tag.count || tag.outfitCount || 0
        }));
        
        setTags(formattedTags);
      } else {
        console.warn('Beklenen array formatı gelmedi:', tagsData);
        setTags([]);
      }
      
    } catch (err) {
      console.error('Tag çekme hatası:', err);
      setError('Tag\'ler yüklenirken bir hata oluştu.');
      setTags([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Arama filtresi
  const filteredTags = tags.filter(tag =>
    tag.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Modal aç
  const openModal = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name, color: tag.color });
    } else {
      setEditingTag(null);
      setFormData({ name: '', color: '#3B82F6' });
    }
    setShowModal(true);
  };

  // ✅ Modal kapat
  const closeModal = () => {
    setShowModal(false);
    setEditingTag(null);
    setFormData({ name: '', color: '#3B82F6' });
  };

  // ✅ Tag ekle (POST)
  const handleAddTag = async (tagData) => {
    try {
      const response = await tagService.createTag({
        name: tagData.name,
        color: tagData.color
        // ✅ Backend'in beklediği diğer alanları ekle
      });
      
      console.log('Tag ekleme response:', response);
      
      // ✅ Yeni tag'i listeye ekle
      const newTag = {
        id: response.id || response.data?.id || Date.now(),
        name: tagData.name,
        color: tagData.color,
        count: 0
      };
      
      setTags(prev => [...prev, newTag]);
      alert(`"${tagData.name}" tag'i başarıyla eklendi!`);
      
    } catch (err) {
      console.error('Tag ekleme hatası:', err);
      alert('Tag eklenirken bir hata oluştu.');
      throw err;
    }
  };

  // ✅ Tag güncelle (PUT)
  const handleUpdateTag = async (tagId, tagData) => {
    try {
      await tagService.updateTag(tagId, {
        name: tagData.name,
        color: tagData.color
        // ✅ Backend'in beklediği diğer alanları ekle
      });
      
      // ✅ Local state'i güncelle
      setTags(prev => prev.map(tag =>
        tag.id === tagId
          ? { ...tag, name: tagData.name, color: tagData.color }
          : tag
      ));
      
      alert(`"${tagData.name}" tag'i başarıyla güncellendi!`);
      
    } catch (err) {
      console.error('Tag güncelleme hatası:', err);
      alert('Tag güncellenirken bir hata oluştu.');
      throw err;
    }
  };

  // ✅ Tag sil (DELETE)
  const handleDeleteTag = async (tagId, tagName, tagCount) => {
    if (window.confirm(`"${tagName}" tag'ini silmek istediğinize emin misiniz?\n\nBu tag ${tagCount} outfit'te kullanılıyor.`)) {
      try {
        await tagService.deleteTag(tagId);
        
        // ✅ Local state'den kaldır
        setTags(prev => prev.filter(tag => tag.id !== tagId));
        alert(`"${tagName}" tag'i başarıyla silindi!`);
        
      } catch (err) {
        console.error('Tag silme hatası:', err);
        alert('Tag silinirken bir hata oluştu.');
      }
    }
  };

  // ✅ Form submit (Ekleme veya Güncelleme)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Tag adı boş olamaz!');
      return;
    }

    try {
      if (editingTag) {
        // ✅ Güncelle
        await handleUpdateTag(editingTag.id, formData);
      } else {
        // ✅ Ekle
        await handleAddTag(formData);
      }
      
      closeModal();
      
    } catch (err) {
      // Hata mesajı yukarıdaki fonksiyonlarda gösterildi
    }
  };

  // ✅ Renk paletleri
  const colorPalette = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6',
    '#1F2937', '#60A5FA', '#34D399', '#FBBF24'
  ];

  // ✅ LOADING DURUMU
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Tag'ler yükleniyor...</p>
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
            onClick={fetchTags}
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🏷️ Tag Yönetimi</h1>
        <p className="text-gray-600">Outfit kategorilerini oluştur ve yönet</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Tag</p>
              <p className="text-3xl font-bold text-gray-800">{tags.length}</p>
            </div>
            <div className="text-4xl">🏷️</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">Toplam Kullanım</p>
              <p className="text-3xl font-bold text-gray-800">
                {tags.reduce((sum, tag) => sum + (tag.count || 0), 0)}
              </p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm mb-1">En Popüler</p>
              <p className="text-xl font-bold text-gray-800">
                {tags.length > 0 ? 
                  tags.reduce((a, b) => (a.count || 0) > (b.count || 0) ? a : b).name 
                  : '-'}
              </p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>

      {/* Search & Add Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="🔍 Tag ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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

          {/* Add Button */}
          <button
            onClick={() => openModal()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
          >
            <span className="text-xl">+</span>
            <span>Yeni Tag Ekle</span>
          </button>
        </div>
      </div>

      {/* Tag List */}
      {filteredTags.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-xl text-gray-500 mb-2">
            {searchTerm ? 'Arama sonucu bulunamadı' : 'Henüz tag yok'}
          </p>
          <p className="text-gray-400">
            {searchTerm ? 'Arama teriminizi değiştirin' : 'İlk tag\'inizi ekleyerek başlayın'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tag
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Renk
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kullanım
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTags.map((tag) => (
                <tr key={tag.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500 font-mono">{tag.color}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {tag.count || 0} outfit
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => openModal(tag)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                      title="Düzenle"
                    >
                      ✏️ Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id, tag.name, tag.count)}
                      className="text-red-600 hover:text-red-900"
                      title="Sil"
                    >
                      🗑️ Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingTag ? '✏️ Tag Düzenle' : '➕ Yeni Tag Ekle'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag Adı
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: Casual, Formal, Summer..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Renk Seç
                </label>
                <div className="grid grid-cols-6 gap-3">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        formData.color === color
                          ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
                          : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    ></button>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Seçilen renk:</span>
                  <div
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  ></div>
                  <span className="text-sm font-mono text-gray-700">{formData.color}</span>
                </div>
              </div>

              {/* Preview */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Önizleme:</p>
                <span
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: formData.color }}
                >
                  {formData.name || 'Tag Adı'}
                </span>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {editingTag ? 'Güncelle' : 'Ekle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagManagement;