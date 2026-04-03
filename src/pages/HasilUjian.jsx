import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuestionVisual from '../components/QuestionVisual';

export default function HasilUjian() {
  const [result, setResult] = useState(null);
  const [showPembahasan, setShowPembahasan] = useState({});

  useEffect(() => {
    const data = sessionStorage.getItem('exam_result');
    if (data) {
      setResult(JSON.parse(data));
    }
  }, []);

  if (!result) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📝</div>
        <h3>Belum ada hasil ujian</h3>
        <p>Mulai simulasi ujian terlebih dahulu</p>
        <Link to="/simulasi" className="btn btn-primary mt-4">Mulai Simulasi</Link>
      </div>
    );
  }

  const { score, correct, total, timeUsed, details } = result;
  const labels = ['A', 'B', 'C', 'D'];
  const formatTime = (s) => `${Math.floor(s / 60)} menit ${s % 60} detik`;

  // Topic analysis
  const topicStats = {};
  details.forEach(d => {
    const topic = d.question.topik;
    if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
    topicStats[topic].total++;
    if (d.isCorrect) topicStats[topic].correct++;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Score Header */}
      <div className="card" style={{ textAlign: 'center', padding: 40, marginBottom: 24 }}>
        <div style={{ fontSize: '4rem', marginBottom: 12 }}>
          {score >= 80 ? '🎉' : score >= 60 ? '👍' : '💪'}
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>Hasil Simulasi Ujian</h1>
        <div style={{
          fontSize: '4rem', fontWeight: 900, lineHeight: 1,
          color: score >= 70 ? 'var(--success)' : score >= 50 ? 'var(--warning)' : 'var(--danger)',
          marginBottom: 12,
        }}>
          {score}
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: 4 }}>
          {correct} / {total} benar
        </p>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>
          ⏱️ Waktu: {formatTime(timeUsed)}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: 24 }}>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--success)' }}>{correct}</div>
          <div className="stat-label">✅ Benar</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--danger)' }}>{total - correct}</div>
          <div className="stat-label">❌ Salah</div>
        </div>
        <div className="card stat-card">
          <div className="stat-value" style={{ color: 'var(--accent)' }}>
            {details.filter(d => d.userAnswer === undefined).length}
          </div>
          <div className="stat-label">⏭️ Tidak dijawab</div>
        </div>
      </div>

      {/* Topic Analysis */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📊 Analisis per Topik</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Object.entries(topicStats).map(([topic, stats]) => {
            const pct = Math.round((stats.correct / stats.total) * 100);
            return (
              <div key={topic} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px', background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-sm)',
              }}>
                <span style={{ flex: 1, fontWeight: 500, fontSize: '0.9rem', textTransform: 'capitalize' }}>
                  {topic.replace('-', ' ')}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {stats.correct}/{stats.total}
                </span>
                <div className="progress-bar" style={{ width: 80, height: 6 }}>
                  <div className="progress-fill" style={{
                    width: `${pct}%`,
                    background: pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--warning)' : 'var(--danger)',
                  }} />
                </div>
                <span className={`badge ${pct >= 70 ? 'badge-green' : pct >= 50 ? 'badge-yellow' : 'badge-red'}`}>
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detailed Review */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 16 }}>📝 Pembahasan Lengkap</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {details.map((d, i) => {
            const q = d.question;
            const expanded = showPembahasan[i];

            return (
              <div key={i} style={{
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                borderLeft: `4px solid ${d.isCorrect ? 'var(--success)' : d.userAnswer === undefined ? 'var(--text-tertiary)' : 'var(--danger)'}`,
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setShowPembahasan(p => ({ ...p, [i]: !p[i] }))}
                  style={{
                    width: '100%', padding: '12px 16px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center',
                    background: 'transparent', textAlign: 'left', color: 'var(--text-primary)',
                    border: 'none', cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span>{d.isCorrect ? '✅' : d.userAnswer === undefined ? '⏭️' : '❌'}</span>
                    <span style={{ fontWeight: 600 }}>Soal {i + 1}</span>
                    <span className={`badge ${q.tingkat === 'mudah' ? 'badge-green' : q.tingkat === 'sedang' ? 'badge-yellow' : 'badge-red'}`} style={{ fontSize: '0.7rem' }}>
                      {q.tingkat}
                    </span>
                  </span>
                  <span style={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: '0.2s',
                  }}>▼</span>
                </button>

                {expanded && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: '0 16px 16px' }}
                  >
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 12 }}>
                      {q.pertanyaan}
                    </p>
                    <QuestionVisual question={q} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 12 }}>
                      {q.opsi.map((opsi, oi) => {
                        let style = {
                          padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem', display: 'flex', gap: 8,
                          border: '1px solid var(--border)',
                        };
                        if (oi === q.jawaban) {
                          style.background = 'var(--success-light)';
                          style.borderColor = 'var(--success)';
                        } else if (oi === d.userAnswer && oi !== q.jawaban) {
                          style.background = 'var(--danger-light)';
                          style.borderColor = 'var(--danger)';
                        }
                        return (
                          <div key={oi} style={style}>
                            <strong>{labels[oi]}.</strong>
                            <span>{opsi}</span>
                            {oi === q.jawaban && <span>✅</span>}
                            {oi === d.userAnswer && oi !== q.jawaban && <span>❌</span>}
                          </div>
                        );
                      })}
                    </div>
                    {d.userAnswer === undefined && (
                      <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem', marginBottom: 8 }}>
                        ⏭️ Tidak dijawab
                      </p>
                    )}
                    <div className="pembahasan-box">
                      <h4>💡 Pembahasan</h4>
                      <pre>{q.pembahasan}</pre>
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/simulasi" className="btn btn-primary btn-lg">🔄 Ulang Simulasi</Link>
        <Link to="/progress" className="btn btn-secondary btn-lg">📊 Lihat Progress</Link>
        <Link to="/" className="btn btn-secondary btn-lg">🏠 Dashboard</Link>
      </div>
    </motion.div>
  );
}
