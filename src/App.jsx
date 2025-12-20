import React, { useEffect, useState } from "react";
import {
  Activity,
  Target,
  Flame,
  TrendingUp,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import LoginScreen from "./components/LoginScreen";
import Header from "./components/Header";
import DayCard from "./components/DayCard";
import Footer from "./components/Footer";
import { exportToPDF } from "./utils/pdfExport";
import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

// Environment variables'dan al - güvenli!
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY || "";

/**
 * Weekly Self-Improvement Tracker
 * Dark mode, AI suggestions, Weekly quotes
 */

const INITIAL_DATA = [
  {
    id: 1,
    day: "Pazartesi",
    sport: "Kardiyo / Yürüyüş",
    code: "Yeni Konu Öğrenimi",
    quote: "Bin millik bir yolculuk tek bir adımla başlar.",
    completed: false,
    journal: "",
  },
  {
    id: 2,
    day: "Salı",
    sport: "Ağırlık Antrenmanı",
    code: "Kod Pratikleri",
    quote: "Dün yapmadıkların için pişman olma, bugüne odaklan.",
    completed: false,
    journal: "",
  },
  {
    id: 3,
    day: "Çarşamba",
    sport: "Dinlenme",
    code: "Proje Geliştirme",
    quote: "Disiplin, hedeflerinle isteklerin arasındaki köprüdür.",
    completed: false,
    journal: "",
  },
  {
    id: 4,
    day: "Perşembe",
    sport: "Kardiyo",
    code: "Hata Ayıklama (Debug)",
    quote: "Hata yapmak, denediğinin kanıtıdır.",
    completed: false,
    journal: "",
  },
  {
    id: 5,
    day: "Cuma",
    sport: "Tüm Vücut",
    code: "Haftalık Tekrar",
    quote: "Yorgun olduğunda dinlen, pes etme.",
    completed: false,
    journal: "",
  },
  {
    id: 6,
    day: "Cumartesi",
    sport: "Doğa Yürüyüşü",
    code: "Hackathon Hazırlığı",
    quote: "Hayallerin bahanelerinden büyük olsun.",
    completed: false,
    journal: "",
  },
  {
    id: 7,
    day: "Pazar",
    sport: "Yoga / Esneme",
    code: "Planlama",
    quote: "Gelecek, bugünden hazırlananlara aittir.",
    completed: false,
    journal: "",
  },
];

const STORAGE_KEY = "weekly-tracker-data-v1";
const DARK_MODE_KEY = "weekly-tracker-dark-mode";
const AUTH_KEY = "weekly-tracker-auth";
const AI_SUGGESTIONS_KEY = "weekly-tracker-ai-suggestions";
const QUOTES_WEEK_KEY = "weekly-tracker-quotes-week";

// Haftalık motive edici sözler havuzu
const MOTIVATIONAL_QUOTES_POOL = [
  "Bin millik bir yolculuk tek bir adımla başlar.",
  "Dün yapmadıkların için pişman olma, bugüne odaklan.",
  "Disiplin, hedeflerinle isteklerin arasındaki köprüdür.",
  "Hata yapmak, denediğinin kanıtıdır.",
  "Yorgun olduğunda dinlen, pes etme.",
  "Hayallerin bahanelerinden büyük olsun.",
  "Gelecek, bugünden hazırlananlara aittir.",
  "Başarı küçük çabaların tekrarıdır.",
  "Değişim bugün başlar, yarın değil.",
  "Sen düşündüğünden çok daha güçlüsün.",
  "Her gün bir önceki günden daha iyi ol.",
  "İmkansız, sadece büyük bir olasılıktır.",
  "Limitler sadece zihnindedir.",
  "Bugün yaptıkların yarının temelini atar.",
];

// Haftanın numarasını al (sözlerin haftalık değişmesi için)
const getWeekNumber = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
};

// Haftalık sözleri karıştır ve ata
const getWeeklyQuotes = () => {
  const currentWeek = getWeekNumber();
  const storedWeek = localStorage.getItem(QUOTES_WEEK_KEY);

  // Eğer hafta değişmişse veya hiç kaydedilmemişse yeni sözler seç
  if (!storedWeek || parseInt(storedWeek) !== currentWeek) {
    const shuffled = [...MOTIVATIONAL_QUOTES_POOL].sort(
      () => Math.random() - 0.5
    );
    const weeklyQuotes = shuffled.slice(0, 7);
    localStorage.setItem(QUOTES_WEEK_KEY, currentWeek.toString());
    return weeklyQuotes;
  }

  // Aynı hafta içindeyse mevcut INITIAL_DATA'dan al
  return INITIAL_DATA.map((d) => d.quote);
};

// Haftalık sözlerle INITIAL_DATA'yı güncelle
const weeklyQuotes = getWeeklyQuotes();
INITIAL_DATA.forEach((day, index) => {
  day.quote = weeklyQuotes[index];
});

// AI öneri fonksiyonu
const getAISuggestion = async (journal, day, sport, code) => {
  if (!AI_API_KEY) {
    return "⚠️ AI önerileri için API key gerekli. .env dosyasında VITE_AI_API_KEY'i ayarla ve sunucuyu yeniden başlat.";
  }

  const prompt = `Sen kişisel gelişim koçusun. Kullanıcı "${day}" günü için şunları yazdı:

Günlük düşünceler: "${journal}"
Spor aktivitesi: ${sport}
Kodlama görevi: ${code}

Kullanıcıya kısa, motive edici ve pratik bir öneri ver. Türkçe yaz, 2-3 cümle ile sınırla. Samimi ve destekleyici ol.`;

  // Sadece çalışan modeli kullan
  const models = [
    {
      name: "gemini-2.5-flash",
      config: { maxOutputTokens: 2000, temperature: 0.8 },
    },
  ];

  for (const { name: model, config } of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${AI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: config,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Gemini API response yapısı - farklı senaryolar
        const candidate = data.candidates?.[0];
        if (candidate) {
          // Normal text response
          const text = candidate.content?.parts?.[0]?.text;
          if (text) return text;

          // Alternatif yapılar
          if (candidate.text) return candidate.text;
          if (candidate.output) return candidate.output;

          // finishReason kontrolü
          if (candidate.finishReason === "SAFETY") {
            return "⚠️ AI güvenlik kuralları nedeniyle yanıt vermedi. Farklı bir soru dene.";
          }
          if (candidate.finishReason === "MAX_TOKENS") {
            // Yarım kalmış yanıt bile olsa göster
            const partialText = candidate.content?.parts?.[0]?.text;
            if (partialText) return partialText + "...";
            return "⏳ Yanıt çok uzun oldu, tekrar dene.";
          }
        }

        // Başka bir yapıda gelebilir
        if (data.text) return data.text;
        if (data.content) return data.content;

        console.warn(`Model ${model} yanıt verdi ama metin bulunamadı:`, data);
      }

      // 404 ise sonraki modeli dene
      if (response.status === 404) continue;

      // Diğer hatalar
      const errorData = await response.json().catch(() => ({}));
      console.error(`API Error (${model}):`, response.status, errorData);

      if (response.status === 400) {
        return "❌ API key geçersiz. Lütfen .env dosyasını kontrol et.";
      }
      if (response.status === 403) {
        return "🚫 API key'in bu hizmete erişim izni yok. Google AI Studio'dan kontrol et.";
      }
      if (response.status === 429) {
        return "⏳ Çok fazla istek gönderildi. Biraz bekle ve tekrar dene.";
      }
    } catch (error) {
      console.error(`Fetch error (${model}):`, error);
      continue;
    }
  }

  return "❌ AI servisi şu an kullanılamıyor. API key'ini kontrol et veya daha sonra tekrar dene.";
};

export default function App() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [loadingAI, setLoadingAI] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem("soulfiy_darkMode") === "true";
    } catch {
      return false;
    }
  });

  const [days, setDays] = useState(INITIAL_DATA);

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);

        // Firestore'dan kullanıcı verilerini yükle
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setDays(data.days || INITIAL_DATA);
            setAiSuggestions(data.aiSuggestions || {});
          } else {
            // İlk giriş - INITIAL_DATA'yı kaydet
            await setDoc(doc(db, "users", user.uid), {
              email: user.email,
              createdAt: new Date().toISOString(),
              days: INITIAL_DATA,
              aiSuggestions: {},
            });
          }
          setIsInitialLoad(false);
        } catch (error) {
          console.error("Veri yükleme hatası:", error);
          setIsInitialLoad(false);
        }
      } else {
        setCurrentUser(null);
        setIsAuthenticated(false);
        setDays(INITIAL_DATA);
        setAiSuggestions({});
        setIsInitialLoad(true);
      }
    });

    return () => unsubscribe();
  }, []);

  // Days değiştiğinde Firestore'a kaydet (ilk yükleme hariç)
  useEffect(() => {
    if (!currentUser || isInitialLoad) return;

    const saveData = async () => {
      try {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            days,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log("Veriler kaydedildi");
      } catch (error) {
        console.error("Veri kaydetme hatası:", error);
      }
    };

    saveData();
  }, [days, currentUser, isInitialLoad]);

  // AI önerilerini Firestore'a kaydet (ilk yükleme hariç)
  useEffect(() => {
    if (!currentUser || isInitialLoad) return;

    const saveAI = async () => {
      try {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            aiSuggestions,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("AI önerileri kaydetme hatası:", error);
      }
    };

    saveAI();
  }, [aiSuggestions, currentUser, isInitialLoad]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("❌ Email ve şifre boş olamaz!");
      return;
    }

    setLoading(true);
    try {
      // Firebase Authentication ile kullanıcı oluştur
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firestore'da kullanıcı belgesi oluştur
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        createdAt: new Date().toISOString(),
        days: INITIAL_DATA,
        aiSuggestions: {},
      });

      alert("✅ Hesabınız başarıyla oluşturuldu!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      if (error.code === "auth/email-already-in-use") {
        alert("❌ Bu email adresi zaten kullanılıyor!");
      } else if (error.code === "auth/weak-password") {
        alert("❌ Şifre çok zayıf! En az 6 karakter olmalı.");
      } else if (error.code === "auth/invalid-email") {
        alert("❌ Geçersiz email adresi!");
      } else {
        alert("❌ Kayıt sırasında bir hata oluştu: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      alert("❌ Email ve şifre boş olamaz!");
      return;
    }

    setLoading(true);
    try {
      // Firebase Authentication ile giriş yap
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener otomatik olarak kullanıcı verilerini yükleyecek
    } catch (error) {
      console.error("Giriş hatası:", error);
      if (error.code === "auth/user-not-found") {
        alert("❌ Kullanıcı bulunamadı!");
      } else if (error.code === "auth/wrong-password") {
        alert("❌ Hatalı şifre!");
      } else if (error.code === "auth/invalid-email") {
        alert("❌ Geçersiz email adresi!");
      } else if (error.code === "auth/invalid-credential") {
        alert("❌ Email veya şifre hatalı!");
      } else {
        alert("❌ Giriş sırasında bir hata oluştu: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setPassword("");
      setEmail("");
    } catch (error) {
      console.error("Çıkış hatası:", error);
      alert("❌ Çıkış yapılırken bir hata oluştu!");
    }
  };

  const toggleCompleted = (id) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const updateJournal = (id, text) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, journal: text } : d))
    );
  };

  const updateSport = (id, text) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, sport: text } : d))
    );
  };

  const updateCode = (id, text) => {
    setDays((prev) =>
      prev.map((d) => (d.id === id ? { ...d, code: text } : d))
    );
  };

  const completedCount = days.filter((d) => d.completed).length;
  const percentage = Math.round((completedCount / days.length) * 100);
  const hoursCoded = completedCount * 3;

  const currentStreak = days.reduce((streak, day, i) => {
    if (i === 0) return day.completed ? 1 : 0;
    if (day.completed && days[i - 1].completed) return streak + 1;
    if (day.completed && !days[i - 1].completed) return 1;
    return streak;
  }, 0);

  // Dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newValue = !prev;
      localStorage.setItem(DARK_MODE_KEY, String(newValue));
      return newValue;
    });
  };

  // AI öneri al
  const requestAISuggestion = async (day) => {
    if (loadingAI[day.id]) return;
    if (!day.journal.trim()) {
      alert("Önce günlük düşüncelerini yaz!");
      return;
    }

    setLoadingAI((prev) => ({ ...prev, [day.id]: true }));

    const suggestion = await getAISuggestion(
      day.journal,
      day.day,
      day.sport,
      day.code
    );

    setAiSuggestions((prev) => ({ ...prev, [day.id]: suggestion }));
    setLoadingAI((prev) => ({ ...prev, [day.id]: false }));
  };

  // AI önerisini kapat
  const clearAISuggestion = (id) => {
    setAiSuggestions((prev) => {
      const newSuggestions = { ...prev };
      delete newSuggestions[id];
      return newSuggestions;
    });
  };

  // Export data as beautiful formatted report
  const exportData = () => {
    exportToPDF(days, aiSuggestions);
  };

  // Reset all data
  const resetData = async () => {
    if (!confirm("Tüm ilerleme ve günlükler sıfırlansın mı?")) return;

    setDays(INITIAL_DATA);
    setAiSuggestions({});

    if (currentUser) {
      try {
        await setDoc(
          doc(db, "users", currentUser.uid),
          {
            days: INITIAL_DATA,
            aiSuggestions: {},
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Sıfırlama hatası:", error);
        alert("❌ Veriler sıfırlanırken bir hata oluştu!");
      }
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        password={password}
        setPassword={setPassword}
        email={email}
        setEmail={setEmail}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
        loading={loading}
      />
    );
  }

  return (
    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-900"
          : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
      }`}
    >
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <Header
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            handleLogout={handleLogout}
            hoursCoded={hoursCoded}
            completedCount={completedCount}
            currentStreak={currentStreak}
            percentage={percentage}
            days={days}
          />

          {/* Grid of day cards */}
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {days.map((day, index) => (
                <DayCard
                  key={day.id}
                  day={day}
                  index={index}
                  darkMode={darkMode}
                  toggleCompleted={toggleCompleted}
                  updateSport={updateSport}
                  updateCode={updateCode}
                  updateJournal={updateJournal}
                  requestAISuggestion={requestAISuggestion}
                  loadingAI={loadingAI}
                  aiSuggestions={aiSuggestions}
                  clearAISuggestion={clearAISuggestion}
                />
              ))}
            </div>
          </main>

          {/* Footer Controls */}
          <Footer
            darkMode={darkMode}
            exportData={exportData}
            resetData={resetData}
          />
        </div>
      </div>
    </div>
  );
}
