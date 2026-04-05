import React, { useState, useEffect, useRef } from 'react';
import { Mafs, Coordinates, Point, Polygon, Circle, Line, Text, Transform } from "mafs";
import "mafs/core.css";
import "mafs/font.css";
import GeoVisual3D from './GeoVisual3D';
import MathAnimator from './MathAnimator';

/**
 * Geometry visualizations for math problems.
 * Types: pythagoras, rectangle, circle, triangle, coordinate, barChart, transformation, similar, gardu, probability, animated, estimation, sequence
 */
export default function GeoVisual({ type, data = {}, width = '100%', height = 300 }) {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  
  // Helper to ensure values are safe numbers
  const safe = (val, fallback = 0) => {
    if (val === undefined || val === null || val === '') return fallback;
    const n = Number(val);
    return isNaN(n) ? fallback : n;
  };

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

  const containerStyle = {
    width: '100%',
    height: typeof height === 'number' ? `${height}px` : height,
    minHeight: '280px',
    borderRadius: 12,
    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
    background: colors.bg,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'none',
  };

  const reminderStyle = {
    position: 'absolute',
    bottom: '12px',
    right: '12px',
    background: 'rgba(0, 0, 0, 0.4)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '16px',
    fontSize: '0.65rem',
    pointerEvents: 'none',
    zIndex: 10,
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const svgStyle = {
    width: '100%',
    height: '100%',
    display: 'block',
  };

  const MoveableReminder = () => (
    <div style={reminderStyle}>
      <span>🖱️ Geser & Zoom</span>
    </div>
  );

  // ─── PYTHAGORAS TRIANGLE ───
  if (type === 'pythagoras') {
    const a = safe(data.a, 8);
    const b = safe(data.b, 15);
    const c = safe(data.c, 17);
    const labels = data.labels || {};
    
    const pad = 50;
    const viewW = 400;
    const viewH = 300;
    const rawScale = Math.min((viewW - pad * 2) / Math.max(b, 1), (viewH - pad * 2) / Math.max(a, 1));
    const scale = isNaN(rawScale) ? 10 : rawScale;
    
    const bx = b * scale;
    const ay = a * scale;

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle} preserveAspectRatio="xMidYMid meet">
          {/* Triangle */}
          <polygon
            points={`${pad},${viewH - pad} ${pad + bx},${viewH - pad} ${pad},${viewH - pad - ay}`}
            fill={colors.fill}
            stroke={colors.accent}
            strokeWidth="2.5"
          />
          {/* Right angle marker */}
          <path
            d={`M ${pad},${viewH - pad - 18} L ${pad + 18},${viewH - pad - 18} L ${pad + 18},${viewH - pad}`}
            fill="none"
            stroke={colors.stroke}
            strokeWidth="1.5"
          />
          {/* Labels */}
          <text x={pad + bx / 2} y={viewH - pad + 25} textAnchor="middle" fill={colors.text} fontSize="13" fontWeight="600">
            {labels.bottom || `${b}`}
          </text>
          <text x={pad - 25} y={viewH - pad - ay / 2} textAnchor="middle" fill={colors.text} fontSize="13" fontWeight="600">
            {labels.left || `${a}`}
          </text>
          <text x={pad + bx / 2 + 15} y={viewH - pad - ay / 2 - 5} textAnchor="middle" fill={colors.danger} fontSize="13" fontWeight="700">
            {labels.hyp || `${c}`}
          </text>
          {/* Hypotenuse dashed line */}
          <line
            x1={pad}
            y1={viewH - pad - ay}
            x2={pad + bx}
            y2={viewH - pad}
            stroke={colors.danger}
            strokeWidth="2.5"
            strokeDasharray="6 3"
          />
        </svg>
      </div>
    );
  }

  // ─── COORDINATE PLANE with POINTS (Mafs) ───
  if (type === 'coordinate') {
    const { points = [], lines = [] } = data;
    
    // Default range if not provided
    const defaultX = [-5, 5];
    const defaultY = [-5, 5];
    
    const xRange = Array.isArray(data.xRange) ? data.xRange.map(v => safe(v)) : defaultX;
    const yRange = Array.isArray(data.yRange) ? data.yRange.map(v => safe(v)) : defaultY;
    
    // Ensure 0,0 is always visible but focus on data points
    // We expand the range to include 0 and add padding
    const vbX = [Math.min(...xRange, 0) - 1.5, Math.max(...xRange, 0) + 1.5];
    const vbY = [Math.min(...yRange, 0) - 1.5, Math.max(...yRange, 0) + 1.5];

    return (
      <div style={containerStyle}>
        <Mafs 
          viewBox={{ x: vbX, y: vbY }} 
          zoom={true} 
          pan={true} 
          preserveAspectRatio="contain"
        >
          <Coordinates.Cartesian />
          
          {/* Lines */}
          {lines.map((line, i) => (
            <Line.Segment
              key={`l${i}`}
              point1={[safe(line.x1), safe(line.y1)]}
              point2={[safe(line.x2), safe(line.y2)]}
              color={line.color || colors.accent}
              weight={2}
              style={line.dashed ? "dashed" : "solid"}
            />
          ))}
          
          {/* Points & Labels */}
          {points.map((pt, i) => (
            <g key={`p${i}`}>
              <Point x={safe(pt.x)} y={safe(pt.y)} color={pt.color || colors.accent} />
              <Text x={safe(pt.x) + 0.3} y={safe(pt.y) + 0.3} color={pt.color || colors.text} size={14}>
                {pt.label || `(${safe(pt.x)},${safe(pt.y)})`}
              </Text>
            </g>
          ))}

          {/* Optional Arrow (Vector marker) */}
          {points.length > 1 && points[0].arrow && (
            <Line.Segment
              point1={[safe(points[0].x), safe(points[0].y)]}
              point2={[safe(points[1].x), safe(points[1].y)]}
              color={colors.success}
              weight={3}
              style="dashed"
            />
          )}
        </Mafs>
        <MoveableReminder />
      </div>
    );
  }

  // ─── CIRCLE (Mafs) ───
  if (type === 'circle') {
    const r = safe(data.diameter ? data.diameter / 2 : data.radius, 7);
    const { showRadius = true, label } = data;
    const maxBound = Math.max(r + 2, 5);

    return (
      <div style={containerStyle}>
        <Mafs 
          viewBox={{ x: [-maxBound, maxBound], y: [-maxBound, maxBound] }} 
          zoom={true} 
          pan={true}
        >
          <Circle center={[0, 0]} radius={r} color={colors.accent} weight={2} />
          
          {showRadius && (
            <>
              <Line.Segment point1={[0, 0]} point2={[r, 0]} color={colors.danger} />
              <Text x={r / 2} y={0.5} color={colors.danger} size={14}>
                r = {r}
              </Text>
            </>
          )}
          <Point x={0} y={0} color={colors.accent} />
          
          {label && (
            <Text x={0} y={-r - 1} color={colors.text} size={14}>
              {label}
            </Text>
          )}
        </Mafs>
        <MoveableReminder />
      </div>
    );
  }

  // ─── RECTANGLE ───
  if (type === 'rectangle') {
    const rw = safe(data.width, 24);
    const rh = safe(data.height, 18);
    const { label, showDimensions = true } = data;
    
    const pad = 50;
    const viewW = 400;
    const viewH = 300;
    const rawScale = Math.min((viewW - pad * 2) / Math.max(rw, 1), (viewH - pad * 2) / Math.max(rh, 1));
    const scale = isNaN(rawScale) ? 1 : rawScale;
    
    const sw = rw * scale;
    const sh = rh * scale;
    const rx_pos = (viewW - sw) / 2;
    const ry_pos = (viewH - sh) / 2;

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle} preserveAspectRatio="xMidYMid meet">
          <rect x={rx_pos} y={ry_pos} width={sw} height={sh} fill={colors.fill} stroke={colors.accent} strokeWidth="2.5" rx="3" />
          {showDimensions && (
            <>
              <text x={rx_pos + sw / 2} y={ry_pos + sh + 22} textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="600">
                {rw} m
              </text>
              <text x={rx_pos - 20} y={ry_pos + sh / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="600">
                {rh} m
              </text>
            </>
          )}
          {label && (
            <text x={rx_pos + sw / 2} y={ry_pos + sh / 2 + 4} textAnchor="middle" fill={colors.label} fontSize="11">{label}</text>
          )}
        </svg>
      </div>
    );
  }

  // ─── PRISM 3D (R3F) ───
  if (type === 'prism') {
    const prismData = {
      a: safe(data.a, 6),
      b: safe(data.b, 8),
      h: safe(data.h, 15)
    };
    return <GeoVisual3D type="prism" data={prismData} width={width} height={height} />;
  }

  // ─── BAR CHART ───
  if (type === 'barChart') {
    const { bars = [] } = data;
    if (bars.length === 0) return null;
    const pad = 45;
    const viewW = 400;
    const viewH = 300;
    const maxVal = Math.max(...bars.map(b => safe(b.value, 1)), 1);
    const barWidth = (viewW - pad * 2) / bars.length - 8;
    const chartHeight = viewH - pad * 2;

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle} preserveAspectRatio="xMidYMid meet">
          {/* Grid lines */}
          {[0.25, 0.5, 0.75, 1].map(f => (
            <line key={f}
              x1={pad} y1={pad + chartHeight * (1 - f)}
              x2={viewW - pad} y2={pad + chartHeight * (1 - f)}
              stroke={colors.grid} strokeWidth="0.5" />
          ))}
          {/* Y axis */}
          <line x1={pad} y1={pad} x2={pad} y2={viewH - pad} stroke={colors.stroke} strokeWidth="1.5" />
          <line x1={pad} y1={viewH - pad} x2={viewW - pad} y2={viewH - pad} stroke={colors.stroke} strokeWidth="1.5" />
          {/* Bars */}
          {bars.map((bar, i) => {
            const bh = (safe(bar.value) / maxVal) * chartHeight;
            const bx = pad + i * (barWidth + 8) + 4;
            const by = viewH - pad - bh;
            return (
              <g key={i}>
                <rect x={bx} y={by} width={barWidth} height={bh}
                  fill={bar.color || colors.accent} rx="3" opacity="0.85" />
                <text x={bx + barWidth / 2} y={viewH - pad + 16}
                  textAnchor="middle" fill={colors.label} fontSize="10">{bar.label}</text>
                <text x={bx + barWidth / 2} y={by - 6}
                  textAnchor="middle" fill={colors.text} fontSize="10" fontWeight="600">{bar.value}</text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  }

  // ─── RHOMBUS (Mafs) ───
  if (type === 'rhombus') {
    const d1 = safe(data.d1, 24);
    const d2 = safe(data.d2, 18);
    const x = d1 / 2;
    const y = d2 / 2;
    const maxBound = Math.max(x + 2, y + 2, 5);

    return (
      <div style={containerStyle}>
        <Mafs 
          viewBox={{ x: [-maxBound, maxBound], y: [-maxBound, maxBound] }} 
          zoom={true} 
          pan={true} 
          preserveAspectRatio="contain"
        >
          <Polygon points={[[x, 0], [0, y], [-x, 0], [0, -y]]} color={colors.accent} weight={2} />
          
          <Line.Segment point1={[-x, 0]} point2={[x, 0]} color={colors.danger} style="dashed" />
          <Line.Segment point1={[0, -y]} point2={[0, y]} color={colors.danger} style="dashed" />
          
          <Text x={x/2} y={1} color={colors.text} size={14}>D1 = {d1}</Text>
          <Text x={1} y={y/2} color={colors.text} size={14}>D2 = {d2}</Text>
        </Mafs>
        <MoveableReminder />
      </div>
    );
  }

  // ─── VENN DIAGRAM (SVG) ───
  if (type === 'venn') {
    const total = safe(data.total, 100);
    const a = safe(data.a, 40);
    const b = safe(data.b, 30);
    const both = safe(data.both, 10);
    
    const viewW = 400;
    const viewH = 300;
    const cx1 = viewW/2 - 25;
    const cx2 = viewW/2 + 25;
    const cy = viewH/2;
    const r = 45;
    
    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle} preserveAspectRatio="xMidYMid meet">
          <rect x={10} y={10} width={viewW-20} height={viewH-20} fill="none" stroke={colors.stroke} strokeWidth="2" />
          <text x={18} y={25} fill={colors.text} fontSize="12" fontWeight="600">S={total}</text>
          
          <circle cx={cx1} cy={cy} r={r} fill={colors.accent} fillOpacity="0.3" stroke={colors.accent} strokeWidth="2" />
          <circle cx={cx2} cy={cy} r={r} fill={colors.danger} fillOpacity="0.3" stroke={colors.danger} strokeWidth="2" />
          
          <text x={cx1 - 20} y={cy + 4} textAnchor="middle" fill={colors.text} fontSize="14" fontWeight="bold">{a - both}</text>
          <text x={cx2 + 20} y={cy + 4} textAnchor="middle" fill={colors.text} fontSize="14" fontWeight="bold">{b - both}</text>
          <text x={viewW/2} y={cy + 4} textAnchor="middle" fill={colors.text} fontSize="14" fontWeight="bold">{both}</text>
        </svg>
      </div>
    );
  }

  // ─── DATA TABLE (HTML Table) ───
  if (type === 'table') {
    const { headers = [], rows = [], title } = data;
    return (
      <div style={{ ...containerStyle, height: 'auto' }}>
        <div style={{ padding: '12px 4px', width: '100%', boxSizing: 'border-box' }}>
          {title && <div style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '8px', fontSize: '13px', color: colors.text }}>{title}</div>}
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px', color: colors.text, tableLayout: 'auto' }}>
            <thead>
              <tr>
                {headers.map((h, i) => (
                  <th key={i} style={{ padding: '8px', borderBottom: `2px solid ${colors.stroke}`, background: colors.fill }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: '8px', borderBottom: `1px solid ${colors.grid}`, fontWeight: j === 0 ? '600' : 'normal' }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ─── PROBABILITY: DICE & COIN ───
  if (type === 'probability') {
    const { subType = 'dice', value = 1, value2 } = data;
    const viewW = 400;
    const viewH = 300;

    const Dice = ({ val, x, y, size = 60 }) => {
      const dots = {
        1: [[0.5, 0.5]],
        2: [[0.25, 0.25], [0.75, 0.75]],
        3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
        4: [[0.25, 0.25], [0.25, 0.75], [0.75, 0.25], [0.75, 0.75]],
        5: [[0.25, 0.25], [0.25, 0.75], [0.5, 0.5], [0.75, 0.25], [0.75, 0.75]],
        6: [[0.25, 0.25], [0.25, 0.5], [0.25, 0.75], [0.75, 0.25], [0.75, 0.5], [0.75, 0.75]]
      };
      return (
        <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
          <rect width={size} height={size} rx={size * 0.15} fill={colors.fill} stroke={colors.accent} strokeWidth="2" />
          {(dots[val] || []).map(([dx, dy], i) => (
            <circle key={i} cx={dx * size} cy={dy * size} r={size * 0.08} fill={colors.accent} />
          ))}
        </g>
      );
    };

    const Coin = ({ side = 'H', x, y, size = 60 }) => (
      <g transform={`translate(${x}, ${y})`}>
        <circle r={size / 2} fill={colors.fill} stroke={colors.accent} strokeWidth="2" />
        <circle r={size / 2 - 5} fill="none" stroke={colors.accent} strokeWidth="1" strokeDasharray="2 2" />
        <text textAnchor="middle" dominantBaseline="middle" fill={colors.accent} fontSize={size * 0.4} fontWeight="bold">
          {side === 'H' ? 'ANGKA' : 'GAMBAR'}
        </text>
      </g>
    );

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle}>
          {subType === 'dice' && (
            <>
              <Dice val={safe(value, 1)} x={viewW / 2 - (value2 ? 40 : 0)} y={viewH / 2} />
              {value2 && <Dice val={safe(value2, 1)} x={viewW / 2 + 40} y={viewH / 2} />}
            </>
          )}
          {subType === 'coin' && (
            <>
              <Coin side={value === 1 ? 'H' : 'G'} x={viewW / 2 - (value2 ? 60 : 0)} y={viewH / 2} />
              {value2 !== undefined && <Coin side={value2 === 1 ? 'H' : 'G'} x={viewW / 2 + 60} y={viewH / 2} />}
            </>
          )}
          {subType === 'logic' && (
             <g transform={`translate(${viewW/2}, ${viewH/2})`}>
                <text textAnchor="middle" fill={colors.text} fontSize="16" fontWeight="bold">P(A) = n(A) / n(S)</text>
                <line x1="-60" y1="10" x2="60" y2="10" stroke={colors.accent} strokeWidth="2" />
                <text y="35" textAnchor="middle" fill={colors.label} fontSize="12">Peluang Kejadian</text>
             </g>
          )}
        </svg>
      </div>
    );
  }

  // ─── TRANSFORMATION (reflection/translation) ───
  if (type === 'transformation') {
    const original = data.original || { x: 0, y: 0 };
    const transformed = data.transformed || { x: 0, y: 0 };
    const { axis } = data;
    
    const mergedData = {
      points: [
        { ...original, x: safe(original.x), y: safe(original.y), color: colors.accent, label: original.label || `A(${safe(original.x)},${safe(original.y)})` },
        { ...transformed, x: safe(transformed.x), y: safe(transformed.y), color: colors.success, label: transformed.label || `A'(${safe(transformed.x)},${safe(transformed.y)})` },
      ],
      lines: [],
      xRange: Array.isArray(data.xRange) ? data.xRange.map(v => safe(v)) : [-6, 6],
      yRange: Array.isArray(data.yRange) ? data.yRange.map(v => safe(v)) : [-6, 6],
    };

    // Add axis lines
    if (axis === 'x') {
      mergedData.lines.push({ x1: -100, y1: 0, x2: 100, y2: 0, color: colors.danger, dashed: false });
    } else if (axis === 'y') {
      mergedData.lines.push({ x1: 0, y1: -100, x2: 0, y2: 100, color: colors.danger, dashed: false });
    } else if (axis === 'y=x') {
      mergedData.lines.push({ x1: -100, y1: -100, x2: 100, y2: 100, color: colors.danger, dashed: true });
    }

    // Arrow from original to transformed
    mergedData.points[0].arrow = true;

    return <GeoVisual type="coordinate" data={mergedData} width={width} height={height} />;
  }

  // ─── SIMILAR RECTANGLES ───
  if (type === 'similar') {
    const rect1 = data.rect1 || { w: 12, h: 8 };
    const rect2 = data.rect2 || { w: 18, h: 12 };
    const rw1 = safe(rect1.w, 12);
    const rh1 = safe(rect1.h, 8);
    const rw2 = safe(rect2.w, 18);
    const rh2 = safe(rect2.h, 12);

    const pad = 30;
    const viewW = 400;
    const viewH = 300;
    const totalW = rw1 + rw2 + 40;
    const rawScale = (viewW - pad * 2) / Math.max(totalW, 1);
    const scale = isNaN(rawScale) ? 1 : rawScale;
    
    const w1 = rw1 * scale;
    const h1 = rh1 * scale;
    const w2 = rw2 * scale;
    const h2 = rh2 * scale;

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle} preserveAspectRatio="xMidYMid meet">
          {/* Rect A */}
          <rect x={pad} y={viewH - pad - h1} width={w1} height={h1}
            fill={colors.fill} stroke={colors.accent} strokeWidth="2" rx="3" />
          <text x={pad + w1 / 2} y={viewH - pad + 16} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
            {rw1} cm
          </text>
          <text x={pad - 16} y={viewH - pad - h1 / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
            {rh1}
          </text>
          <text x={pad + w1 / 2} y={viewH - pad - h1 - 8} textAnchor="middle" fill={colors.label} fontSize="10">A</text>
          {/* Rect B */}
          <rect x={pad + w1 + 30 * scale} y={viewH - pad - h2} width={w2} height={h2}
            fill={colors.fill} stroke={colors.success} strokeWidth="2" rx="3" />
          <text x={pad + w1 + 30 * scale + w2 / 2} y={viewH - pad + 16} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
            ? cm
          </text>
          <text x={pad + w1 + 30 * scale - 16} y={viewH - pad - h2 / 2 + 4} textAnchor="middle" fill={colors.text} fontSize="11" fontWeight="600">
            {rh2}
          </text>
          <text x={pad + w1 + 30 * scale + w2 / 2} y={viewH - pad - h2 - 8} textAnchor="middle" fill={colors.label} fontSize="10">B</text>
          {/* ≅ symbol */}
          <text x={pad + w1 + 15 * scale} y={viewH / 2 + 4} textAnchor="middle" fill={colors.label} fontSize="18">≅</text>
        </svg>
      </div>
    );
  }

  // ─── GARDU + TIANG ───
  if (type === 'gardu') {
    const garduH = safe(data.garduH, 4);
    const dict = safe(data.dict, 5);
    const kabel = safe(data.kabel, 13);
    
    const pad = 40;
    const viewW = 400;
    const viewH = 300;
    
    // Calculate difference in height (x) and total pole height
    const xDist = Math.sqrt(Math.max(kabel * kabel - dict * dict, 0));
    const tiangH = garduH + xDist;
    const rawScale = Math.min((viewW - pad * 2) / 10, (viewH - pad * 2) / Math.max(tiangH, 10));
    const scale = isNaN(rawScale) ? 10 : rawScale;
    
    const garduX = pad + 20;
    const garduY = viewH - pad - (garduH * scale);
    const tiangX = viewW - pad - 40;
    const tiangY = viewH - pad - (tiangH * scale);
    const gwScaled = 40; // width of gardu building
    
    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle} preserveAspectRatio="xMidYMid meet">
          {/* Ground */}
          <line x1={10} y1={viewH - pad} x2={viewW - 10} y2={viewH - pad} stroke={colors.stroke} strokeWidth="3" />
          
          {/* Gardu */}
          <rect x={garduX - gwScaled/2} y={garduY} width={gwScaled} height={garduH * scale} fill={colors.fill} stroke={colors.accent} strokeWidth="2" rx="2" />
          <text x={garduX} y={garduY + (garduH * scale)/2 + 4} textAnchor="middle" fill={colors.text} fontSize="12" fontWeight="600">{garduH} m</text>
          <text x={garduX} y={viewH - pad + 18} textAnchor="middle" fill={colors.label} fontSize="12" fontWeight="600">Gardu</text>

          {/* Tiang */}
          <line x1={tiangX} y1={viewH - pad} x2={tiangX} y2={tiangY} stroke={colors.stroke} strokeWidth="6" strokeLinecap="round" />
          <text x={tiangX} y={viewH - pad + 18} textAnchor="middle" fill={colors.label} fontSize="12" fontWeight="600">Tiang</text>
          
          {/* Horizontal Line for x */}
          <line x1={garduX} y1={garduY} x2={tiangX} y2={garduY} stroke={colors.grid} strokeWidth="2" strokeDasharray="5 5" />
          
          {/* Kabel */}
          <line x1={garduX} y1={garduY} x2={tiangX} y2={tiangY} stroke={colors.danger} strokeWidth="3" />
          <text x={(garduX + tiangX)/2 - 10} y={(garduY + tiangY)/2 - 10} textAnchor="middle" fill={colors.danger} fontSize="13" fontWeight="700">{kabel} m</text>
          
          {/* Distance (dict) */}
          <line x1={garduX} y1={viewH - pad - 12} x2={tiangX} y2={viewH - pad - 12} stroke={colors.accent} strokeWidth="1.5" />
          <text x={(garduX + tiangX)/2} y={viewH - pad - 20} textAnchor="middle" fill={colors.accent} fontSize="12" fontWeight="600">{dict} m</text>
          
          {/* Height indicator for tiang diff */}
          <text x={tiangX - 10} y={(garduY + tiangY)/2 + 5} textAnchor="end" fill={colors.text} fontSize="13" fontWeight="600">? m</text>
          
          {/* Total height text */}
          <text x={tiangX + 15} y={(tiangY + viewH - pad)/2 + 5} textAnchor="start" fill={colors.accent} fontSize="12" fontWeight="700">t tiang = ?</text>
        </svg>
      </div>
    );
  }

  // ─── ESTIMATION / SCALE (SVG) ───
  if (type === 'estimation') {
    const { unit = 1, total = 19.6, price = 12750 } = data;
    const viewW = 400;
    const viewH = 300;
    const estTotal = Math.round(total);
    const estPrice = Math.round(price / 500) * 500;

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle}>
          <g transform="translate(50, 80)">
             <rect width="80" height="100" fill={colors.fill} stroke={colors.accent} strokeWidth="2" rx="5" />
             <text x="40" y="55" textAnchor="middle" fill={colors.text} fontSize="14" fontWeight="bold">{unit} kg</text>
             <text x="40" y="125" textAnchor="middle" fill={colors.label} fontSize="12">Rp{price.toLocaleString()}</text>
          </g>
          
          <text x="175" y="135" textAnchor="middle" fill={colors.accent} fontSize="30">×</text>
          <text x="175" y="165" textAnchor="middle" fill={colors.label} fontSize="12">≈ {estTotal}</text>

          <g transform="translate(250, 80)">
             <rect width="100" height="120" fill={colors.accent} fillOpacity="0.2" stroke={colors.accent} strokeWidth="2" rx="5" />
             <text x="50" y="50" textAnchor="middle" fill={colors.text} fontSize="14" fontWeight="bold">{total} kg</text>
             <text x="50" y="80" textAnchor="middle" fill={colors.danger} fontSize="16" fontWeight="bold">?</text>
             <text x="50" y="145" textAnchor="middle" fill={colors.label} fontSize="11">Estimasi: {estTotal} x {estPrice.toLocaleString()}</text>
          </g>
        </svg>
      </div>
    );
  }

  // ─── SEQUENCE / POLA (SVG) ───
  if (type === 'sequence') {
    const { pattern = 'dots', steps = [1, 3, 6, 10], current = 3 } = data;
    const viewW = 400;
    const viewH = 300;
    const n = steps[current] || 1;
    
    // Draw dots in triangle or line
    const renderDots = () => {
      const dots = [];
      if (pattern === 'dots') {
        // Triangular pattern
        let count = 0;
        for (let row = 0; row < 10; row++) {
          for (let col = 0; col <= row; col++) {
            if (count < n) {
              dots.push(<circle key={count} cx={200 - (row * 12) + (col * 24)} cy={100 + (row * 24)} r="8" fill={colors.accent} />);
              count++;
            }
          }
        }
      }
      return dots;
    };

    return (
      <div style={containerStyle}>
        <svg viewBox={`0 0 ${viewW} ${viewH}`} style={svgStyle}>
          {renderDots()}
          <text x={viewW/2} y={260} textAnchor="middle" fill={colors.text} fontSize="16" fontWeight="bold">Pola ke-{current + 1}: {n} titik</text>
        </svg>
      </div>
    );
  }

  const [animStep, setAnimStep] = React.useState(0);

  // ─── ANIMATED (MathAnimator) ───
  if (type === 'animated') {
    const currentStepData = data.steps && data.steps[animStep] ? data.steps[animStep] : {};
    const visual = currentStepData.visual || data.visual;

    return (
      <div style={{ ...containerStyle, height: 'auto', padding: '16px', flexDirection: 'column' }}>
        {visual && (
          <div style={{ width: '100%', marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.05)' }}>
             <GeoVisual type={visual.type} data={visual.data} height={200} />
          </div>
        )}
        <MathAnimator 
          steps={data.steps || []} 
          colors={colors} 
          onStepChange={setAnimStep}
        />
      </div>
    );
  }

  return null;
}
