import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import materiData from '../data/materi.json';
import { useState } from 'react';
import StepSolver from '../components/StepSolver';

export default function MateriDetail() {
  const { topikId } = useParams();
  const { markTopicCompleted, completedTopics } = useApp();
  const topik = materiData.find(t => t.id === topikId);
  const [expandedExample, setExpandedExample] = useState(null);

  if (!topik) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>Topik tidak ditemukan</h3>
        <Link to="/materi" className="btn btn-primary mt-4">Kembali ke Materi</Link>
      </div>
    );
  }

  const isCompleted = completedTopics.includes(topik.id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 20, fontSize: '0.85rem' }}>
        <Link to="/materi" style={{ color: 'var(--text-tertiary)' }}>📚 Materi</Link>
        <span style={{ color: 'var(--text-tertiary)', margin: '0 8px' }}>/</span>
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{topik.title}</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 64, height: 64, borderRadius: 'var(--radius-lg)',
          background: 'var(--accent-subtle)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '2rem'
        }}>
          {topik.icon}
        </div>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{topik.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{topik.summary}</p>
        </div>
      </div>

      {/* Rumus */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📐 Rumus Penting</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {topik.formulas.map((f, i) => (
            <div key={i} className="formula-card">
              <div className="formula-name">{f.name}</div>
              <div className="formula-text">{f.formula}</div>
              {f.note && <div className="formula-note">💡 {f.note}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Contoh Soal */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📝 Contoh Soal & Pembahasan</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {topik.examples.map((ex, i) => (
            <div key={i} style={{
              border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
            }}>
              <button
                onClick={() => setExpandedExample(expandedExample === i ? null : i)}
                style={{
                  width: '100%', padding: '14px 18px', background: 'var(--bg-tertiary)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  textAlign: 'left', color: 'var(--text-primary)', fontSize: '0.9rem',
                  lineHeight: 1.6, border: 'none', cursor: 'pointer',
                }}
              >
                <span style={{ flex: 1 }}>
                  <strong style={{ color: 'var(--accent)', marginRight: 8 }}>Soal {i + 1}.</strong>
                  {ex.question}
                </span>
                <span style={{
                  transform: expandedExample === i ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: '0.2s', fontSize: '1.2rem', marginLeft: 12, flexShrink: 0,
                }}>
                  ▼
                </span>
              </button>
              {expandedExample === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{ padding: '16px 18px' }}
                >
                  {ex.steps ? (
                    <StepSolver steps={ex.steps} finalAnswer={ex.answer} />
                  ) : (
                    <>
                      <h4 style={{ color: 'var(--accent)', fontSize: '0.85rem', marginBottom: 8 }}>
                        💡 Pembahasan:
                      </h4>
                      <pre style={{
                        fontFamily: 'Inter, monospace', fontSize: '0.85rem',
                        whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--text-secondary)',
                        marginBottom: 12,
                      }}>
                        {ex.solution}
                      </pre>
                      <div style={{
                        padding: '10px 14px', background: 'var(--success-light)',
                        borderRadius: 'var(--radius-sm)', fontWeight: 600, color: 'var(--success)',
                      }}>
                        ✅ Jawaban: {ex.answer}
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Link to={`/latihan/${topik.id}`} className="btn btn-primary btn-lg">
          ✏️ Latihan Soal {topik.title}
        </Link>
        {!isCompleted && (
          <button className="btn btn-success btn-lg" onClick={() => markTopicCompleted(topik.id)}>
            ✅ Tandai Sudah Dipelajari
          </button>
        )}
        {isCompleted && (
          <span className="badge badge-green" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
            ✅ Sudah Dipelajari
          </span>
        )}
      </div>
    </motion.div>
  );
}
