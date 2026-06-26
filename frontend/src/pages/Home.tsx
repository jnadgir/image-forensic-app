import { useState, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

interface AnalysisResult {
    id: string;
    imageName: string;
    imageUrl: string;
    isAiGenerated: boolean;
    aiScore: number;
    verdict: string;
    createdAt: string;
}

const Home = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string>('');
    const [scanFrame, setScanFrame] = useState<number>(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { token } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setSelectedFile(file);
        setResult(null);
        setError('');
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;
        if (!file.type.match(/image\/(jpeg|jpg|png|webp)/)) {
            setError('Only jpeg, jpg, png, webp files are allowed');
            return;
        }
        setSelectedFile(file);
        setResult(null);
        setError('');
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const startScanAnimation = () => {
        let frame = 0;
        scanIntervalRef.current = setInterval(() => {
            frame = (frame + 1) % 6;
            setScanFrame(frame);
        }, 150);
    };

    const stopScanAnimation = () => {
        if (scanIntervalRef.current) {
            clearInterval(scanIntervalRef.current);
            scanIntervalRef.current = null;
        }
        setScanFrame(0);
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError('Please select an image first');
            return;
        }
        setLoading(true);
        setError('');
        setResult(null);
        startScanAnimation();

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            const response = await axios.post(
                'http://localhost:5000/api/analysis/analyze',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setResult(response.data.result);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Analysis failed. Please try again.');
        } finally {
            setLoading(false);
            stopScanAnimation();
        }
    };

    const renderPixelGrid = () => {
        const pixels = [];
        const rows = 8;
        const cols = 12;
        for (let i = 0; i < rows * cols; i++) {
            const isActive = Math.sin(i + scanFrame * 3) > 0.3;
            pixels.push(
                <div
                    key={i}
                    style={{
                        width: '100%',
                        paddingBottom: '100%',
                        backgroundColor: isActive
                            ? `hsl(${200 + scanFrame * 20}, 100%, 60%)`
                            : 'rgba(255,255,255,0.04)',
                        borderRadius: '2px',
                        transition: 'background-color 0.1s',
                    }}
                />
            );
        }
        return pixels;
    };

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
                maxWidth: '760px',
                margin: '0 auto',
                padding: '2.5rem 2rem',
                fontFamily: "'Space Grotesk', sans-serif",
            }}>

                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        fontSize: '2rem',
                        letterSpacing: '-0.02em',
                        color: '#ffffff',
                        marginBottom: '0.6rem',
                        lineHeight: 1.2,
                    }}>
                        Image Forensic Analyzer
                    </h1>
                    <p style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 400,
                        fontSize: '0.95rem',
                        color: '#6b7280',
                        letterSpacing: '0.01em',
                    }}>
                        Upload an image to detect if it is AI generated
                    </p>
                </div>

                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                        border: '2px dashed #2d3748',
                        borderRadius: '14px',
                        padding: preview ? '1.5rem' : '3.5rem 2rem',
                        textAlign: 'center',
                        cursor: 'pointer',
                        backgroundColor: '#111827',
                        marginBottom: '1.5rem',
                        transition: 'border-color 0.2s',
                    }}
                >
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            style={{
                                maxHeight: '280px',
                                maxWidth: '100%',
                                borderRadius: '10px',
                                objectFit: 'contain',
                            }}
                        />
                    ) : (
                        <>
                            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.6 }}>
                                📁
                            </div>
                            <p style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 500,
                                color: '#9ca3af',
                                fontSize: '0.95rem',
                                marginBottom: '0.4rem',
                            }}>
                                Drag and drop an image here, or click to select
                            </p>
                            <p style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontWeight: 400,
                                color: '#4b5563',
                                fontSize: '0.8rem',
                                letterSpacing: '0.02em',
                            }}>
                                Supports: JPG, PNG, WEBP — Max 10MB
                            </p>
                        </>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {error && (
                    <p style={{
                        fontFamily: "'Space Mono', monospace",
                        color: '#ff4444',
                        textAlign: 'center',
                        fontSize: '0.85rem',
                        marginBottom: '1rem',
                    }}>
                        {error}
                    </p>
                )}

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <button
                        onClick={handleAnalyze}
                        disabled={loading || !selectedFile}
                        style={{
                            padding: '0.75rem 3rem',
                            fontSize: '0.85rem',
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 600,
                            letterSpacing: '0.08em',
                            backgroundColor: loading || !selectedFile ? '#1f2937' : '#2563eb',
                            color: loading || !selectedFile ? '#4b5563' : '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: loading || !selectedFile ? 'not-allowed' : 'pointer',
                            transition: 'background-color 0.2s',
                        }}
                    >
                        {loading ? 'ANALYZING...' : 'ANALYZE IMAGE'}
                    </button>
                </div>

                {loading && (
                    <div style={{
                        backgroundColor: '#0d1117',
                        border: '1px solid #1f2937',
                        borderRadius: '14px',
                        padding: '2rem',
                        marginBottom: '2rem',
                        textAlign: 'center',
                    }}>
                        <p style={{
                            fontFamily: "'Space Mono', monospace",
                            color: '#3b82f6',
                            marginBottom: '1.5rem',
                            letterSpacing: '0.1em',
                            fontSize: '0.8rem',
                            fontWeight: 500,
                        }}>
                            {[
                                'INITIALIZING SCAN...',
                                'READING PIXELS...',
                                'ANALYZING PATTERNS...',
                                'CHECKING AI SIGNATURES...',
                                'COMPUTING RESULTS...',
                                'FINALIZING...',
                            ][scanFrame]}
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(12, 1fr)',
                            gap: '3px',
                            maxWidth: '280px',
                            margin: '0 auto 1.5rem',
                        }}>
                            {renderPixelGrid()}
                        </div>

                        <p style={{
                            fontFamily: "'Space Mono', monospace",
                            color: '#374151',
                            fontSize: '0.72rem',
                            letterSpacing: '0.08em',
                        }}>
                            PLEASE WAIT — DO NOT CLOSE THIS PAGE
                        </p>
                    </div>
                )}

                {result && (
                    <div style={{
                        backgroundColor: '#0d1117',
                        border: `1.5px solid ${getVerdictColor(result.isAiGenerated)}`,
                        borderRadius: '14px',
                        padding: '1.8rem',
                        fontFamily: "'Space Mono', monospace",
                    }}>
                        <div style={{
                            borderBottom: '1px solid #1f2937',
                            paddingBottom: '1rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{
                                fontFamily: "'Space Mono', monospace",
                                color: getVerdictColor(result.isAiGenerated),
                                fontWeight: 700,
                                fontSize: '0.8rem',
                                letterSpacing: '0.12em',
                            }}>
                                — FORENSIC ANALYSIS REPORT —
                            </span>
                            <span style={{
                                backgroundColor: getVerdictColor(result.isAiGenerated),
                                color: '#000000',
                                padding: '0.2rem 0.7rem',
                                borderRadius: '4px',
                                fontSize: '0.65rem',
                                fontWeight: 700,
                                letterSpacing: '0.1em',
                                fontFamily: "'Space Grotesk', sans-serif",
                            }}>
                                OFFICIAL
                            </span>
                        </div>

                        <div style={{ display: 'grid', gap: '0.9rem' }}>
                            {[
                                { label: 'File Name', value: result.imageName, color: '#e5e7eb' },
                                { label: 'Classification', value: result.verdict.toUpperCase(), color: getVerdictColor(result.isAiGenerated), bold: true },
                                { label: 'Confidence', value: `${(result.aiScore * 100).toFixed(1)}%`, color: '#e5e7eb' },
                                { label: 'Risk Level', value: getRiskLevel(result.aiScore), color: getVerdictColor(result.isAiGenerated), bold: true },
                                { label: 'Date Analyzed', value: new Date(result.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }), color: '#e5e7eb' },
                            ].map((row) => (
                                <div key={row.label} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontSize: '0.82rem',
                                }}>
                                    <span style={{ color: '#6b7280', letterSpacing: '0.03em' }}>
                                        │ {row.label}
                                    </span>
                                    <span style={{
                                        color: row.color,
                                        fontWeight: row.bold ? 700 : 400,
                                        letterSpacing: row.bold ? '0.06em' : '0.02em',
                                    }}>
                                        {row.value}
                                    </span>
                                </div>
                            ))}

                            <div style={{ marginTop: '0.4rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.5rem',
                                    fontSize: '0.78rem',
                                }}>
                                    <span style={{ color: '#6b7280', letterSpacing: '0.03em' }}>│ AI Probability</span>
                                    <span style={{ color: '#e5e7eb' }}>{(result.aiScore * 100).toFixed(1)}%</span>
                                </div>
                                <div style={{
                                    backgroundColor: '#1f2937',
                                    borderRadius: '4px',
                                    height: '6px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{
                                        width: `${result.aiScore * 100}%`,
                                        height: '100%',
                                        backgroundColor: getVerdictColor(result.isAiGenerated),
                                        borderRadius: '4px',
                                        transition: 'width 1s ease',
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            borderTop: '1px solid #1f2937',
                            marginTop: '1.5rem',
                            paddingTop: '1rem',
                            fontFamily: "'Space Grotesk', sans-serif",
                            color: '#374151',
                            fontSize: '0.7rem',
                            textAlign: 'center',
                            letterSpacing: '0.06em',
                            fontWeight: 500,
                        }}>
                            POWERED BY SIGHTENGINE AI DETECTION — IMAGE FORENSIC APP
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Home;