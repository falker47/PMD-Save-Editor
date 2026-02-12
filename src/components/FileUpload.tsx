import React, { useRef } from 'react';

import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../hooks/useTranslation';

interface FileUploadProps {
    onFileLoaded: (data: Uint8Array, fileName: string) => void;
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded, currentLanguage, onLanguageChange }) => {
    const { t } = useTranslation(currentLanguage);
    const fileInput = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = event.target?.result as ArrayBuffer;
            if (buffer) {
                onFileLoaded(new Uint8Array(buffer), file.name);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const buffer = event.target?.result as ArrayBuffer;
            if (buffer) {
                onFileLoaded(new Uint8Array(buffer), file.name);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1em' }}>
                <h2 style={{ margin: 0, border: 'none', padding: 0, fontSize: '1.2rem' }}>{t('LoadSaveFile')}</h2>
                <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={onLanguageChange} />
            </div>
            <div
                className="file-upload"
                onClick={() => fileInput.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    ref={fileInput}
                    style={{ display: 'none' }}
                    accept=".sav"
                    onChange={handleFileChange}
                />
                <div style={{ textAlign: 'center', pointerEvents: 'none' }}>
                    <svg
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{ marginBottom: '1rem', opacity: 0.7 }}
                    >
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <p style={{ fontSize: '1.2em', margin: '0 0 1rem 0' }}>{t('DragDropInstruction')}</p>
                    <p style={{ fontSize: '0.9em', opacity: 0.8, marginBottom: '2rem' }}>
                        {t('SupportedFormats')}
                    </p>
                </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <a
                    href="https://pokemonmysterydungeon-reversequiz.netlify.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="quiz-button"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    {t('ReverseQuiz')}
                </a>
            </div>
            <div className="card" style={{ marginTop: '0.5rem' }}>
                <div style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
                    <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.35rem', marginTop: 0, fontSize: '1.1rem' }}>
                        {t('FeaturesTitle')}
                    </h3>
                    <ul style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '0.5rem',
                        padding: 0,
                        listStyle: 'none',
                        fontSize: '0.9rem'
                    }}>
                        {['Feature1', 'Feature2', 'Feature3'].map((feature) => (
                            <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ color: '#4CAF50' }}>✓</span> {t(feature)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{
                    marginTop: '1rem',
                    padding: '0.8rem',
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid rgba(255, 193, 7, 0.3)',
                    borderRadius: '8px',
                    color: '#ffc107',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    {t('BackupWarning')}
                </div>
            </div>
        </div>
    );
};
