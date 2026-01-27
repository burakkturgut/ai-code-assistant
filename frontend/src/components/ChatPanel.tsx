import React, { useRef, useEffect } from 'react';
import { User, Trash2, Copy, Sparkles, Bug, Lightbulb } from 'lucide-react';
import '../styles/ChatPanel.css';
// Robot resminizi import edin
import robotImage from '../assets/image.png'; // Resim yolunuzu buraya yazın

interface Message {
    id: number;
    type: 'user' | 'ai' | 'system';
    content: string;
    action?: string;
    timestamp: Date;
    hasCode?: boolean;
    codeToApply?: string;
}

interface ChatPanelProps {
    messages: Message[];
    isLoading: boolean;
    panelWidth: number;
    backendConnected: boolean | null;
    onClearChat: () => void;
    onCopyMessage: (content: string) => void;
    onApplyCode: (code: string) => void;
    onAnalyze: (action: 'explain' | 'find_bugs' | 'improve') => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
    messages,
    isLoading,
    panelWidth,
    backendConnected,
    onClearChat,
    onCopyMessage,
    onApplyCode,
    onAnalyze
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <aside className="chat-panel" style={{ width: `${panelWidth}px` }}>
            {/* Chat Header */}
            <div className="chat-header">
                <div className="chat-header-left">
                    <div className="ai-avatar">
                        {/* Kendi robot resminiz */}
                        <img src={robotImage} alt="AI Robot" className="robot-image" />
                    </div>
                    <div className="chat-header-text">
                        <span className="chat-title">AI Asistan</span>
                        <span className="chat-status">
                            {isLoading ? 'yazıyor...' : 'çevrimiçi'}
                        </span>
                    </div>
                </div>
                <button className="clear-chat-btn" onClick={onClearChat} title="Sohbeti Temizle">
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message message-${msg.type}`}>
                        {msg.type === 'ai' && (
                            <div className="message-avatar">
                                {/* Küçük mesaj avatarı - resim veya ikon */}
                                <img src={robotImage} alt="AI" className="robot-image-small" />
                            </div>
                        )}
                        <div className="message-content">
                            {msg.type === 'user' && <div className="message-header">Siz</div>}
                            {msg.type === 'ai' && (
                                <div className="message-header">
                                    AI Asistan
                                    <button
                                        className="copy-message-btn"
                                        onClick={() => onCopyMessage(msg.content)}
                                        title="Mesajı Kopyala"
                                    >
                                        <Copy size={12} />
                                    </button>
                                </div>
                            )}
                            <div className="message-text">{msg.content}</div>
                            {msg.hasCode && msg.codeToApply && (
                                <button
                                    className="apply-code-btn"
                                    onClick={() => onApplyCode(msg.codeToApply!)}
                                >
                                    <Sparkles size={14} />
                                    Kodu Editöre Uygula
                                </button>
                            )}
                            <div className="message-time">
                                {msg.timestamp.toLocaleTimeString('tr-TR', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                        {msg.type === 'user' && (
                            <div className="message-avatar user-avatar">
                                <User size={20} strokeWidth={2.5} />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="message message-ai">
                        <div className="message-avatar">
                            <img src={robotImage} alt="AI" className="robot-image-small" />
                        </div>
                        <div className="message-content">
                            <div className="message-header">AI Asistan</div>
                            <div className="typing-indicator">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Chat Actions */}
            <div className="chat-actions">
                <button
                    className="action-btn btn-explain"
                    onClick={() => onAnalyze('explain')}
                    disabled={isLoading || backendConnected === false}
                >
                    <Lightbulb size={22} strokeWidth={2} />
                    <span className="action-text">Kodu Açıkla</span>
                </button>
                <button
                    className="action-btn btn-bugs"
                    onClick={() => onAnalyze('find_bugs')}
                    disabled={isLoading || backendConnected === false}
                >
                    <Bug size={22} strokeWidth={2} />
                    <span className="action-text">Hata Bul</span>
                </button>
                <button
                    className="action-btn btn-improve"
                    onClick={() => onAnalyze('improve')}
                    disabled={isLoading || backendConnected === false}
                >
                    <Sparkles size={22} strokeWidth={2} />
                    <span className="action-text">Kodu İyileştir</span>
                </button>
            </div>
        </aside>
    );
};

export default ChatPanel;
export type { Message };