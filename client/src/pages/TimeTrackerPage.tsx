import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { HiOutlinePlay, HiOutlineStop, HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import Modal from '@/components/Modal';
import { PageLoader } from '@/components/LoadingSpinner';
import { timeApi } from '@/services/endpoints';

export default function TimeTrackerPage() {
  const [elapsed, setElapsed] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
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
      toast.success('Entry added!');
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => timeApi.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['time-entries'] }); toast.success('Deleted!'); },
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

  const handleStartTimer = () => {
    const title = prompt('What are you working on?');
    if (!title) return;
    const project = prompt('Project name (optional)') || 'General';
    startMutation.mutate({ title, project });
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

      {/* Timer Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center">
        <p className="text-sm font-medium text-gray-500 dark:text-dark-200 mb-2">
          {running ? `Working on: ${running.title}` : 'Ready to start'}
        </p>
        <p className={`text-6xl font-display font-bold tracking-wider ${running ? 'gradient-text' : 'text-gray-300 dark:text-dark-400'}`}>
          {formatTime(elapsed)}
        </p>
        <div className="mt-6">
          {running ? (
            <button onClick={() => stopMutation.mutate(running.id)}
              className="px-8 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 transition-all inline-flex items-center gap-2">
              <HiOutlineStop className="w-5 h-5" /> Stop Timer
            </button>
          ) : (
            <button onClick={handleStartTimer}
              className="btn-primary inline-flex items-center gap-2 px-8 py-3">
              <HiOutlinePlay className="w-5 h-5" /> Start Timer
            </button>
          )}
        </div>
      </motion.div>

      {/* Weekly Chart */}
      {summary?.weeklyTrend && (
        <div className="glass-card p-6">
          <h3 className="section-title mb-4">Weekly Overview</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold gradient-text">{summary.totalHours}h</p>
              <p className="text-sm text-gray-500 dark:text-dark-200">This Week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary.averageDaily}h</p>
              <p className="text-sm text-gray-500 dark:text-dark-200">Daily Avg</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{Object.keys(summary.byProject || {}).length}</p>
              <p className="text-sm text-gray-500 dark:text-dark-200">Projects</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={summary.weeklyTrend}>
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: 'rgba(30,30,40,0.9)', border: 'none', borderRadius: '12px', color: '#fff' }} />
              <Bar dataKey="hours" fill="#5c7cfa" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Recent Entries */}
      <div className="glass-card p-6">
        <h3 className="section-title mb-4">Recent Entries</h3>
        <div className="space-y-3">
          {(entries || []).slice(0, 15).map((entry: any) => (
            <div key={entry.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-500/50 transition-colors">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.isRunning ? '#ff6b6b' : '#51cf66' }} />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm">{entry.title}</p>
                <p className="text-xs text-gray-400">{entry.project} · {new Date(entry.startTime).toLocaleDateString()}</p>
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-dark-100">
                {entry.isRunning ? '⏱️ Running' : formatTime(entry.duration || 0)}
              </p>
              {!entry.isRunning && (
                <button onClick={() => deleteMutation.mutate(entry.id)} className="btn-ghost p-1 text-red-500">
                  <HiOutlineTrash className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Manual Entry Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Manual Time Entry">
        <form onSubmit={(e) => { e.preventDefault(); manualMutation.mutate(form); }} className="space-y-4">
          <input type="text" placeholder="What did you work on?" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          <input type="text" placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input type="datetime-local" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} className="input-field" required />
            <input type="datetime-local" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} className="input-field" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" className="btn-primary flex-1">Add Entry</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
