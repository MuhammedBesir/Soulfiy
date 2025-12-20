import {
  Calendar,
  Sun,
  Moon,
  Lock,
  Activity,
  Target,
  Flame,
  TrendingUp,
} from "lucide-react";

export default function Header({
  darkMode,
  toggleDarkMode,
  handleLogout,
  hoursCoded,
  completedCount,
  currentStreak,
  percentage,
}) {
  return (
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
        </div>
      </div>
    </header>
  );
}
