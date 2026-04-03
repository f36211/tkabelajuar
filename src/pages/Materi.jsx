import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import materiData from '../data/materi.json';

const tierColors = {
  S: { bg: 'var(--danger-light)', color: 'var(--danger)' },
  A: { bg: 'var(--warning-light)', color: 'var(--warning)' },
  B: { bg: 'var(--accent-light)', color: 'var(--accent)' },
};

export default function Materi() {
  const { topicProgress, completedTopics } = useApp();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>📚 Materi Belajar</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Pilih topik untuk belajar — materi ringkas, rumus penting, dan contoh soal
        </p>
      </div>

      {/* Tier Legend */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <span className="badge badge-red">🔥 Tier S — 95% keluar</span>
        <span className="badge badge-yellow">⭐ Tier A — 70% keluar</span>
        <span className="badge badge-blue">📘 Tier B — 50% keluar</span>
      </div>

      <div className="grid-2">
        {materiData.map((topik, i) => {
          const prog = topicProgress[topik.id];
          const pct = prog && prog.total > 0 ? Math.round((prog.correct / prog.total) * 100) : 0;
          const isCompleted = completedTopics.includes(topik.id);
          const tc = tierColors[topik.tier] || tierColors.B;

          return (
            <motion.div
              key={topik.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/materi/${topik.id}`} style={{ color: 'inherit', display: 'block' }}>
                <div className="card card-clickable topic-card">
                  <div className="topic-icon" style={{ background: tc.bg }}>
                    {topik.icon}
                  </div>
                  <div className="topic-info" style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontSize: '1rem' }}>{topik.title}</h3>
                      <span className="badge" style={{ background: tc.bg, color: tc.color, fontSize: '0.7rem' }}>
                        Tier {topik.tier}
                      </span>
                      {isCompleted && <span style={{ fontSize: '0.8rem' }}>✅</span>}
                    </div>
                    <p>{topik.description}</p>
                    {prog && prog.total > 0 && (
                      <div style={{ marginTop: 8 }}>
                        <div className="progress-bar" style={{ height: 4 }}>
                          <div className="progress-fill" style={{ width: `${pct}%` }} />
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 4, display: 'block' }}>
                          {prog.correct}/{prog.total} benar ({pct}%)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
