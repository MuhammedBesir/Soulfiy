import React, { useState } from "react";
import { Lock, Eye, EyeOff, Sun, Moon, UserPlus, LogIn } from "lucide-react";

export default function LoginScreen({
  darkMode,
  setDarkMode,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  handleLogin,
  handleRegister,
  username,
  setUsername,
}) {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginMode) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

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
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`absolute top-4 right-4 p-2 rounded-lg ${
            darkMode
              ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
              : "bg-orange-100 text-orange-700 hover:bg-orange-200"
          }`}
        >
          {darkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="text-center mb-8">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
              darkMode
                ? "bg-amber-900/30"
                : "bg-gradient-to-br from-amber-100 to-orange-100"
            }`}
          >
            <Lock
              className={`w-8 h-8 ${
                darkMode ? "text-amber-400" : "text-orange-600"
              }`}
            />
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
            {isLoginMode ? "Hesabına giriş yap" : "Yeni hesap oluştur"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Kullanıcı Adı
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adınız"
              required
              className={`w-full px-4 py-3 rounded-lg border ${
                darkMode
                  ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                  : "bg-white border-orange-200 text-slate-900 placeholder-slate-400"
              } focus:outline-none focus:ring-2 ${
                darkMode ? "focus:ring-amber-500" : "focus:ring-orange-500"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-2 ${
                darkMode ? "text-slate-300" : "text-slate-700"
              }`}
            >
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifrenizi girin"
                required
                minLength="4"
                className={`w-full px-4 py-3 rounded-lg border ${
                  darkMode
                    ? "bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    : "bg-white border-orange-200 text-slate-900 placeholder-slate-400"
                } focus:outline-none focus:ring-2 ${
                  darkMode ? "focus:ring-amber-500" : "focus:ring-orange-500"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                  darkMode
                    ? "text-slate-400 hover:text-slate-300"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              darkMode
                ? "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white"
                : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
            } shadow-lg hover:shadow-xl`}
          >
            {isLoginMode ? (
              <>
                <LogIn className="w-5 h-5" />
                Giriş Yap
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Kayıt Ol
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className={`text-sm font-medium ${
              darkMode
                ? "text-amber-400 hover:text-amber-300"
                : "text-orange-600 hover:text-orange-700"
            }`}
          >
            {isLoginMode
              ? "Hesabın yok mu? Kayıt ol"
              : "Zaten hesabın var mı? Giriş yap"}
          </button>
        </div>
      </div>
    </div>
  );
}
