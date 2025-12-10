import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* --- HERO BÖLÜMÜ (Giriş) --- */}
      <section className="relative bg-gradient-to-b from-purple-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32 pt-20 px-4 sm:px-6 lg:px-8">
            
            <main className="mt-10 mx-auto max-w-7xl sm:mt-12 md:mt-16 lg:mt-20 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Tarzını Paylaş,</span>{' '}
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                    Dünyaya İlham Ver.
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Sharing APP ile dolabındaki potansiyeli keşfet. En sevdiğin kombinleri oluştur, paylaş ve dünyanın dört bir yanındaki moda tutkunlarından ilham al.
                </p>
                
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start gap-4">
                  <div className="rounded-md shadow">
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-purple-600 hover:bg-purple-700 md:py-4 md:text-lg transition-transform hover:scale-105"
                    >
                      Hemen Başla
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border-2 border-purple-100 text-base font-medium rounded-full text-purple-700 bg-purple-50 hover:bg-purple-100 md:py-4 md:text-lg transition-colors"
                    >
                      Giriş Yap
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
        
        {/* --- SAĞ TARAF GÖRSELİ (Düzenlendi) --- */}
        {/* lg:inset-y-4 ve lg:right-4 -> Kenarlardan boşluk bırakır.
            lg:rounded-[50px] -> Köşeleri ovalleştirir.
            lg:p-12 -> Görseli mor kutunun içine doğru iter (küçültür).
        */}
        <div className="lg:absolute lg:inset-y-4 lg:right-4 lg:w-1/2 bg-purple-100 lg:rounded-[50px] lg:p-12 flex items-center justify-center">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-auto opacity-90 hover:opacity-100 transition-all duration-500 lg:rounded-3xl shadow-2xl"
            src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
            alt="Fashion woman shopping"
          />
        </div>
      </section>

      {/* --- ÖZELLİKLER (Features) --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base text-purple-600 font-semibold tracking-wide uppercase">Özellikler</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Moda Dünyasının Kalbi Burada
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Sadece bir uygulama değil, stilini geliştirebileceğin bir topluluk.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Kart 1 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg border border-gray-100">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md shadow-lg">
                      <span className="text-3xl">✨</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Keşfet</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Trendleri yakala. Binlerce farklı kombini incele ve kendi tarzına en uygun parçaları bul.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 2 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg border border-gray-100">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-pink-500 to-red-500 rounded-md shadow-lg">
                      <span className="text-3xl">📸</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Paylaş</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Kendi stilini oluştur, fotoğraflarını yükle ve topluluğun beğenisine sun. Takipçi kazan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Kart 3 */}
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8 h-full hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-lg border border-gray-100">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded-md shadow-lg">
                      <span className="text-3xl">🤝</span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">İlham Al</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Favori mağazalarını ve influencerlarını takip et. Senin için özel olarak seçilen önerileri gör.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* --- ALT CTA (Call to Action) --- */}
      <section className="bg-gradient-to-r from-purple-800 to-pink-900">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Stil yolculuğuna hazır mısın?</span>
            <span className="block text-purple-200">Bugün ücretsiz hesabını oluştur.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 gap-3">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-purple-600 bg-white hover:bg-purple-50"
              >
                Kayıt Ol
              </Link>
            </div>
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-700 hover:bg-purple-800"
              >
                Giriş Yap
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;