import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  Circle,
  Activity,
  Dumbbell,
  Code2,
  Quote,
  Target,
  Flame,
  Trophy,
  RotateCcw,
  Calendar,
  TrendingUp,
  Download,
  Upload,
  Save,
  Moon,
  Sun,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";

// Environment variables'dan al - güvenli!
const SECRET_PASSWORD = import.meta.env.VITE_SECRET_PASSWORD || "soulfiy2024";
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
  const [aiSuggestions, setAiSuggestions] = useState(() => {
    // localStorage'dan AI önerilerini yükle
    try {
      const saved = localStorage.getItem(AI_SUGGESTIONS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [loadingAI, setLoadingAI] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(AUTH_KEY) === "true";
  });
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return localStorage.getItem(DARK_MODE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [days, setDays] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === INITIAL_DATA.length)
          return parsed;
      }
    } catch (e) {}
    return INITIAL_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
    } catch (e) {
      console.error("Failed saving to localStorage", e);
    }
  }, [days]);

  // AI önerilerini localStorage'a kaydet
  useEffect(() => {
    try {
      localStorage.setItem(AI_SUGGESTIONS_KEY, JSON.stringify(aiSuggestions));
    } catch (e) {
      console.error("Failed saving AI suggestions", e);
    }
  }, [aiSuggestions]);

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

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(AUTH_KEY, "true");
      setPassword("");
    } else {
      alert("Yanlış şifre!");
    }
  };

  // Logout handler
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
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
    const date = new Date().toLocaleDateString("tr-TR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    let report = `╔═══════════════════════════════════════════════════════════╗
║           SOULFIY - HAFTALIK GELİŞİM RAPORU              ║
║                   ${date.padStart(29).padEnd(42)}       ║
╚═══════════════════════════════════════════════════════════╝

`;

    // Haftalık özet
    const totalTasks = days.reduce((sum, day) => sum + day.tasks.length, 0);
    const completedTasks = days.reduce(
      (sum, day) => sum + day.tasks.filter((t) => t.completed).length,
      0
    );
    const completionRate =
      totalTasks > 0 ? ((completedTasks / totalTasks) * 100).toFixed(1) : 0;
    const totalProgress = days.reduce(
      (sum, day) => sum + (day.progress || 0),
      0
    );
    const avgProgress = (totalProgress / 7).toFixed(1);

    report += `📊 HAFTALIK ÖZET
${"═".repeat(60)}
`;
    report += `  🎯 Toplam Görev        : ${totalTasks} görev\n`;
    report += `  ✅ Tamamlanan Görev    : ${completedTasks} görev\n`;
    report += `  📈 Tamamlanma Oranı    : %${completionRate}\n`;
    report += `  ⭐ Ortalama İlerleme   : %${avgProgress}\n\n`;

    // Günlük detaylar
    report += `\n📅 GÜNLÜK DETAYLAR\n${"═".repeat(60)}\n\n`;

    days.forEach((day, index) => {
      const dayEmojis = ["📆", "📅", "🗓️", "📋", "📌", "📍", "🎯"];
      const completedCount = day.tasks.filter((t) => t.completed).length;
      const taskCount = day.tasks.length;

      report += `${dayEmojis[index]} ${day.name.toUpperCase()}\n`;
      report += `${"-".repeat(60)}\n`;
      report += `İlerleme: %${
        day.progress || 0
      } | Görevler: ${completedCount}/${taskCount}\n`;

      if (day.tasks.length > 0) {
        report += `\n🎯 Görevler:\n`;
        day.tasks.forEach((task, i) => {
          const status = task.completed ? "✅" : "⬜";
          report += `  ${status} ${i + 1}. ${task.text}\n`;
        });
      }

      if (day.notes) {
        report += `\n📝 Notlar:\n  ${day.notes.split("\n").join("\n  ")}\n`;
      }

      report += `\n`;
    });

    // AI Önerileri
    if (Object.keys(aiSuggestions).length > 0) {
      report += `\n🤖 AI ÖNERİLERİ\n${"═".repeat(60)}\n\n`;
      Object.entries(aiSuggestions).forEach(([dayName, suggestion]) => {
        report += `${dayName}:\n${suggestion}\n\n`;
      });
    }

    report += `\n${"═".repeat(60)}\n`;
    report += `Oluşturulma Tarihi: ${new Date().toLocaleString("tr-TR")}\n`;
    report += `Soulfiy - Haftalık Gelişim Takip Uygulaması\n`;
    report += `https://soulfiy.vercel.app\n`;

    // Dosyayı indir
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = `soulfiy-rapor-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center p-4 ${
          darkMode
            ? "bg-slate-900"
            : "bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50"
        }`}
      >
        <div
          className={`w-full max-w-md p-8 rounded-2xl shadow-xl ${
            darkMode
              ? "bg-slate-800 border border-slate-700"
              : "bg-white border border-orange-100"
          }`}
        >
          <div className="text-center mb-8">
            <div
              className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                darkMode
                  ? "bg-amber-600"
                  : "bg-gradient-to-br from-amber-400 to-orange-500"
              }`}
            >
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-slate-800"
              }`}
            >
              Soulfiy
            </h1>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Giriş yaparak devam edin
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                className={`w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-amber-500"
                    : "bg-white border-orange-100 text-slate-800 placeholder:text-slate-400 focus:border-amber-400"
                } focus:outline-none focus:ring-2 focus:ring-amber-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Giriş Yap
            </button>
          </form>

          <button
            onClick={toggleDarkMode}
            className={`mt-4 w-full py-2 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all ${
              darkMode
                ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                : "bg-orange-50 text-orange-600 hover:bg-orange-100"
            }`}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
            {darkMode ? "Açık Mod" : "Karanlık Mod"}
          </button>
        </div>
      </div>
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
      {/* Content */}
      <div className="min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div
              className={`rounded-2xl p-6 shadow-sm border ${
                darkMode
                  ? "bg-slate-800 border-slate-700"
                  : "bg-white border-slate-200"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                {/* Title Section */}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      darkMode ? "bg-amber-600" : "bg-slate-800"
                    }`}
                  >
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1
                      className={`text-xl sm:text-2xl font-bold ${
                        darkMode ? "text-white" : "text-slate-800"
                      }`}
                    >
                      Soulfiy
                    </h1>
                    <p
                      className={`text-sm mt-0.5 ${
                        darkMode ? "text-slate-400" : "text-slate-500"
                      }`}
                    >
                      Haftalık Gelişim Takipçisi
                    </p>
                  </div>

                  {/* Dark mode & Logout buttons */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={toggleDarkMode}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        darkMode
                          ? "bg-slate-700 text-amber-400 hover:bg-slate-600"
                          : "bg-orange-50 text-orange-500 hover:bg-orange-100"
                      }`}
                    >
                      {darkMode ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={handleLogout}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        darkMode
                          ? "bg-slate-700 text-slate-400 hover:bg-red-900/50 hover:text-red-400"
                          : "bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500"
                      }`}
                      title="Çıkış Yap"
                    >
                      <Lock className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Stats Cards */}
                <div className="flex gap-3 sm:gap-4">
                  <div
                    className={`rounded-2xl px-4 py-3 min-w-[90px] border ${
                      darkMode
                        ? "bg-amber-900/30 border-amber-700/50"
                        : "bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Activity
                        className={`w-4 h-4 ${
                          darkMode ? "text-amber-400" : "text-amber-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          darkMode ? "text-amber-300" : "text-amber-700"
                        }`}
                      >
                        Saat
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        darkMode ? "text-amber-100" : "text-amber-900"
                      }`}
                    >
                      {hoursCoded}
                      <span
                        className={`text-sm ${
                          darkMode ? "text-amber-400" : "text-amber-500"
                        }`}
                      >
                        /21
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 min-w-[90px] border ${
                      darkMode
                        ? "bg-orange-900/30 border-orange-700/50"
                        : "bg-gradient-to-br from-orange-50 to-rose-100 border-orange-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target
                        className={`w-4 h-4 ${
                          darkMode ? "text-orange-400" : "text-orange-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          darkMode ? "text-orange-300" : "text-orange-700"
                        }`}
                      >
                        Gün
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        darkMode ? "text-orange-100" : "text-orange-900"
                      }`}
                    >
                      {completedCount}
                      <span
                        className={`text-sm ${
                          darkMode ? "text-orange-400" : "text-orange-500"
                        }`}
                      >
                        /7
                      </span>
                    </div>
                  </div>

                  <div
                    className={`rounded-2xl px-4 py-3 min-w-[90px] border ${
                      darkMode
                        ? "bg-rose-900/30 border-rose-700/50"
                        : "bg-gradient-to-br from-rose-50 to-pink-100 border-rose-200/50"
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Flame
                        className={`w-4 h-4 ${
                          darkMode ? "text-rose-400" : "text-rose-600"
                        }`}
                      />
                      <span
                        className={`text-xs font-medium ${
                          darkMode ? "text-rose-300" : "text-rose-700"
                        }`}
                      >
                        Seri
                      </span>
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        darkMode ? "text-rose-100" : "text-rose-900"
                      }`}
                    >
                      {currentStreak} 🔥
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <TrendingUp
                      className={`w-4 h-4 ${
                        darkMode ? "text-amber-400" : "text-orange-500"
                      }`}
                    />
                    <span
                      className={`text-sm font-medium ${
                        darkMode ? "text-slate-300" : "text-stone-600"
                      }`}
                    >
                      Haftalık İlerleme
                    </span>
                  </div>
                  <span
                    className={`text-sm font-bold ${
                      darkMode ? "text-amber-400" : "text-orange-600"
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>
                <div
                  className={`h-3 rounded-full overflow-hidden ${
                    darkMode ? "bg-slate-700" : "bg-orange-100"
                  }`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex justify-between mt-3 gap-1.5">
                  {days.map((d) => (
                    <div
                      key={d.id}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        d.completed
                          ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-sm"
                          : darkMode
                          ? "bg-slate-700"
                          : "bg-orange-100"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* Grid of day cards */}
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {days.map((d, index) => (
                <article
                  key={d.id}
                  className={`backdrop-blur-sm rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                    d.completed
                      ? darkMode
                        ? "border-2 border-amber-500/50 shadow-amber-900/20 bg-gradient-to-br from-slate-800 to-slate-800/80"
                        : "border-2 border-amber-300 shadow-amber-100 bg-gradient-to-br from-amber-50/80 to-orange-50/80"
                      : darkMode
                      ? "border border-slate-700 bg-slate-800/80 hover:shadow-xl hover:shadow-amber-900/10"
                      : "border border-orange-100 bg-white/80 hover:shadow-xl hover:shadow-orange-100/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md ${
                          d.completed
                            ? "bg-gradient-to-br from-amber-400 to-orange-500"
                            : darkMode
                            ? "bg-gradient-to-br from-slate-600 to-slate-700"
                            : "bg-gradient-to-br from-stone-400 to-stone-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h2
                          className={`font-bold ${
                            darkMode ? "text-white" : "text-stone-800"
                          }`}
                        >
                          {d.day}
                        </h2>
                        {d.completed && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              darkMode ? "text-amber-400" : "text-amber-600"
                            }`}
                          >
                            <Trophy className="w-3 h-3" /> Tamamlandı
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCompleted(d.id)}
                      className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                        d.completed
                          ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-200"
                          : darkMode
                          ? "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-amber-400"
                          : "bg-orange-50 text-stone-400 hover:bg-orange-100 hover:text-orange-500"
                      }`}
                      aria-pressed={d.completed}
                    >
                      {d.completed ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="space-y-2.5 mb-4">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        darkMode
                          ? "bg-amber-900/20 border-amber-700/30"
                          : "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100"
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                        <Dumbbell className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-[10px] uppercase tracking-wide font-semibold block mb-1 ${
                            darkMode ? "text-amber-400" : "text-amber-600"
                          }`}
                        >
                          Spor
                        </span>
                        <input
                          type="text"
                          value={d.sport}
                          onChange={(e) => updateSport(d.id, e.target.value)}
                          placeholder="Spor aktivitesi gir..."
                          className={`w-full text-sm font-medium bg-transparent border-none outline-none ${
                            darkMode
                              ? "text-slate-200 placeholder:text-amber-700/50"
                              : "text-stone-700 placeholder:text-amber-600/40"
                          }`}
                        />
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-xl border ${
                        darkMode
                          ? "bg-slate-700/50 border-slate-600"
                          : "bg-gradient-to-r from-stone-50 to-stone-100 border-stone-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          darkMode
                            ? "bg-gradient-to-br from-slate-500 to-slate-600"
                            : "bg-gradient-to-br from-stone-500 to-stone-600"
                        }`}
                      >
                        <Code2 className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <span
                          className={`text-[10px] uppercase tracking-wide font-semibold block mb-1 ${
                            darkMode ? "text-slate-400" : "text-stone-500"
                          }`}
                        >
                          Kodlama
                        </span>
                        <input
                          type="text"
                          value={d.code}
                          onChange={(e) => updateCode(d.id, e.target.value)}
                          placeholder="Kodlama görevi gir..."
                          className={`w-full text-sm font-medium bg-transparent border-none outline-none ${
                            darkMode
                              ? "text-slate-200 placeholder:text-slate-600/50"
                              : "text-stone-700 placeholder:text-stone-500/40"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label
                        className={`text-xs font-semibold ${
                          darkMode ? "text-slate-400" : "text-stone-500"
                        }`}
                      >
                        Günlük Düşünceler
                      </label>
                      <button
                        onClick={() => requestAISuggestion(d)}
                        disabled={loadingAI[d.id]}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          darkMode
                            ? "bg-purple-900/40 text-purple-300 hover:bg-purple-900/60 border border-purple-700/50"
                            : "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200"
                        } ${
                          loadingAI[d.id] ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loadingAI[d.id] ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        AI Öneri
                      </button>
                    </div>
                    <textarea
                      className={`w-full h-20 resize-none rounded-xl border-2 p-3 text-sm transition-all ${
                        darkMode
                          ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-amber-500 focus:bg-slate-700 focus:ring-2 focus:ring-amber-900/50"
                          : "bg-white/60 border-orange-100 text-stone-800 placeholder:text-stone-400 focus:border-amber-300 focus:bg-white focus:ring-2 focus:ring-amber-100"
                      } focus:outline-none`}
                      placeholder="Bugün ne öğrendin?"
                      value={d.journal}
                      onChange={(e) => updateJournal(d.id, e.target.value)}
                    />

                    {/* AI Suggestion Display */}
                    {aiSuggestions[d.id] && (
                      <div
                        className={`mt-2 p-3 rounded-xl border relative ${
                          darkMode
                            ? "bg-purple-900/20 border-purple-700/40"
                            : "bg-purple-50 border-purple-200"
                        }`}
                      >
                        <button
                          onClick={() => clearAISuggestion(d.id)}
                          className={`absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center ${
                            darkMode
                              ? "bg-slate-700 text-slate-400 hover:text-white"
                              : "bg-purple-100 text-purple-400 hover:text-purple-600"
                          }`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <div className="flex gap-2 pr-6">
                          <Sparkles
                            className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              darkMode ? "text-purple-400" : "text-purple-500"
                            }`}
                          />
                          <p
                            className={`text-xs leading-relaxed ${
                              darkMode ? "text-purple-200" : "text-purple-700"
                            }`}
                          >
                            {aiSuggestions[d.id]}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <footer
                    className={`pt-3 border-t ${
                      darkMode ? "border-slate-700" : "border-orange-100"
                    }`}
                  >
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center flex-shrink-0">
                        <Quote className="w-3 h-3 text-white" />
                      </div>
                      <p
                        className={`text-xs italic leading-relaxed ${
                          darkMode ? "text-slate-400" : "text-stone-500"
                        }`}
                      >
                        "{d.quote}"
                      </p>
                    </div>
                  </footer>
                </article>
              ))}
            </div>
          </main>

          {/* Footer Controls */}
          <footer className="mt-8">
            <div
              className={`backdrop-blur-sm rounded-2xl p-5 shadow-lg border ${
                darkMode
                  ? "bg-slate-800/80 shadow-slate-900/50 border-slate-700"
                  : "bg-white/80 shadow-orange-100/50 border-orange-100"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      darkMode ? "bg-amber-500" : "bg-amber-400"
                    }`}
                  ></div>
                  <Save
                    className={`w-4 h-4 ${
                      darkMode ? "text-amber-400" : "text-amber-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-slate-300" : "text-stone-600"
                    }`}
                  >
                    Veriler otomatik kaydediliyor
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={exportData}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-sm ${
                      darkMode
                        ? "bg-amber-900/30 text-amber-300 border-amber-700/50 hover:bg-amber-900/50"
                        : "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 hover:from-amber-100 hover:to-orange-100"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    Haftalık Rapor İndir
                  </button>

                  <button
                    onClick={() => {
                      if (!confirm("Tüm ilerleme ve günlükler sıfırlansın mı?"))
                        return;
                      localStorage.removeItem(STORAGE_KEY);
                      setDays(INITIAL_DATA);
                    }}
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shadow-sm ${
                      darkMode
                        ? "bg-slate-700 text-slate-300 border-slate-600 hover:bg-red-900/50 hover:border-red-700/50 hover:text-red-300"
                        : "bg-white text-stone-600 border-stone-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Sıfırla
                  </button>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
