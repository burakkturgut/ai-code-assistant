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


                        quickSuggestions: {
                            other: 'on',
                            comments: 'off',
                            strings: 'on'
                        },

                        suggestOnTriggerCharacters: true,

                        wordBasedSuggestions: 'allDocuments',

                        parameterHints: {
                            enabled: true,
                            cycle: true
                        },

                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        autoSurround: 'languageDefined',

                        formatOnType: true,
                        formatOnPaste: true,
                        autoIndent: 'full',

                        renderValidationDecorations: 'on',

                        matchBrackets: 'always',
                        bracketPairColorization: {
                            enabled: true,
                            independentColorPoolPerBracketType: true
                        },

                        folding: true,
                        foldingStrategy: 'indentation',
                        showFoldingControls: 'always',

                        occurrencesHighlight: 'singleFile',
                        selectionHighlight: true,

                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',

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