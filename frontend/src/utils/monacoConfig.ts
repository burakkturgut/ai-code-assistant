// Monaco Editor Dil Konfigürasyonu
import { loader } from '@monaco-editor/react';
import type * as Monaco from 'monaco-editor';

export const configureMonaco = () => {
    loader.init().then((monaco) => {
        // Python için özel keyword ve snippet'ler
        monaco.languages.registerCompletionItemProvider('python', {
            provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions = [
                    // Built-in fonksiyonlar
                    { label: 'print', kind: monaco.languages.CompletionItemKind.Function, insertText: 'print(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'input', kind: monaco.languages.CompletionItemKind.Function, insertText: 'input(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'len', kind: monaco.languages.CompletionItemKind.Function, insertText: 'len(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'range', kind: monaco.languages.CompletionItemKind.Function, insertText: 'range(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'str', kind: monaco.languages.CompletionItemKind.Function, insertText: 'str(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'int', kind: monaco.languages.CompletionItemKind.Function, insertText: 'int(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'float', kind: monaco.languages.CompletionItemKind.Function, insertText: 'float(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'list', kind: monaco.languages.CompletionItemKind.Function, insertText: 'list(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'dict', kind: monaco.languages.CompletionItemKind.Function, insertText: 'dict(${1:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'open', kind: monaco.languages.CompletionItemKind.Function, insertText: 'open(${1:}, ${2:})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },

                    // Keywords
                    { label: 'def', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'def ${1:function_name}(${2:}):\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:ClassName}:\n    def __init__(self):\n        ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while ${1:condition}:\n    ${2:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'try', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'try:\n    ${1:pass}\nexcept ${2:Exception}:\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'with', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'with ${1:expression} as ${2:variable}:\n    ${3:pass}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'import', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'import ${1:module}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'from', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'from ${1:module} import ${2:name}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                ];

                return { suggestions };
            },
        });

        // Java için özel keyword ve snippet'ler
        monaco.languages.registerCompletionItemProvider('java', {
            provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions = [
                    { label: 'System.out.println', kind: monaco.languages.CompletionItemKind.Function, insertText: 'System.out.println(${1:});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'public class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public class ${1:ClassName} {\n    ${2:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'public static void main', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public static void main(String[] args) {\n    ${1:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (${1:int i = 0}; ${2:i < length}; ${3:i++}) {\n    ${4:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'if', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'if (${1:condition}) {\n    ${2:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'while', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'while (${1:condition}) {\n    ${2:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'try catch', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'try {\n    ${1:}\n} catch (${2:Exception} e) {\n    ${3:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                ];

                return { suggestions };
            },
        });

        // C++ için özel keyword ve snippet'ler
        monaco.languages.registerCompletionItemProvider('cpp', {
            provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions = [
                    { label: '#include <iostream>', kind: monaco.languages.CompletionItemKind.Keyword, insertText: '#include <iostream>', range },
                    { label: 'std::cout', kind: monaco.languages.CompletionItemKind.Function, insertText: 'std::cout << ${1:} << std::endl;', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'std::cin', kind: monaco.languages.CompletionItemKind.Function, insertText: 'std::cin >> ${1:};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'int main', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'int main() {\n    ${1:}\n    return 0;\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (${1:int i = 0}; ${2:i < n}; ${3:i++}) {\n    ${4:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'class ${1:ClassName} {\npublic:\n    ${2:}\n};', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                ];

                return { suggestions };
            },
        });

        // C# için özel keyword ve snippet'ler
        monaco.languages.registerCompletionItemProvider('csharp', {
            provideCompletionItems: (model: Monaco.editor.ITextModel, position: Monaco.Position) => {
                const word = model.getWordUntilPosition(position);
                const range = {
                    startLineNumber: position.lineNumber,
                    endLineNumber: position.lineNumber,
                    startColumn: word.startColumn,
                    endColumn: word.endColumn,
                };

                const suggestions = [
                    { label: 'Console.WriteLine', kind: monaco.languages.CompletionItemKind.Function, insertText: 'Console.WriteLine(${1:});', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'class', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'public class ${1:ClassName} {\n    ${2:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'Main', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'static void Main(string[] args) {\n    ${1:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                    { label: 'for', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'for (${1:int i = 0}; ${2:i < length}; ${3:i++}) {\n    ${4:}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
                ];

                return { suggestions };
            },
        });
    });
};

export default configureMonaco;