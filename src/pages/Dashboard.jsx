import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import materiData from '../data/materi.json';
import soalData from '../data/soal.json';

export default function Dashboard() {
  const { xp, level, latihanHistory, ujianHistory, topicProgress, completedTopics, wrongAnswers } = useApp();

  const totalTopics = materiData.length;
  const completedCount = completedTopics.length;
  const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const totalLatihan = latihanHistory.length;
  const totalUjian = ujianHistory.length;

  const avgScore = ujianHistory.length > 0
    ? Math.round(ujianHistory.reduce((s, u) => s + u.score, 0) / ujianHistory.length)
    : 0;

  // Find weak topics
  const weakTopics = materiData.filter(t => {
    const prog = topicProgress[t.id];
    if (!prog || prog.total === 0) return true;
    return (prog.correct / prog.total) < 0.6;
  }).slice(0, 3);

  // Recent activity
  const recentActivity = [...latihanHistory, ...ujianHistory]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      {/* Header */}
      <motion.div variants={item} style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
          Selamat Belajar! 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Persiapan ujian matematika TKA — Latihan, simulasi, dan analisis skormu.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="grid-4" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-light)' }}>📊</div>
          <div className="stat-value" style={{ color: 'var(--accent)' }}>{progressPercent}%</div>
          <div className="stat-label">Progress Belajar</div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)' }}>✅</div>
          <div className="stat-value" style={{ color: 'var(--success)' }}>{totalLatihan}</div>
          <div className="stat-label">Latihan Selesai</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--purple-light)' }}>📝</div>
          <div className="stat-value" style={{ color: 'var(--purple)' }}>{totalUjian}</div>
          <div className="stat-label">Simulasi Ujian</div>
        </div>
        <div className="card stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-light)' }}>🏆</div>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>{avgScore}</div>
          <div className="stat-label">Rata-rata Nilai</div>
        </div>
      </motion.div>

      <div className="grid-2" style={{ gap: 24 }}>
        {/* Quick Actions */}
        <motion.div variants={item}>
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 16 }}>🚀 Mulai Belajar</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/simulasi" className="btn btn-primary btn-full btn-lg">
                📝 Simulasi Ujian (30 Soal, 75 menit)
              </Link>
              <Link to="/latihan" className="btn btn-outline btn-full">
                ✏️ Latihan Soal per Topik
              </Link>
              <Link to="/rumus" className="btn btn-secondary btn-full">
                ⚡ Rumus Cepat
              </Link>
            </div>
          </div>

          {/* XP Level */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>⭐ Level {level}</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{xp} XP</span>
            </div>
            <div className="progress-bar" style={{ height: 10 }}>
              <div className="progress-fill" style={{ width: `${xp % 100}%` }} />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', marginTop: 8 }}>
              {100 - (xp % 100)} XP lagi ke Level {level + 1}
            </p>
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div variants={item}>
          {/* Weak Topics */}
          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>⚠️ Topik Perlu Latihan</h3>
            {weakTopics.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {weakTopics.map(t => {
                  const prog = topicProgress[t.id];
                  const pct = prog && prog.total > 0 ? Math.round((prog.correct / prog.total) * 100) : 0;
                  return (
                    <Link key={t.id} to={`/latihan/${t.id}`} style={{ color: 'inherit' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span>{t.icon}</span>
                          <span style={{ fontWeight: 500, fontSize: '0.9rem' }}>{t.title}</span>
                        </div>
                        <span className={`badge ${pct >= 60 ? 'badge-green' : 'badge-red'}`}>{pct}%</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
                Semua topik sudah dikuasai! 🎉
              </p>
            )}
          </div>

          {/* Wrong Answers */}
          {wrongAnswers.length > 0 && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 8 }}>❌ Soal Salah</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                {wrongAnswers.length} soal perlu direview
              </p>
              <Link to="/latihan" className="btn btn-danger btn-sm">
                Review Soal Salah
              </Link>
            </div>
          )}

          {/* Activity */}
          {recentActivity.length > 0 && !wrongAnswers.length && (
            <div className="card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 12 }}>🕐 Aktivitas Terakhir</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {recentActivity.map((act, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '8px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border-light)' : 'none',
                    fontSize: '0.85rem'
                  }}>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {act.type === 'ujian' ? '📝 Simulasi' : `✏️ ${act.topik || 'Latihan'}`}
                    </span>
                    <span className={`badge ${act.score >= 70 ? 'badge-green' : 'badge-yellow'}`}>
                      {act.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
