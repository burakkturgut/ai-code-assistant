import React from 'react';
import {
    SiJavascript,
    SiTypescript,
    SiPython,
    SiCplusplus,
    SiHtml5,
    SiCss3
} from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { TbBrandCSharp } from 'react-icons/tb';
import ThemeToggle from './ThemeToggle';
import type { ThemeMode, ThemeColor } from './ThemeToggle';
import '../styles/Header.css';

type IconComponent = React.ComponentType<{ className?: string; size?: string | number }>;

interface Language {
    value: string;
    label: string;
    icon: IconComponent;
    color: string;
    textColor: string;
}

const LANGUAGES: Language[] = [
    {
        value: 'javascript',
        label: 'JavaScript',
        icon: SiJavascript,
        color: '#f7df1e',
        textColor: '#000000'
    },
    {
        value: 'typescript',
        label: 'TypeScript',
        icon: SiTypescript,
        color: '#3178c6',
        textColor: '#ffffff'
    },
    {
        value: 'python',
        label: 'Python',
        icon: SiPython,
        color: '#3776ab',
        textColor: '#ffffff'
    },
    {
        value: 'java',
        label: 'Java',
        icon: FaJava,
        color: '#f89820',
        textColor: '#ffffff'
    },
    {
        value: 'cpp',
        label: 'C++',
        icon: SiCplusplus,
        color: '#00599c',
        textColor: '#ffffff'
    },
    {
        value: 'csharp',
        label: 'C#',
        icon: TbBrandCSharp,
        color: '#239120',
        textColor: '#ffffff'
    },
    {
        value: 'html',
        label: 'HTML',
        icon: SiHtml5,
        color: '#e34f26',
        textColor: '#ffffff'
    },
    {
        value: 'css',
        label: 'CSS',
        icon: SiCss3,
        color: '#1572b6',
        textColor: '#ffffff'
    },
];

interface HeaderProps {
    backendConnected: boolean | null;
    language: string;
    themeMode: ThemeMode;
    themeColor: ThemeColor;
    onLanguageChange: (language: string) => void;
    onThemeModeChange: (mode: ThemeMode) => void;
    onThemeColorChange: (color: ThemeColor) => void;
}

const LanguageIcon = ({ lang }: { lang: Language }) => {
    const IconComponent = lang.icon;
    return <IconComponent />;
};

const Header: React.FC<HeaderProps> = ({
    backendConnected,
    language,
    themeMode,
    themeColor,
    onLanguageChange,
    onThemeModeChange,
    onThemeColorChange
}) => {
    const getCurrentLanguage = (): Language | undefined =>
        LANGUAGES.find(l => l.value === language);

    return (
        <header className="app-header">
            <div className="app-title">
                AI Code Assistant
                {backendConnected === false && (
                    <span className="connection-badge disconnected">⚠️ Bağlantı Yok</span>
                )}
                {backendConnected === true && (
                    <span className="connection-badge connected">✓ Bağlı</span>
                )}
            </div>
            <div className="header-controls">
                <ThemeToggle
                    mode={themeMode}
                    color={themeColor}
                    onModeChange={onThemeModeChange}
                    onColorChange={onThemeColorChange}
                />

                <div className="language-label">
                    <span className="language-label-text">Programlama Dili</span>
                    <span className="language-label-arrow">→</span>
                </div>
                <div className="language-selector-wrapper">
                    <div className="current-language">
                        <span
                            className="lang-icon-badge"
                            style={{
                                backgroundColor: getCurrentLanguage()?.color,
                            }}
                        >
                            {getCurrentLanguage() && <LanguageIcon lang={getCurrentLanguage()!} />}
                        </span>
                        <span className="lang-name">
                            {getCurrentLanguage()?.label}
                        </span>
                    </div>
                    <select
                        className="language-dropdown"
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value)}
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.value} value={lang.value}>
                                {lang.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </header>
    );
};

export default Header;
export { LANGUAGES };
export type { Language };