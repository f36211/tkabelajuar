import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import materiData from '../data/materi.json';

export default function Progress() {
  const { latihanHistory, ujianHistory, topicProgress, xp, level, wrongAnswers } = useApp();

  // Topic performance data
  const topicData = materiData.map(t => {
    const prog = topicProgress[t.id];
    const pct = prog && prog.total > 0 ? Math.round((prog.correct / prog.total) * 100) : 0;
    return { name: t.title.split(' ')[0], fullName: t.title, pct, correct: prog?.correct || 0, total: prog?.total || 0 };
  });

  // Ujian history chart
  const ujianChartData = ujianHistory.slice(-10).map((u, i) => ({
    name: `#${i + 1}`,
    score: u.score,
  }));

  // Overall stats
  const totalLatihan = latihanHistory.length;
  const totalUjian = ujianHistory.length;
  const avgUjian = ujianHistory.length > 0
    ? Math.round(ujianHistory.reduce((s, u) => s + u.score, 0) / ujianHistory.length)
    : 0;
  const bestUjian = ujianHistory.length > 0
    ? Math.max(...ujianHistory.map(u => u.score))
    : 0;

  // Pie data
  const pieData = [
    { name: 'Kuat (≥70%)', value: topicData.filter(t => t.pct >= 70).length, color: '#10b981' },
    { name: 'Sedang (40-69%)', value: topicData.filter(t => t.pct >= 40 && t.pct < 70).length, color: '#f59e0b' },
    { name: 'Lemah (<40%)', value: topicData.filter(t => t.pct < 40).length, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>📊 Progress & Statistik</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Pantau perkembangan belajarmu</p>
      </div>

      {/* Overview stats */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{totalLatihan}</div>
          <div className="stat-label">Total Latihan</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--purple)' }}>{totalUjian}</div>
          <div className="stat-label">Simulasi Ujian</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{avgUjian}</div>
          <div className="stat-label">Rata-rata Ujian</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{bestUjian}</div>
          <div className="stat-label">Nilai Tertinggi</div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        {/* Topic performance chart */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📚 Performa per Topik</h3>
          {topicData.some(t => t.total > 0) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topicData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  formatter={(val) => [`${val}%`, 'Akurasi']}
                />
                <Bar dataKey="pct" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>Belum ada data. Mulai latihan!</p>
            </div>
          )}
        </div>

        {/* Score trend */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>📈 Tren Nilai Ujian</h3>
          {ujianChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={ujianChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="score" stroke="var(--accent)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>Selesaikan simulasi ujian untuk melihat grafik</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid-2" style={{ gap: 24, marginBottom: 24 }}>
        {/* Strength/Weakness */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>💪 Topik Kuat & Lemah</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {topicData.sort((a, b) => b.pct - a.pct).map(t => (
              <div key={t.fullName} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 12px', background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ flex: 1, fontSize: '0.85rem', fontWeight: 500 }}>{t.fullName}</span>
                <div className="progress-bar" style={{ width: 80, height: 5 }}>
                  <div className="progress-fill" style={{
                    width: `${t.pct}%`,
                    background: t.pct >= 70 ? 'var(--success)' : t.pct >= 40 ? 'var(--warning)' : 'var(--danger)',
                  }} />
                </div>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 600, width: 38, textAlign: 'right',
                  color: t.pct >= 70 ? 'var(--success)' : t.pct >= 40 ? 'var(--warning)' : 'var(--danger)',
                }}>
                  {t.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Level & XP */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>⭐ Level & Achievement</h3>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: '3rem', marginBottom: 8 }}>🏆</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--warning)' }}>Level {level}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{xp} Total XP</div>
          </div>
          <div className="progress-bar" style={{ height: 10, marginBottom: 8 }}>
            <div className="progress-fill" style={{ width: `${xp % 100}%` }} />
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', textAlign: 'center' }}>
            {100 - (xp % 100)} XP ke Level {level + 1}
          </p>

          {wrongAnswers.length > 0 && (
            <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--danger-light)', borderRadius: 'var(--radius-sm)' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--danger)' }}>
                ❌ {wrongAnswers.length} soal salah perlu di-review
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {(latihanHistory.length > 0 || ujianHistory.length > 0) && (
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>🕐 Riwayat Latihan</h3>
          <div style={{ maxHeight: 300, overflow: 'auto' }}>
            {[...latihanHistory, ...ujianHistory]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 20)
              .map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-light)',
                }}>
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                      {item.type === 'ujian' ? '📝 Simulasi Ujian' : `✏️ Latihan: ${item.topik}`}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                      {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span className={`badge ${item.score >= 70 ? 'badge-green' : item.score >= 50 ? 'badge-yellow' : 'badge-red'}`}>
                    {item.score}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
