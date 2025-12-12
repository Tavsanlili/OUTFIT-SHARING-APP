import { Link } from 'react-router-dom';

const AboutPage = () => {
  const features = [
    {
      icon: '👗',
      title: 'Outfit Yönetimi',
      description: 'Kıyafet kombinlerinizi kolayca yönetin, kategorize edin ve paylaşın.'
    },
    {
      icon: '🏷️',
      title: 'Akıllı Etiketleme',
      description: 'Tag sistemi ile outfit\'lerinizi organize edin ve hızlıca bulun.'
    },
    {
      icon: '🔍',
      title: 'Keşfet',
      description: 'Diğer kullanıcıların kombinlerini keşfedin ve ilham alın.'
    },
    {
      icon: '📊',
      title: 'İstatistikler',
      description: 'Detaylı raporlar ve analizlerle outfit performansınızı takip edin.'
    },
    {
      icon: '🎨',
      title: 'Kişiselleştirme',
      description: 'Kendi tarzınızı yansıtan özel kategoriler oluşturun.'
    },
    {
      icon: '💼',
      title: 'Organizasyon Paneli',
      description: 'İşletmeler için özel yönetim araçları ve toplu işlemler.'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Kullanıcı' },
    { number: '50K+', label: 'Outfit' },
    { number: '200+', label: 'Marka' },
    { number: '99%', label: 'Memnuniyet' }
  ];

  const team = [
    {
      name: 'Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      image: '👨‍💼',
      description: 'Moda teknolojisi alanında 10+ yıl deneyim'
    },
    {
      name: 'Ayşe Kaya',
      role: 'Tasarım Direktörü',
      image: '👩‍🎨',
      description: 'Kullanıcı deneyimi ve arayüz tasarımı uzmanı'
    },
    {
      name: 'Mehmet Demir',
      role: 'Teknik Direktör',
      image: '👨‍💻',
      description: 'Full-stack developer ve AI uzmanı'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white py-20 overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
          <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-purple-600 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <span className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
                Hakkımızda
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Moda ve Teknolojinin<br/>Buluşma Noktası
            </h1>
            <p className="text-xl text-indigo-200 mb-8 leading-relaxed">
              SharingApp, kıyafet kombinlerinizi yönetmenin en modern ve kullanıcı dostu yolu. 
              Tarzınızı keşfedin, paylaşın ve ilham alın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-indigo-900 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
              >
                Hemen Başla
              </Link>
              <Link
                to="/"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Misyonumuz</h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Herkesin kendi tarzını bulmasına, yönetmesine ve paylaşmasına yardımcı olmak. 
                Moda dünyasını dijitalleştirerek, kullanıcılarımıza sınırsız ilham kaynağı sunuyoruz.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Vizyon</h3>
                <p className="text-gray-600">
                  Dünyanın en büyük outfit paylaşım platformu olmak ve moda endüstrisini dijital çağa taşımak.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
                <div className="text-5xl mb-4">💡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">İnovasyon</h3>
                <p className="text-gray-600">
                  AI destekli öneri sistemleri ve akıllı etiketleme ile kullanıcı deneyimini sürekli geliştiriyoruz.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Topluluk</h3>
                <p className="text-gray-600">
                  Küresel bir moda topluluğu oluşturarak, insanları tarzları üzerinden bir araya getiriyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Öne Çıkan Özellikler</h2>
            <p className="text-xl text-gray-600">
              SharingApp'i özel kılan nedir?
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
            <p className="text-xl text-gray-600">
              SharingApp'i hayata geçiren tutkulu ekip
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-xl transition-all"
              >
                <div className="text-7xl mb-4">{member.image}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-indigo-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Hazır mısın?</h2>
          <p className="text-xl mb-8 text-indigo-100">
            Tarzını yönetmenin en kolay yolunu keşfet. Ücretsiz başla!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:-translate-y-1 shadow-lg"
            >
              Ücretsiz Kaydol
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">SharingApp</h3>
              <p className="text-gray-400 text-sm">
                Tarzınızı yönetin, paylaşın ve ilham alın.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Ürün</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/explore" className="hover:text-white">Keşfet</Link></li>
                <li><Link to="/my-outfits" className="hover:text-white">Kombinlerim</Link></li>
                <li><Link to="/" className="hover:text-white">Özellikler</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Şirket</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link to="/about" className="hover:text-white">Hakkımızda</Link></li>
                <li><a href="#" className="hover:text-white">Kariyer</a></li>
                <li><a href="#" className="hover:text-white">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Yasal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white">Gizlilik</a></li>
                <li><a href="#" className="hover:text-white">Kullanım Şartları</a></li>
                <li><a href="#" className="hover:text-white">Çerezler</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 SharingApp. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;