export default function StatsCard({
  icon: Icon,
  label,
  value,
  max,
  darkMode,
  colorClass,
}) {
  return (
    <div
      className={`rounded-2xl px-4 py-3 min-w-[90px] border ${
        darkMode
          ? `bg-${colorClass}-900/30 border-${colorClass}-700/50`
          : `bg-gradient-to-br from-${colorClass}-50 to-${
              colorClass.includes("amber")
                ? "orange"
                : colorClass.includes("orange")
                ? "rose"
                : "pink"
            }-100 border-${colorClass}-200/50`
      }`}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <Icon
          className={`w-4 h-4 ${
            darkMode ? `text-${colorClass}-400` : `text-${colorClass}-600`
          }`}
        />
        <span
          className={`text-xs font-medium ${
            darkMode ? `text-${colorClass}-300` : `text-${colorClass}-700`
          }`}
        >
          {label}
        </span>
      </div>
      <div
        className={`text-2xl font-bold ${
          darkMode ? `text-${colorClass}-100` : `text-${colorClass}-900`
        }`}
      >
        {value}
        <span
          className={`text-sm ${
            darkMode ? `text-${colorClass}-400` : `text-${colorClass}-500`
          }`}
        >
          /{max}
        </span>
      </div>
    </div>
  );
}
