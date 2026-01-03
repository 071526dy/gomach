import { useState } from 'react';
import { Calendar } from './ui/calendar';

interface ScheduledWorkout {
  id: string;
  date: Date;
  gym: string;
  time: string;
  category: string;
  status: 'pending' | 'matched' | 'completed';
  matchedUser?: {
    name: string;
    compatibility: number;
    experienceLevel: string;
    levelPreference: string;
  };
}

interface MyCalendarProps {
  onBack: () => void;
  onScheduleClick: (schedule: ScheduledWorkout) => void;
}

export function MyCalendar({ onBack, onScheduleClick }: MyCalendarProps) {
  // モックデータ：予定されたトレーニング
  const [schedules] = useState<ScheduledWorkout[]>([
    {
      id: '1',
      date: new Date(),
      gym: '渋谷エニタイム',
      time: '夜',
      category: '背中',
      status: 'matched',
      matchedUser: { 
        name: 'ユーザーA', 
        compatibility: 92,
        experienceLevel: 'intermediate',
        levelPreference: 'same',
      },
    },
    {
      id: '2',
      date: new Date(new Date().setDate(new Date().getDate() + 1)),
      gym: '新宿ゴールドジム',
      time: '夕方',
      category: '胸',
      status: 'pending',
    },
    {
      id: '3',
      date: new Date(new Date().setDate(new Date().getDate() + 3)),
      gym: '渋谷エニタイム',
      time: '夜',
      category: '脚',
      status: 'matched',
      matchedUser: { 
        name: 'ユーザーB', 
        compatibility: 85,
        experienceLevel: 'advanced',
        levelPreference: 'teach',
      },
    },
    {
      id: '4',
      date: new Date(new Date().setDate(new Date().getDate() + 5)),
      gym: '恵比寿24h',
      time: '夕方',
      category: '上半身',
      status: 'pending',
    },
  ]);

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: { emoji: string; label: string } } = {
      beginner: { emoji: '🌱', label: '初心者' },
      intermediate: { emoji: '💪', label: '中級者' },
      advanced: { emoji: '🏋️', label: '上級者' },
      expert: { emoji: '⭐', label: 'エキスパート' },
    };
    return labels[level] || { emoji: '💪', label: '中級者' };
  };

  // 選択された日付の予定を取得
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(
      (schedule) => schedule.date.toDateString() === date.toDateString()
    );
  };

  // カレンダーに予定がある日付をハイライト
  const getScheduleDates = () => {
    return schedules.map((schedule) => schedule.date);
  };

  const scheduleDates = getScheduleDates();
  const selectedDateSchedules = selectedDate ? getSchedulesForDate(selectedDate) : [];

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return '今日';
    if (date.toDateString() === tomorrow.toDateString()) return '明日';

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return { text: 'マッチング済み', color: 'bg-cyan-100 text-cyan-700' };
      case 'pending':
        return { text: '募集中', color: 'bg-purple-100 text-purple-700' };
      case 'completed':
        return { text: '完了', color: 'bg-green-100 text-green-700' };
      default:
        return { text: '', color: '' };
    }
  };

  // 統計情報
  const stats = {
    total: schedules.length,
    matched: schedules.filter((s) => s.status === 'matched').length,
    pending: schedules.filter((s) => s.status === 'pending').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md mx-auto px-6 py-8 pb-24">
        {/* ヘッダー */}
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4"
          >
            ← 戻る
          </button>
          <h1 className="mb-2">マイカレンダー</h1>
          <p className="text-slate-600">トレーニング予定を管理</p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
            <div className="text-2xl text-slate-900">{stats.total}</div>
            <p className="text-xs text-slate-500 mt-1">予定総数</p>
          </div>
          <div className="bg-cyan-50 rounded-2xl p-4 text-center shadow-sm border border-cyan-100">
            <div className="text-2xl text-cyan-600">{stats.matched}</div>
            <p className="text-xs text-cyan-700 mt-1">マッチング</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-4 text-center shadow-sm border border-purple-100">
            <div className="text-2xl text-purple-600">{stats.pending}</div>
            <p className="text-xs text-purple-700 mt-1">募集中</p>
          </div>
        </div>

        {/* カレンダー */}
        <div className="bg-white rounded-3xl p-4 mb-6 shadow-sm">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{
              scheduled: scheduleDates,
            }}
            modifiersClassNames={{
              scheduled: 'bg-cyan-100 text-cyan-900 font-bold',
            }}
            className="w-full"
          />
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-100 rounded-full border border-cyan-300"></div>
              <span>予定あり</span>
            </div>
          </div>
        </div>

        {/* 選択日の予定リスト */}
        {selectedDate && (
          <div className="mb-6">
            <h3 className="mb-3 text-slate-700">{formatDate(selectedDate)}の予定</h3>
            {selectedDateSchedules.length > 0 ? (
              <div className="space-y-3">
                {selectedDateSchedules.map((schedule) => {
                  const badge = getStatusBadge(schedule.status);
                  return (
                    <div
                      key={schedule.id}
                      onClick={() => onScheduleClick(schedule)}
                      className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs ${badge.color}`}>
                              {badge.text}
                            </span>
                            {schedule.status === 'matched' && (
                              <span className="text-xs text-slate-500">🤝</span>
                            )}
                          </div>
                          <p className="text-slate-900">{schedule.gym}</p>
                          <p className="text-sm text-slate-500">
                            {schedule.time} • {schedule.category}
                          </p>
                        </div>
                      </div>
                      {schedule.matchedUser && (
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                            {schedule.matchedUser.name.slice(-1)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-slate-900">{schedule.matchedUser.name}</p>
                            <p className="text-xs text-slate-500">
                              相性 {schedule.matchedUser.compatibility}%
                            </p>
                            <p className="text-xs text-slate-500">
                              {getExperienceLevelLabel(schedule.matchedUser.experienceLevel).emoji} {getExperienceLevelLabel(schedule.matchedUser.experienceLevel).label}
                            </p>
                          </div>
                          <button className="text-cyan-500 hover:text-cyan-600 text-sm">
                            詳細 →
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-50 rounded-2xl p-8 text-center">
                <p className="text-slate-500 text-sm">この日の予定はありません</p>
              </div>
            )}
          </div>
        )}

        {/* 凡例 */}
        <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-100">
          <p className="text-sm text-cyan-900 mb-2">💡 予定について</p>
          <div className="space-y-1 text-sm text-cyan-800">
            <p>🤝 マッチング済み - 相手と合意済み</p>
            <p>📢 募集中 - マッチング相手を探しています</p>
            <p>✅ 完了 - トレーニング終了</p>
          </div>
        </div>
      </div>
    </div>
  );
}