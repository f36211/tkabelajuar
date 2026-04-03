import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import materiData from '../data/materi.json';

export default function Latihan() {
  const { topicProgress } = useApp();

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>✏️ Latihan Soal</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Pilih topik untuk berlatih — mode timer atau santai
        </p>
      </div>

      <div className="grid-2">
        {materiData.map((topik, i) => {
          const prog = topicProgress[topik.id];
          const pct = prog && prog.total > 0 ? Math.round((prog.correct / prog.total) * 100) : 0;

          return (
            <motion.div
              key={topik.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link to={`/latihan/${topik.id}`} style={{ color: 'inherit', display: 'block' }}>
                <div className="card card-clickable">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-subtle)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                    }}>
                      {topik.icon}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{topik.title}</h3>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                        Tier {topik.tier}
                      </span>
                    </div>
                  </div>
                  {prog && prog.total > 0 ? (
                    <>
                      <div className="progress-bar" style={{ marginBottom: 6, height: 5 }}>
                        <div className="progress-fill" style={{ width: `${pct}%` }} />
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                        {prog.correct}/{prog.total} benar ({pct}%)
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)' }}>
                      Belum ada latihan
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/simulasi" className="btn btn-primary btn-lg">
          📝 Atau langsung Simulasi Ujian →
        </Link>
      </div>
    </div>
  );
}
