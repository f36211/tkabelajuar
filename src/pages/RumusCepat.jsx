import { motion } from 'framer-motion';
import materiData from '../data/materi.json';
import { useState } from 'react';
import { Formula } from '../components/MathVisual';
import GeoVisual from '../components/GeoVisual';

export default function RumusCepat() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? materiData
    : materiData.filter(t => t.id === activeFilter);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 4 }}>⚡ Rumus Cepat</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Ringkasan semua rumus penting — buka sebelum ujian!
        </p>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${activeFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveFilter('all')}
        >
          Semua
        </button>
        {materiData.map(t => (
          <button
            key={t.id}
            className={`btn btn-sm ${activeFilter === t.id ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveFilter(t.id)}
          >
            {t.icon} {t.title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="card" style={{ marginBottom: 24, background: 'var(--accent-subtle)', border: '1px solid var(--accent)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 10, color: 'var(--accent)' }}>
          💡 Tips Mengerjakan Soal
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
          {[
            { tip: 'Soal cerita panjang → Baca pertanyaan terakhir dulu', icon: '📖' },
            { tip: 'Diskon bertingkat → Kalikan bertahap, bukan jumlah %', icon: '💰' },
            { tip: 'Geometri + gambar → Gambar ulang, tandai data', icon: '📐' },
            { tip: 'Transformasi → Buat tabel koordinat', icon: '🔄' },
            { tip: 'Statistika → Hitung total dulu baru rata-rata', icon: '📊' },
            { tip: 'Waktu habis → Kerjakan mudah dulu!', icon: '⏰' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '8px 12px', background: 'var(--bg-card)',
              borderRadius: 'var(--radius-sm)', fontSize: '0.82rem',
            }}>
              <span>{item.icon}</span>
              <span>{item.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pythagoras Triple */}
      {(activeFilter === 'all' || activeFilter === 'geometri') && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid var(--danger)' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 8, color: 'var(--danger)' }}>
            🔥 Pythagoras Triple (WAJIB HAFAL!)
          </h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 12 }}>
            {['3-4-5', '5-12-13', '8-15-17', '7-24-25', '9-40-41'].map(triple => (
              <span key={triple} className="badge badge-red" style={{ fontSize: '0.9rem', padding: '8px 14px' }}>
                {triple}
              </span>
            ))}
          </div>
          <div style={{ marginBottom: 12 }}>
            <Formula tex="a^2 + b^2 = c^2" display />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <GeoVisual type="pythagoras" data={{ a: 3, b: 4, c: 5 }} width={200} height={160} />
            <GeoVisual type="pythagoras" data={{ a: 5, b: 12, c: 13 }} width={240} height={160} />
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-tertiary)', marginTop: 8, textAlign: 'center' }}>
            Kalau lihat 5 dan 13 di soal → langsung tahu yang lain 12!
          </p>
        </div>
      )}

      {/* Formula Cards by Topic */}
      {filtered.map(topik => (
        <motion.div
          key={topik.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card" style={{ marginBottom: 16 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: '1.4rem' }}>{topik.icon}</span>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{topik.title}</h2>
            <span className={`badge ${topik.tier === 'S' ? 'badge-red' : topik.tier === 'A' ? 'badge-yellow' : 'badge-blue'}`}>
              Tier {topik.tier}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10 }}>
            {topik.formulas.map((f, i) => (
              <div key={i} className="formula-card">
                <div className="formula-name">{f.name}</div>
                <div className="formula-text">{f.formula}</div>
                {f.note && <div className="formula-note">💡 {f.note}</div>}
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Jebakan */}
      <div className="card" style={{ borderLeft: '4px solid var(--warning)' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: 12, color: 'var(--warning)' }}>
          🚨 Jebakan Soal yang Sering Muncul
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { trap: '"Ditambah" vs "Menjadi"', desc: 'Soal kerja: "ditambah" = total baru, bukan selisih' },
            { trap: 'Satuan berbeda', desc: 'Pastikan satuan sama: cm vs m, gram vs kg, menit vs jam' },
            { trap: 'Diskon % dari harga berbeda', desc: 'Diskon 20% + 30% BUKAN 50%!' },
            { trap: 'Diagram: nilai vs frekuensi', desc: 'Cek sumbu mana yang menunjukkan apa' },
            { trap: 'Luas daerah arsir', desc: 'Harus dikurangi/ditambah bagian tertentu' },
          ].map((item, i) => (
            <div key={i} style={{
              padding: '10px 14px', background: 'var(--bg-tertiary)',
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: 2 }}>⚠️ {item.trap}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
