import { useState } from 'react';
import { Heart, User, MapPin, Dumbbell, Calendar } from 'lucide-react';

interface GoMembersProps {
  onBack: () => void;
}

interface GoMember {
  id: string;
  name: string;
  area: string;
  compatibility: number;
  experienceLevel: string;
  preferredCategories: string[];
  addedDate: Date;
  totalWorkouts: number;
  lastWorkout?: Date;
}

export function GoMembers({ onBack }: GoMembersProps) {
  // モックデータ
  const [goMembers] = useState<GoMember[]>([]);

  const getExperienceLevelEmoji = (level: string) => {
    const levels: { [key: string]: string } = {
      '初心者': '🌱',
      '中級者': '💪',
      '上級者': '🏋️',
      'エキスパート': '⭐',
    };
    return levels[level] || '💪';
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return '今日';
    if (diffDays === 1) return '昨日';
    if (diffDays < 7) return `${diffDays}日前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
    return `${Math.floor(diffDays / 30)}ヶ月前`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-6 py-6 pb-24">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <span>←</span>
            <span>戻る</span>
          </button>
          <h1 className="text-slate-900">Goとも</h1>
          <div className="w-16"></div>
        </div>

        {/* 説明カード */}
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl p-5 mb-6 border-2 border-pink-200">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="size-6 text-pink-500 fill-pink-500" />
            <h2 className="text-lg text-slate-900">お気に入りの友達</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            一緒にトレーニングした友達をGoともに追加すると、次回から簡単に誘えるようになります。
          </p>
        </div>

        {/* 統計情報 */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl text-pink-500 mb-1">{goMembers.length}</div>
            <div className="text-xs text-slate-600">Goとも</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl text-cyan-500 mb-1">
              {goMembers.reduce((sum, member) => sum + member.totalWorkouts, 0)}
            </div>
            <div className="text-xs text-slate-600">一緒の回数</div>
          </div>
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl text-purple-500 mb-1">
              {Math.round(goMembers.reduce((sum, member) => sum + member.compatibility, 0) / goMembers.length)}%
            </div>
            <div className="text-xs text-slate-600">平均相性</div>
          </div>
        </div>

        {/* メンバーリスト */}
        {goMembers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm">
            <Heart className="size-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-2">まだGoともはいません</p>
            <p className="text-sm text-slate-400">
              マッチ画面でハートマークをタップして<br />お気に入りメンバーを追加しましょう
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
              >
                {/* ヘッダー部分 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-14 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white text-xl">
                      💪
                    </div>
                    <div>
                      <h3 className="text-lg text-slate-900 mb-1">{member.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="size-4" />
                        <span>{member.area}</span>
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-pink-50 rounded-full transition-colors">
                    <Heart className="size-6 text-pink-500 fill-pink-500" />
                  </button>
                </div>

                {/* 相性スコア */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">相性スコア</span>
                    <span className="text-lg text-pink-600">{member.compatibility}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full transition-all"
                      style={{ width: `${member.compatibility}%` }}
                    />
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="space-y-3 mb-4">
                  {/* レベル */}
                  <div className="flex items-center gap-2 text-sm">
                    <User className="size-4 text-cyan-500" />
                    <span className="text-slate-600">
                      {getExperienceLevelEmoji(member.experienceLevel)} {member.experienceLevel}
                    </span>
                  </div>

                  {/* カテゴリ */}
                  <div className="flex items-start gap-2">
                    <Dumbbell className="size-4 text-orange-500 mt-0.5" />
                    <div className="flex flex-wrap gap-2">
                      {member.preferredCategories.map((category, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* 活動履歴 */}
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="size-4 text-purple-500" />
                    <span>
                      一緒に {member.totalWorkouts}回
                      {member.lastWorkout && (
                        <span className="text-slate-400 ml-1">
                          · 最終: {formatDate(member.lastWorkout)}
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* アクションボタン */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 rounded-xl hover:shadow-lg transition-all">
                    誘う
                  </button>
                  <button className="px-5 bg-slate-100 text-slate-700 py-3 rounded-xl hover:bg-slate-200 transition-all">
                    プロフィール
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}