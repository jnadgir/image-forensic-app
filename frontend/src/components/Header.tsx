import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div style={{
            background: '#0d1117',
            borderBottom: '1px solid #1f2937',
            color: 'white',
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        }}>
            {/* Left — Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            {/* Right — Profile */}
            <div
                onClick={() => navigate('/profile')}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #1f2937',
                    transition: 'all 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = '#1f2937';
                }}
                onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
                }}
            >
                <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#ffffff',
                    fontFamily: "'Space Grotesk', sans-serif",
                }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.85rem',
                    color: '#9ca3af',
                    fontWeight: 500,
                }}>
                    {user?.name || 'Profile'}
                </span>
            </div>
        </div>
    );
};

export default Header;