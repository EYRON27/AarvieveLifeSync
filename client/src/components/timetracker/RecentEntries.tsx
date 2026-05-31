import { HiOutlineTrash } from 'react-icons/hi';

interface RecentEntriesProps {
  entries: any[];
  formatTime: (seconds: number) => string;
  deleteMutation: any;
}

export default function RecentEntries({ entries, formatTime, deleteMutation }: RecentEntriesProps) {
  return (
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
  );
}
