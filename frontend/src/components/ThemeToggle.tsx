import React from 'react';
import { Moon, Sun, Palette, Check } from 'lucide-react';
import '../styles/ThemeToggle.css';

export type ThemeMode = 'dark' | 'light';
export type ThemeColor = 'blue' | 'purple' | 'green';

interface ThemeToggleProps {
    mode: ThemeMode;
    color: ThemeColor;
    onModeChange: (mode: ThemeMode) => void;
    onColorChange: (color: ThemeColor) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({
    mode,
    color,
    onModeChange,
    onColorChange
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleMode = () => {
        onModeChange(mode === 'dark' ? 'light' : 'dark');
    };

    return (
        <div className="theme-toggle-container">
            <button
                className="theme-toggle-btn"
                onClick={toggleMode}
                title={`${mode === 'dark' ? 'Açık' : 'Koyu'} temaya geç`}
            >
                {mode === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <div className="theme-color-selector">
                <button
                    className="color-picker-btn"
                    onClick={() => setIsOpen(!isOpen)}
                    title="Tema rengini değiştir"
                >
                    <Palette size={18} />
                </button>

                {isOpen && (
                    <div className="color-picker-menu">
                        <div className="color-picker-title">Tema Rengi</div>
                        <div className="color-options">
                            <button
                                className={`color-option blue ${color === 'blue' ? 'active' : ''}`}
                                onClick={() => {
                                    onColorChange('blue');
                                    setIsOpen(false);
                                }}
                                title="Mavi"
                            >
                                <span className="color-dot blue-dot"></span>
                                Mavi
                                {color === 'blue' && <Check size={14} className="check-icon" />}
                            </button>
                            <button
                                className={`color-option purple ${color === 'purple' ? 'active' : ''}`}
                                onClick={() => {
                                    onColorChange('purple');
                                    setIsOpen(false);
                                }}
                                title="Mor"
                            >
                                <span className="color-dot purple-dot"></span>
                                Mor
                                {color === 'purple' && <Check size={14} className="check-icon" />}
                            </button>
                            <button
                                className={`color-option green ${color === 'green' ? 'active' : ''}`}
                                onClick={() => {
                                    onColorChange('green');
                                    setIsOpen(false);
                                }}
                                title="Yeşil"
                            >
                                <span className="color-dot green-dot"></span>
                                Yeşil
                                {color === 'green' && <Check size={14} className="check-icon" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThemeToggle;