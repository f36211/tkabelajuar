import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Formula } from './MathVisual';
import GeoVisual from './GeoVisual';

export default function StepSolver({ steps, finalAnswer }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!steps || steps.length === 0) return null;

  const step = steps[currentStep];
  const isFinished = currentStep === steps.length - 1;

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--bg-card)',
      marginTop: 16
    }}>
      {/* Progress Dots / Steps Indicator */}
      <div style={{
        padding: '12px 16px',
        background: 'var(--bg-tertiary)',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid var(--border)'
      }}>
        {steps.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentStep(i)}
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: i <= currentStep ? 'var(--accent)' : 'var(--border)',
              transition: '0.3s ease',
              border: 'none',
              cursor: 'pointer'
            }}
            title={`Langkah ${i + 1}`}
          />
        ))}
      </div>

      <div style={{ padding: '24px 20px', minHeight: 320, display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {/* Step Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                Langkah {currentStep + 1} / {steps.length}
              </span>
              <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600 }}>
                {step.title || 'Penjelasan'}
              </h4>
            </div>

            {/* Visual (if any) */}
            {step.visual && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
                <GeoVisual
                  type={step.visual.type}
                  data={step.visual.data}
                  width={step.visual.width || 320}
                  height={step.visual.height || 240}
                />
              </div>
            )}

            {/* Explanation Text */}
            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.7,
              color: 'var(--text-secondary)'
            }}>
              {step.text}
            </p>

            {/* Math Formula */}
            {step.math && (
              <div style={{
                padding: '16px',
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Formula tex={step.math} display />
              </div>
            )}

            {/* Final Answer Highlight */}
            {isFinished && finalAnswer && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  marginTop: 'auto',
                  padding: '12px 16px',
                  background: 'var(--success-light)',
                  border: '1px solid var(--success)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--success)',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: '1.05rem'
                }}
              >
                ✅ Jawaban Akhir: {finalAnswer}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'var(--bg-tertiary)'
      }}>
        <button
          className="btn btn-secondary"
          onClick={() => setCurrentStep(c => Math.max(0, c - 1))}
          disabled={currentStep === 0}
        >
          ← Sebelumnya
        </button>
        <button
          className={isFinished ? 'btn btn-success' : 'btn btn-primary'}
          onClick={() => {
            if (!isFinished) setCurrentStep(c => c + 1);
          }}
          disabled={isFinished}
        >
          {isFinished ? 'Selesai ✨' : 'Selanjutnya →'}
        </button>
      </div>
    </div>
  );
}
