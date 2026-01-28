import { useState, useEffect } from 'react';
import { analyzeCode, checkBackendHealth, APIError } from './services/api';
import Header, { LANGUAGES, type Language } from './components/Header';
import EditorPanel from './components/EditorPanel';
import ChatPanel, { type Message } from './components/ChatPanel';
import type { ThemeMode, ThemeColor } from './components/ThemeToggle';
import { configureMonaco } from './utils/monacoConfig';
import './styles/theme-variables.css';
import './styles/App.css';

const STORAGE_KEYS = {
  CODE: 'ai-code-assistant-code',
  LANGUAGE: 'ai-code-assistant-language',
  THEME_MODE: 'ai-code-assistant-theme-mode',
  THEME_COLOR: 'ai-code-assistant-theme-color',
};

function App() {
  const [code, setCode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CODE);
    return saved || '// Sistem hazır olduğunda üst kısımda "Bağlandı" ibaresini göreceksiniz.\n' +
      '// Bu mesaj göründükten sonra kodunuzu güvenle düzenleyebilirsiniz.\n\n' +
      '// Kodunuzu buraya yazın...\n' +
      '// Ardından sağ taraftaki butonlardan birini seçerek AI analizi başlatın.';
  });

  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
    return saved || 'javascript';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_MODE);
    return (saved as ThemeMode) || 'dark';
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME_COLOR);
    return (saved as ThemeColor) || 'blue';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: 'system',
      content: 'Merhaba! Ben AI Kod Asistanınızım. Size nasıl yardımcı olabilirim?\n\nKodunuzu analiz edebilirim\nHata bulabilirim\nİyileştirmeler önerebilirim',
      timestamp: new Date(),
    }
  ]);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);
  const [panelWidth, setPanelWidth] = useState(450);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-color', themeColor);
  }, [themeMode, themeColor]);

  useEffect(() => {
    configureMonaco();
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CODE, code);
  }, [code]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, themeMode);
  }, [themeMode]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME_COLOR, themeColor);
  }, [themeColor]);

  useEffect(() => {
    checkBackendHealth().then(setBackendConnected);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze('explain');
      }
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        handleAnalyze('find_bugs');
      }
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        handleAnalyze('improve');
      }
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        clearEditor();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [code, language, isLoading, backendConnected]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 380 && newWidth <= 800) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const getCurrentLanguage = (): Language | undefined =>
    LANGUAGES.find(l => l.value === language);

  const LanguageIcon = ({ lang }: { lang: Language }) => {
    const IconComponent = lang.icon;
    return <IconComponent />;
  };

  const getEditorTheme = (): string => {
    return themeMode === 'dark' ? 'vs-dark' : 'light';
  };

  const getActionText = (action: string) => {
    const texts = {
      explain: 'Kodu Açıklar Mısın?',
      find_bugs: 'Hata Bulur Musun?',
      improve: 'Kodu İyileştirir Misin?',
    };
    return texts[action as keyof typeof texts] || action;
  };

  const extractCode = (text: string, lang: string): string | null => {
    const codeBlockRegex = new RegExp(`\`\`\`${lang}\\n([\\s\\S]*?)\`\`\``, 'i');
    const match = text.match(codeBlockRegex);
    if (match) return match[1].trim();

    const anyCodeBlockRegex = /```[\w]*\n([\s\S]*?)```/;
    const anyMatch = text.match(anyCodeBlockRegex);
    if (anyMatch) return anyMatch[1].trim();

    return null;
  };

  const handleAnalyze = async (action: 'explain' | 'find_bugs' | 'improve') => {
    if (!code.trim() || code.includes('Kodunuzu buraya yazın')) {
      const errorMsg: Message = {
        id: Date.now(),
        type: 'system',
        content: 'Lütfen önce bir kod yazın!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    const userMsg: Message = {
      id: Date.now(),
      type: 'user',
      content: getActionText(action),
      action,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const result = await analyzeCode({
        code,
        language,
        action,
      });

      const extractedCode = (action === 'improve' || action === 'find_bugs')
        ? extractCode(result.response, language)
        : null;

      const aiMsg: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: result.response,
        timestamp: new Date(),
        hasCode: !!extractedCode,
        codeToApply: extractedCode || undefined,
      };
      setMessages(prev => [...prev, aiMsg]);
      setBackendConnected(true);
    } catch (err) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        type: 'system',
        content: err instanceof APIError
          ? `Hata: ${err.message}`
          : 'Beklenmeyen bir hata oluştu.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);

      if (err instanceof APIError && err.message.includes('Cannot connect')) {
        setBackendConnected(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const applyCodeToEditor = (codeToApply: string) => {
    setCode(codeToApply);
    const successMsg: Message = {
      id: Date.now(),
      type: 'system',
      content: 'Kod editöre uygulandı!',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, successMsg]);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 0,
        type: 'system',
        content: 'Sohbet temizlendi. Yeni bir analiz için hazırım!',
        timestamp: new Date(),
      }
    ]);
  };

  const clearEditor = () => {
    setCode('// Kodunuzu buraya yazın...\n');
    const msg: Message = {
      id: Date.now(),
      type: 'system',
      content: 'Editör temizlendi!',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      const msg: Message = {
        id: Date.now(),
        type: 'system',
        content: 'Kod panoya kopyalandı!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);
    } catch (err) {
      const msg: Message = {
        id: Date.now(),
        type: 'system',
        content: 'Kopyalama başarısız!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      const msg: Message = {
        id: Date.now(),
        type: 'system',
        content: 'Mesaj kopyalandı!',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, msg]);
    } catch (err) {
      console.error('Kopyalama hatası:', err);
    }
  };

  const handleLoadCode = (loadedCode: string) => {
    setCode(loadedCode);
    const msg: Message = {
      id: Date.now(),
      type: 'system',
      content: 'Dosya yüklendi!',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
  };

  return (
    <div className="app-container">
      <Header
        backendConnected={backendConnected}
        language={language}
        themeMode={themeMode}
        themeColor={themeColor}
        onLanguageChange={setLanguage}
        onThemeModeChange={setThemeMode}
        onThemeColorChange={setThemeColor}
      />

      <main className="app-main">
        <EditorPanel
          code={code}
          language={language}
          currentLanguage={getCurrentLanguage()}
          editorTheme={getEditorTheme()}
          onCodeChange={(value) => setCode(value || '')}
          onCopyCode={copyCode}
          onClearEditor={clearEditor}
          onLoadCode={handleLoadCode}
          LanguageIcon={LanguageIcon}
        />

        <div
          className="resize-handle"
          onMouseDown={() => setIsResizing(true)}
        />

        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          panelWidth={panelWidth}
          backendConnected={backendConnected}
          onClearChat={clearChat}
          onCopyMessage={copyMessage}
          onApplyCode={applyCodeToEditor}
          onAnalyze={handleAnalyze}
        />
      </main>
    </div>
  );
}

export default App;