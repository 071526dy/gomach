
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

export function Welcome() {
    const { login } = useAuth();
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [area, setArea] = useState('渋谷');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [experienceLevel, setExperienceLevel] = useState('初心者');
    const [gyms, setGyms] = useState('');
    const [selectedDays, setSelectedDays] = useState<string[]>([]);

    const categories = ['脚', '背中', '胸', '上半身', '有酸素', 'フリーウェイト', 'マシン'];
    const levels = ['初心者', '中級者', '上級者', 'エキスパート'];
    const days = ['月', '火', '水', '木', '金', '土', '日'];

    const handleStart = () => {
        if (!name.trim()) {
            alert('名前を入力してください');
            setStep(1);
            return;
        }

        login({
            name,
            area,
            nearbyStations: area === '渋谷' ? ['渋谷', '恵比寿', '表参道', '原宿'] : [area],
            experienceLevel,
            preferredTime: '午後 (18:00-21:00)',
            preferredCategories: selectedCategories.length > 0 ? selectedCategories : ['胸', '背中'],
            companionStyle: '入口から一緒に入れたらOK',
            gender: '未設定',
            genderPreference: '指定なし',
            preferredDays: selectedDays,
            preferredGyms: gyms.split(/[,、\s]+/).filter(g => g.trim()),
        });
    };

    const toggleCategory = (cat: string) => {
        setSelectedCategories(prev =>
            prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
        );
    };

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 flex flex-col items-center justify-center px-6 text-white py-12">
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-black mb-2 tracking-tighter">Gomach</h1>
                <p className="text-cyan-100 text-sm">理想のジム仲間を見つけよう</p>
            </div>

            <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/20 shadow-2xl">
                {/* プログレスバー */}
                <div className="flex gap-1.5 mb-8 justify-center">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i ? 'w-8 bg-cyan-400' : 'w-4 bg-white/20'}`} />
                    ))}
                </div>

                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-center text-white">基本情報を教えてください</h2>
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">ニックネーム</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="例：ニック"
                                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all font-medium"
                            />
                        </div>
                        <div className="mb-8">
                            <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">活動エリア</label>
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
                            onClick={() => setStep(2)}
                            disabled={!name.trim()}
                            className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            次へ <ChevronRight className="size-5" />
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-center text-white">トレーニングについて</h2>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-3 ml-1">よくやるカテゴリ</label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => toggleCategory(cat)}
                                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${selectedCategories.includes(cat)
                                                ? 'bg-cyan-400 border-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                            }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-3 ml-1">レベル</label>
                            <div className="grid grid-cols-2 gap-2">
                                {levels.map(l => (
                                    <button
                                        key={l}
                                        onClick={() => setExperienceLevel(l)}
                                        className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${experienceLevel === l
                                                ? 'bg-cyan-400 border-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                            }`}
                                    >
                                        {l}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(1)}
                                className="w-1/3 bg-white/10 text-white py-4 rounded-2xl font-bold border border-white/20 flex items-center justify-center"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex-1 bg-white text-blue-600 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                次へ <ChevronRight className="size-5" />
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-xl font-bold mb-6 text-center text-white">いつどこで？</h2>

                        <div className="mb-6">
                            <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-2 ml-1">よく使う場所 (ジム名など)</label>
                            <input
                                type="text"
                                value={gyms}
                                onChange={(e) => setGyms(e.target.value)}
                                placeholder="例：Anytime 渋谷店"
                                className="w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/30 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:bg-white/20 transition-all font-medium"
                            />
                        </div>

                        <div className="mb-8">
                            <label className="block text-xs font-bold text-cyan-200 uppercase tracking-widest mb-3 ml-1">トレーニングする曜日</label>
                            <div className="flex gap-1.5 justify-between">
                                {days.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(day)}
                                        className={`size-10 rounded-full text-xs font-bold border transition-all flex items-center justify-center ${selectedDays.includes(day)
                                                ? 'bg-cyan-400 border-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                                                : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep(2)}
                                className="w-1/3 bg-white/10 text-white py-4 rounded-2xl font-bold border border-white/20 flex items-center justify-center"
                            >
                                <ChevronLeft className="size-5" />
                            </button>
                            <button
                                onClick={handleStart}
                                className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-cyan-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                <Check className="size-5" />
                                はじめる
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <p className="mt-8 text-white/40 text-[10px] uppercase tracking-widest font-bold">
                By joining Gomach, you agree to our terms
            </p>
        </div>
    );
}
