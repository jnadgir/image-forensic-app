import { useNavigate, useLocation } from 'react-router-dom';

const LeftNav = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { label: 'Home', path: '/home' },
        { label: 'History', path: '/history' },
    ];

    return (
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
    );
};

export default LeftNav;