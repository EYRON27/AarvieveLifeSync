import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { HiOutlinePlus } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/LoadingSpinner';
import { timeApi } from '@/services/endpoints';
import TimerCard from '@/components/timetracker/TimerCard';
import WeeklyChart from '@/components/timetracker/WeeklyChart';
import RecentEntries from '@/components/timetracker/RecentEntries';
import TimeModals from '@/components/timetracker/TimeModals';

export default function TimeTrackerPage() {
  const [elapsed, setElapsed] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [startTimerModalOpen, setStartTimerModalOpen] = useState(false);
  const [startTimerForm, setStartTimerForm] = useState({ title: '', project: '' });
  const [form, setForm] = useState({ title: '', project: '', description: '', startTime: '', endTime: '' });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery({
    queryKey: ['time-entries'],
    queryFn: () => timeApi.getAll({ limit: 30 }),
    select: (res) => res.data.data,
  });

  const { data: running } = useQuery({
    queryKey: ['running-timer'],
    queryFn: () => timeApi.getRunning(),
    select: (res) => res.data.data,
    refetchInterval: 1000,
  });

  const { data: summary } = useQuery({
    queryKey: ['time-summary'],
    queryFn: () => timeApi.getSummary(),
    select: (res) => res.data.data,
  });

  const startMutation = useMutation({
    mutationFn: (data: any) => timeApi.start(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['running-timer'] });
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      toast.success('Timer started!');
    },
  });

  const stopMutation = useMutation({
    mutationFn: (id: string) => timeApi.stop(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['running-timer'] });
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['time-summary'] });
      toast.success('Timer stopped!');
      setElapsed(0);
    },
  });

  const manualMutation = useMutation({
    mutationFn: (data: any) => timeApi.createManual(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-entries'] });
      queryClient.invalidateQueries({ queryKey: ['time-summary'] });
      toast.success('Entry added!');
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timeApi.delete(id),
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['time-entries'] }); 
      queryClient.invalidateQueries({ queryKey: ['time-summary'] });
      toast.success('Deleted!'); 
    },
  });

  // Timer effect
  useEffect(() => {
    if (running) {
      const start = new Date(running.startTime).getTime();
      const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000));
      tick();
      timerRef.current = setInterval(tick, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    } else {
      setElapsed(0);
    }
  }, [running]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const openStartTimerModal = () => {
    setStartTimerForm({ title: '', project: '' });
    setStartTimerModalOpen(true);
  };

  const handleStartTimerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startTimerForm.title) return;
    startMutation.mutate({ 
      title: startTimerForm.title, 
      project: startTimerForm.project || 'General' 
    });
    setStartTimerModalOpen(false);
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="page-title">Time Tracker</h1>
        <button onClick={() => setModalOpen(true)} className="btn-secondary flex items-center gap-2">
          <HiOutlinePlus className="w-5 h-5" /> Manual Entry
        </button>
      </div>

      <TimerCard 
        running={running} 
        elapsed={elapsed} 
        formatTime={formatTime} 
        stopMutation={stopMutation} 
        openStartTimerModal={openStartTimerModal} 
      />

      <WeeklyChart summary={summary} />

      <RecentEntries 
        entries={entries} 
        formatTime={formatTime} 
        deleteMutation={deleteMutation} 
      />

      <TimeModals 
        modalOpen={modalOpen} 
        setModalOpen={setModalOpen} 
        form={form} 
        setForm={setForm} 
        manualMutation={manualMutation}
        startTimerModalOpen={startTimerModalOpen} 
        setStartTimerModalOpen={setStartTimerModalOpen} 
        startTimerForm={startTimerForm} 
        setStartTimerForm={setStartTimerForm} 
        handleStartTimerSubmit={handleStartTimerSubmit} 
      />
    </div>
  );
}
