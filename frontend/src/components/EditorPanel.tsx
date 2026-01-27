import React from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Trash2 } from 'lucide-react';
import type { Language } from './Header';
import FileManager from './FileManager';
import '../styles/EditorPanel.css';

interface EditorPanelProps {
    code: string;
    language: string;
    currentLanguage: Language | undefined;
    editorTheme: string;
    onCodeChange: (value: string | undefined) => void;
    onCopyCode: () => void;
    onClearEditor: () => void;
    onLoadCode: (code: string) => void;
    LanguageIcon: React.FC<{ lang: Language }>;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
    code,
    language,
    currentLanguage,
    editorTheme,
    onCodeChange,
    onCopyCode,
    onClearEditor,
    onLoadCode,
    LanguageIcon
}) => {
    // Monaco Editor'ün dil ID'lerini eşleştir
    const getMonacoLanguage = (lang: string): string => {
        const languageMap: Record<string, string> = {
            'javascript': 'javascript',
            'typescript': 'typescript',
            'python': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'csharp': 'csharp',
            'html': 'html',
            'css': 'css',
        };
        return languageMap[lang] || 'plaintext';
    };

    return (
        <div className="editor-panel">
            <div className="editor-toolbar">
                <span className="toolbar-label">
                    {currentLanguage && (
                        <span
                            className="toolbar-lang-badge"
                            style={{
                                backgroundColor: currentLanguage.color,
                                color: currentLanguage.textColor,
                            }}
                        >
                            <LanguageIcon lang={currentLanguage} />
                        </span>
                    )}
                    {currentLanguage?.label}
                </span>
                <div className="editor-actions">
                    <FileManager
                        code={code}
                        language={language}
                        onLoadCode={onLoadCode}
                    />
                    <button
                        className="editor-btn btn-copy"
                        onClick={onCopyCode}
                        title="Kodu Kopyala (Ctrl+C)"
                    >
                        <Copy size={16} />
                        Kopyala
                    </button>
                    <button
                        className="editor-btn btn-clear"
                        onClick={onClearEditor}
                        title="Editörü Temizle (Ctrl+K)"
                    >
                        <Trash2 size={16} />
                        Temizle
                    </button>
                </div>
            </div>
            <div className="editor-wrapper">
                <Editor
                    height="100%"
                    language={getMonacoLanguage(language)}
                    value={code}
                    onChange={onCodeChange}
                    theme={editorTheme}
                    options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        lineNumbers: 'on',
                        roundedSelection: true,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        fontLigatures: true,
                        padding: { top: 16, bottom: 16 },

                        // ✨ OTOMATIK TAMAMLAMA - TÜM DİLLER İÇİN
                        suggest: {
                            showKeywords: true,
                            showSnippets: true,
                            showClasses: true,
                            showFunctions: true,
                            showVariables: true,
                            showModules: true,
                            showProperties: true,
                            showMethods: true,
                            showValues: true,
                            showConstants: true,
                            showEnums: true,
                            showInterfaces: true,
                            showStructs: true,
                            showEvents: true,
                            showOperators: true,
                            showUnits: true,
                            showColors: true,
                            showFiles: true,
                            showReferences: true,
                            showFolders: true,
                            showTypeParameters: true,
                            showIssues: true,
                            showUsers: true,
                            insertMode: 'insert',
                            filterGraceful: true,
                            snippetsPreventQuickSuggestions: false,
                        },

                        // Otomatik öneriler - HER ŞEY AÇIK
                        quickSuggestions: {
                            other: 'on',      // Genel kod için
                            comments: 'off',   // Yorumlarda kapalı
                            strings: 'on'      // String içinde de açık
                        },

                        // Belirli karakterlerde otomatik aç
                        suggestOnTriggerCharacters: true,

                        // Kelime tabanlı öneriler
                        wordBasedSuggestions: 'allDocuments',

                        // Parametre ipuçları
                        parameterHints: {
                            enabled: true,
                            cycle: true
                        },

                        // Otomatik parantez tamamlama
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        autoSurround: 'languageDefined',

                        // Kod biçimlendirme
                        formatOnType: true,
                        formatOnPaste: true,
                        autoIndent: 'full',

                        // Hata göstergeleri
                        renderValidationDecorations: 'on',

                        // Parantez eşleştirme ve renklendirme
                        matchBrackets: 'always',
                        bracketPairColorization: {
                            enabled: true,
                            independentColorPoolPerBracketType: true
                        },

                        // Kod katlama
                        folding: true,
                        foldingStrategy: 'indentation',
                        showFoldingControls: 'always',

                        // Kelime ve seçim vurgulama
                        occurrencesHighlight: 'singleFile',
                        selectionHighlight: true,

                        // İmleç efektleri
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',

                        // Ek özellikler
                        tabCompletion: 'on',
                        acceptSuggestionOnCommitCharacter: true,
                        acceptSuggestionOnEnter: 'on',
                        snippetSuggestions: 'top',
                        wordWrap: 'off',
                        wrappingIndent: 'indent',
                    }}
                />
            </div>
        </div>
    );
};

export default EditorPanel;