import { useParams, Link } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import soalData from '../data/soal.json';
import QuestionVisual from '../components/QuestionVisual';
import materiData from '../data/materi.json';

export default function LatihanSoal() {
  const { topikId } = useParams();
  const { addXP, addLatihanResult, updateTopicProgress, toggleBookmark, toggleDifficult, bookmarks, markedDifficult, addWrongAnswer, removeWrongAnswer } = useApp();

  const topik = materiData.find(t => t.id === topikId);
  const allQuestions = soalData.latihan.filter(q => q.topik === topikId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [useTimer, setUseTimer] = useState(false);
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef(null);

  const questions = allQuestions;
  const current = questions[currentIndex];

  useEffect(() => {
    if (useTimer && started && !finished) {
      intervalRef.current = setInterval(() => setTimer(t => t + 1), 1000);
      return () => clearInterval(intervalRef.current);
    }
  }, [useTimer, started, finished]);

  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    const isCorrect = selectedAnswer === current.jawaban;
    setScore(s => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      total: s.total + 1,
    }));
    if (isCorrect) {
      addXP(10);
      removeWrongAnswer(current.id);
    } else {
      addWrongAnswer(current.id);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      // Finished
      setFinished(true);
      clearInterval(intervalRef.current);
      updateTopicProgress(topikId, score.correct + (selectedAnswer === current?.jawaban ? 1 : 0), score.total + 1);
      addLatihanResult({
        type: 'latihan',
        topik: topik?.title || topikId,
        topikId,
        score: Math.round(((score.correct) / questions.length) * 100),
        correct: score.correct,
        total: questions.length,
        time: timer,
      });
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore({ correct: 0, total: 0 });
    setTimer(0);
    setFinished(false);
    setStarted(true);
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  if (!topik || questions.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📚</div>
        <h3>Belum ada soal untuk topik ini</h3>
        <Link to="/latihan" className="btn btn-primary mt-4">Kembali</Link>
      </div>
    );
  }

  if (!started) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: 600, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>{topik.icon}</div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>
            Latihan: {topik.title}
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>
            {questions.length} soal tersedia
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              border: !useTimer ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              <input type="radio" checked={!useTimer} onChange={() => setUseTimer(false)} />
              <span><strong>😌 Mode Santai</strong> — Tanpa timer</span>
            </label>
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
              background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              border: useTimer ? '2px solid var(--accent)' : '2px solid transparent',
            }}>
              <input type="radio" checked={useTimer} onChange={() => setUseTimer(true)} />
              <span><strong>⏱️ Mode Timer</strong> — Hitung waktu</span>
            </label>
          </div>

          <button className="btn btn-primary btn-lg btn-full" onClick={() => setStarted(true)}>
            🚀 Mulai Latihan
          </button>
        </div>
      </motion.div>
    );
  }

  if (finished) {
    const pct = Math.round((score.correct / questions.length) * 100);
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ maxWidth: 500, margin: '0 auto' }}>
        <div className="card" style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>
            {pct >= 80 ? '🎉' : pct >= 60 ? '👍' : '💪'}
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8 }}>
            Latihan Selesai!
          </h2>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: pct >= 70 ? 'var(--success)' : 'var(--warning)', marginBottom: 12 }}>
            {pct}
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 8 }}>
            {score.correct} / {questions.length} benar
          </p>
          {useTimer && (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem', marginBottom: 20 }}>
              ⏱️ Waktu: {formatTime(timer)}
            </p>
          )}
          <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginBottom: 24 }}>
            +{score.correct * 10} XP earned!
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={restart}>🔄 Ulangi</button>
            <Link to="/latihan" className="btn btn-secondary">📚 Topik Lain</Link>
          </div>
        </div>
      </motion.div>
    );
  }

  const isBookmarked = bookmarks.includes(current.id);
  const isDifficult = markedDifficult.includes(current.id);
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Link to="/latihan" style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
            ← Kembali
          </Link>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginTop: 4 }}>
            {topik.icon} {topik.title}
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {useTimer && (
            <div className="timer-display" style={{ fontSize: '1.1rem' }}>
              ⏱️ {formatTime(timer)}
            </div>
          )}
          <span className="badge badge-blue">{currentIndex + 1} / {questions.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar" style={{ marginBottom: 20, height: 4 }}>
        <div className="progress-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card">
            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              <span className={`badge ${current.tingkat === 'mudah' ? 'badge-green' : current.tingkat === 'sedang' ? 'badge-yellow' : 'badge-red'}`}>
                {current.tingkat === 'mudah' ? '🟢' : current.tingkat === 'sedang' ? '🟡' : '🔴'} {current.tingkat}
              </span>
              <button
                className={`badge ${isBookmarked ? 'badge-yellow' : ''}`}
                style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => toggleBookmark(current.id)}
              >
                {isBookmarked ? '🔖 Bookmarked' : '🔖 Bookmark'}
              </button>
              <button
                className={`badge ${isDifficult ? 'badge-red' : ''}`}
                style={{ cursor: 'pointer', border: '1px solid var(--border)' }}
                onClick={() => toggleDifficult(current.id)}
              >
                {isDifficult ? '⚡ Sulit!' : '⚡ Tandai Sulit'}
              </button>
            </div>

            <div className="question-text">{current.pertanyaan}</div>

            <QuestionVisual question={current} />

            <div className="option-list">
              {current.opsi.map((opsi, i) => {
                let className = 'option-btn';
                if (showResult) {
                  if (i === current.jawaban) className += ' correct';
                  else if (i === selectedAnswer && i !== current.jawaban) className += ' wrong';
                } else if (i === selectedAnswer) {
                  className += ' selected';
                }

                return (
                  <button
                    key={i}
                    className={className}
                    onClick={() => !showResult && setSelectedAnswer(i)}
                    disabled={showResult}
                  >
                    <span className="option-label">{labels[i]}</span>
                    <span>{opsi}</span>
                  </button>
                );
              })}
            </div>

            {/* Pembahasan */}
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="pembahasan-box"
              >
                <h4>💡 Pembahasan</h4>
                <pre>{current.pembahasan}</pre>
              </motion.div>
            )}

            {/* Actions */}
            <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
              {!showResult ? (
                <button
                  className="btn btn-primary btn-full"
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null}
                >
                  ✅ Cek Jawaban
                </button>
              ) : (
                <button className="btn btn-primary btn-full" onClick={nextQuestion}>
                  {currentIndex < questions.length - 1 ? '➡️ Soal Berikutnya' : '🏁 Selesai'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
