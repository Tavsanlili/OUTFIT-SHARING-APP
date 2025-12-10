import { useState } from 'react';

const OrganizationOutfitList = () => {
  // Demo outfit verileri
  const allOutfits = [
    {
      id: 1,
      name: 'Yaz Kombini 2024',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
      tags: ['Casual', 'Summer', 'Beach'],
      description: 'Hafif ve rahat bir yaz kombini. Plaj için ideal.',
      createdAt: '2024-12-10'
    },
    {
      id: 2,
      name: 'İş Görüşmesi Stili',
      image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
      tags: ['Formal', 'Business', 'Professional'],
      description: 'Profesyonel ve şık görünüm. İş toplantıları için mükemmel.',
      createdAt: '2024-12-09'
    },
    {
      id: 3,
      name: 'Sokak Modası',
      image: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400',
      tags: ['Streetwear', 'Urban', 'Casual'],
      description: 'Modern ve rahat sokak stili. Günlük kullanım için harika.',
      createdAt: '2024-12-08'
    },
    {
      id: 4,
      name: 'Kış Şıklığı',
      image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
      tags: ['Winter', 'Formal', 'Elegant'],
      description: 'Kış akşamları için zarif bir kombin.',
      createdAt: '2024-12-07'
    },
    {
      id: 5,
      name: 'Spor Görünüm',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
      tags: ['Sport', 'Athletic', 'Casual'],
      description: 'Spor ve rahat bir stil. Aktif günler için.',
      createdAt: '2024-12-06'
    },
    {
      id: 6,
      name: 'Vintage Tarz',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
      tags: ['Vintage', 'Retro', 'Classic'],
      description: 'Nostaljik ve benzersiz bir görünüm.',
      createdAt: '2024-12-05'
    },
    {
      id: 7,
      name: 'Akşam Yemeği',
      image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
      tags: ['Formal', 'Evening', 'Elegant'],
      description: 'Özel akşamlar için şık bir seçenek.',
      createdAt: '2024-12-04'
    },
    {
      id: 8,
      name: 'Bohem Stil',
      image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
      tags: ['Bohemian', 'Casual', 'Artistic'],
      description: 'Özgür ruhlu ve sanatsal bir kombinasyon.',
      createdAt: '2024-12-03'
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filtreleme ve sıralama
  const getFilteredOutfits = () => {
    let filtered = [...allOutfits];

    // Arama
    if (searchTerm) {
      filtered = filtered.filter(outfit =>
        outfit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        outfit.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'a-z':
          return a.name.localeCompare(b.name);
        case 'z-a':
          return b.name.localeCompare(a.name);
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

  const handleDelete = (id) => {
    if (window.confirm('Bu outfit\'i silmek istediğinize emin misiniz?')) {
      alert(`Outfit #${id} silindi (Demo mode - gerçekte API'ye istek gönderilecek)`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">👗 Outfit Yönetimi</h1>
        <p className="text-gray-600">
          Toplam {filteredOutfits.length} outfit bulundu
        </p>
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
          <p className="text-gray-400">Arama teriminizi değiştirmeyi deneyin</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                onDelete={handleDelete}
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

// Outfit Card Component
const OutfitCard = ({ outfit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-64 bg-gray-200 overflow-hidden">
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

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {outfit.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
          {outfit.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{outfit.tags.length - 3}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {outfit.description}
        </p>

        {/* Date */}
        <p className="text-gray-400 text-xs mb-4">
          {new Date(outfit.createdAt).toLocaleDateString('tr-TR')}
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => alert(`Outfit #${outfit.id} detayları gösteriliyor...`)}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Detay
          </button>
          <button
            onClick={() => alert(`Outfit #${outfit.id} düzenleniyor...`)}
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

// Pagination Component
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