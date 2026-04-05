import { useEffect, useRef } from 'react';
import GeoVisual3D from './GeoVisual3D';

/**
 * SVG-based geometry visualizations for math problems.
 * Types: pythagoras, rectangle, circle, triangle, coordinate, barChart, transformation
 */
export default function GeoVisual({ type, data = {}, width = 320, height = 240 }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const colors = {
    bg: isDark ? '#1e293b' : '#f8fafc',
    stroke: isDark ? '#94a3b8' : '#334155',
    fill: isDark ? '#334155' : '#dbeafe',
    accent: '#3b82f6',
    danger: '#ef4444',
    success: '#10b981',
    text: isDark ? '#e2e8f0' : '#1e293b',
    grid: isDark ? '#334155' : '#e2e8f0',
    label: isDark ? '#94a3b8' : '#64748b',
  };

  const svgStyle = {
    width: '100%',
    maxWidth: width,
    height: 'auto',
    borderRadius: 12,
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: colors.bg,
  };

  // ─── PYTHAGORAS TRIANGLE ───
  if (type === 'pythagoras') {
    const { a = 8, b = 15, c = 17, labels = {} } = data;
    const pad = 50;
    const scale = Math.min((width - pad * 2) / b, (height - pad * 2) / a);
    const bx = b * scale;
    const ay = a * scale;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        {/* Triangle */}
        <polygon
          points={`${pad},${height - pad} ${pad + bx},${height - pad} ${pad},${height - pad - ay}`}
          fill={colors.fill}
          stroke={colors.accent}
          strokeWidth="2.5"
        />
        {/* Right angle marker */}
        <path
          d={`M ${pad},${height - pad - 18} L ${pad + 18},${height - pad - 18} L ${pad + 18},${height - pad}`}
          fill="none"
          stroke={colors.stroke}
          strokeWidth="1.5"
        />
        {/* Labels */}
        <text x={pad + bx / 2} y={height - pad + 25} textAnchor="middle" fill={colors.text} fontSize="13" fontWeight="600">
          {labels.bottom || `${b}`}
        </text>
        <text x={pad - 25} y={height - pad - ay / 2} textAnchor="middle" fill={colors.text} fontSize="13" fontWeight="600">
          {labels.left || `${a}`}
        </text>
        <text x={pad + bx / 2 + 15} y={height - pad - ay / 2 - 5} textAnchor="middle" fill={colors.danger} fontSize="13" fontWeight="700">
          {labels.hyp || `${c}`}
        </text>
        {/* Hypotenuse dashed line */}
        <line
          x1={pad}
          y1={height - pad - ay}
          x2={pad + bx}
          y2={height - pad}
          stroke={colors.danger}
          strokeWidth="2.5"
          strokeDasharray="6 3"
        />
      </svg>
    );
  }

  // ─── COORDINATE PLANE with POINTS ───
  if (type === 'coordinate') {
    const { points = [], lines = [], xRange = [-6, 6], yRange = [-6, 6] } = data;
    const pad = 40;
    const w = width - pad * 2;
    const h = height - pad * 2;
    const xScale = w / (xRange[1] - xRange[0]);
    const yScale = h / (yRange[1] - yRange[0]);
    const toX = (x) => pad + (x - xRange[0]) * xScale;
    const toY = (y) => pad + (yRange[1] - y) * yScale;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        {/* Grid */}
        {Array.from({ length: xRange[1] - xRange[0] + 1 }, (_, i) => xRange[0] + i).map(x => (
          <line key={`gx${x}`} x1={toX(x)} y1={pad} x2={toX(x)} y2={height - pad}
            stroke={colors.grid} strokeWidth={x === 0 ? 2 : 0.5} />
        ))}
        {Array.from({ length: yRange[1] - yRange[0] + 1 }, (_, i) => yRange[0] + i).map(y => (
          <line key={`gy${y}`} x1={pad} y1={toY(y)} x2={width - pad} y2={toY(y)}
            stroke={colors.grid} strokeWidth={y === 0 ? 2 : 0.5} />
        ))}
        {/* Axis labels */}
        <text x={width - pad + 10} y={toY(0) + 4} fill={colors.label} fontSize="11">x</text>
        <text x={toX(0) - 12} y={pad - 8} fill={colors.label} fontSize="11">y</text>
        {/* Lines */}
        {lines.map((line, i) => (
          <line key={`l${i}`}
            x1={toX(line.x1)} y1={toY(line.y1)}
            x2={toX(line.x2)} y2={toY(line.y2)}
            stroke={line.color || colors.accent}
            strokeWidth="2"
            strokeDasharray={line.dashed ? '6 3' : 'none'}
          />
        ))}
        {/* Points */}
        {points.map((pt, i) => (
          <g key={`p${i}`}>
            <circle cx={toX(pt.x)} cy={toY(pt.y)} r={5}
              fill={pt.color || colors.accent} stroke="white" strokeWidth="2" />
            <text x={toX(pt.x) + 10} y={toY(pt.y) - 8}
              fill={pt.color || colors.text} fontSize="11" fontWeight="600">
              {pt.label || `(${pt.x},${pt.y})`}
            </text>
          </g>
        ))}
        {/* Arrow at origin */}
        {points.length > 1 && points[0].arrow && (
          <line
            x1={toX(points[0].x)} y1={toY(points[0].y)}
            x2={toX(points[1].x)} y2={toY(points[1].y)}
            stroke={colors.success}
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
            strokeDasharray="5 3"
          />
        )}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={colors.success} />
          </marker>
        </defs>
      </svg>
    );
  }

  // ─── CIRCLE ───
  if (type === 'circle') {
    const { radius = 7, diameter, showRadius = true, label } = data;
    const r = diameter ? diameter / 2 : radius;
    const cx = width / 2;
    const cy = height / 2;
    const scale = Math.min((width - 80) / (r * 2), (height - 80) / (r * 2));
    const sr = r * scale;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        <circle cx={cx} cy={cy} r={sr} fill={colors.fill} stroke={colors.accent} strokeWidth="2.5" />
        {showRadius && (
          <>
            <line x1={cx} y1={cy} x2={cx + sr} y2={cy} stroke={colors.danger} strokeWidth="2" />
            <text x={cx + sr / 2} y={cy - 8} textAnchor="middle" fill={colors.danger} fontSize="12" fontWeight="600">
              r = {r}
            </text>
          </>
        )}
        <circle cx={cx} cy={cy} r={3} fill={colors.accent} />
        {label && (
          <text x={cx} y={cy + sr + 25} textAnchor="middle" fill={colors.text} fontSize="12">{label}</text>
        )}
      </svg>
    );
  }

  // ─── RECTANGLE ───
  if (type === 'rectangle') {
    const { width: rw = 24, height: rh = 18, label, showDimensions = true } = data;
    const pad = 50;
    const scale = Math.min((width - pad * 2) / rw, (height - pad * 2) / rh);
    const sw = rw * scale;
    const sh = rh * scale;
    const x = (width - sw) / 2;
    const y = (height - sh) / 2;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        <rect x={x} y={y} width={sw} height={sh} fill={colors.fill} stroke={colors.accent} strokeWidth="2.5" rx="3" />
        {showDimensions && (
          <>
            <text x={x + sw / 2} y={y + sh + 22} textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="600">
              {rw} m
            </text>
            <text x={x - 20} y={y + sh / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="600">
              {rh} m
            </text>
          </>
        )}
        {label && (
          <text x={x + sw / 2} y={y + sh / 2 + 4} textAnchor="middle" fill={colors.label} fontSize="11">{label}</text>
        )}
      </svg>
    );
  }

  // ─── PRISM 3D (R3F) ───
  if (type === 'prism') {
    return <GeoVisual3D type="prism" data={data} width={width} height={height} />;
  }

  // ─── BAR CHART ───
  if (type === 'barChart') {
    const { bars = [], xLabel = '', yLabel = '' } = data;
    if (bars.length === 0) return null;
    const pad = 45;
    const maxVal = Math.max(...bars.map(b => b.value));
    const barWidth = (width - pad * 2) / bars.length - 8;
    const chartHeight = height - pad * 2;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map(f => (
          <line key={f}
            x1={pad} y1={pad + chartHeight * (1 - f)}
            x2={width - pad} y2={pad + chartHeight * (1 - f)}
            stroke={colors.grid} strokeWidth="0.5" />
        ))}
        {/* Y axis */}
        <line x1={pad} y1={pad} x2={pad} y2={height - pad} stroke={colors.stroke} strokeWidth="1.5" />
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke={colors.stroke} strokeWidth="1.5" />
        {/* Bars */}
        {bars.map((bar, i) => {
          const bh = (bar.value / maxVal) * chartHeight;
          const bx = pad + i * (barWidth + 8) + 4;
          const by = height - pad - bh;
          return (
            <g key={i}>
              <rect x={bx} y={by} width={barWidth} height={bh}
                fill={bar.color || colors.accent} rx="3" opacity="0.85" />
              <text x={bx + barWidth / 2} y={height - pad + 16}
                textAnchor="middle" fill={colors.label} fontSize="10">{bar.label}</text>
              <text x={bx + barWidth / 2} y={by - 6}
                textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="600">{bar.value}</text>
            </g>
          );
        })}
      </svg>
    );
  }

  // ─── TRANSFORMATION (reflection/translation) ───
  if (type === 'transformation') {
    const { original, transformed, transformType = 'reflection', axis } = data;
    const mergedData = {
      points: [
        { ...original, color: colors.accent, label: original.label || `A(${original.x},${original.y})` },
        { ...transformed, color: colors.success, label: transformed.label || `A'(${transformed.x},${transformed.y})` },
      ],
      lines: [],
      xRange: data.xRange || [-6, 6],
      yRange: data.yRange || [-6, 6],
    };

    // Add axis lines
    if (axis === 'x') {
      mergedData.lines.push({ x1: -6, y1: 0, x2: 6, y2: 0, color: colors.danger, dashed: false });
    } else if (axis === 'y') {
      mergedData.lines.push({ x1: 0, y1: -6, x2: 0, y2: 6, color: colors.danger, dashed: false });
    } else if (axis === 'y=x') {
      mergedData.lines.push({ x1: -6, y1: -6, x2: 6, y2: 6, color: colors.danger, dashed: true });
    }

    // Arrow from original to transformed
    mergedData.points[0].arrow = true;

    return <GeoVisual type="coordinate" data={mergedData} width={width} height={height} />;
  }

  // ─── SIMILAR RECTANGLES ───
  if (type === 'similar') {
    const { rect1 = { w: 12, h: 8 }, rect2 = { w: 18, h: 12 } } = data;
    const pad = 30;
    const totalW = rect1.w + rect2.w + 40;
    const scale = (width - pad * 2) / totalW;
    const w1 = rect1.w * scale;
    const h1 = rect1.h * scale;
    const w2 = rect2.w * scale;
    const h2 = rect2.h * scale;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        {/* Rect A */}
        <rect x={pad} y={height - pad - h1} width={w1} height={h1}
          fill={colors.fill} stroke={colors.accent} strokeWidth="2" rx="3" />
        <text x={pad + w1 / 2} y={height - pad + 16} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
          {rect1.w} cm
        </text>
        <text x={pad - 16} y={height - pad - h1 / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
          {rect1.h}
        </text>
        <text x={pad + w1 / 2} y={height - pad - h1 - 8} textAnchor="middle" fill={colors.label} fontSize="10">A</text>
        {/* Rect B */}
        <rect x={pad + w1 + 30 * scale} y={height - pad - h2} width={w2} height={h2}
          fill={colors.fill} stroke={colors.success} strokeWidth="2" rx="3" />
        <text x={pad + w1 + 30 * scale + w2 / 2} y={height - pad + 16} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
          ? cm
        </text>
        <text x={pad + w1 + 30 * scale - 16} y={height - pad - h2 / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
          {rect2.h}
        </text>
        <text x={pad + w1 + 30 * scale + w2 / 2} y={height - pad - h2 - 8} textAnchor="middle" fill={colors.label} fontSize="10">B</text>
        {/* ≅ symbol */}
        <text x={pad + w1 + 15 * scale} y={height / 2 + 4} textAnchor="middle" fill={colors.label} fontSize="18">≅</text>
      </svg>
    );
  }

  // ─── GARDU + TIANG ───
  if (type === 'gardu') {
    const { garduH = 4, dict = 5, kabel = 13 } = data;
    const pad = 40;
    
    // Calculate difference in height (x) and total pole height
    const xDist = Math.sqrt(Math.max(kabel * kabel - dict * dict, 1));
    const tiangH = garduH + xDist;
    const scale = Math.min((width - pad * 2) / 10, (height - pad * 2) / Math.max(tiangH, 10));
    
    const garduX = pad + 20;
    const garduY = height - pad - (garduH * scale);
    const tiangX = width - pad - 40;
    const tiangY = height - pad - (tiangH * scale);
    const gwScaled = 40; // width of gardu building
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={svgStyle}>
        {/* Ground */}
        <line x1={10} y1={height - pad} x2={width - 10} y2={height - pad} stroke={colors.stroke} strokeWidth="3" />
        
        {/* Gardu */}
        <rect x={garduX - gwScaled/2} y={garduY} width={gwScaled} height={garduH * scale} fill={colors.fill} stroke={colors.accent} strokeWidth="2" rx="2" />
        <text x={garduX} y={garduY + (garduH * scale)/2 + 4} textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="600">{garduH} m</text>
        <text x={garduX} y={height - pad + 18} textAnchor="middle" fill={colors.label} fontSize="12" fontWeight="600">Gardu</text>

        {/* Tiang */}
        <line x1={tiangX} y1={height - pad} x2={tiangX} y2={tiangY} stroke={colors.stroke} strokeWidth="6" strokeLinecap="round" />
        <text x={tiangX} y={height - pad + 18} textAnchor="middle" fill={colors.label} fontSize="12" fontWeight="600">Tiang</text>
        
        {/* Horizontal Line for x */}
        <line x1={garduX} y1={garduY} x2={tiangX} y2={garduY} stroke={colors.grid} strokeWidth="2" strokeDasharray="5 5" />
        
        {/* Kabel */}
        <line x1={garduX} y1={garduY} x2={tiangX} y2={tiangY} stroke={colors.danger} strokeWidth="3" />
        <text x={(garduX + tiangX)/2 - 10} y={(garduY + tiangY)/2 - 10} textAnchor="middle" fill={colors.danger} fontSize="13" fontWeight="700">{kabel} m</text>
        
        {/* Distance (dict) */}
        <line x1={garduX} y1={height - pad - 12} x2={tiangX} y2={height - pad - 12} stroke={colors.accent} strokeWidth="1.5" />
        <text x={(garduX + tiangX)/2} y={height - pad - 20} textAnchor="middle" fill={colors.accent} fontSize="12" fontWeight="600">{dict} m</text>
        
        {/* Height indicator for tiang diff */}
        <text x={tiangX - 10} y={(garduY + tiangY)/2 + 5} textAnchor="end" fill={colors.text} fontSize="13" fontWeight="600">? m</text>
        
        {/* Total height text */}
        <text x={tiangX + 15} y={(tiangY + height - pad)/2 + 5} textAnchor="start" fill={colors.accent} fontSize="12" fontWeight="700">t tiang = ?</text>
      </svg>
    );
  }

  return null;
}
