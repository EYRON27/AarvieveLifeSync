import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/LoadingSpinner';
import { foodApi } from '@/services/endpoints';
import CalorieRing from '@/components/foodtracker/CalorieRing';
import MacrosSummary from '@/components/foodtracker/MacrosSummary';
import MealList from '@/components/foodtracker/MealList';
import FoodModal from '@/components/foodtracker/FoodModal';

export default function FoodTrackerPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', mealType: 'lunch' as string, date: selectedDate, notes: '' });

  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['food-entries'],
    queryFn: () => foodApi.getAll({ limit: 50 }),
    select: (res) => res.data.data,
  });

  const { data: summary } = useQuery({
    queryKey: ['food-summary', selectedDate],
    queryFn: () => foodApi.getSummary(selectedDate),
    select: (res) => res.data.data,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => foodApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-entries'] });
      queryClient.invalidateQueries({ queryKey: ['food-summary'] });
      toast.success('Meal logged!');
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => foodApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['food-entries'] });
      queryClient.invalidateQueries({ queryKey: ['food-summary'] });
      toast.success('Deleted!');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      ...form,
      calories: parseInt(form.calories) || 0,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
    });
  };

  const calorieGoal = 2000;
  const caloriePercent = Math.min(100, Math.round(((summary?.totalCalories || 0) / calorieGoal) * 100));

  if (isLoading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-title">Food Tracker</h1>
        <button onClick={() => { setForm({ ...form, date: selectedDate }); setModalOpen(true); }} className="btn-primary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Log Meal
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CalorieRing 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          caloriePercent={caloriePercent} 
          totalCalories={summary?.totalCalories || 0} 
          calorieGoal={calorieGoal} 
        />
        <MacrosSummary summary={summary} />
      </div>

      <MealList entries={entries || []} deleteMutation={deleteMutation} />

      <FoodModal 
        modalOpen={modalOpen} 
        setModalOpen={setModalOpen} 
        form={form} 
        setForm={setForm} 
        handleSubmit={handleSubmit} 
      />
    </div>
  );
}
