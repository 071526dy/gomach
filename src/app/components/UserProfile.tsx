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

  const handleSave = () => {
    if (editForm) {
      updateProfile(editForm);
      setIsEditing(false);
    }
  };

  const categories = ['脚', '背中', '胸', '上半身', '有酸素'];
  const stations = ['渋谷', '新宿', '恵比寿', '表参道', '池袋', '中目黒', '原宿'];

  const toggleCategory = (cat: string) => {
    if (!editForm) return;
    const current = editForm.preferredCategories || [];
    const updated = current.includes(cat)
      ? current.filter(c => c !== cat)
      : [...current, cat];
    setEditForm({ ...editForm, preferredCategories: updated });
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
              className="text-cyan-600 font-bold flex items-center gap-1"
            >
              <Check className="size-5" />
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
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          {/* アイコンと基本情報 */}
          <div className="flex items-center gap-4 mb-6">
            <div className="size-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white text-3xl shadow-inner">
              💪
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
                  <span>{user.area}エリア</span>
                )}
              </div>
            </div>
          </div>

          {/* ステータス (モックデータ) */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mb-6 border border-slate-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-600 mb-1">84</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">ワークアウト</div>
            </div>
            <div className="text-center border-x border-slate-200">
              <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">マッチング</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">1</div>
              <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">達成ゴール</div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-6">
            {/* エリア */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-3">
                <MapPin className="size-5 text-cyan-500" />
                <span className="font-bold text-sm">活動エリア</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-7">
                {(isEditing ? editForm?.nearbyStations : user.nearbyStations)?.map((station, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-semibold"
                  >
                    {station}
                  </span>
                ))}
              </div>
            </div>

            {/* トレーニングカテゴリ */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-3">
                <Dumbbell className="size-5 text-orange-500" />
                <span className="font-bold text-sm">よくやるカテゴリ</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-7">
                {(isEditing ? categories : user.preferredCategories).map((cat) => {
                  const isSelected = isEditing
                    ? editForm?.preferredCategories.includes(cat)
                    : user.preferredCategories.includes(cat);

                  return (
                    <button
                      key={cat}
                      disabled={!isEditing}
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isSelected
                          ? 'bg-orange-400 text-white shadow-md shadow-orange-400/30'
                          : 'bg-orange-50 text-orange-600 border border-orange-100'
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
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <TrendingUp className="size-5 text-blue-500" />
                <span className="font-bold text-sm">レベル</span>
              </div>
              <div className="ml-7">
                {isEditing ? (
                  <select
                    value={editForm?.experienceLevel || ''}
                    onChange={(e) => setEditForm(prev => prev ? { ...prev, experienceLevel: e.target.value } : null)}
                    className="w-full bg-slate-50 border-b border-slate-300 focus:outline-none py-2 text-sm text-slate-700"
                  >
                    <option value="初心者">初心者</option>
                    <option value="中級者">中級者</option>
                    <option value="上級者">上級者</option>
                    <option value="エキスパート">エキスパート</option>
                  </select>
                ) : (
                  <span className="text-slate-600 bg-blue-50 px-3 py-1 rounded-lg text-xs font-semibold text-blue-700">
                    {user.experienceLevel}
                  </span>
                )}
              </div>
            </div>

            {/* デザイン調整用の区切り */}
            <div className="border-t border-slate-100 pt-6">
              <button
                onClick={logout}
                className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 rounded-2xl border border-red-100 hover:bg-red-100 transition-colors"
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