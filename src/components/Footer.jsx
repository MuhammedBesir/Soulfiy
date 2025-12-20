import { Save, Download, RotateCcw } from "lucide-react";

export default function Footer({ darkMode, exportData, resetData }) {
  return (
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
              PDF Rapor İndir
            </button>

            <button
              onClick={resetData}
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
  );
}
