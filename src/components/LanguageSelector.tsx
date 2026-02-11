import React, { useState, useRef, useEffect } from 'react';

interface LanguageSelectorProps {
    currentLanguage: string;
    onLanguageChange: (lang: string) => void;
}

const languages = [
    { code: 'en', flag: 'gb', label: 'English' },
    { code: 'fr', flag: 'fr', label: 'Français' },
    { code: 'de', flag: 'de', label: 'Deutsch' },
    { code: 'it', flag: 'it', label: 'Italiano' },
    { code: 'es', flag: 'es', label: 'Español' }
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onLanguageChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLangObj = languages.find(l => l.code === currentLanguage) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (langCode: string) => {
        onLanguageChange(langCode);
        setIsOpen(false);
    };

    return (
        <div className="language-selector" ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
            <button
                onClick={toggleDropdown}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: '#374151', // Dark grey similar to screenshot
                    border: '1px solid #d4af37', // Gold border
                    borderRadius: '20px',
                    padding: '8px 16px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none'
                }}
            >
                <span className={`fi fi-${currentLangObj.flag}`}></span>
                <span>{currentLangObj.label}</span>
                <span style={{ fontSize: '10px', marginLeft: '4px' }}>{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    backgroundColor: '#374151',
                    border: '1px solid #4b5563',
                    borderRadius: '12px',
                    padding: '4px',
                    minWidth: '150px',
                    zIndex: 1000,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}>
                    {languages.map((lang) => (
                        <div
                            key={lang.code}
                            onClick={() => handleSelect(lang.code)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderRadius: '8px',
                                color: lang.code === currentLanguage ? '#fbbf24' : 'white', // Gold for selected
                                backgroundColor: 'transparent',
                                transition: 'background-color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                            <span className={`fi fi-${lang.flag}`}></span>
                            <span>{lang.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
