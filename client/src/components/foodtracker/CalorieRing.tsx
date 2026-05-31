interface CalorieRingProps {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  caloriePercent: number;
  totalCalories: number;
  calorieGoal: number;
}

export default function CalorieRing({ selectedDate, setSelectedDate, caloriePercent, totalCalories, calorieGoal }: CalorieRingProps) {
  return (
    <div className="glass-card p-6 text-center">
      <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="input-field mb-4 text-center" max={new Date().toISOString().split('T')[0]} />
      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r="70" strokeWidth="12" stroke="currentColor" fill="none" className="text-gray-200 dark:text-dark-500" />
          <circle cx="80" cy="80" r="70" strokeWidth="12" stroke="url(#gradient)" fill="none"
            strokeDasharray={`${caloriePercent * 4.4} 440`}
            strokeLinecap="round" className="transition-all duration-700" />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5c7cfa" />
              <stop offset="100%" stopColor="#f06595" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalCalories}</p>
          <p className="text-xs text-gray-500 dark:text-dark-200">/ {calorieGoal} cal</p>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-gray-600 dark:text-dark-100">{caloriePercent}% of daily goal</p>
    </div>
  );
}
