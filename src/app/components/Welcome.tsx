
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export function Welcome() {
    const { login } = useAuth();
    const [name, setName] = useState('');
    const [area, setArea] = useState('渋谷');

    const handleStart = () => {
        if (!name.trim()) {
            alert('名前を入力してください');
            return;
        }

        login({
            name,
            area,
            nearbyStations: area === '渋谷' ? ['渋谷', '恵比寿', '表参道', '原宿'] : [area],
            experienceLevel: '初心者',
            preferredTime: '午後 (18:00-21:00)',
            preferredCategories: ['背中', '胸'],
            companionStyle: '入口から一緒に入れたらOK',
            gender: '未設定',
            genderPreference: '指定なし',
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 flex flex-col items-center justify-center px-8 text-white">
            <div className="mb-12 text-center">
                <h1 className="text-6xl font-black mb-4 tracking-tighter">Gomach</h1>
                <p className="text-cyan-100 text-lg">ジム仲間マッチングアプリ</p>
            </div>

            <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="mb-6">
                    <label className="block text-sm font-medium text-cyan-100 mb-2 ml-1">お名前</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ニックネームを入力"
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all font-medium"
                    />
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-cyan-100 mb-2 ml-1">メインの活動エリア</label>
                    <select
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all font-medium appearance-none"
                    >
                        <option value="渋谷" className="text-slate-900">渋谷</option>
                        <option value="新宿" className="text-slate-900">新宿</option>
                        <option value="池袋" className="text-slate-900">池袋</option>
                        <option value="恵比寿" className="text-slate-900">恵比寿</option>
                    </select>
                </div>

                <button
                    onClick={handleStart}
                    className="w-full bg-white text-blue-600 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                    はじめる
                </button>
            </div>

            <p className="mt-8 text-white/50 text-sm">
                登録することで利用規約に同意したことになります
            </p>
        </div>
    );
}
