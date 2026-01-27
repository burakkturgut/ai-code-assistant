import React, { useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import '../styles/FileManager.css';

interface FileManagerProps {
    code: string;
    language: string;
    onLoadCode: (code: string) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ code, language, onLoadCode }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getFileExtension = (lang: string): string => {
        const extensions: Record<string, string> = {
            javascript: 'js',
            typescript: 'ts',
            python: 'py',
            java: 'java',
            cpp: 'cpp',
            csharp: 'cs',
            html: 'html',
            css: 'css',
        };
        return extensions[lang] || 'txt';
    };

    const handleDownload = () => {
        const extension = getFileExtension(language);
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `code.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onLoadCode(content);
            };
            reader.readAsText(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="file-manager">
            <button
                className="file-btn download-btn"
                onClick={handleDownload}
                title="Kodu indir"
            >
                <Download size={16} />
                İndir
            </button>
            <button
                className="file-btn upload-btn"
                onClick={handleUpload}
                title="Dosya yükle"
            >
                <Upload size={16} />
                Yükle
            </button>
            <input
                ref={fileInputRef}
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept=".js,.ts,.py,.java,.cpp,.cs,.html,.css,.txt"
            />
        </div>
    );
};

export default FileManager;