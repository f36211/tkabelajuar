import React, { useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * MathAnimator: A component that renders a step-by-step math animation.
 * Features: Play, Pause, Rewind, Step Forward/Backward, LaTeX support, and dynamic shapes.
 */
export default function MathAnimator({ steps = [], colors = {}, onStepChange }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);

  const totalSteps = steps.length;

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 3000); // 3 seconds per step for better reading
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isPlaying, totalSteps]);

  useEffect(() => {
    if (onStepChange) onStepChange(currentStep);
  }, [currentStep, onStepChange]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };
  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  };
  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const currentData = steps[currentStep] || {};

  return (
    <div className="math-animator" style={{ width: '100%', position: 'relative' }}>
      {/* Animation Display */}
      <div className="animation-display" style={{ 
        width: '100%', 
        minHeight: '260px', 
        background: 'rgba(0,0,0,0.02)', 
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <div style={{ 
              fontSize: '1.1rem', 
              fontWeight: '800', 
              marginBottom: '10px', 
              color: colors.accent,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{ 
                background: colors.accent, 
                color: '#fff', 
                width: '24px', 
                height: '24px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '0.8rem'
              }}>
                {currentStep + 1}
              </span>
              {currentData.title}
            </div>
            
            <p style={{ 
              fontSize: '0.95rem', 
              color: colors.text, 
              lineHeight: '1.6',
              marginBottom: '20px' 
            }}>
              {currentData.description}
            </p>

            {currentData.math && (
              <div style={{ 
                padding: '16px', 
                background: colors.bg === '#1e293b' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', 
                borderRadius: '8px',
                marginBottom: '10px',
                borderLeft: `4px solid ${colors.accent}`
              }}>
                <BlockMath math={currentData.math} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '6px', background: 'rgba(0,0,0,0.05)', marginTop: '16px', borderRadius: '3px', overflow: 'hidden' }}>
        <motion.div 
          style={{ 
            height: '100%', 
            background: colors.accent,
          }}
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Controls Overlay */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        gap: '16px', 
        marginTop: '20px',
        padding: '10px',
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(10px)',
        borderRadius: '30px',
        width: 'fit-content',
        margin: '20px auto 0',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <button onClick={handleReset} title="Mulai Ulang" style={btnStyle}>⏮️</button>
        <button onClick={handlePrev} title="Langkah Sebelumnya" style={btnStyle}>◀️</button>
        <button 
          onClick={handlePlayPause} 
          style={{ 
            ...btnStyle, 
            fontSize: '1.4rem', 
            width: '46px', 
            height: '46px',
            background: colors.accent,
            border: 'none',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
          }}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={handleNext} title="Langkah Selanjutnya" style={btnStyle}>▶️</button>
      </div>
      
      <div style={{ textAlign: 'center', fontSize: '0.75rem', color: colors.label, marginTop: '12px', fontWeight: '500' }}>
        LANGKAH {currentStep + 1} DARI {totalSteps}
      </div>
    </div>
  );
}

const btnStyle = {
  background: 'white',
  border: '1px solid rgba(0,0,0,0.1)',
  borderRadius: '50%',
  width: '36px',
  height: '36px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  userSelect: 'none'
};
