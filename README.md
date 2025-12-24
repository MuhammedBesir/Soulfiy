# Soulfiy - Haftalık Gelişim Takibi 🌟

Haftalık self-improvement hedeflerinizi takip edin, gelişiminizi izleyin ve AI destekli öneriler alın!

## 🚀 Özellikler

- ✅ **Haftalık Takip**: 7 günlük gelişim planı
- 👤 **Çoklu Kullanıcı**: Email ile kayıt ve giriş
- 💾 **LocalStorage**: Tüm veriler tarayıcıda saklanır (hiç sunucu yok!)
- 🤖 **AI Önerileri**: Google Gemini ile akıllı öneriler
- 📊 **PDF Rapor**: Haftalık gelişim raporunu indir
- 🌙 **Dark Mode**: Göz dostu karanlık tema
- 🔒 **Gizlilik**: Verileriniz sadece sizde kalır
- 📴 **Offline Çalışır**: İnternet gerektirmez

## 🛠️ Kurulum

### 1. Projeyi Klonlayın

```bash
git clone https://github.com/MuhammedBesir/Soulfiy.git
cd Soulfiy
```

### 2. Bağımlılıkları Yükleyin

```bash
npm install
```

### 3. Environment Variables (Opsiyonel)

Sadece AI önerileri için gerekli. `.env` dosyası oluşturun:

```env
# AI API Key (Google Gemini) - Opsiyonel
VITE_AI_API_KEY=your_gemini_api_key
```

#### AI API Key Alma (Opsiyonel)

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 'ya gidin
2. "Create API Key" ile ücretsiz API key alın
3. `.env` dosyasına ekleyin

### 4. Uygulamayı Çalıştırın

```bash
npm run dev
```

Tarayıcınızda `http://localhost:5173` adresini açın.

## 📦 Production Build

```bash
npm run build
```

Build dosyaları `dist/` klasöründe oluşturulur.

## 🌐 Vercel Deploy

### Otomatik Deploy

1. GitHub repository'nizi Vercel'e bağlayın
2. Environment Variables ekleyin (Firebase config)
3. Deploy!

### Manuel Deploy

```bash
npm install -g vercel
vercel --prod
```

Environment variables'ı Vercel Dashboard'dan ekleyin.

## 📱 Kullanım

1. **Kayıt Ol**: Email ve şifre ile hesap oluştur
2. **Giriş Yap**: Herhangi bir cihazdan giriş yap
3. **Haftalık Plan**: Günlük aktivitelerinizi ekle
4. **AI Öneri**: Günlük düşüncelerine AI önerisi al
5. **PDF İndir**: Haftalık raporunu indir
6. **Çıkış Yap**: Güvenli çıkış yap

## 🔒 Güvenlik

- ✅ Firebase Authentication ile güvenli giriş
- ✅ Firestore Security Rules ile veri güvenliği
- ✅ Environment variables ile API key güvenliği
- ✅ Her kullanıcı sadece kendi verilerine erişebilir

## 🛡️ Gizlilik

- Tüm veriler Firebase Cloud Firestore'da güvenle saklanır
- Hiçbir veri 3. partilerle paylaşılmaz
- Verileriniz sadece sizin erişiminizde

## 📊 Nasıl Çalışır?

1. **Kayıt Ol**: Email ve şifre ile hesap oluştur
2. **Hedef Belirle**: Her gün için spor ve kodlama hedefi belirle
3. **Günlük Tut**: Düşüncelerini yaz, AI'dan öneri al
4. **İzle**: Haftalık ilerleme istatistiklerini gör
5. **Rapor Al**: Hafta sonunda PDF rapor indir

## 🔒 Gizlilik ve Güvenlik

- Tüm veriler **tarayıcınızda** localStorage'da saklanır
- Hiçbir veri sunucuya gönderilmez
- Şifreler Base64 ile kodlanır (basit şifreleme)
- Sadece AI önerileri için internet gerekir

## 🤝 Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır!

## 📄 Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🔗 Linkler

- **Canlı Demo**: [soulfiy.vercel.app](https://soulfiy.vercel.app)
- **GitHub**: [github.com/MuhammedBesir/Soulfiy](https://github.com/MuhammedBesir/Soulfiy)

## 💡 Teknolojiler

- React 18
- Vite
- Tailwind CSS
- LocalStorage API
- Google Gemini AI
- jsPDF
- Lucide Icons

---

Made with ❤️ by [Muhammed Besir](https://github.com/MuhammedBesir)
