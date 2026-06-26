import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/home');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#0a0a0f',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Space Grotesk', sans-serif",
            padding: '2rem',
        }}>
            {/* App Title */}
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>🔍</div>
                <h1 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: '1.8rem',
                    color: '#ffffff',
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.02em',
                }}>
                    Image Forensic App
                </h1>
                <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.72rem',
                    color: '#374151',
                    letterSpacing: '0.1em',
                }}>
                    AI IMAGE DETECTION PLATFORM
                </p>
            </div>

            {/* Login Card */}
            <div style={{
                width: '100%',
                maxWidth: '420px',
                backgroundColor: '#0d1117',
                border: '1px solid #1f2937',
                borderRadius: '16px',
                padding: '2.5rem',
            }}>
                <h2 style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600,
                    fontSize: '1.3rem',
                    color: '#ffffff',
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.01em',
                }}>
                    Welcome back
                </h2>
                <p style={{
                    color: '#6b7280',
                    fontSize: '0.85rem',
                    marginBottom: '1.8rem',
                }}>
                    Sign in to your account to continue
                </p>

                {error && (
                    <p style={{
                        fontFamily: "'Space Mono', monospace",
                        color: '#ff4444',
                        fontSize: '0.78rem',
                        marginBottom: '1rem',
                        padding: '0.8rem',
                        backgroundColor: '#ff444411',
                        borderRadius: '8px',
                        border: '1px solid #ff444433',
                    }}>
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#9ca3af',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            marginBottom: '0.5rem',
                            letterSpacing: '0.02em',
                        }}>
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 14px',
                                backgroundColor: '#111827',
                                border: '1px solid #1f2937',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'block',
                            color: '#9ca3af',
                            fontSize: '0.82rem',
                            fontWeight: 500,
                            marginBottom: '0.5rem',
                            letterSpacing: '0.02em',
                        }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                display: 'block',
                                width: '100%',
                                padding: '10px 14px',
                                backgroundColor: '#111827',
                                border: '1px solid #1f2937',
                                borderRadius: '8px',
                                color: '#ffffff',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: '0.9rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '11px',
                            backgroundColor: loading ? '#1f2937' : '#2563eb',
                            color: loading ? '#4b5563' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            letterSpacing: '0.02em',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={{
                    textAlign: 'center',
                    marginTop: '1.5rem',
                    color: '#6b7280',
                    fontSize: '0.85rem',
                }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{
                        color: '#2563eb',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}>
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;