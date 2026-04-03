import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { to: '/', label: 'Dashboard', icon: '🏠' },
  { to: '/materi', label: 'Materi', icon: '📚' },
  { to: '/latihan', label: 'Latihan', icon: '✏️' },
  { to: '/simulasi', label: 'Simulasi', icon: '📝' },
  { to: '/progress', label: 'Progress', icon: '📊' },
  { to: '/rumus', label: 'Rumus', icon: '⚡' },
];

export default function Layout() {
  const { darkMode, toggleDarkMode, xp, level } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <NavLink to="/" className="navbar-logo">
            <span>🎯</span>
            MathLearn
          </NavLink>

          <ul className="navbar-nav">
            {navLinks.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => isActive ? 'active' : ''}
                >
                  {link.icon} {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar-actions">
            <div className="xp-badge">
              ⭐ Lv.{level} • {xp} XP
            </div>
            <button className="dark-toggle" onClick={toggleDarkMode}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
              ☰
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <div className={`mobile-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="navbar-logo" style={{ marginBottom: 8 }}>
          <span>🎯</span>
          MathLearn
        </div>
        <div className="xp-badge" style={{ marginBottom: 16 }}>
          ⭐ Level {level} • {xp} XP
        </div>
        <nav>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <main className="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
