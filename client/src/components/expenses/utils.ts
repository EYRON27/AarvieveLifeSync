export const defaultCategories = ['food','transport','housing','utilities','entertainment','healthcare','education','shopping','personal','other'];

export const categoryEmoji: Record<string, string> = {
  food: '🍔', transport: '🚗', housing: '🏠', utilities: '💡', entertainment: '🎬',
  healthcare: '🏥', education: '📚', shopping: '🛍️', personal: '👤', other: '📦',
};

export const COLORS = ['#ff6b6b','#fcc419','#51cf66','#5c7cfa','#f06595','#845ef7','#22b8cf','#ff922b','#20c997','#adb5bd', '#e8590c', '#3bc9db'];

export const getDatesForRange = (range: string) => {
  const today = new Date();
  let dateFrom = '';
  const dateTo = today.toISOString().split('T')[0];
  
  if (range === 'daily') {
    dateFrom = dateTo;
  } else if (range === 'weekly') {
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    dateFrom = lastWeek.toISOString().split('T')[0];
  } else if (range === 'monthly') {
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);
    dateFrom = lastMonth.toISOString().split('T')[0];
  } else if (range === 'yearly') {
    const lastYear = new Date(today);
    lastYear.setFullYear(today.getFullYear() - 1);
    dateFrom = lastYear.toISOString().split('T')[0];
  } else {
    dateFrom = '2000-01-01'; // all time
  }
  return { dateFrom, dateTo };
};
