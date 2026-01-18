import { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { analyzeCode, checkBackendHealth, APIError } from './services/api';
import './styles/App.css';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];

function App() {
  const [code, setCode] = useState('// Write your code here...\n');
  const [language, setLanguage] = useState('javascript');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [error, setError] = useState('');
  const [backendConnected, setBackendConnected] = useState<boolean | null>(null);

  // Backend bağlantısını kontrol et
  useEffect(() => {
    checkBackendHealth().then(setBackendConnected);
  }, []);

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
    setError(''); // Kod değişince hata mesajını temizle
  };

  const handleAnalyze = async (action: 'explain' | 'find_bugs' | 'improve') => {
    if (!code.trim() || code === '// Write your code here...\n') {
      setError('Please write some code first!');
      setAiResponse('');
      return;
    }

    setIsLoading(true);
    setAiResponse('');
    setError('');

    try {
      const result = await analyzeCode({
        code,
        language,
        action,
      });

      setAiResponse(result.response);
      setBackendConnected(true);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
        if (err.message.includes('Cannot connect')) {
          setBackendConnected(false);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error('Error analyzing code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionTitle = (action: string) => {
    const titles = {
      explain: 'Code Explanation',
      find_bugs: 'Bug Analysis',
      improve: 'Code Improvements',
    };
    return titles[action as keyof typeof titles] || 'AI Response';
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="app-title">
          AI Code Assistant
          {backendConnected === false && (
            <span style={{
              marginLeft: '12px',
              fontSize: '12px',
              color: 'var(--error)',
              fontWeight: 'normal'
            }}>
              ⚠️ Backend not connected
            </span>
          )}
          {backendConnected === true && (
            <span style={{
              marginLeft: '12px',
              fontSize: '12px',
              color: 'var(--success)',
              fontWeight: 'normal'
            }}>
              ✓ Connected
            </span>
          )}
        </div>
        <div className="header-controls">
          <select
            className="language-selector"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Editor Panel */}
        <div className="editor-panel">
          <div className="editor-toolbar">
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              {language.toUpperCase()}
            </span>
          </div>
          <div className="editor-wrapper">
            <Editor
              height="100%"
              language={language}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: true,
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* AI Panel */}
        <aside className="ai-panel">
          <div className="ai-panel-header">
            <span className="ai-panel-title">🤖 AI Assistant</span>
          </div>
          <div className="ai-panel-content">
            <div className="ai-actions">
              <button
                className="btn btn-primary"
                onClick={() => handleAnalyze('explain')}
                disabled={isLoading || backendConnected === false}
              >
                💡 Explain Code
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAnalyze('find_bugs')}
                disabled={isLoading || backendConnected === false}
              >
                🐛 Find Bugs
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleAnalyze('improve')}
                disabled={isLoading || backendConnected === false}
              >
                ✨ Improve Code
              </button>
            </div>

            {/* Backend bağlantı uyarısı */}
            {backendConnected === false && !isLoading && (
              <div className="ai-response" style={{ borderColor: 'var(--error)' }}>
                <div className="ai-response-title" style={{ color: 'var(--error)' }}>
                  Backend Connection Error
                </div>
                <div className="ai-response-content">
                  Cannot connect to the backend server. Please make sure:
                  <br />
                  <br />
                  1. Backend server is running (python main.py)
                  <br />
                  2. Server is running on http://localhost:8000
                  <br />
                  3. ANTHROPIC_API_KEY is configured
                </div>
              </div>
            )}

            {/* Error mesajı */}
            {error && !isLoading && (
              <div className="ai-response" style={{ borderColor: 'var(--error)' }}>
                <div className="ai-response-title" style={{ color: 'var(--error)' }}>
                  Error
                </div>
                <div className="ai-response-content">{error}</div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="ai-response">
                <div className="ai-response-loading">
                  <div className="spinner"></div>
                  <span>Analyzing code with Claude AI...</span>
                </div>
              </div>
            )}

            {/* AI Response */}
            {!isLoading && aiResponse && !error && (
              <div className="ai-response">
                <div className="ai-response-title">{getActionTitle('response')}</div>
                <div className="ai-response-content">{aiResponse}</div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !aiResponse && !error && backendConnected !== false && (
              <div className="empty-state">
                <div className="empty-state-icon">🎯</div>
                <div className="empty-state-text">
                  Write some code and click one of the buttons above to get AI assistance.
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}

export default App;