import { useState } from 'react';
import Editor from '@monaco-editor/react';
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

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleExplainCode = async () => {
    if (!code.trim()) {
      setAiResponse('Please write some code first!');
      return;
    }
    setIsLoading(true);
    setAiResponse('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiResponse('AI analysis will appear here once backend is connected.');
    } catch (error) {
      setAiResponse('Error: Could not analyze code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFindBugs = async () => {
    if (!code.trim()) {
      setAiResponse('Please write some code first!');
      return;
    }
    setIsLoading(true);
    setAiResponse('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiResponse('Bug analysis will appear here once backend is connected.');
    } catch (error) {
      setAiResponse('Error: Could not analyze code.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImproveCode = async () => {
    if (!code.trim()) {
      setAiResponse('Please write some code first!');
      return;
    }
    setIsLoading(true);
    setAiResponse('');
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiResponse('Code improvements will appear here once backend is connected.');
    } catch (error) {
      setAiResponse('Error: Could not analyze code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-title">AI Code Assistant</div>
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

      <main className="app-main">
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

        <aside className="ai-panel">
          <div className="ai-panel-header">
            <span className="ai-panel-title">🤖 AI Assistant</span>
          </div>
          <div className="ai-panel-content">
            <div className="ai-actions">
              <button className="btn btn-primary" onClick={handleExplainCode} disabled={isLoading}>
                💡 Explain Code
              </button>
              <button className="btn btn-primary" onClick={handleFindBugs} disabled={isLoading}>
                🐛 Find Bugs
              </button>
              <button className="btn btn-primary" onClick={handleImproveCode} disabled={isLoading}>
                ✨ Improve Code
              </button>
            </div>

            {isLoading && (
              <div className="ai-response">
                <div className="ai-response-loading">
                  <div className="spinner"></div>
                  <span>Analyzing code...</span>
                </div>
              </div>
            )}

            {!isLoading && aiResponse && (
              <div className="ai-response">
                <div className="ai-response-title">Response</div>
                <div className="ai-response-content">{aiResponse}</div>
              </div>
            )}

            {!isLoading && !aiResponse && (
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