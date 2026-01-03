import { User, MapPin, Calendar, Dumbbell, Award, Target, TrendingUp, Heart } from 'lucide-react';

interface Match {
  id: string;
  name: string;
  compatibility: number;
  gym: string;
  time: string;
  category: string;
  mode: string;
  style: string;
  commonTags: string[];
  isInCommonGoal?: boolean;
  experienceLevel: string;
  levelPreference: string;
}

interface OtherUserProfileProps {
  match: Match | null;
  onBack: () => void;
  onInvite: () => void;
}

export function OtherUserProfile({ match, onBack, onInvite }: OtherUserProfileProps) {
  if (!match) {
    return null;
  }

  // 経験レベルの日本語表示
  const experienceLevelMap: { [key: string]: string } = {
    beginner: '初心者',
    intermediate: '中級者',
    advanced: '上級者',
    expert: 'エキスパート',
  };

  // レベル希望の日本語表示
  const levelPreferenceMap: { [key: string]: string } = {
    same: '同じくらいのレベル',
    teach: '教えることができる',
    learn: '教えてほしい',
    any: 'どのレベルでもOK',
  };

  // モックデータ（実際はAPIから取得）
  const userProfile = {
    name: match.name,
    gym: match.gym,
    nearbyStations: ['渋谷', '恵比寿', '表参道'],
    experienceLevel: experienceLevelMap[match.experienceLevel] || '中級者',
    levelPreference: levelPreferenceMap[match.levelPreference] || '同じくらいのレベル',
    memberSince: '2024年8月',
    totalWorkouts: 56,
    totalMatches: 18,
    preferredTime: '午後 (18:00-21:00)',
    preferredCategories: [match.category, '脚', '肩'],
    companionStyle: match.style,
    gender: '男性',
    genderPreference: '指定なし',
    commonGoals: match.isInCommonGoal ? 2 : 0,
    completedGoals: match.isInCommonGoal ? 1 : 0,
    bio: 'トレーニング仲間と一緒に楽しく続けたいです！よろしくお願いします。',
    trainingDays: ['火', '木', '土'], // トレーニング曜日
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
          <h1 className="text-slate-900">プロフィール</h1>
          <div className="w-16"></div>
        </div>

        {/* プロフィールカード */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          {/* アイコンと基本情報 */}
          <div className="flex items-center gap-4 mb-4">
            <div className="size-20 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white text-3xl">
              💪
            </div>
            <div>
              <h2 className="text-2xl text-slate-900 mb-1">{userProfile.name}</h2>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="size-4" />
                <span>{userProfile.gym}エリア</span>
              </div>
            </div>
          </div>

          {/* 相性スコア */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-pink-500 fill-pink-500" />
                <span className="text-slate-700">相性スコア</span>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                {match.compatibility}%
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {match.commonTags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-white text-cyan-700 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* ステータス */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl mb-6">
            <div className="text-center">
              <div className="text-2xl text-cyan-600 mb-1">{userProfile.totalWorkouts}</div>
              <div className="text-xs text-slate-600">トレーニング</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-blue-600 mb-1">{userProfile.totalMatches}</div>
              <div className="text-xs text-slate-600">マッチング</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-purple-600 mb-1">{userProfile.completedGoals}</div>
              <div className="text-xs text-slate-600">達成ゴール</div>
            </div>
          </div>

          {/* 詳細情報 */}
          <div className="space-y-4">
            {/* 自己紹介 */}
            {userProfile.bio && (
              <div>
                <div className="flex items-center gap-2 text-slate-700 mb-2">
                  <User className="size-5 text-cyan-500" />
                  <span className="font-medium">自己紹介</span>
                </div>
                <div className="ml-7 text-slate-600 bg-slate-50 p-3 rounded-xl">
                  {userProfile.bio}
                </div>
              </div>
            )}

            {/* エリア */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <MapPin className="size-5 text-cyan-500" />
                <span className="font-medium">活動エリア</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-7">
                {userProfile.nearbyStations.map((station, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm"
                  >
                    {station}
                  </span>
                ))}
              </div>
            </div>

            {/* トレーニングレベル */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <TrendingUp className="size-5 text-blue-500" />
                <span className="font-medium">トレーニングレベル</span>
              </div>
              <div className="ml-7 space-y-1">
                <div className="text-slate-600">{userProfile.experienceLevel}</div>
                <div className="text-sm text-slate-500">{userProfile.levelPreference}</div>
              </div>
            </div>

            {/* 今日の予定 */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Calendar className="size-5 text-purple-500" />
                <span className="font-medium">今日の予定</span>
              </div>
              <div className="ml-7 bg-purple-50 p-3 rounded-xl">
                <div className="text-slate-700">{match.time} 〜</div>
                <div className="text-sm text-slate-600 mt-1">{match.gym}</div>
              </div>
            </div>

            {/* よく行く時間帯 */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Calendar className="size-5 text-orange-500" />
                <span className="font-medium">よく行く時間帯</span>
              </div>
              <div className="ml-7 text-slate-600">{userProfile.preferredTime}</div>
            </div>

            {/* トレーニングカテゴリ */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Dumbbell className="size-5 text-green-500" />
                <span className="font-medium">よくやるカテゴリ</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-7">
                {userProfile.preferredCategories.map((category, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* 同伴スタイル */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <User className="size-5 text-indigo-500" />
                <span className="font-medium">同伴スタイル</span>
              </div>
              <div className="ml-7 text-slate-600">{userProfile.companionStyle}</div>
            </div>

            {/* 性別 */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <User className="size-5 text-pink-500" />
                <span className="font-medium">性別</span>
              </div>
              <div className="ml-7 text-slate-600">{userProfile.gender}</div>
            </div>

            {/* 共通ゴール */}
            {userProfile.commonGoals > 0 && (
              <div>
                <div className="flex items-center gap-2 text-slate-700 mb-2">
                  <Target className="size-5 text-red-500" />
                  <span className="font-medium">共通ゴール参加</span>
                </div>
                <div className="ml-7 text-slate-600">
                  {userProfile.commonGoals}件参加中
                </div>
              </div>
            )}

            {/* 利用開始日 */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Award className="size-5 text-amber-500" />
                <span className="font-medium">利用開始</span>
              </div>
              <div className="ml-7 text-slate-600">{userProfile.memberSince}</div>
            </div>

            {/* トレーニング曜日 */}
            <div>
              <div className="flex items-center gap-2 text-slate-700 mb-2">
                <Calendar className="size-5 text-gray-500" />
                <span className="font-medium">トレーニング曜日</span>
              </div>
              <div className="flex flex-wrap gap-2 ml-7">
                {userProfile.trainingDays.map((day, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm"
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <button 
          onClick={onInvite}
          className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-4 rounded-2xl shadow-lg shadow-cyan-400/30 hover:shadow-xl transition-shadow"
        >
          このユーザーを誘う
        </button>
      </div>
    </div>
  );
}