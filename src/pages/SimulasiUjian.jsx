import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import soalData from '../data/soal.json';
import QuestionVisual from '../components/QuestionVisual';

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SimulasiUjian() {
  const navigate = useNavigate();
  const { addXP, addUjianResult, addWrongAnswer } = useApp();

  const [phase, setPhase] = useState('intro'); // intro | exam | finished
  const [mode, setMode] = useState(null); // 'no-timer' | 'with-timer'
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [timeLeft, setTimeLeft] = useState(75 * 60); // 75 minutes
  const intervalRef = useRef(null);

  // Anti refresh
  useEffect(() => {
    if (phase === 'exam') {
      const handler = (e) => {
        e.preventDefault();
        e.returnValue = 'Ujian sedang berlangsung! Yakin ingin keluar?';
        return e.returnValue;
      };
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [phase]);

  // Timer
  useEffect(() => {
    if (phase === 'exam' && mode === 'with-timer' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            submitExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [phase, mode]);

  const startExam = (selectedMode) => {
    const shuffled = shuffleArray(soalData.ujian).slice(0, 30);
    setQuestions(shuffled);
    setAnswers({});
    setMarked({});
    setMode(selectedMode);
    if (selectedMode === 'with-timer') {
      setTimeLeft(75 * 60);
    } else {
      setTimeLeft(null); // No timer
    }
    setCurrentIndex(0);
    setPhase('exam');
  };

  const submitExam = useCallback(() => {
    clearInterval(intervalRef.current);

    const result = questions.map((q, i) => {
      const userAnswer = answers[i];
      const isCorrect = userAnswer === q.jawaban;
      if (!isCorrect && userAnswer !== undefined) {
        addWrongAnswer(q.id);
      }
      return {
        question: q,
        userAnswer,
        isCorrect,
      };
    });

    const correct = result.filter(r => r.isCorrect).length;
    const score = Math.round((correct / questions.length) * 100);
    const timeUsed = mode === 'with-timer' ? 75 * 60 - timeLeft : 0;

    addXP(correct * 5 + (score >= 70 ? 50 : 0));
    addUjianResult({
      type: 'ujian',
      score,
      correct,
      total: questions.length,
      timeUsed,
      details: result,
    });

    // Store for results page
    sessionStorage.setItem('exam_result', JSON.stringify({
      score, correct, total: questions.length, timeUsed, details: result,
    }));

    setPhase('finished');
    navigate('/hasil-ujian');
  }, [questions, answers, timeLeft, navigate, addXP, addUjianResult, addWrongAnswer]);

  // Re-register submitExam in timer effect
  useEffect(() => {
    if (phase === 'exam') {
      window.__submitExam = submitExam;
    }
  }, [phase, submitExam]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const selectAnswer = (index) => {
    setAnswers(prev => ({ ...prev, [currentIndex]: index }));
  };

  const toggleMark = () => {
    setMarked(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const answeredCount = Object.keys(answers).length;
  const labels = ['A', 'B', 'C', 'D'];

  // ─── INTRO ───
  if (phase === 'intro') {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📝</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 8 }}>
            Simulasi Ujian TKA Matematika
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
            30 soal campuran semua topik. Pilih mode simulasi yang diinginkan.
          </p>

          <div style={{
            background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
            padding: 20, marginBottom: 24, textAlign: 'left',
          }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: 12 }}>📋 Ketentuan:</h3>
            <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 2, paddingLeft: 20 }}>
              <li>30 soal pilihan ganda</li>
              <li>Soal campuran dari semua topik</li>
              <li>Bisa tandai soal ragu-ragu</li>
              <li>Navigasi bebas (maju/mundur)</li>
              <li>Pembahasan setelah submit</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
            <button className="btn btn-primary btn-lg btn-full" onClick={() => startExam('no-timer')}>
              🕒 Mode Tanpa Timer
              <br />
              <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>Latihan tanpa batas waktu</small>
            </button>
            <button className="btn btn-success btn-lg btn-full" onClick={() => startExam('with-timer')}>
              ⏱️ Mode Dengan Timer
              <br />
              <small style={{ fontSize: '0.8rem', opacity: 0.8 }}>75 menit (auto submit jika habis)</small>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── EXAM ───
  const current = questions[currentIndex];
  const isTimeDanger = mode === 'with-timer' && timeLeft < 300; // < 5 min

  return (
    <div className="exam-layout">
      {/* Main Question Area */}
      <div>
        {/* Timer bar mobile */}
        {mode === 'with-timer' && (
          <div className="card" style={{
            marginBottom: 16, display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', padding: '12px 20px',
          }}>
            <div className={`timer-display ${isTimeDanger ? 'timer-danger' : ''}`}>
              🕐 {formatTime(timeLeft)}
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="badge badge-blue">{answeredCount}/{questions.length} dijawab</span>
            </div>
          </div>
        )}

        {mode === 'no-timer' && (
          <div className="card" style={{
            marginBottom: 16, display: 'flex', justifyContent: 'center',
            alignItems: 'center', padding: '12px 20px',
          }}>
            <span className="badge badge-blue">{answeredCount}/{questions.length} dijawab</span>
          </div>
        )}

        {/* Progress bar */}
        <div className="progress-bar" style={{ marginBottom: 16, height: 4 }}>
          <div className="progress-fill" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.15 }}
          >
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <span style={{ fontWeight: 700, color: 'var(--accent)' }}>Soal {currentIndex + 1}</span>
                <button
                  className={`badge ${marked[currentIndex] ? 'badge-yellow' : ''}`}
                  style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                  onClick={toggleMark}
                >
                  {marked[currentIndex] ? '🚩 Ditandai' : '🏳️ Tandai Ragu'}
                </button>
              </div>

              <div className="question-text">{current.pertanyaan}</div>

              <QuestionVisual question={current} />

              <div className="option-list">
                {current.opsi.map((opsi, i) => (
                  <button
                    key={i}
                    className={`option-btn ${answers[currentIndex] === i ? 'selected' : ''}`}
                    onClick={() => selectAnswer(i)}
                  >
                    <span className="option-label">{labels[i]}</span>
                    <span>{opsi}</span>
                  </button>
                ))}
              </div>

              {/* Nav buttons */}
              <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                  disabled={currentIndex === 0}
                  style={{ flex: 1 }}
                >
                  ← Sebelumnya
                </button>
                {currentIndex < questions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentIndex(i => i + 1)}
                    style={{ flex: 1 }}
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      if (window.confirm(`Kumpulkan ujian? ${answeredCount}/${questions.length} soal dijawab.`)) {
                        submitExam();
                      }
                    }}
                    style={{ flex: 1 }}
                  >
                    ✅ Kumpulkan
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sidebar - Question Nav */}
      <div className="exam-sidebar">
        <div className="card" style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>📋 Navigasi Soal</h3>
          <div className="exam-nav-grid">
            {questions.map((_, i) => {
              let cls = 'exam-nav-btn';
              if (i === currentIndex) cls += ' current';
              else if (marked[i]) cls += ' marked';
              else if (answers[i] !== undefined) cls += ' answered';
              return (
                <button key={i} className={cls} onClick={() => setCurrentIndex(i)}>
                  {i + 1}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <span>🔵 Aktif</span>
              <span>🟢 Dijawab</span>
              <span>🟡 Ragu</span>
              <span>⚪ Belum</span>
            </div>
          </div>
        </div>

        <button
          className="btn btn-success btn-full"
          onClick={() => {
            if (window.confirm(`Kumpulkan ujian? ${answeredCount}/${questions.length} soal dijawab.`)) {
              submitExam();
            }
          }}
        >
          ✅ Kumpulkan Ujian
        </button>
      </div>
    </div>
  );
}
