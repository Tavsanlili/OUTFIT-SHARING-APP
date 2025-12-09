🧥 [Sharing-App] - Outfit Management Platform
Bu proje, modern web geliştirme süreçleri kullanılarak geliştirilmiş, rol tabanlı (Role-Based) bir kıyafet kombin ve yönetim platformudur. Kullanıcıların kıyafetleri keşfedebileceği, kendi kombinlerini oluşturabileceği; organizasyonların ise geniş çaplı kıyafet ve etiket yönetimi yapabileceği kapsamlı bir Frontend uygulamasıdır.

Proje, Access Token / Refresh Token mantığına dayalı güvenli bir kimlik doğrulama altyapısına sahiptir ve profesyonel Git Flow & PR süreçleri izlenerek geliştirilmiştir.

🚀 Projenin Amacı:
Bu projenin temel amacı, uçtan uca modern bir React uygulaması geliştirerek aşağıdaki yetkinlikleri sergilemektir:

-JWT (JSON Web Token) ile güvenli kimlik doğrulama ve oturum yönetimi.

-Axios Interceptor'lar ile otomatik token yenileme (Refresh Token Flow).

-Role-Based Access Control (RBAC) ile kullanıcı ve organizasyon panellerinin ayrıştırılması.

-Zustand ile performanslı Global State yönetimi.

-Karmaşık veri yönetimi (Sayfalama, Filtreleme, Arama, Sıralama).

-Görsel yükleme (Image Upload) ve CRUD işlemleri.

--------------------------------------------------------
Alan: Teknoloji
Core: "React 18, Vite"
Dil: JavaScript (ES6+) / JSX
State Management: Zustand
Routing: React Router DOM v6
HTTP Client: Axios (Interceptors ile yapılandırılmış)
Styling: Tailwind CSS
Build Tool: Vite
Version Control: Git & GitHub (PR Workflow)

--------------------------------------------------------
🌟 Özellikler

🔐 Kimlik Doğrulama (Auth)

-Login, Register sayfaları.

-Access Token & Refresh Token mekanizması.

-Oturum süresi dolduğunda kullanıcı hissetmeden token yenileme (Silent Refresh).

-Güvenli çıkış (Logout).


👤 User (Kullanıcı) Paneli

-Keşfet (Explore): Tüm kombinleri listeleme, arama ve etiketlere göre filtreleme.

-Kombin Oluşturma: Kendi kıyafet kombinini oluşturma ve fotoğraf yükleme.

-Kişisel Yönetim: Sadece kendi oluşturduğu içerikleri düzenleme ve silme yetkisi.


🏢 Organization (Organizasyon) Paneli

-Gelişmiş Liste: Tüm sistemdeki outfitleri yönetme (Server-side pagination & sorting).

-Tag Yönetimi: Sisteme yeni etiketler (Casual, Winter vb.) ekleme, güncelleme ve silme.


🌐 Genel

-Responsive (Mobil uyumlu) tasarım.

-Landing Page, Hakkımızda sayfası.

-Private ve Protected Route yapıları.

------------------------------------------------------
⚙️ Kurulum ve Çalıştırma Talimatları
Projeyi yerel makinenizde çalıştırmak için aşağıdaki adımları izleyin:

1. Repoyu Klonlayın

-> git clone https://github.com/kullaniciadi/repo-adi.git
   cd repo-adi

2. Bağımlılıkları Yükleyin

-> npm install

3. Çevresel Değişkenleri (Environment Variables) Ayarlayın Ana dizinde .env dosyası oluşturun ve API adresini ekleyin:

-> VITE_API_BASE_URL=http://api.ornekadres.com

4. Projeyi Başlatın

->npm run dev

Tarayıcınızda http://localhost:5173 adresine giderek projeyi görüntüleyebilirsiniz.

-----------------------------------------------------------------
📂 Proje Yapısı
src/
├── api/            # Axios instance ve API istekleri
├── components/     # Tekrar kullanılabilir UI bileşenleri
├── hooks/          # Custom React hooks
├── layouts/        # Sayfa düzenleri (AuthLayout, DashboardLayout)
├── pages/          # Uygulama sayfaları
├── router/         # React Router tanımları ve RouteGuard'lar
├── store/          # Zustand global state dosyaları (authStore vb.)
└── utils/          # Yardımcı fonksiyonlar

------------------------------------------------------------------
🤝 Katkı ve Geliştirme Süreci (Git Workflow)
Bu proje geliştirilirken katı bir Branch & Pull Request stratejisi uygulanmıştır:

Her özellik için ayrı bir feature/ branch'i açılmıştır.

Geliştirmeler tamamlandıktan sonra Main branch'ine PR (Pull Request) açılmıştır.

Kod incelemesi (Code Review) yapıldıktan sonra merge işlemi gerçekleştirilmiştir.

Doğrudan main branch'ine commit atılmamıştır.

Geliştirici:Koray Tavşanlılı
