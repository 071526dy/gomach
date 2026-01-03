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
  experienceLevel: string;
  levelPreference: string;
}

interface CompatibilityModalProps {
  match: Match | null;
  onClose: () => void;
  onInvite: (match: Match) => void;
}

export function CompatibilityModal({ match, onClose, onInvite }: CompatibilityModalProps) {
  if (!match) return null;

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: { emoji: string; label: string; desc: string } } = {
      beginner: { emoji: '🌱', label: '初心者', desc: '3ヶ月未満' },
      intermediate: { emoji: '💪', label: '中級者', desc: '3ヶ月〜2年' },
      advanced: { emoji: '🏋️', label: '上級者', desc: '2年〜5年' },
      expert: { emoji: '⭐', label: 'エキスパート', desc: '5年以上' },
    };
    return labels[level] || { emoji: '💪', label: '中級者', desc: '3ヶ月〜2年' };
  };

  const getLevelPreferenceLabel = (pref: string) => {
    const labels: { [key: string]: { emoji: string; label: string; desc: string } } = {
      same: { emoji: '🤝', label: '同じくらいのレベル', desc: '同レベルで励まし合いたい' },
      learn: { emoji: '📚', label: '教えてもらいたい', desc: '上級者にフォームなど教わりたい' },
      teach: { emoji: '🎓', label: '教えてもOK', desc: '初心者にアドバイスできる' },
    };
    return labels[pref] || { emoji: '🤝', label: '同じくらいのレベル', desc: '同レベルで励まし合いたい' };
  };

  const matchPoints = [
    { label: '同時間帯一致', matched: match.commonTags.includes('同時間帯') },
    { label: '同伴希望同士', matched: match.commonTags.includes('同伴希望') },
    { label: '同エリア', matched: match.commonTags.includes('同じエリア') },
    { label: 'カテゴリ一致', matched: match.commonTags.includes('カテゴリ一致') },
  ];

  const nearPoints = [
    { label: '近いカテゴリ', matched: match.commonTags.includes('近いカテゴリ') },
    { label: '近い時間帯', matched: match.commonTags.includes('近い時間帯') },
    { label: '近いエリア', matched: match.commonTags.includes('近いエリア') },
  ];

  const expLevel = getExperienceLevelLabel(match.experienceLevel);
  const levelPref = getLevelPreferenceLabel(match.levelPreference);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-0 md:p-4">
      <div className="bg-white w-full md:max-w-md md:rounded-3xl rounded-t-3xl max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between rounded-t-3xl">
          <h2>相性詳細</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* プロフィール */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              {match.name.slice(-1)}
            </div>
            <div>
              <p className="text-lg">{match.name}</p>
              <p className="text-sm text-slate-500">📍 {match.gym}</p>
            </div>
          </div>

          {/* 相性スコア */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-3xl p-8 mb-6 text-center">
            <p className="text-sm text-slate-600 mb-2">相性スコア</p>
            <div className="text-6xl text-cyan-500 mb-2">{match.compatibility}%</div>
            <p className="text-sm text-slate-600">とても良い相性です</p>
          </div>

          {/* 一致ポイント */}
          <div className="mb-6">
            <h3 className="mb-3 text-slate-700">一致ポイント</h3>
            <div className="space-y-2">
              {matchPoints.map((point) => (
                point.matched && (
                  <div
                    key={point.label}
                    className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3"
                  >
                    <span className="text-green-600">✓</span>
                    <span className="text-green-800">{point.label}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* 近いポイント */}
          {nearPoints.some((p) => p.matched) && (
            <div className="mb-6">
              <h3 className="mb-3 text-slate-700">近いポイント</h3>
              <div className="space-y-2">
                {nearPoints.map((point) => (
                  point.matched && (
                    <div
                      key={point.label}
                      className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3"
                    >
                      <span className="text-slate-400">△</span>
                      <span className="text-slate-600">{point.label}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* トレーニング情報 */}
          <div className="bg-slate-50 rounded-2xl p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500 mb-1">時間帯</p>
                <p className="text-slate-900">{match.time}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">カテゴリ</p>
                <p className="text-slate-900">{match.category}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">参加スタイル</p>
                <p className="text-slate-900 text-xs">{match.style}</p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">モード</p>
                <p className="text-slate-900">
                  {match.mode === '誘う側 OK' ? '🟣 誘いOK' : '🟢 誘われ待ち'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">経験レベル</p>
                <p className="text-slate-900">
                  {expLevel.emoji} {expLevel.label} ({expLevel.desc})
                </p>
              </div>
              <div>
                <p className="text-slate-500 mb-1">レベルの好み</p>
                <p className="text-slate-900">
                  {levelPref.emoji} {levelPref.label} ({levelPref.desc})
                </p>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            <button
              onClick={() => onInvite(match)}
              className="w-full bg-cyan-400 text-white py-4 rounded-2xl hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-400/30"
            >
              🟣 入口から一緒に行きませんか？
            </button>
            <button
              onClick={onClose}
              className="w-full bg-slate-100 text-slate-700 py-4 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              後で考える
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}