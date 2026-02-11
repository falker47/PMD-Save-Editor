import React, { useRef } from 'react';

import { LanguageSelector } from './LanguageSelector';

interface FileUploadProps {
    onFileLoaded: (data: Uint8Array, fileName: string) => void;
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileLoaded, currentLanguage, onLanguageChange }) => {
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
                <h2 style={{ margin: 0, border: 'none', padding: 0 }}>Load Save File</h2>
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
                <p>Click or Drag & Drop to upload .sav file</p>
            </div>
        </div>
    );
};
