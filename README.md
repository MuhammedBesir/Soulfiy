# Soulfiy - Haftalık Gelişim Takibi 🌟

Haftalık self-improvement hedeflerinizi takip edin, gelişiminizi izleyin ve AI destekli öneriler alın!

## 🚀 Özellikler

- ✅ **Haftalık Takip**: 7 günlük gelişim planı
- 👤 **Çoklu Kullanıcı**: Email ile kayıt ve giriş
- ☁️ **Cloud Sync**: Firebase ile cihazlar arası senkronizasyon
- 🤖 **AI Önerileri**: Google Gemini ile akıllı öneriler
- 📊 **PDF Rapor**: Haftalık gelişim raporunu indir
- 🌙 **Dark Mode**: Göz dostu karanlık tema
- 💾 **Otomatik Kayıt**: Verileriniz otomatik kaydedilir

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

### 3. Firebase Kurulumu

#### 3.1. Firebase Projesi Oluşturun

1. [Firebase Console](https://console.firebase.google.com/) 'a gidin
2. "Add project" ile yeni proje oluşturun
3. Proje adı: "Soulfiy" (veya istediğiniz isim)

#### 3.2. Firebase Authentication Ayarları

1. Firebase Console → **Authentication** → **Get started**
2. **Sign-in method** sekmesinde **Email/Password**'ü etkinleştirin
3. "Email/Password" → **Enable** → Save

#### 3.3. Firestore Database Ayarları

1. Firebase Console → **Firestore Database** → **Create database**
2. **Production mode** seçin → **Next**
3. Location seçin (Europe-west3 önerilir) → **Enable**

#### 3.4. Firebase Rules

Firestore Rules kısmına şu kuralları ekleyin:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Sadece kendi verilerine erişebilir
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

#### 3.5. Firebase Config

1. Firebase Console → **Project Settings** (⚙️ ikonu)
2. **Your apps** → **Web app** (</> ikonu) → **Register app**
3. App nickname: "Soulfiy Web"
4. **Firebase SDK snippet** → **Config** seçeneğini kopyalayın

### 4. Environment Variables

`.env` dosyası oluşturun ve Firebase config bilgilerinizi ekleyin:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# AI API Key (Google Gemini) - Opsiyonel
VITE_AI_API_KEY=your_gemini_api_key
```

#### AI API Key Alma (Opsiyonel)

1. [Google AI Studio](https://makersuite.google.com/app/apikey) 'ya gidin
2. "Create API Key" ile ücretsiz API key alın
3. `.env` dosyasına ekleyin

### 5. Uygulamayı Çalıştırın

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
- Firebase (Auth + Firestore)
- Google Gemini AI
- jsPDF
- Lucide Icons

---

Made with ❤️ by [Muhammed Besir](https://github.com/MuhammedBesir)
