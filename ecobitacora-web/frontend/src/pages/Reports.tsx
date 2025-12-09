import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useLanguageStore } from '@/store/languageStore';

export default function Reports() {
  const { t } = useLanguageStore();
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<any>(null);

  const generateReport = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/report/generate?period=${period}`);
      const data = await res.json();
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!reportData) return;
    
    // Crear contenido HTML para el reporte
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Reporte Ecológico - ${reportData.user.name}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #10b981; border-bottom: 3px solid #10b981; padding-bottom: 10px; }
          h2 { color: #059669; margin-top: 30px; }
          .header { text-align: center; margin-bottom: 40px; }
          .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; margin: 20px 0; }
          .stat-card { background: #f0fdf4; padding: 20px; border-radius: 8px; border-left: 4px solid #10b981; }
          .stat-label { font-size: 14px; color: #6b7280; }
          .stat-value { font-size: 28px; font-weight: bold; color: #10b981; }
          .category { margin: 15px 0; padding: 15px; background: #f9fafb; border-radius: 8px; }
          .equivalence { display: inline-block; margin: 10px; padding: 15px; background: #ecfdf5; border-radius: 8px; text-align: center; min-width: 150px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
          th { background: #f3f4f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🌱 REPORTE DE IMPACTO ECOLÓGICO</h1>
          <p><strong>${reportData.user.name}</strong> | Nivel ${reportData.user.level}</p>
          <p>Período: ${reportData.period.startDate} a ${reportData.period.endDate}</p>
        </div>

        <div class="stats">
          <div class="stat-card">
            <div class="stat-label">CO₂ Total Ahorrado</div>
            <div class="stat-value">${reportData.period.totalCO2} kg</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Acciones Registradas</div>
            <div class="stat-value">${reportData.period.totalActions}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Promedio Diario</div>
            <div class="stat-value">${reportData.period.dailyAverage} kg</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Eco Score</div>
            <div class="stat-value">${reportData.user.ecoScore}/100</div>
          </div>
        </div>

        <h2>📊 Impacto por Categoría</h2>
        ${Object.entries(reportData.byCategory).map(([cat, data]: [string, any]) => `
          <div class="category">
            <strong>${cat.toUpperCase()}</strong>: ${data.co2.toFixed(2)} kg CO₂ | ${data.actions} acciones
          </div>
        `).join('')}

        <h2>🌍 Tu Impacto Equivale a:</h2>
        <div style="text-align: center;">
          ${Object.entries(reportData.equivalences).map(([key, value]: [string, any]) => `
            <div class="equivalence">
              <div style="font-size: 32px; margin-bottom: 10px;">
                ${key === 'trees' ? '🌳' : key === 'carKm' ? '🚗' : key === 'showers' ? '🚿' : key === 'ledHours' ? '💡' : key === 'phoneCharges' ? '📱' : '🥗'}
              </div>
              <div style="font-size: 24px; font-weight: bold; color: #10b981;">${value}</div>
              <div style="font-size: 12px; color: #6b7280;">
                ${key === 'trees' ? 'árboles' : key === 'carKm' ? 'km en auto' : key === 'showers' ? 'duchas' : key === 'ledHours' ? 'horas LED' : key === 'phoneCharges' ? 'cargas' : 'comidas'}
              </div>
            </div>
          `).join('')}
        </div>

        <h2>🏆 Top 10 Acciones</h2>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Categoría</th>
              <th>CO₂ Ahorrado</th>
            </tr>
          </thead>
          <tbody>
            ${reportData.topActions.map((action: any) => `
              <tr>
                <td>${action.date}</td>
                <td>${action.type}</td>
                <td>${action.category}</td>
                <td>${action.co2Saved} kg</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          <p><strong>¡Felicitaciones por tu compromiso con el planeta! 🌍💚</strong></p>
          <p>Reporte generado el ${new Date(reportData.generatedAt).toLocaleString('es-ES')}</p>
          <p>Ecobitacora - Tu asistente ecológico personal</p>
        </div>
      </body>
      </html>
    `;

    // Crear blob y descargar
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-ecologico-${reportData.period.startDate}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">📄 {t('reports.title')}</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{t('reports.generate')}</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t('reports.period')}
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7">{t('analytics.weekly')}</option>
              <option value="30">{t('analytics.monthly')}</option>
              <option value="90">3 {t('common.months')}</option>
              <option value="365">{t('analytics.yearly')}</option>
            </select>
          </div>

          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <FileText className="w-5 h-5" />
            <span>{loading ? t('common.loading') : t('reports.generate')}</span>
          </button>
        </div>
      </div>

      {reportData && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('reports.summary')}</h2>
            <button
              onClick={downloadPDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>{t('reports.download')}</span>
            </button>
          </div>

          <div className="space-y-6">
            {/* User Info */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h3 className="text-2xl font-bold text-green-600">{reportData.user.name}</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Nivel {reportData.user.level} | Eco Score: {reportData.user.ecoScore}/100
              </p>
              <p className="text-sm text-gray-500">
                {reportData.period.startDate} - {reportData.period.endDate}
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.co2Saved')}</p>
                <p className="text-2xl font-bold text-green-600">{reportData.period.totalCO2} kg</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.totalActions')}</p>
                <p className="text-2xl font-bold text-blue-600">{reportData.period.totalActions}</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('stats.overview')}</p>
                <p className="text-2xl font-bold text-purple-600">{reportData.period.dailyAverage} kg/día</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('dashboard.streak')}</p>
                <p className="text-2xl font-bold text-yellow-600">{reportData.user.streak} días</p>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('stats.byCategory')}</h3>
              <div className="space-y-2">
                {Object.entries(reportData.byCategory).map(([cat, data]: [string, any]) => (
                  <div key={cat} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <span className="font-medium text-gray-900 dark:text-white capitalize">{cat}</span>
                    <span className="text-green-600 font-semibold">{data.co2.toFixed(2)} kg | {data.actions} acciones</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Equivalences */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">{t('stats.equivalent')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(reportData.equivalences).map(([key, value]: [string, any]) => (
                  <div key={key} className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-lg text-center">
                    <div className="text-3xl mb-2">
                      {key === 'trees' ? '🌳' : key === 'carKm' ? '🚗' : key === 'showers' ? '🚿' : key === 'ledHours' ? '💡' : key === 'phoneCharges' ? '📱' : '🥗'}
                    </div>
                    <div className="text-xl font-bold text-green-600">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
