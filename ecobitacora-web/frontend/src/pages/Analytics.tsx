import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Calendar, Award, Leaf } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Analytics() {
  const { t } = useLanguageStore();
  const [trends, setTrends] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [equivalences, setEquivalences] = useState<any>(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [trendsRes, compRes, equivRes] = await Promise.all([
        fetch(`/api/analytics/trends?period=${period}`),
        fetch('/api/analytics/comparison'),
        fetch('/api/analytics/equivalences')
      ]);

      setTrends(await trendsRes.json());
      setComparison(await compRes.json());
      setEquivalences(await equivRes.json());
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 {t('analytics.title')}</h1>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          <option value="7">{t('analytics.weekly')}</option>
          <option value="30">{t('analytics.monthly')}</option>
          <option value="90">3 {t('common.months')}</option>
          <option value="365">{t('analytics.yearly')}</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.co2Saved')}</p>
              <p className="text-2xl font-bold text-green-600">{trends?.summary.totalCO2} kg</p>
            </div>
            <Leaf className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.overview')}</p>
              <p className="text-2xl font-bold text-blue-600">{trends?.summary.dailyAverage} kg</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.predictions')}</p>
              <p className="text-2xl font-bold text-purple-600">{trends?.summary.annualProjection} kg</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Eco Score</p>
              <p className="text-2xl font-bold text-yellow-600">{trends?.summary.ecoScore}/100</p>
            </div>
            <Award className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('analytics.trends')}</h2>
        <div className="flex items-center space-x-4">
          {trends?.trend > 0 ? (
            <>
              <TrendingUp className="w-12 h-12 text-green-500" />
              <div>
                <p className="text-3xl font-bold text-green-600">+{trends?.trend}%</p>
                <p className="text-gray-600 dark:text-gray-400">{t('common.success')} 🎉</p>
              </div>
            </>
          ) : trends?.trend < 0 ? (
            <>
              <TrendingDown className="w-12 h-12 text-red-500" />
              <div>
                <p className="text-3xl font-bold text-red-600">{trends?.trend}%</p>
                <p className="text-gray-600 dark:text-gray-400">{t('analytics.tryMore')} 💪</p>
              </div>
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">{t('analytics.keepPace')} 👍</p>
          )}
        </div>
      </div>

      {/* CO2 Over Time Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('stats.evolution')}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trends?.daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            <Legend />
            <Line type="monotone" dataKey="co2" stroke="#10b981" strokeWidth={2} name="CO₂ (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison */}
      {comparison && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('analytics.weekly')}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.thisWeek')}</p>
                <p className="text-2xl font-bold text-green-600">{comparison.week.current.co2} kg</p>
                <p className="text-sm text-gray-500">{comparison.week.current.actions} {t('actions.recent').toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.lastWeek')}</p>
                <p className="text-xl text-gray-700 dark:text-gray-300">{comparison.week.previous.co2} kg</p>
                <p className="text-sm text-gray-500">{comparison.week.previous.actions} {t('actions.recent').toLowerCase()}</p>
              </div>
              <div className={`text-lg font-semibold ${comparison.week.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.week.trend > 0 ? '↑' : '↓'} {Math.abs(comparison.week.trend)}%
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{t('analytics.monthly')}</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.thisMonth')}</p>
                <p className="text-2xl font-bold text-blue-600">{comparison.month.current.co2} kg</p>
                <p className="text-sm text-gray-500">{comparison.month.current.actions} {t('actions.recent').toLowerCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('analytics.lastMonth')}</p>
                <p className="text-xl text-gray-700 dark:text-gray-300">{comparison.month.previous.co2} kg</p>
                <p className="text-sm text-gray-500">{comparison.month.previous.actions} {t('actions.recent').toLowerCase()}</p>
              </div>
              <div className={`text-lg font-semibold ${comparison.month.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparison.month.trend > 0 ? '↑' : '↓'} {Math.abs(comparison.month.trend)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Equivalences */}
      {equivalences && (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">🌍 {t('stats.equivalent')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(equivalences.equivalences).map(([key, data]: [string, any]) => (
              <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                <div className="text-4xl mb-2">{data.icon}</div>
                <div className="text-2xl font-bold text-green-600">{data.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{data.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
