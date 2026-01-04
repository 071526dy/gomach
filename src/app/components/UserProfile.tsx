import { useState } from 'react';
import { User, MapPin, Calendar, Dumbbell, Award, Target, TrendingUp, GraduationCap, BookOpen, X, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  onBack: () => void;
}

export function UserProfile({ onBack }: UserProfileProps) {
  const { user, updateProfile, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(user);

  if (!user) return null;

  const levels = ['初心者', '中級者', '上級者', 'エキスパート'];
  const snsTypes = [
    { id: 'instagram', label: 'Instagram', icon: '📸' },
    { id: 'x', label: 'X (Twitter)', icon: '🐦' },
    { id: 'threads', label: 'Threads', icon: '🧵' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'other', label: 'その他', icon: '🔗' }
  ];

  const handleSave = () => {
    if (editForm) {
      updateProfile(editForm);
      setIsEditing(false);
    }
  };

  const categories = ['脚', '背中', '胸', '上半身', '有酸素', 'フリーウェイト', 'マシン'];
  const stations = ['渋谷', '新宿', '恵比寿', '表参道', '池袋', '中目黒', '原宿'];
  const days = ['月', '火', '水', '木', '金', '土', '日'];

  const toggleCategory = (cat: string) => {
    if (!editForm) return;
    const current = editForm.preferredCategories || [];
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    setEditForm({ ...editForm, preferredCategories: updated });
  };

  const toggleDay = (day: string) => {
    if (!editForm) return;
    const current = editForm.preferredDays || [];
    const updated = current.includes(day)
      ? current.filter(d => d !== day)
      : [...current, day];
    setEditForm({ ...editForm, preferredDays: updated });
  };

  const addSns = () => {
    if (!editForm) return;
    const current = editForm.snsAccounts || [];
    setEditForm({ ...editForm, snsAccounts: [...current, { type: 'instagram', url: '' }] });
  };

  const updateSns = (index: number, field: string, value: string) => {
    if (!editForm) return;
    const updated = [...(editForm.snsAccounts || [])];
    updated[index] = { ...updated[index], [field]: value };
    setEditForm({ ...editForm, snsAccounts: updated });
  };

  const removeSns = (index: number) => {
    if (!editForm) return;
    setEditForm({ ...editForm, snsAccounts: (editForm.snsAccounts || []).filter((_, i) => i !== index) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <div className="max-w-md mx-auto px-6 py-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>←</span>
            <span>戻る</span>
          </button>
          <h1 className="text-slate-900 text-lg font-bold">
            {isEditing ? 'プロフィール編集' : 'マイプロフィール'}
          </h1>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-cyan-500 text-white rounded-full font-bold flex items-center gap-1 shadow-lg shadow-cyan-200"
            >
              <Check className="size-4" />
              保存
            </button>
          ) : (
            <button
              onClick={() => {
                setEditForm(user);
                setIsEditing(true);
              }}
              className="text-cyan-600 font-medium"
            >
              編集
            </button>
          )}
        </div>

        {/* プロフィールカード */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-xl border border-slate-100">
          {/* アイコンと基本情報 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl shadow-inner border-4 border-white">
              {user.gender === '女性' ? '🧘‍♀️' : '💪'}
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editForm?.name || ''}
                  onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                  className="w-full text-2xl font-bold text-slate-900 mb-1 border-b-2 border-cyan-400 focus:outline-none bg-slate-50 px-2 py-1"
                />
              ) : (
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h2>
              )}
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="size-4 text-cyan-500" />
                {isEditing ? (
                  <select
                    value={editForm?.area || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, area: e.target.value } : null)}
                    className="text-sm bg-slate-50 border-b border-slate-300 focus:outline-none py-1"
                  >
                    {stations.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                ) : (
                  <span className="text-sm font-medium">{user.area}エリア</span>
                )}
              </div>
            </div>
          </div>

          {/* ステータス (モックデータ) */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600 mb-1">84</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ワークアウト</div>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">マッチング</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">1</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">達成ゴール</div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-8">
            {/* 性別 */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 mb-3">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <User className="size-4 text-blue-500" />
                </div>
                <span className="font-bold text-sm">性別</span>
              </div>
              <div className="ml-10">
                {isEditing ? (
                  <div className="flex gap-2">
                    {['男性', '女性', '回答しない'].map(g => (
                      <button
                        key={g}
                        onClick={() => setEditForm(prev => prev ? { ...prev, gender: g } : null)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${editForm?.gender === g
                          ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/30'
                          : 'bg-white border-slate-200 text-slate-400'
                          }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm font-medium text-slate-700">{user.gender || '未設定'}</span>
                )}
              </div>
            </div>

            {/* SNS */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 mb-3">
                <div className="p-1.5 bg-indigo-50 rounded-lg">
                  <BookOpen className="size-4 text-indigo-500" />
                </div>
                <span className="font-bold text-sm">SNSリンク</span>
              </div>
              <div className="ml-10 space-y-3">
                {isEditing ? (
                  <>
                    {(editForm?.snsAccounts || []).map((sns, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <select
                          value={sns.type}
                          onChange={(e) => updateSns(idx, 'type', e.target.value as any)}
                          className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-sm"
                        >
                          {snsTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.icon}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={sns.url}
                          onChange={(e) => updateSns(idx, 'url', e.target.value)}
                          placeholder="URLを入力"
                          className="flex-1 text-xs border-b border-slate-200 py-1 focus:outline-none focus:border-cyan-500 bg-transparent"
                        />
                        <button onClick={() => removeSns(idx)} className="text-slate-300 hover:text-red-500 text-lg">×</button>
                      </div>
                    ))}
                    <button
                      onClick={addSns}
                      className="w-full py-2 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-[10px] text-slate-500 hover:bg-slate-100"
                    >
                      + SNSを追加
                    </button>
                  </>
                ) : (
                  <div className="flex flex-wrap gap-3">
                    {user.snsAccounts && user.snsAccounts.length > 0 ? (
                      user.snsAccounts.map((sns, idx) => {
                        const type = snsTypes.find(t => t.id === sns.type);
                        return (
                          <a
                            key={idx}
                            href={sns.url.startsWith('http') ? sns.url : `https://${sns.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-slate-100 rounded-full hover:bg-cyan-100 transition-colors"
                            title={type?.label}
                          >
                            <span className="text-lg">{type?.icon}</span>
                          </a>
                        );
                      })
                    ) : (
                      <span className="text-slate-400 text-xs italic">未設定</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* よく使う場所 */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 mb-3">
                <div className="p-1.5 bg-red-50 rounded-lg">
                  <MapPin className="size-4 text-red-500" />
                </div>
                <span className="font-bold text-sm">よく使う場所 (ジム名など)</span>
              </div>
              <div className="ml-10">
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm?.preferredGyms?.join(', ') || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, preferredGyms: e.target.value.split(/[,、\s]+/).filter(g => g.trim()) } : null)}
                    placeholder="ジム名をカンマ区切りで入力"
                    className="w-full text-sm border-b border-slate-200 py-1 focus:outline-none focus:border-cyan-500 bg-slate-50 px-2"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {user.preferredGyms && user.preferredGyms.length > 0 ? (
                      user.preferredGyms.map((gym, idx) => (
                        <span key={idx} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                          {gym}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">未設定</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* トレーニング日 */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 mb-3">
                <div className="p-1.5 bg-purple-50 rounded-lg">
                  <Calendar className="size-4 text-purple-500" />
                </div>
                <span className="font-bold text-sm">普段トレーニングする曜日</span>
              </div>
              <div className="ml-10 flex flex-wrap gap-2">
                {days.map(day => {
                  const isSelected = isEditing
                    ? editForm?.preferredDays?.includes(day)
                    : user.preferredDays?.includes(day);

                  return (
                    <button
                      key={day}
                      disabled={!isEditing}
                      onClick={() => toggleDay(day)}
                      className={`size-9 rounded-full text-xs font-bold transition-all flex items-center justify-center border ${isSelected
                        ? 'bg-purple-500 border-purple-500 text-white shadow-md shadow-purple-500/30'
                        : 'bg-white border-slate-200 text-slate-400'
                        }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* トレーニングカテゴリ */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 mb-3">
                <div className="p-1.5 bg-orange-50 rounded-lg">
                  <Dumbbell className="size-4 text-orange-500" />
                </div>
                <span className="font-bold text-sm">よくやるカテゴリ</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-10">
                {(isEditing ? categories : user.preferredCategories).map((cat) => {
                  const isSelected = isEditing
                    ? editForm?.preferredCategories.includes(cat)
                    : user.preferredCategories.includes(cat);

                  return (
                    <button
                      key={cat}
                      disabled={!isEditing}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${isSelected
                        ? 'bg-orange-400 border-orange-400 text-white shadow-md shadow-orange-400/30'
                        : 'bg-white border-slate-200 text-slate-500'
                        }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* トレーニングレベル */}
            <div>
              <div className="flex items-center gap-2 text-slate-800 mb-3">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <TrendingUp className="size-4 text-blue-500" />
                </div>
                <span className="font-bold text-sm">レベル</span>
              </div>
              <div className="ml-10">
                {isEditing ? (
                  <select
                    value={editForm?.experienceLevel || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, experienceLevel: e.target.value } : null)}
                    className="w-full bg-slate-50 border-b border-slate-300 focus:outline-none py-2 text-sm font-bold text-slate-700 px-2"
                  >
                    <option value="初心者">初心者</option>
                    <option value="中級者">中級者</option>
                    <option value="上級者">上級者</option>
                    <option value="エキスパート">エキスパート</option>
                  </select>
                ) : (
                  <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-extrabold border border-blue-100 uppercase tracking-tight">
                    {user.experienceLevel}
                  </span>
                )}
              </div>
            </div>

            {/* デザイン調整用の区切り */}
            <div className="border-t border-slate-100 pt-6">
              <button
                onClick={logout}
                className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors shadow-sm"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}