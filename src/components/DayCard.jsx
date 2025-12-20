import {
  CheckCircle,
  Circle,
  Dumbbell,
  Code2,
  Quote,
  Trophy,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";

export default function DayCard({
  day,
  index,
  darkMode,
  toggleCompleted,
  updateSport,
  updateCode,
  updateJournal,
  requestAISuggestion,
  clearAISuggestion,
  loadingAI,
  aiSuggestions,
}) {
  return (
    <article
      className={`backdrop-blur-sm rounded-2xl p-5 shadow-lg transition-all duration-300 hover:-translate-y-1 ${
        day.completed
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
              day.completed
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
              {day.day}
            </h2>
            {day.completed && (
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
          onClick={() => toggleCompleted(day.id)}
          className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
            day.completed
              ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-amber-200"
              : darkMode
              ? "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-amber-400"
              : "bg-orange-50 text-stone-400 hover:bg-orange-100 hover:text-orange-500"
          }`}
          aria-pressed={day.completed}
        >
          {day.completed ? (
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
              value={day.sport}
              onChange={(e) => updateSport(day.id, e.target.value)}
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
              value={day.code}
              onChange={(e) => updateCode(day.id, e.target.value)}
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
            onClick={() => requestAISuggestion(day)}
            disabled={loadingAI[day.id]}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              darkMode
                ? "bg-purple-900/40 text-purple-300 hover:bg-purple-900/60 border border-purple-700/50"
                : "bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200"
            } ${loadingAI[day.id] ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loadingAI[day.id] ? (
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
          value={day.journal}
          onChange={(e) => updateJournal(day.id, e.target.value)}
        />

        {/* AI Suggestion Display */}
        {aiSuggestions[day.id] && (
          <div
            className={`mt-2 p-3 rounded-xl border relative ${
              darkMode
                ? "bg-purple-900/20 border-purple-700/40"
                : "bg-purple-50 border-purple-200"
            }`}
          >
            <button
              onClick={() => clearAISuggestion(day.id)}
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
                {aiSuggestions[day.id]}
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
            "{day.quote}"
          </p>
        </div>
      </footer>
    </article>
  );
}
