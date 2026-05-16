import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineDownload, HiOutlineDocumentReport } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { reportApi } from '@/services/endpoints';

const reports = [
  { id: 'expenses', title: 'Expense Report', description: 'Download a PDF summary of all your expenses', icon: '💰', color: 'from-emerald-500 to-emerald-700' },
  { id: 'time', title: 'Time Tracking Report', description: 'Export your time entries and productivity stats', icon: '⏱️', color: 'from-violet-500 to-violet-700' },
  { id: 'food', title: 'Food & Nutrition Report', description: 'Get a PDF of your food log and calorie tracking', icon: '🍽️', color: 'from-rose-500 to-rose-700' },
];

export default function ReportsPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const downloadReport = async (type: string) => {
    setLoading(type);
    try {
      let response;
      switch (type) {
        case 'expenses': response = await reportApi.exportExpenses(); break;
        case 'time': response = await reportApi.exportTime(); break;
        case 'food': response = await reportApi.exportFood(); break;
        default: return;
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('Report downloaded!');
    } catch {
      toast.error('Failed to generate report');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="page-container">
      <div className="flex items-center gap-3 mb-2">
        <HiOutlineDocumentReport className="w-8 h-8 text-primary-500" />
        <h1 className="page-title">Reports</h1>
      </div>
      <p className="text-gray-500 dark:text-dark-200 mb-8">Export your data as PDF reports</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover p-6 flex flex-col"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${report.color} flex items-center justify-center mb-4 shadow-lg`}>
              <span className="text-2xl">{report.icon}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
            <p className="text-sm text-gray-500 dark:text-dark-200 mt-2 flex-1">{report.description}</p>
            <button
              onClick={() => downloadReport(report.id)}
              disabled={loading === report.id}
              className="btn-primary mt-4 flex items-center justify-center gap-2"
            >
              <HiOutlineDownload className="w-5 h-5" />
              {loading === report.id ? 'Generating...' : 'Download PDF'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
