import { Link } from 'react-router-dom';

const OrgDashboard = () => {
  // Demo istatistikler
  const stats = {
    totalOutfits: 24,
    totalTags: 12,
    recentOutfits: 5,
    totalViews: 387
  };

  // Demo son outfit'ler
  const recentOutfits = [
    {
      id: 1,
      name: 'Yaz Kombini 2024',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      tags: [{ name: 'Casual' }, { name: 'Summer' }],
      createdAt: '2024-12-10',
      description: 'Hafif ve rahat bir yaz kombini'
    },
    {
      id: 2,
      name: 'İş Görüşmesi Stili',
      image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
      tags: [{ name: 'Formal' }, { name: 'Business' }],
      createdAt: '2024-12-09',
      description: 'Profesyonel ve şık görünüm'
    },
    {
      id: 3,
      name: 'Sokak Modası',
      image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400',
      tags: [{ name: 'Streetwear' }, { name: 'Urban' }],
      createdAt: '2024-12-08',
      description: 'Modern ve rahat sokak stili'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📊 Organization Dashboard
          </h1>
          <p className="text-gray-600">
            Outfit ve tag yönetimi için kontrol paneliniz
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
                <p className="text-gray-500 text-sm mb-1">Son 7 Gün</p>
                <p className="text-3xl font-bold text-gray-800">{stats.recentOutfits}</p>
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
              Tüm outfit'leri görüntüle, düzenle ve yönet
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
              Tag'leri ekle, düzenle ve kategori oluştur
            </p>
            <div className="flex items-center text-sm font-semibold">
              <span>Tag Paneline Git</span>
              <span className="ml-2">→</span>
            </div>
          </Link>

          {/* Add New Outfit */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
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
              Tümünü Gör <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={outfit.image}
                    alt={outfit.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                    {outfit.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {outfit.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {outfit.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  {/* Date */}
                  <p className="text-gray-500 text-xs">
                    {new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
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
                bulmalarını sağlar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgDashboard;