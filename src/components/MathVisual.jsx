import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a LaTeX formula using KaTeX
 * Usage: <Formula tex="x^2 + y^2 = r^2" />
 */
export function Formula({ tex, display = false, style = {} }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && tex) {
      try {
        katex.render(tex, ref.current, {
          throwOnError: false,
          displayMode: display,
        });
      } catch (e) {
        if (ref.current) ref.current.textContent = tex;
      }
    }
  }, [tex, display]);

  return <span ref={ref} style={{ fontSize: display ? '1.1rem' : '0.95rem', ...style }} />;
}

/**
 * Maps question visualization data to auto-generated visuals.
 * Returns GeoVisual props or null if no visual needed.
 */
export function getAutoVisual(question) {
  const q = question.pertanyaan?.toLowerCase() || '';

  // Gardu + tiang listrik
  if (q.includes('gardu') || (q.includes('kabel') && q.includes('tiang'))) {
    const nums = q.match(/\d+/g)?.map(Number) || [];
    return {
      type: 'gardu',
      data: {
        garduH: nums[0] || 4,
        dict: nums[1] || 5,
        kabel: nums[2] || 13,
      },
    };
  }

  // Pythagoras / tiang / tali
  if ((q.includes('tali') || q.includes('tiang') || q.includes('tangga')) &&
    (q.includes('tinggi') || q.includes('panjang'))) {
    // Try to extract numbers
    const nums = q.match(/\d+/g)?.map(Number) || [];
    if (nums.length >= 2) {
      const sorted = [...nums].sort((a, b) => a - b);
      return {
        type: 'pythagoras',
        data: {
          a: sorted[0] || 8,
          b: sorted[1] || 15,
          c: sorted[sorted.length - 1] || 17,
          labels: { bottom: `${sorted[0]} m`, left: '? m', hyp: `${sorted[sorted.length - 1]} m` },
        },
      };
    }
  }

  // Refleksi / translasi
  if (q.includes('refleksi') || q.includes('direfleksikan') || q.includes('translasi')) {
    const coordMatch = q.match(/\((-?\d+)\s*,\s*(-?\d+)\)/);
    if (coordMatch) {
      const x = parseInt(coordMatch[1]);
      const y = parseInt(coordMatch[2]);
      let tx = x, ty = y;
      let axis = '';

      if (q.includes('sumbu x') && q.includes('sumbu y')) {
        tx = -x; ty = -y; // Double reflection
      } else if (q.includes('sumbu x')) {
        tx = x; ty = -y; axis = 'x';
      } else if (q.includes('sumbu y') || q.includes('sumbu-y')) {
        tx = -x; ty = y; axis = 'y';
      } else if (q.includes('y = x') || q.includes('y=x')) {
        tx = y; ty = x; axis = 'y=x';
      }

      if (q.includes('translasi')) {
         const transMatch = q.match(/translasi\s*\(\s*(-?\d+)\s*,\s*(-?\d+)\s*\)/);
         if (transMatch) {
            tx += parseInt(transMatch[1]);
            ty += parseInt(transMatch[2]);
         }
      }

      return {
        type: 'transformation',
        data: {
          original: { x, y, label: `A(${x},${y})` },
          transformed: { x: tx, y: ty, label: `Akhir(${tx},${ty})` },
          axis,
          xRange: [Math.min(x, tx) - 3, Math.max(x, tx) + 3],
          yRange: [Math.min(y, ty) - 3, Math.max(y, ty) + 3],
        },
      };
    }
  }

  // Persamaan garis / through points
  if (q.includes('garis') && q.includes('melalui')) {
    const coordMatches = [...q.matchAll(/\((-?\d+)\s*,\s*(-?\d+)\)/g)];
    if (coordMatches.length >= 2) {
      const x1 = parseInt(coordMatches[0][1]);
      const y1 = parseInt(coordMatches[0][2]);
      const x2 = parseInt(coordMatches[1][1]);
      const y2 = parseInt(coordMatches[1][2]);
      return {
        type: 'coordinate',
        data: {
          points: [
            { x: x1, y: y1, label: `(${x1},${y1})`, color: '#3b82f6' },
            { x: x2, y: y2, label: `(${x2},${y2})`, color: '#3b82f6' },
          ],
          lines: [{ x1, y1, x2, y2, color: '#3b82f6' }],
          xRange: [Math.min(x1, x2) - 3, Math.max(x1, x2) + 3],
          yRange: [Math.min(y1, y2) - 3, Math.max(y1, y2) + 3],
        },
      };
    }
  }

  // Prisma segitiga
  if (q.includes('prisma') && q.includes('segitiga')) {
    const nums = q.match(/\d+/g)?.map(Number) || [];
    return {
      type: 'prism',
      data: {
        a: nums[0] || 6,
        b: nums[1] || 8,
        h: nums[3] || 15,
      },
    };
  }

  // Lingkaran / diameter
  if ((q.includes('lingkaran') || q.includes('diameter')) && (q.includes('luas') || q.includes('keliling'))) {
    const nums = q.match(/\d+/g)?.map(Number) || [];
    const d = nums.find(n => n > 2 && n <= 50) || 14;
    return {
      type: 'circle',
      data: { diameter: d, label: `d = ${d} cm` },
    };
  }

  // Taman persegi panjang
  if (q.includes('persegi panjang') && (q.includes('taman') || q.includes('kebun'))) {
    const nums = q.match(/\d+/g)?.map(Number) || [];
    return {
      type: 'rectangle',
      data: { width: nums[0] || 24, height: nums[1] || 18 },
    };
  }

  // Diagram batang / pengunjung
  if (q.includes('diagram') || q.includes('pengunjung') || q.includes('peminjaman')) {
    if (q.includes('senin') || q.includes('selasa')) {
      return {
        type: 'barChart',
        data: {
          bars: [
            { label: 'Sen', value: 20, color: '#3b82f6' },
            { label: 'Sel', value: 35, color: '#8b5cf6' },
            { label: 'Rab', value: 25, color: '#10b981' },
            { label: 'Kam', value: 30, color: '#f59e0b' },
            { label: 'Jum', value: 40, color: '#ef4444' },
          ],
        },
      };
    }
  }

  // Kesebangunan
  if (q.includes('sebangun') && q.includes('persegi panjang')) {
    const nums = q.match(/\d+/g)?.map(Number) || [];
    return {
      type: 'similar',
      data: {
        rect1: { w: nums[0] || 12, h: nums[1] || 8 },
        rect2: { w: nums[3] || 18, h: nums[2] || 12 },
      },
    };
  }

  return null;
}
