import { useState, useEffect } from 'react';
import en from '../locales/en.json';
import de from '../locales/de.json';
import es from '../locales/es.json';
import fr from '../locales/fr.json';
import it from '../locales/it.json';

const locales: Record<string, any> = {
    en,
    de,
    es,
    fr,
    it
};

export const useTranslation = (lang: string) => {
    const [locale, setLocale] = useState(en);

    useEffect(() => {
        if (locales[lang]) {
            setLocale(locales[lang]);
        } else {
            setLocale(en);
        }
    }, [lang]);

    const t = (key: string) => {
        return locale[key as keyof typeof en] || key;
    };

    return { t };
};
