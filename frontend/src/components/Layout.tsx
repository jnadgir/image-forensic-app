import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/home' },
    { label: 'History', path: '/history' },
  ];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: '#0a0a0f',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: '#0d1117',
        borderBottom: '1px solid #1f2937',
        color: 'white',
        padding: '16px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '1.2rem' }}>🔍</span>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 600,
          fontSize: '1.1rem',
          letterSpacing: '0.02em',
          color: '#ffffff',
          margin: 0,
        }}>
          Image Forensic App
        </h2>
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar */}
        <div style={{
          width: '220px',
          minWidth: '220px',
          background: '#0d1117',
          borderRight: '1px solid #1f2937',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}>

          <p style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.65rem',
            color: '#374151',
            letterSpacing: '0.12em',
            fontWeight: 700,
            marginBottom: '8px',
            paddingLeft: '12px',
          }}>
            NAVIGATION
          </p>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? '#1f2937' : 'transparent',
                  color: isActive ? '#ffffff' : '#6b7280',
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '0.9rem',
                  letterSpacing: '0.01em',
                  borderLeft: isActive ? '3px solid #2563eb' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#111827';
                    (e.currentTarget as HTMLDivElement).style.color = '#d1d5db';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.color = '#6b7280';
                  }
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Main Content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#0a0a0f',
        }}>
          {children}
        </div>

      </div>
    </div>
  );
}

export default Layout;