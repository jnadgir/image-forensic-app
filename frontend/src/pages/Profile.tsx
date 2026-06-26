import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

interface ProfileStats {
    totalScans: number;
    aiDetected: number;
    realImages: number;
}

interface ProfileData {
    id: string;
    name: string;
    email: string;
    createdAt: string;
}

const Profile = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [stats, setStats] = useState<ProfileStats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    // change password states
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [passwordMsg, setPasswordMsg] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    // delete account state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string>('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/auth/profile',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setProfile(response.data.user);
                setStats(response.data.stats);
            } catch (err: any) {
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleChangePassword = async () => {
        setPasswordMsg('');
        setPasswordError('');
        if (!currentPassword || !newPassword) {
            setPasswordError('Please fill in both fields');
            return;
        }
        try {
            await axios.put(
                'http://localhost:5000/api/auth/change-password',
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPasswordMsg('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
        } catch (err: any) {
            setPasswordError(err.response?.data?.message || 'Failed to change password');
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await axios.delete(
                'http://localhost:5000/api/auth/delete',
                { headers: { Authorization: `Bearer ${token}` } }
            );
            logout();
            navigate('/');
        } catch (err: any) {
            setDeleteError('Failed to delete account. Please try again.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return (
        <Layout>
            <div style={{
                textAlign: 'center',
                padding: '4rem',
                fontFamily: "'Space Mono', monospace",
                color: '#374151',
                fontSize: '0.8rem',
                letterSpacing: '0.1em',
            }}>
                LOADING PROFILE...
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div style={{
                maxWidth: '700px',
                margin: '0 auto',
                padding: '2.5rem 2rem',
                fontFamily: "'Space Grotesk', sans-serif",
            }}>

                {/* Page Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <h1 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: '1.8rem',
                        color: '#ffffff',
                        marginBottom: '0.4rem',
                        letterSpacing: '-0.02em',
                    }}>
                        My Profile
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                        Manage your account and view your stats
                    </p>
                </div>

                {error && (
                    <p style={{ color: '#ff4444', fontFamily: "'Space Mono', monospace", fontSize: '0.8rem' }}>
                        {error}
                    </p>
                )}

                {/* User Info Card */}
                {profile && (
                    <div style={{
                        backgroundColor: '#0d1117',
                        border: '1px solid #1f2937',
                        borderRadius: '14px',
                        padding: '1.8rem',
                        marginBottom: '1.5rem',
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            marginBottom: '1.5rem',
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: '#2563eb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.4rem',
                                fontWeight: 700,
                                color: '#ffffff',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}>
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p style={{
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    color: '#ffffff',
                                    marginBottom: '0.2rem',
                                }}>
                                    {profile.name}
                                </p>
                                <p style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                    {profile.email}
                                </p>
                            </div>
                        </div>

                        <div style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.72rem',
                            color: '#374151',
                            letterSpacing: '0.06em',
                            borderTop: '1px solid #1f2937',
                            paddingTop: '1rem',
                        }}>
                            MEMBER SINCE {new Date(profile.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit', month: 'long', year: 'numeric'
                            }).toUpperCase()}
                        </div>
                    </div>
                )}

                {/* Stats Card */}
                {stats && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                    }}>
                        {[
                            { label: 'TOTAL SCANS', value: stats.totalScans, color: '#2563eb' },
                            { label: 'AI DETECTED', value: stats.aiDetected, color: '#ff4444' },
                            { label: 'REAL IMAGES', value: stats.realImages, color: '#00e676' },
                        ].map((stat) => (
                            <div key={stat.label} style={{
                                backgroundColor: '#0d1117',
                                border: '1px solid #1f2937',
                                borderTop: `3px solid ${stat.color}`,
                                borderRadius: '10px',
                                padding: '1.2rem',
                                textAlign: 'center',
                            }}>
                                <p style={{
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: '2rem',
                                    fontWeight: 700,
                                    color: stat.color,
                                    marginBottom: '0.4rem',
                                }}>
                                    {stat.value}
                                </p>
                                <p style={{
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.62rem',
                                    color: '#374151',
                                    letterSpacing: '0.08em',
                                }}>
                                    {stat.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Change Password Card */}
                <div style={{
                    backgroundColor: '#0d1117',
                    border: '1px solid #1f2937',
                    borderRadius: '14px',
                    padding: '1.8rem',
                    marginBottom: '1.5rem',
                }}>
                    <h3 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#ffffff',
                        marginBottom: '1.2rem',
                        letterSpacing: '0.01em',
                    }}>
                        Change Password
                    </h3>

                    {passwordMsg && (
                        <p style={{
                            color: '#00e676',
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.78rem',
                            marginBottom: '1rem',
                        }}>
                            {passwordMsg}
                        </p>
                    )}

                    {passwordError && (
                        <p style={{
                            color: '#ff4444',
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.78rem',
                            marginBottom: '1rem',
                        }}>
                            {passwordError}
                        </p>
                    )}

                    <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            backgroundColor: '#111827',
                            border: '1px solid #1f2937',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '0.9rem',
                            marginBottom: '0.8rem',
                            outline: 'none',
                        }}
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            backgroundColor: '#111827',
                            border: '1px solid #1f2937',
                            borderRadius: '8px',
                            color: '#ffffff',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: '0.9rem',
                            marginBottom: '1rem',
                            outline: 'none',
                        }}
                    />

                    <button
                        onClick={handleChangePassword}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: '#2563eb',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            letterSpacing: '0.04em',
                        }}
                    >
                        Update Password
                    </button>
                </div>

                {/* Logout Button */}
                <div style={{
                    backgroundColor: '#0d1117',
                    border: '1px solid #1f2937',
                    borderRadius: '14px',
                    padding: '1.8rem',
                    marginBottom: '1.5rem',
                }}>
                    <h3 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#ffffff',
                        marginBottom: '0.6rem',
                    }}>
                        Logout
                    </h3>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                    }}>
                        You will be returned to the login screen.
                    </p>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: '10px 24px',
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            border: '1px solid #1f2937',
                            borderRadius: '8px',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                        }}
                    >
                        Logout
                    </button>
                </div>

                {/* Delete Account Card */}
                <div style={{
                    backgroundColor: '#0d1117',
                    border: '1px solid #ff444433',
                    borderRadius: '14px',
                    padding: '1.8rem',
                }}>
                    <h3 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 600,
                        fontSize: '1rem',
                        color: '#ff4444',
                        marginBottom: '0.6rem',
                    }}>
                        Delete Account
                    </h3>
                    <p style={{
                        color: '#6b7280',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                    }}>
                        This will permanently delete your account and all your scan history. This action cannot be undone.
                    </p>

                    {deleteError && (
                        <p style={{
                            color: '#ff4444',
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.78rem',
                            marginBottom: '1rem',
                        }}>
                            {deleteError}
                        </p>
                    )}

                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            style={{
                                padding: '10px 24px',
                                backgroundColor: 'transparent',
                                color: '#ff4444',
                                border: '1px solid #ff444433',
                                borderRadius: '8px',
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 600,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                            }}
                        >
                            Delete Account
                        </button>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <p style={{
                                fontFamily: "'Space Mono', monospace",
                                color: '#ff4444',
                                fontSize: '0.78rem',
                                letterSpacing: '0.04em',
                            }}>
                                ARE YOU SURE?
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: '#ff4444',
                                    color: '#ffffff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                style={{
                                    padding: '8px 20px',
                                    backgroundColor: 'transparent',
                                    color: '#6b7280',
                                    border: '1px solid #1f2937',
                                    borderRadius: '8px',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontWeight: 600,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;