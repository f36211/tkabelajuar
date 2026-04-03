import { useState } from 'react';
import { motion } from 'framer-motion';
import GeoVisual from './GeoVisual';
import { getAutoVisual } from './MathVisual';

/**
 * Renders question images if available, or auto-generates geometry visuals.
 * Place inside a question card, after the question text.
 */
export default function QuestionVisual({ question }) {
  const [expanded, setExpanded] = useState(false);

  // 1. Check for explicit images
  if (question.images && question.images.length > 0) {
    return (
      <div style={{ margin: '12px 0', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {question.images.map((img, i) => (
          <div key={i} style={{ position: 'relative' }}>
            <img
              src={img}
              alt={`Gambar soal ${i + 1}`}
              onClick={() => setExpanded(expanded === i ? false : i)}
              style={{
                maxWidth: expanded === i ? '100%' : 280,
                maxHeight: expanded === i ? 'none' : 200,
                borderRadius: 10,
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: '0.3s ease',
                objectFit: 'contain',
                background: 'var(--bg-tertiary)',
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        ))}
      </div>
    );
  }

  // 2. Try auto-generated visual
  const visual = getAutoVisual(question);
  if (visual) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ margin: '12px 0' }}
      >
        <GeoVisual type={visual.type} data={visual.data} />
        <div style={{
          fontSize: '0.72rem', color: 'var(--text-tertiary)',
          marginTop: 4, textAlign: 'center', fontStyle: 'italic',
        }}>
          📐 Ilustrasi otomatis
        </div>
      </motion.div>
    );
  }

  return null;
}
