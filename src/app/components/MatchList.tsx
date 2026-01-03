import { UserStatus } from './StatusInput';
import { useState } from 'react';
import { Search, MapPin, Calendar, Dumbbell, Target, Heart, Check, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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

interface MatchListProps {
  userStatus: UserStatus | null;
  onMatchSelect: (match: Match) => void;
  onDirectChat: (match: Match) => void;
  onSearchClick: () => void;
  onGoalsClick: () => void;
  onCalendarClick: () => void;
  onProfileClick?: () => void;
  onOtherProfileClick?: (match: Match) => void;
  onGoMembersClick?: () => void;
}

export function MatchList({ userStatus, onMatchSelect, onDirectChat, onSearchClick, onGoalsClick, onCalendarClick, onProfileClick, onOtherProfileClick, onGoMembersClick }: MatchListProps) {
  const [requestedMatches, setRequestedMatches] = useState<Set<string>>(new Set());
  const [showingMessageFor, setShowingMessageFor] = useState<string | null>(null);
  const [selectedDeadline, setSelectedDeadline] = useState<{ [key: string]: { date: string; time: string } }>({});
  const [dateSelectionMode, setDateSelectionMode] = useState<{ [key: string]: 'today' | 'tomorrow' | 'calendar' }>({});
  const [calendarMonth, setCalendarMonth] = useState<{ [key: string]: { year: number; month: number } }>({});
  const [favoriteMatches, setFavoriteMatches] = useState<Set<string>>(new Set(['1', '3'])); // 初期値として一部を登録済み

  const quickMessages = [
    'よろしくお願いします！',
    '一緒に頑張りましょう！',
    '楽しみにしています！',
    '入口で合流しましょう',
  ];

  // 日付オプションを生成（今日から7日後まで）
  const generateDateOptions = () => {
    const dates: { value: string; label: string }[] = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      let label = '';
      if (i === 0) label = '今日';
      else if (i === 1) label = '明日';
      else if (i === 2) label = '明後日';
      else {
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        label = `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
      }

      dates.push({
        value: date.toISOString().split('T')[0],
        label: label
      });
    }

    return dates;
  };

  // カレンダー用の日付データ生成
  const generateCalendarDays = (year: number, month: number, matchDate?: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 時刻をリセット

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // カレンダーの開始日（日曜日から開始）
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const days: { date: Date; isCurrentMonth: boolean; isSelectable: boolean; dateString: string }[] = [];
    const currentDate = new Date(startDate);

    // 選択可能範囲の最大日（マッチ日当日 or 30日後）
    const maxSelectableDate = new Date(today);
    if (matchDate) {
      // マッチ日当日まで選択可能
      const matchDay = new Date(matchDate);
      matchDay.setHours(0, 0, 0, 0);
      maxSelectableDate.setTime(matchDay.getTime());
    } else {
      // マッチ日が未定の場合は30日後まで
      maxSelectableDate.setDate(today.getDate() + 30);
    }

    const todayStart = new Date(today);

    // カレンダーグリッド生成（6週間分）
    for (let i = 0; i < 42; i++) {
      const isCurrentMonth = currentDate.getMonth() === month;
      const dateString = currentDate.toISOString().split('T')[0];
      const checkDate = new Date(currentDate);
      checkDate.setHours(0, 0, 0, 0);

      const isSelectable = checkDate.getTime() >= todayStart.getTime() &&
        checkDate.getTime() <= maxSelectableDate.getTime();

      days.push({
        date: new Date(currentDate),
        isCurrentMonth,
        isSelectable,
        dateString
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  };

  const getCalendarMonth = (year: number, month: number) => {
    return `${year}年${month + 1}月`;
  };

  // 時刻オプションを生成
  const generateTimeOptions = (selectedDate?: string, matchDate?: Date, matchTime?: string) => {
    const times: string[] = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // 選択された日付が今日の場合は現在時刻以降のみ表示
    const isToday = selectedDate === today;

    // 選択された日付がマッチ日の場合
    const matchDateString = matchDate?.toISOString().split('T')[0];
    const isMatchDate = selectedDate === matchDateString;

    let startHour = 0;
    let startMinute = 0;
    let endHour = 23;
    let endMinute = 30;

    if (isToday) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      startHour = currentHour;
      startMinute = currentMinute < 30 ? 30 : 0;
      if (currentMinute >= 30) {
        startHour += 1;
      }
    }

    // マッチ日の場合は、マッチ時刻までしか選択できない
    if (isMatchDate && matchTime) {
      const [matchHour, matchMinute] = matchTime.split(':').map(Number);
      endHour = matchHour;
      endMinute = matchMinute;
    }

    // 時刻リストを生成
    for (let h = startHour; h <= endHour; h++) {
      const minuteStart = (isToday && h === startHour) ? startMinute : 0;
      const minuteEnd = (h === endHour) ? endMinute : 30;

      for (let m = minuteStart; m <= minuteEnd; m += 30) {
        if (h === endHour && m > endMinute) break;
        times.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
      }
    }

    return times;
  };

  // モックマッチデータ
  const allMatches: Match[] = [
    {
      id: '1',
      name: 'ユーザーA',
      compatibility: 92,
      gym: '渋谷',
      time: '19:00',
      category: '背中',
      mode: '誘われ待ち',
      style: '入口から一緒に入れたらOK',
      commonTags: ['同じエリア', '同時間帯', '同伴希望', 'カテゴリ一致'],
      isInCommonGoal: true,
      experienceLevel: 'intermediate',
      levelPreference: 'same',
    },
    {
      id: '2',
      name: 'ユーザーB',
      compatibility: 85,
      gym: '渋谷',
      time: '20:00',
      category: '上半身',
      mode: '誘う側 OK',
      style: '同じ時間帯だけ一緒',
      commonTags: ['同じエリア', '同時間帯', '近いカテゴリ'],
      isInCommonGoal: true,
      experienceLevel: 'advanced',
      levelPreference: 'teach',
    },
    {
      id: '3',
      name: 'ユーザーC',
      compatibility: 78,
      gym: '新宿',
      time: '18:30',
      category: '背中',
      mode: '誘われ待ち',
      style: '近いメニューで軽く合わせる',
      commonTags: ['同時間帯', 'カテゴリ一致', '同伴希望'],
      experienceLevel: 'beginner',
      levelPreference: 'learn',
    },
    {
      id: '4',
      name: 'ユーザーD',
      compatibility: 72,
      gym: '恵比寿',
      time: '17:00',
      category: '脚',
      mode: '誘われ待ち',
      style: '入口から一緒に入れたらOK',
      commonTags: ['近いエリア', '近い時間帯'],
      experienceLevel: 'expert',
      levelPreference: 'same',
    },
    {
      id: '5',
      name: 'ユーザーE',
      compatibility: 88,
      gym: '表参道',
      time: '18:00',
      category: '胸',
      mode: '誘われ待ち',
      style: '同じ時間帯だけ一緒',
      commonTags: ['近いエリア', '同時間帯'],
      isInCommonGoal: false,
      experienceLevel: 'intermediate',
      levelPreference: 'same',
    },
  ];

  const { user } = useAuth();

  // エリアが近い駅のグループ定義
  const nearbyStations: { [key: string]: string[] } = {
    '渋谷': ['渋谷', '恵比寿', '表参道', '原宿', '代官山'],
    '恵比寿': ['渋谷', '恵比寿', '表参道', '代官山'],
    '表参道': ['渋谷', '恵比寿', '表参道', '原宿', '青山一丁目'],
    '新宿': ['新宿', '新宿三丁目', '代々木', '新大久保'],
    '池袋': ['池袋', '要町', '東池袋'],
    '原宿': ['渋谷', '表参道', '原宿', '明治神宮前'],
  };

  // ユーザーのプロフィールエリア
  const userProfileArea = user?.area || '渋谷';
  const userNearbyStations = nearbyStations[userProfileArea] || [userProfileArea];

  // ユーザーの今日のカテゴリ
  const userCategories = userStatus?.category || [];

  // エリアが近い人だけをフィルタリング（modeフィルタを削除）
  const matches = allMatches.filter(
    (match) => userNearbyStations.includes(match.gym)
  );

  // 共通タグを生成する関数
  const getCommonTags = (match: Match) => {
    const tags: string[] = [];

    // エリア
    if (match.gym === userProfileArea) {
      tags.push('同じエリア');
    } else if (userNearbyStations.includes(match.gym)) {
      tags.push('近いエリア');
    }

    tags.push('同時間帯');

    // カテゴリ（配列対応）
    if (userCategories.includes(match.category)) {
      tags.push(match.category); // 「カテゴリ一致」の代わりに部位名を表示
    }

    return tags;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: { [key: string]: { emoji: string; label: string } } = {
      beginner: { emoji: '🌱', label: '初心者' },
      intermediate: { emoji: '💪', label: '中級者' },
      advanced: { emoji: '🏋️', label: '上級者' },
      expert: { emoji: '⭐', label: 'エキスパート' },
    };
    return labels[level] || { emoji: '💪', label: '中級者' };
  };

  const getLevelPreferenceLabel = (pref: string) => {
    const labels: { [key: string]: { emoji: string; label: string } } = {
      same: { emoji: '🤝', label: '同レベル希望' },
      learn: { emoji: '📚', label: '教えてもらいたい' },
      teach: { emoji: '🎓', label: '教えOK' },
    };
    return labels[pref] || { emoji: '🤝', label: '同レベル希望' };
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return '今日';
    if (date.toDateString() === tomorrow.toDateString()) return '明日';

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
  };

  const formatFullDate = (date: Date) => {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 (${weekdays[date.getDay()]})`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <div className="max-w-md mx-auto px-6 py-8">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                Gomach
              </h1>
            </div>
            {onProfileClick && (
              <button
                onClick={onProfileClick}
                className="size-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white shadow-md hover:shadow-lg transition-shadow"
              >
                👤
              </button>
            )}
          </div>

          {/* 検索ボタン */}
          <button
            onClick={onSearchClick}
            className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl p-4 mb-4 shadow-lg shadow-cyan-400/30 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-center gap-2 text-white">
              <span className="text-xl">🔍</span>
              <span className="text-lg">相手を探す</span>
            </div>
          </button>

          <p className="text-slate-600">
            エリアが近いユーザー {matches.length}人
          </p>
        </div>

        {/* 共通ゴールボタン */}
        <button
          onClick={onGoalsClick}
          className="w-full bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-4 mb-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-purple-900">共通ゴールを見る</p>
              <p className="text-sm text-purple-600">継続仲間とつながる</p>
            </div>
            <span className="text-2xl">🎯</span>
          </div>
        </button>

        {/* Goメンバーボタン */}
        {onGoMembersClick && (
          <button
            onClick={onGoMembersClick}
            className="w-full bg-gradient-to-r from-pink-100 to-red-100 rounded-2xl p-4 mb-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <p className="text-pink-900">Goとも</p>
                <p className="text-sm text-pink-600">お気に入りの友達を見る</p>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="size-6 text-pink-500 fill-pink-500" />
                <span className="text-xs text-pink-700 bg-pink-200 rounded-full px-2 py-0.5">{favoriteMatches.size}</span>
              </div>
            </div>
          </button>
        )}

        {/* カレンダーボタン */}
        <button
          onClick={onCalendarClick}
          className="w-full bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-4 mb-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p className="text-blue-900">カレンダーを見る</p>
              <p className="text-sm text-blue-600">予定を確認する</p>
            </div>
            <span className="text-2xl">📅</span>
          </div>
        </button>

        {/* マッチカードリスト */}
        <div className="space-y-4">
          {matches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* 相性スコア */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  onClick={() => onOtherProfileClick && onOtherProfileClick(match)}
                  className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform cursor-pointer"
                >
                  {match.name.slice(-1)}
                </button>
                <div>
                  <p className="text-slate-900">{match.name}</p>
                  <p className="text-sm text-slate-500">📍 {match.gym}</p>
                </div>
              </div>

              {/* 共通タグ */}
              <div className="flex flex-wrap gap-2 mb-4">
                {match.isInCommonGoal && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm border border-purple-200">
                    ⭐ 共通ゴール仲間
                  </span>
                )}
                {getCommonTags(match).map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm"
                  >
                    ✓ {tag}
                  </span>
                ))}
              </div>

              {/* ステータス */}
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                <span>{match.time}</span>
                <span>•</span>
                <span>{match.category}</span>
                <span>•</span>
                <span className="text-cyan-600">
                  {formatDate(userStatus?.date || new Date())} {match.time}〜
                </span>
              </div>

              {/* スキルレベル */}
              <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                <span>
                  {getExperienceLevelLabel(match.experienceLevel).emoji}{' '}
                  {getExperienceLevelLabel(match.experienceLevel).label}
                </span>
                <span>•</span>
                <span>
                  {getLevelPreferenceLabel(match.levelPreference).emoji}{' '}
                  {getLevelPreferenceLabel(match.levelPreference).label}
                </span>
              </div>

              {/* アクションボタン */}
              <div className="space-y-3">
                {/* メインボタン */}
                <div className="flex gap-2">
                  {!requestedMatches.has(match.id) ? (
                    <button
                      onClick={() => setShowingMessageFor(match.id)}
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 rounded-xl shadow-cyan-400/30 hover:shadow-lg transition-all"
                    >
                      📤 リクエスト
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setRequestedMatches(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(match.id);
                            return newSet;
                          });
                        }}
                        className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors border border-red-200"
                      >
                        ❌ キャンセル
                      </button>
                      <button
                        onClick={() => onDirectChat(match)}
                        className="flex-1 bg-green-100 text-green-700 py-3 rounded-xl border-2 border-green-300 hover:bg-green-200 transition-all"
                      >
                        💬 メッセージ
                      </button>
                    </>
                  )}
                  {onOtherProfileClick && (
                    <button
                      onClick={() => onOtherProfileClick(match)}
                      className="px-4 py-3 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      👤
                    </button>
                  )}
                </div>

                {/* 簡単なメッセージ選択 */}
                {showingMessageFor === match.id && (
                  <div className="bg-cyan-50 rounded-2xl p-4 border border-cyan-200 space-y-3">
                    {/* 返信期限選択 */}
                    <div>
                      <p className="text-sm text-cyan-900 mb-2">🕒 返信期限</p>

                      {/* 日付選択タブ */}
                      <div className="flex gap-2 mb-3">
                        <button
                          onClick={() => {
                            const today = new Date().toISOString().split('T')[0];
                            setDateSelectionMode(prev => ({ ...prev, [match.id]: 'today' }));
                            setSelectedDeadline(prev => ({
                              ...prev,
                              [match.id]: {
                                date: today,
                                time: prev[match.id]?.date === today ? prev[match.id].time : ''
                              }
                            }));
                          }}
                          className={`flex-1 px-4 py-2 rounded-xl transition-all text-sm ${dateSelectionMode[match.id] === 'today'
                            ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                            : 'bg-white text-cyan-700 hover:bg-cyan-100 border border-cyan-200'
                            }`}
                        >
                          📅 今日
                        </button>
                        <button
                          onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            const tomorrowString = tomorrow.toISOString().split('T')[0];
                            setDateSelectionMode(prev => ({ ...prev, [match.id]: 'tomorrow' }));
                            setSelectedDeadline(prev => ({
                              ...prev,
                              [match.id]: {
                                date: tomorrowString,
                                time: prev[match.id]?.date === tomorrowString ? prev[match.id].time : ''
                              }
                            }));
                          }}
                          className={`flex-1 px-4 py-2 rounded-xl transition-all text-sm ${dateSelectionMode[match.id] === 'tomorrow'
                            ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                            : 'bg-white text-cyan-700 hover:bg-cyan-100 border border-cyan-200'
                            }`}
                        >
                          📅 明日
                        </button>
                        <button
                          onClick={() => {
                            setDateSelectionMode(prev => ({ ...prev, [match.id]: 'calendar' }));
                            // カレンダーの初期月を設定（未設定の場合）
                            if (!calendarMonth[match.id]) {
                              setCalendarMonth(prev => ({
                                ...prev,
                                [match.id]: {
                                  year: new Date().getFullYear(),
                                  month: new Date().getMonth()
                                }
                              }));
                            }
                          }}
                          className={`flex-1 px-4 py-2 rounded-xl transition-all text-sm ${dateSelectionMode[match.id] === 'calendar'
                            ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                            : 'bg-white text-cyan-700 hover:bg-cyan-100 border border-cyan-200'
                            }`}
                        >
                          📆 カレンダー
                        </button>
                      </div>

                      {/* カレンダー表示（カレンダーモード時のみ） */}
                      {dateSelectionMode[match.id] === 'calendar' && (
                        <div className="bg-white rounded-xl p-3 mb-3 border border-cyan-200">
                          {/* 月表示と切り替えボタン */}
                          <div className="flex items-center justify-between mb-3">
                            <button
                              onClick={() => {
                                const current = calendarMonth[match.id] || { year: new Date().getFullYear(), month: new Date().getMonth() };
                                let newMonth = current.month - 1;
                                let newYear = current.year;
                                if (newMonth < 0) {
                                  newMonth = 11;
                                  newYear -= 1;
                                }
                                setCalendarMonth(prev => ({ ...prev, [match.id]: { year: newYear, month: newMonth } }));
                              }}
                              className="px-2 py-1 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                            >
                              ◀
                            </button>
                            <p className="text-sm text-cyan-900">{getCalendarMonth(calendarMonth[match.id]?.year || new Date().getFullYear(), calendarMonth[match.id]?.month || new Date().getMonth())}</p>
                            <button
                              onClick={() => {
                                const current = calendarMonth[match.id] || { year: new Date().getFullYear(), month: new Date().getMonth() };
                                let newMonth = current.month + 1;
                                let newYear = current.year;
                                if (newMonth > 11) {
                                  newMonth = 0;
                                  newYear += 1;
                                }
                                setCalendarMonth(prev => ({ ...prev, [match.id]: { year: newYear, month: newMonth } }));
                              }}
                              className="px-2 py-1 text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                            >
                              ▶
                            </button>
                          </div>

                          {/* 曜日ヘッダー */}
                          <div className="grid grid-cols-7 gap-1 mb-2">
                            {['日', '月', '火', '水', '木', '金', '土'].map((day, index) => (
                              <div
                                key={day}
                                className={`text-center text-xs py-1 ${index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-slate-600'
                                  }`}
                              >
                                {day}
                              </div>
                            ))}
                          </div>

                          {/* カレンダーグリッド */}
                          <div className="grid grid-cols-7 gap-1">
                            {generateCalendarDays(
                              calendarMonth[match.id]?.year || new Date().getFullYear(),
                              calendarMonth[match.id]?.month || new Date().getMonth(),
                              userStatus?.date || new Date()
                            ).map((day, index) => {
                              const isToday = day.dateString === new Date().toISOString().split('T')[0];
                              const isSelected = selectedDeadline[match.id]?.date === day.dateString;

                              return (
                                <button
                                  key={index}
                                  onClick={() => {
                                    if (day.isSelectable) {
                                      setSelectedDeadline(prev => {
                                        const current = prev[match.id];
                                        return {
                                          ...prev,
                                          [match.id]: {
                                            date: day.dateString,
                                            time: current?.date === day.dateString ? current.time : ''
                                          }
                                        };
                                      });
                                    }
                                  }}
                                  disabled={!day.isSelectable}
                                  className={`aspect-square flex items-center justify-center text-xs rounded-lg transition-all ${!day.isSelectable
                                    ? 'text-slate-300 cursor-not-allowed'
                                    : isSelected
                                      ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                                      : isToday
                                        ? 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200'
                                        : !day.isCurrentMonth
                                          ? 'text-slate-400 hover:bg-cyan-50'
                                          : 'text-slate-700 hover:bg-cyan-50'
                                    }`}
                                >
                                  {day.date.getDate()}
                                </button>
                              );
                            })}
                          </div>

                          {/* 凡例 */}
                          <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 bg-cyan-100 rounded"></span>
                              今日
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="w-3 h-3 bg-cyan-400 rounded"></span>
                              選択中
                            </span>
                          </div>
                        </div>
                      )}

                      {/* 時刻選択（選択された日付のみ表示） */}
                      {selectedDeadline[match.id]?.date && (
                        <div>
                          <p className="text-xs text-cyan-700 mb-2">時刻を選択</p>
                          <div className="flex flex-wrap gap-2">
                            {generateTimeOptions(selectedDeadline[match.id].date, userStatus?.date, match.time).map((time) => (
                              <button
                                key={time}
                                onClick={() => setSelectedDeadline(prev => ({
                                  ...prev,
                                  [match.id]: {
                                    date: prev[match.id].date,
                                    time: time
                                  }
                                }))}
                                className={`px-3 py-2 rounded-xl transition-all text-sm ${selectedDeadline[match.id]?.time === time
                                  ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                                  : 'bg-white text-cyan-700 hover:bg-cyan-100 border border-cyan-200'
                                  }`}
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedDeadline[match.id]?.date && selectedDeadline[match.id]?.time && (
                        <p className="text-xs text-cyan-700 mt-2">
                          ⏰ {formatFullDate(new Date(selectedDeadline[match.id].date))} {selectedDeadline[match.id].time}までに返信がない場合、リクエストは自動キャンセルされます
                        </p>
                      )}
                    </div>

                    {/* メッセージ選択 */}
                    <div>
                      <p className="text-sm text-cyan-900 mb-2">簡単なメッセージを選択（任意）</p>
                      <div className="flex flex-wrap gap-2">
                        {quickMessages.map((msg) => (
                          <button
                            key={msg}
                            onClick={() => {
                              if (!selectedDeadline[match.id]?.date || !selectedDeadline[match.id]?.time) {
                                alert('返信期限（日付と時刻）を選択してください');
                                return;
                              }
                              setRequestedMatches(prev => new Set([...prev, match.id]));
                              setShowingMessageFor(null);
                              // メッセージ送信のシミュレーション
                              console.log(`送信: ${msg} to ${match.name}, 期限: ${formatFullDate(new Date(selectedDeadline[match.id].date))} ${selectedDeadline[match.id].time}`);
                            }}
                            className="px-3 py-2 bg-white text-cyan-700 rounded-xl hover:bg-cyan-100 transition-colors text-sm border border-cyan-200"
                          >
                            {msg}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (!selectedDeadline[match.id]?.date || !selectedDeadline[match.id]?.time) {
                          alert('返信期限（日付と時刻）を選択してください');
                          return;
                        }
                        setRequestedMatches(prev => new Set([...prev, match.id]));
                        setShowingMessageFor(null);
                      }}
                      className="w-full px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-colors text-sm"
                    >
                      メッセージなしで送信
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}