import { useState } from 'react';

interface Goal {
  id: string;
  title: string;
  participants: number;
  joined: boolean;
}

interface LogEntry {
  date: string;
  status: '達成' | '休み' | 'ほどほど';
}

interface CommonGoalsProps {
  onBack: () => void;
}

export function CommonGoals({ onBack }: CommonGoalsProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [goals, setGoals] = useState<Goal[]>([
    { id: '1', title: '週2ジム習慣', participants: 184, joined: true },
    { id: '2', title: '毎朝筋トレ', participants: 92, joined: false },
    { id: '3', title: '月間20回チャレンジ', participants: 156, joined: true },
    { id: '4', title: 'ベンチプレス100kg', participants: 67, joined: false },
  ]);

  // カレンダーログデータ（モック）
  const generateLogData = (): LogEntry[] => {
    const logs: LogEntry[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
      
      // ランダムにステータスを割り当て
      const rand = Math.random();
      let status: '達成' | '休み' | 'ほどほど';
      if (rand > 0.7) status = '達成';
      else if (rand > 0.4) status = 'ほどほど';
      else status = '休み';
      
      logs.push({ date: dateStr, status });
    }
    return logs;
  };

  const [logData] = useState(generateLogData());

  const toggleGoal = (goalId: string) => {
    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === goalId ? { ...goal, joined: !goal.joined } : goal
      )
    );
  };

  const getStatusEmoji = (status: string) => {
    if (status === '達成') return '👍';
    if (status === 'ほどほど') return '💪';
    return '💤';
  };

  if (selectedGoal) {
    const goal = goals.find((g) => g.id === selectedGoal);
    if (!goal) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="max-w-md mx-auto px-6 py-8">
          {/* ヘッダー */}
          <div className="mb-6">
            <button
              onClick={() => setSelectedGoal(null)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
            >
              ← 戻る
            </button>
            <h2>{goal.title}</h2>
            <p className="text-slate-600">参加者 {goal.participants}人</p>
          </div>

          {/* カレンダーログ */}
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-6">
            <h3 className="mb-4 text-slate-700">あなたの記録</h3>
            <div className="space-y-2">
              {logData.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0"
                >
                  <span className="text-sm text-slate-500 w-12">{entry.date}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <span className="text-2xl">{getStatusEmoji(entry.status)}</span>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full ${
                      entry.status === '達成'
                        ? 'bg-green-100 text-green-700'
                        : entry.status === 'ほどほど'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {entry.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 凡例 */}
          <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
            <p className="text-sm text-cyan-900 mb-2">記録について</p>
            <div className="space-y-1 text-sm text-cyan-800">
              <p>👍 達成 - 目標クリア</p>
              <p>💪 ほどほど - 少しだけ実施</p>
              <p>💤 休み - 今日はお休み</p>
            </div>
          </div>

          {/* 今日の記録ボタン */}
          <div className="mt-6 space-y-3">
            <p className="text-sm text-slate-600">今日の記録を追加</p>
            <div className="grid grid-cols-3 gap-2">
              <button className="bg-green-100 text-green-700 py-3 rounded-xl hover:bg-green-200 transition-colors">
                👍 達成
              </button>
              <button className="bg-yellow-100 text-yellow-700 py-3 rounded-xl hover:bg-yellow-200 transition-colors">
                💪 ほどほど
              </button>
              <button className="bg-slate-100 text-slate-600 py-3 rounded-xl hover:bg-slate-200 transition-colors">
                💤 休み
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            ← 戻る
          </button>
          <h1>共通ゴール</h1>
          <p className="text-slate-600">継続仲間とゆるくつながる</p>
        </div>

        {/* 説明 */}
        <div className="bg-purple-50 rounded-2xl p-4 mb-6 border border-purple-100">
          <p className="text-sm text-purple-900">
            💡 共通ゴールのメンバーが同じ時間・エリア・同伴希望の場合、マッチ一覧で優先表示されます
          </p>
        </div>

        {/* ゴール一覧 */}
        <div className="space-y-4">
          {goals.map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <h3 className="mb-1">{goal.title}</h3>
                  <p className="text-sm text-slate-500">参加者 {goal.participants}人</p>
                </div>
                <div className="text-3xl">
                  {goal.joined ? '⭐' : '🎯'}
                </div>
              </div>

              <div className="flex gap-2">
                {goal.joined ? (
                  <>
                    <button
                      onClick={() => setSelectedGoal(goal.id)}
                      className="flex-1 bg-cyan-400 text-white py-3 rounded-xl hover:bg-cyan-500 transition-colors shadow-md shadow-cyan-400/30"
                    >
                      記録を見る
                    </button>
                    <button
                      onClick={() => toggleGoal(goal.id)}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      退出
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => toggleGoal(goal.id)}
                    className="flex-1 bg-purple-100 text-purple-700 py-3 rounded-xl hover:bg-purple-200 transition-colors"
                  >
                    参加する
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
