import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';

interface Match {
  id: string;
  name: string;
  gym: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'partner';
  timestamp: string; // JSON互換のため文字列で保存
}

interface MiniChatProps {
  match: Match;
  onBack: () => void;
  onCancelMatch?: () => void;
}

export function MiniChat({ match, onBack, onCancelMatch }: MiniChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelMessage, setCancelMessage] = useState<string>('');

  // メッセージの読み込み
  useEffect(() => {
    const allMessages = storage.get<{ [matchId: string]: Message[] }>('MESSAGES') || {};
    const chatMessages = allMessages[match.id] || [
      {
        id: 'initial',
        text: '合流の調整をお願いします！',
        sender: 'partner',
        timestamp: new Date().toISOString(),
      }
    ];
    setMessages(chatMessages);
  }, [match.id]);

  // メッセージの保存
  const saveMessages = (newMessages: Message[]) => {
    const allMessages = storage.get<{ [matchId: string]: Message[] }>('MESSAGES') || {};
    allMessages[match.id] = newMessages;
    storage.set('MESSAGES', allMessages);
    setMessages(newMessages);
  };

  const detailedMessageOptions = {
    '挨拶': ['よろしくお願いします', '楽しみにしています', 'はじめまして'],
    '合流場所': ['入口前で合流', '中で合流', '受付前で合流'],
    'トレーニング': ['今日は軽めで', 'しっかり追い込みましょう', '同じメニューでやりましょう'],
    '時間調整': ['少し遅れます', '予定通り行けます', '早めに着きそうです'],
    'その他': ['ありがとうございます', 'また次回！', '今回は見送ります'],
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('挨拶');
  const [customMessage, setCustomMessage] = useState<string>('');

  const sendMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, newMessage];
    saveMessages(updatedMessages);
    setCustomMessage('');

    // シミュレーション返信
    if (text !== '今回は見送りします') {
      setTimeout(() => {
        const reply: Message = {
          id: (Date.now() + 1).toString(),
          text: '了解です！',
          sender: 'partner',
          timestamp: new Date().toISOString(),
        };
        const withReply = [...updatedMessages, reply];
        saveMessages(withReply);
      }, 1000);
    }
  };

  const handleSendCustomMessage = () => {
    if (customMessage.trim()) sendMessage(customMessage.trim());
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <button onClick={onBack} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">←</button>
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {match.name.slice(-1)}
            </div>
            <div>
              <p className="font-bold text-slate-900">{match.name}</p>
              <p className="text-xs text-slate-500">📍 {match.gym}</p>
            </div>
          </div>
          {onCancelMatch && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-xs text-red-500 font-medium px-3 py-1.5 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
            >
              解除
            </button>
          )}
        </div>
      </div>

      {/* メッセージエリア */}
      <div className="flex-1 overflow-y-auto bg-slate-50">
        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm text-sm ${message.sender === 'user'
                    ? 'bg-cyan-500 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-100'
                  }`}
              >
                <p>{message.text}</p>
                <p className={`text-[10px] mt-1 opacity-70 ${message.sender === 'user' ? 'text-white' : 'text-slate-500'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 入力エリア */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 sticky bottom-0">
        <div className="max-w-md mx-auto">
          {/* カテゴリー */}
          <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
            {Object.keys(detailedMessageOptions).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-cyan-500 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 定型文 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {detailedMessageOptions[selectedCategory as keyof typeof detailedMessageOptions].map((opt) => (
              <button
                key={opt}
                onClick={() => sendMessage(opt)}
                className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-medium hover:bg-cyan-100 transition-colors border border-cyan-100"
              >
                {opt}
              </button>
            ))}
          </div>

          {/* カスタム入力 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="メッセージを入力..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              onKeyPress={(e) => e.key === 'Enter' && handleSendCustomMessage()}
            />
            <button
              onClick={handleSendCustomMessage}
              disabled={!customMessage.trim()}
              className="px-4 py-3 bg-cyan-500 text-white rounded-xl font-bold disabled:opacity-50"
            >
              送信
            </button>
          </div>
        </div>
      </div>

      {/* 解除確認 */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-6">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 mb-2">マッチングを解除しますか？</h3>
            <p className="text-sm text-slate-500 mb-6">解除すると相手とのメッセージ履歴はリセットされます。</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  const allMessages = storage.get<{ [matchId: string]: Message[] }>('MESSAGES') || {};
                  delete allMessages[match.id];
                  storage.set('MESSAGES', allMessages);
                  onCancelMatch?.();
                  setShowCancelConfirm(false);
                }}
                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold"
              >
                解除する
              </button>
              <button onClick={() => setShowCancelConfirm(false)} className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold">キャンセル</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}