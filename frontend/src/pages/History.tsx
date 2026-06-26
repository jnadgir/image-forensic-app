import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

interface ScanRecord {
    id: string;
    imageName: string;
    imageUrl: string;
    isAiGenerated: boolean;
    aiScore: number;
    verdict: string;
    createdAt: string;
}

const History = () => {
    const [scans, setScans] = useState<ScanRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/analysis/history',
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setScans(response.data.results);
            } catch (err: any) {
                setError('Failed to load history. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [token]);

    const getVerdictColor = (isAiGenerated: boolean) => {
        return isAiGenerated ? '#ff4444' : '#00e676';
    };

    const getRiskLevel = (score: number): string => {
        if (score >= 0.8) return 'HIGH';
        if (score >= 0.5) return 'MEDIUM';
        if (score >= 0.3) return 'LOW';
        return 'NONE';
    };

    return (
        <Layout>
            <div style={{
                maxWidth: '860px',
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
                        Analysis History
                    </h1>
                    <p style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: '#6b7280',
                        fontSize: '0.9rem',
                    }}>
                        All your past image forensic analyses
                    </p>
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        fontFamily: "'Space Mono', monospace",
                        color: '#374151',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                    }}>
                        LOADING HISTORY...
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem',
                        fontFamily: "'Space Mono', monospace",
                        color: '#ff4444',
                        fontSize: '0.8rem',
                        letterSpacing: '0.1em',
                    }}>
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && scans.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '5rem 2rem',
                        backgroundColor: '#0d1117',
                        borderRadius: '14px',
                        border: '1px solid #1f2937',
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
                        <p style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: '#6b7280',
                            fontSize: '0.95rem',
                            marginBottom: '0.4rem',
                        }}>
                            No analyses yet
                        </p>
                        <p style={{
                            fontFamily: "'Space Mono', monospace",
                            color: '#374151',
                            fontSize: '0.75rem',
                            letterSpacing: '0.06em',
                        }}>
                            UPLOAD AN IMAGE ON THE HOME PAGE TO GET STARTED
                        </p>
                    </div>
                )}

                {/* Scan List */}
                {!loading && !error && scans.length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                            padding: '0.6rem 1.2rem',
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '0.65rem',
                            color: '#374151',
                            letterSpacing: '0.1em',
                            fontWeight: 700,
                        }}>
                            <span>FILE NAME</span>
                            <span>RESULT</span>
                            <span>CONFIDENCE</span>
                            <span>RISK</span>
                            <span>DATE</span>
                        </div>

                        {/* Scan Rows */}
                        {scans.map((scan) => (
                            <div
                                key={scan.id}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                                    padding: '1rem 1.2rem',
                                    backgroundColor: '#0d1117',
                                    border: '1px solid #1f2937',
                                    borderLeft: `3px solid ${getVerdictColor(scan.isAiGenerated)}`,
                                    borderRadius: '10px',
                                    alignItems: 'center',
                                    fontFamily: "'Space Grotesk', sans-serif",
                                    fontSize: '0.85rem',
                                    gap: '0.5rem',
                                }}
                            >
                                {/* File Name */}
                                <span style={{
                                    color: '#e5e7eb',
                                    fontWeight: 500,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                }}>
                                    {scan.imageName}
                                </span>

                                {/* Result */}
                                <span style={{
                                    color: getVerdictColor(scan.isAiGenerated),
                                    fontWeight: 700,
                                    fontSize: '0.75rem',
                                    fontFamily: "'Space Mono', monospace",
                                    letterSpacing: '0.04em',
                                }}>
                                    {scan.verdict.toUpperCase()}
                                </span>

                                {/* Confidence */}
                                <span style={{ color: '#9ca3af' }}>
                                    {(scan.aiScore * 100).toFixed(1)}%
                                </span>

                                {/* Risk */}
                                <span style={{
                                    color: getVerdictColor(scan.isAiGenerated),
                                    fontFamily: "'Space Mono', monospace",
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.04em',
                                }}>
                                    {getRiskLevel(scan.aiScore)}
                                </span>

                                {/* Date */}
                                <span style={{
                                    color: '#6b7280',
                                    fontSize: '0.8rem',
                                }}>
                                    {new Date(scan.createdAt).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default History;