import { mealTypes, mealEmojis } from './utils';

interface MacrosSummaryProps {
  summary: any;
}

export default function MacrosSummary({ summary }: MacrosSummaryProps) {
  return (
    <div className="glass-card p-6 lg:col-span-2">
      <h3 className="section-title mb-4">Macronutrients</h3>
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Protein', value: summary?.totalProtein || 0, color: 'from-blue-500 to-blue-600', unit: 'g' },
          { label: 'Carbs', value: summary?.totalCarbs || 0, color: 'from-amber-500 to-amber-600', unit: 'g' },
          { label: 'Fat', value: summary?.totalFat || 0, color: 'from-rose-500 to-rose-600', unit: 'g' },
        ].map((macro) => (
          <div key={macro.label} className="text-center p-4 rounded-xl bg-gray-50 dark:bg-dark-600">
            <p className={`text-2xl font-bold bg-gradient-to-r ${macro.color} bg-clip-text text-transparent`}>
              {macro.value.toFixed(1)}{macro.unit}
            </p>
            <p className="text-sm text-gray-500 dark:text-dark-200 mt-1">{macro.label}</p>
          </div>
        ))}
      </div>

      {/* Meal breakdown */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {mealTypes.map((type) => {
          const mealData = summary?.byMealType?.[type];
          return (
            <div key={type} className="p-3 rounded-xl bg-gray-50 dark:bg-dark-600 text-center">
              <span className="text-xl">{mealEmojis[type]}</span>
              <p className="text-sm font-medium capitalize text-gray-700 dark:text-dark-100 mt-1">{type}</p>
              <p className="text-xs text-gray-500 dark:text-dark-200">{mealData?.calories || 0} cal · {mealData?.count || 0} items</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
