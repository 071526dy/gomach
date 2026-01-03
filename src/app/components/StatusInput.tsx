import { useState } from 'react';
import { Calendar } from './ui/calendar';

interface StatusInputProps {
  onComplete: (status: UserStatus) => void;
  initialStatus?: UserStatus;
}

export interface UserStatus {
  date: Date;
  gyms: string[];
  time: string;
  duration: string;
  category: string[];
  trainingType: string; // 追加
  style: string;
  experienceLevel: string;
  levelPreference: string;
  genderPreference: string;
  expertiseType: string; // 'teach' | 'learn' | 'both'
  teachExpertise: string[];
  learnExpertise: string[];
  trainingDays: string[]; // トレーニング曜日
}

export function StatusInput({ onComplete, initialStatus }: StatusInputProps) {
  const [status, setStatus] = useState<UserStatus>(initialStatus || {
    date: new Date(),
    gyms: [],
    time: '',
    duration: '',
    category: [],
    trainingType: '', // 追加
    style: '',
    experienceLevel: '',
    levelPreference: '',
    genderPreference: '',
    expertiseType: 'both',
    teachExpertise: [],
    learnExpertise: [],
    trainingDays: [], // トレーニング曜日
  });

  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedLine, setSelectedLine] = useState<string>('all');
  const [timePeriod, setTimePeriod] = useState<'morning' | 'afternoon'>('afternoon');

  // 路線と駅のマッピング
  const lineStations: { [key: string]: string[] } = {
    all: ['渋谷', '新宿', '恵比寿', '表参道', '池袋', '中目黒', '六本木', '原宿', '代官山', '自由が丘', '新宿三丁目', '明治神宮前', '北参道', '代々木', '目黒'],
    yamanote: ['渋谷', '新宿', '池袋', '恵比寿', '原宿', '目黒', '代々木', '五反田', '大崎', '品川'],
    fukutoshin: ['渋谷', '新宿三丁目', '池袋', '明治神宮前', '北参道', '東新宿', '雑司が谷'],
    ginza: ['渋谷', '表参道', '青山一丁目', '赤坂見附', '銀座', '新橋', '虎ノ門'],
    hanzomon: ['渋谷', '表参道', '青山一丁目', '永田町', '半蔵門', '大手町', '押上'],
    toyoko: ['渋谷', '代官山', '中目黒', '祐天寺', '学芸大学', '都立大学', '自由が丘'],
    denentoshi: ['渋谷', '三軒茶屋', '駒沢大学', '桜新町', '用賀', '二子玉川', '溝の口'],
  };

  const lines = [
    { id: 'all', name: 'すべて', color: 'slate' },
    { id: 'yamanote', name: '山手線', color: 'green' },
    { id: 'fukutoshin', name: '副都心線', color: 'amber' },
    { id: 'ginza', name: '銀座線', color: 'orange' },
    { id: 'hanzomon', name: '半蔵門線', color: 'purple' },
    { id: 'toyoko', name: '東横線', color: 'pink' },
    { id: 'denentoshi', name: '田園都市線', color: 'emerald' },
  ];

  const stations = lineStations[selectedLine] || lineStations.all;

  // 日付選択肢を生成（今日から7日間 + カレンダーで選択された日付）
  const generateDateOptions = () => {
    const options = [];
    const today = new Date();

    // 今日から7日間を追加
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      options.push(date);
    }

    // 選択された日付が7日間の範囲外の場合は追加
    const selectedDateString = status.date.toDateString();
    const isInRange = options.some(date => date.toDateString() === selectedDateString);

    if (!isInRange) {
      options.push(status.date);
    }

    // 日付順にソート
    options.sort((a, b) => a.getTime() - b.getTime());

    return options;
  };

  const dateOptions = generateDateOptions();

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return '今日';
    if (date.toDateString() === tomorrow.toDateString()) return '明日';

    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    return `${date.getMonth() + 1}/${date.getDate()} (${weekdays[date.getDay()]})`;
  };

  // 開始時間の選択肢（5:00から23:00まで）
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 5; hour <= 23; hour++) {
      options.push(`${hour}:00`);
      if (hour < 23) {
        options.push(`${hour}:30`);
      }
    }
    return options;
  };

  const times = generateTimeOptions();
  const categories = ['脚', '背中', '胸', '上半身', '有酸素'];
  const trainingTypes = [
    { value: 'weight', label: 'ウエイト', emoji: '🏋️' },
    { value: 'pilates', label: 'ピラティス', emoji: '🧘' },
    { value: 'exercise', label: 'エクササイズ', emoji: '💪' },
    { value: 'running', label: 'ランニング', emoji: '🏃' },
    { value: 'yoga', label: 'ヨガ', emoji: '🧘‍♀️' },
    { value: 'swimming', label: 'スイミング', emoji: '🏊' },
  ];
  const durations = ['30分', '60分', '90分', '120分', '150分', '180分'];
  const styles = [
    '入口から一緒に入れたらOK',
    '同じ時間帯だけ一緒',
    '近いメニューで軽く合わせる',
  ];

  const experienceLevels = [
    { value: 'beginner', label: '初心者（3ヶ月未満）', emoji: '🌱' },
    { value: 'intermediate', label: '中級者（3ヶ月〜2年）', emoji: '💪' },
    { value: 'advanced', label: '上級者（2年〜5年）', emoji: '🏋️' },
    { value: 'expert', label: 'エキスパート（5年以上）', emoji: '⭐' },
  ];

  const levelPreferences = [
    { value: 'same', label: '同じくらいのレベル', emoji: '🤝', desc: '同レベルで励まし合いたい' },
    { value: 'learn', label: '教えてもらいたい', emoji: '📚', desc: '上級者にフォームなど教わりたい' },
    { value: 'teach', label: '教えてもOK', emoji: '🎓', desc: '初心者にアドバイスできる' },
  ];

  const genderPreferences = [
    { value: 'all', label: 'どちらでも', emoji: '👫' },
    { value: 'male', label: '男性のみ', emoji: '👨' },
    { value: 'female', label: '女性のみ', emoji: '👩' },
  ];

  const toggleStation = (station: string) => {
    setStatus((prev) => ({
      ...prev,
      gyms: prev.gyms.includes(station)
        ? prev.gyms.filter((g) => g !== station)
        : [...prev.gyms, station],
    }));
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      setStatus((prev) => ({ ...prev, date }));
      setShowCalendar(false);
    }
  };

  const isComplete = status.gyms.length > 0 && status.time && status.category.length > 0 && status.style && status.experienceLevel && status.levelPreference && status.genderPreference;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      <div className="max-w-md mx-auto px-6 py-8">
        <h1 className="mb-8">トレーニング予定を設定</h1>

        {/* セクション0: 日付選択 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">いつ行く？</label>

          {!showCalendar ? (
            <div className="flex flex-col gap-2">
              {dateOptions.map((date) => (
                <button
                  key={date.toISOString()}
                  onClick={() => setStatus((prev) => ({ ...prev, date }))}
                  className={`px-5 py-3 rounded-2xl transition-all text-left ${status.date.toDateString() === date.toDateString()
                      ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {formatDate(date)}
                </button>
              ))}
              <button
                onClick={() => setShowCalendar(true)}
                className="px-5 py-3 rounded-2xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-all text-left border-2 border-dashed border-purple-300"
              >
                📅 カレンダーから選ぶ
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {/* 選択中の日付表示 */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-4 border-2 border-cyan-200">
                <p className="text-sm text-cyan-700 mb-1">選択中の日付</p>
                <p className="text-xl text-cyan-900">
                  {status.date.getFullYear()}年{status.date.getMonth() + 1}月{status.date.getDate()}日
                  ({['日', '月', '火', '水', '木', '金', '土'][status.date.getDay()]})
                </p>
                <p className="text-sm text-cyan-600 mt-1">
                  {formatDate(status.date)}
                </p>
              </div>

              {/* カレンダー */}
              <div className="bg-slate-50 rounded-2xl p-2">
                <Calendar
                  mode="single"
                  selected={status.date}
                  onSelect={handleCalendarSelect}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  className="w-full"
                />
              </div>

              {/* 確定・戻るボタン */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowCalendar(false)}
                  className="flex-1 px-5 py-3 rounded-2xl bg-slate-200 text-slate-700 hover:bg-slate-300 transition-all"
                >
                  ← 戻る
                </button>
                <button
                  onClick={() => setShowCalendar(false)}
                  className="flex-1 px-5 py-3 rounded-2xl bg-cyan-400 text-white hover:bg-cyan-500 transition-all shadow-lg shadow-cyan-400/30"
                >
                  ✓ 確定
                </button>
              </div>
            </div>
          )}
        </div>

        {/* セクション1: 希望エリア（最寄り駅） */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">希望エリア（最寄り駅）</label>

          {/* 路線タブ */}
          <div className="mb-4 overflow-x-auto pb-2">
            <div className="flex gap-2 min-w-max">
              {lines.map((line) => (
                <button
                  key={line.id}
                  onClick={() => setSelectedLine(line.id)}
                  className={`px-4 py-2 rounded-full transition-all whitespace-nowrap ${selectedLine === line.id
                      ? `bg-${line.color}-500 text-white shadow-lg shadow-${line.color}-500/30`
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  style={
                    selectedLine === line.id
                      ? {
                        backgroundColor:
                          line.color === 'green' ? '#22c55e' :
                            line.color === 'amber' ? '#f59e0b' :
                              line.color === 'orange' ? '#f97316' :
                                line.color === 'purple' ? '#a855f7' :
                                  line.color === 'pink' ? '#ec4899' :
                                    line.color === 'emerald' ? '#10b981' :
                                      '#64748b',
                        color: 'white'
                      }
                      : {}
                  }
                >
                  {line.name}
                </button>
              ))}
            </div>
          </div>

          {/* 駅選択 */}
          <div className="flex flex-wrap gap-2">
            {stations.map((station) => (
              <button
                key={station}
                onClick={() => toggleStation(station)}
                className={`px-5 py-3 rounded-full transition-all ${status.gyms.includes(station)
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                📍 {station}
              </button>
            ))}
          </div>
        </div>

        {/* セクション2: 開始時間 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">開始時間</label>

          {/* 午前・午後選択 */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setTimePeriod('morning')}
              className={`flex-1 px-5 py-3 rounded-2xl transition-all ${timePeriod === 'morning'
                  ? 'bg-amber-400 text-white shadow-lg shadow-amber-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              🌅 午前（5:00-11:59）
            </button>
            <button
              onClick={() => setTimePeriod('afternoon')}
              className={`flex-1 px-5 py-3 rounded-2xl transition-all ${timePeriod === 'afternoon'
                  ? 'bg-indigo-400 text-white shadow-lg shadow-indigo-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              🌙 午後（12:00-23:00）
            </button>
          </div>

          {/* 時間入力 */}
          <input
            type="time"
            value={status.time}
            onChange={(e) => setStatus((prev) => ({ ...prev, time: e.target.value }))}
            className="w-full px-5 py-4 rounded-2xl bg-slate-100 text-slate-900 text-lg border-2 border-transparent focus:border-cyan-400 focus:bg-white focus:outline-none transition-all"
            min={timePeriod === 'morning' ? '05:00' : '12:00'}
            max={timePeriod === 'morning' ? '11:59' : '23:00'}
          />
          {status.time && (
            <p className="mt-2 text-sm text-cyan-600">
              ⏰ {status.time} からトレーニング開始
            </p>
          )}
        </div>

        {/* セクション3: 今日のカテゴリ */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">今日のカテゴリ（複数選択可）</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setStatus((prev) => ({
                  ...prev,
                  category: prev.category.includes(category)
                    ? prev.category.filter((c) => c !== category)
                    : [...prev.category, category]
                }))}
                className={`px-5 py-3 rounded-full transition-all ${status.category.includes(category)
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* セクション3.3: 好きなトレーニング */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">好きなトレーニング</label>
          <div className="flex flex-wrap gap-2">
            {trainingTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setStatus((prev) => ({ ...prev, trainingType: type.value }))}
                className={`px-5 py-3 rounded-full transition-all ${status.trainingType === type.value
                    ? 'bg-purple-400 text-white shadow-lg shadow-purple-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <span className="mr-2">{type.emoji}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* セクション3.5: トレーニング時間 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">トレーニング時間</label>
          <div className="grid grid-cols-3 gap-2">
            {durations.map((duration) => (
              <button
                key={duration}
                onClick={() => setStatus((prev) => ({ ...prev, duration }))}
                className={`px-4 py-3 rounded-2xl transition-all ${status.duration === duration
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                ⏱️ {duration}
              </button>
            ))}
          </div>
        </div>

        {/* セクション4: 参加スタイル */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">参加スタイル</label>
          <div className="flex flex-col gap-2">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setStatus((prev) => ({ ...prev, style }))}
                className={`px-5 py-3 rounded-2xl transition-all text-left ${status.style === style
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* セクション6: トレーニング歴 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">あなたのトレーニング歴</label>
          <div className="flex flex-col gap-2">
            {experienceLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setStatus((prev) => ({ ...prev, experienceLevel: level.value }))}
                className={`px-5 py-3 rounded-2xl transition-all text-left ${status.experienceLevel === level.value
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <span className="mr-2">{level.emoji}</span>
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* セクション7: レベルマッチング希望 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">マッチング相手のレベル希望</label>
          <div className="flex flex-col gap-2">
            {levelPreferences.map((pref) => (
              <button
                key={pref.value}
                onClick={() => setStatus((prev) => ({ ...prev, levelPreference: pref.value }))}
                className={`px-5 py-3 rounded-2xl transition-all text-left ${status.levelPreference === pref.value
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="mr-2">{pref.emoji}</span>
                    <span>{pref.label}</span>
                  </div>
                </div>
                <p className={`text-sm mt-1 ml-6 ${status.levelPreference === pref.value ? 'text-cyan-50' : 'text-slate-500'
                  }`}>
                  {pref.desc}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* セクション8: 性別マッチング希望 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">マッチング相手の性別希望</label>
          <div className="flex flex-col gap-2">
            {genderPreferences.map((pref) => (
              <button
                key={pref.value}
                onClick={() => setStatus((prev) => ({ ...prev, genderPreference: pref.value }))}
                className={`px-5 py-3 rounded-2xl transition-all text-left ${status.genderPreference === pref.value
                    ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="mr-2">{pref.emoji}</span>
                    <span>{pref.label}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* セクション9: 専門知識のスタンス */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">専門知識のスタンス</label>
          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => setStatus((prev) => ({ ...prev, expertiseType: 'teach' }))}
              className={`px-5 py-3 rounded-2xl transition-all text-left ${status.expertiseType === 'teach'
                  ? 'bg-indigo-400 text-white shadow-lg shadow-indigo-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              👨‍🏫 教える専門
            </button>
            <button
              onClick={() => setStatus((prev) => ({ ...prev, expertiseType: 'learn' }))}
              className={`px-5 py-3 rounded-2xl transition-all text-left ${status.expertiseType === 'learn'
                  ? 'bg-blue-400 text-white shadow-lg shadow-blue-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              📚 学ぶ専門
            </button>
            <button
              onClick={() => setStatus((prev) => ({ ...prev, expertiseType: 'both' }))}
              className={`px-5 py-3 rounded-2xl transition-all text-left ${status.expertiseType === 'both'
                  ? 'bg-purple-400 text-white shadow-lg shadow-purple-400/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
            >
              🎓 両方
            </button>
          </div>

          {/* 教えられる専門 */}
          {(status.expertiseType === 'both' || status.expertiseType === 'teach') && (
            <div className="mb-4 p-4 bg-green-50 rounded-2xl">
              <label className="block mb-3 text-green-800">教えられる専門（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {trainingTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setStatus((prev) => ({
                      ...prev,
                      teachExpertise: prev.teachExpertise.includes(type.label)
                        ? prev.teachExpertise.filter((e) => e !== type.label)
                        : [...prev.teachExpertise, type.label]
                    }))}
                    className={`px-4 py-2 rounded-full transition-all text-sm ${status.teachExpertise.includes(type.label)
                        ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                        : 'bg-white text-green-700 hover:bg-green-100'
                      }`}
                  >
                    <span className="mr-1">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 教えて欲しい専門 */}
          {(status.expertiseType === 'both' || status.expertiseType === 'learn') && (
            <div className="p-4 bg-blue-50 rounded-2xl">
              <label className="block mb-3 text-blue-800">教えて欲しい専門（複数選択可）</label>
              <div className="flex flex-wrap gap-2">
                {trainingTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setStatus((prev) => ({
                      ...prev,
                      learnExpertise: prev.learnExpertise.includes(type.label)
                        ? prev.learnExpertise.filter((e) => e !== type.label)
                        : [...prev.learnExpertise, type.label]
                    }))}
                    className={`px-4 py-2 rounded-full transition-all text-sm ${status.learnExpertise.includes(type.label)
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-white text-blue-700 hover:bg-blue-100'
                      }`}
                  >
                    <span className="mr-1">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* セーフティメッセージ */}
        <div className="bg-cyan-50 rounded-2xl p-4 mb-4 border border-cyan-100">
          <p className="text-sm text-cyan-900 leading-relaxed">
            💡 DM機能なし・連絡先交換を推奨しない・勧誘や営業・撮影は禁止・合流は共有スペースのみ
          </p>
        </div>

        {/* セクション10: トレーニング曜日 */}
        <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm">
          <label className="block mb-4 text-slate-700">普段トレーニングする曜日（複数選択可）</label>
          <p className="text-sm text-slate-500 mb-4">継続的に一緒にトレーニングできる相手を見つけやすくなります</p>
          <div className="grid grid-cols-7 gap-2">
            {['月', '火', '水', '木', '金', '土', '日'].map((day) => (
              <button
                key={day}
                onClick={() => setStatus((prev) => ({
                  ...prev,
                  trainingDays: prev.trainingDays.includes(day)
                    ? prev.trainingDays.filter((d) => d !== day)
                    : [...prev.trainingDays, day]
                }))}
                className={`aspect-square rounded-2xl transition-all flex items-center justify-center ${status.trainingDays.includes(day)
                    ? 'bg-purple-400 text-white shadow-lg shadow-purple-400/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 固定CTAボタン */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => isComplete && onComplete(status)}
            disabled={!isComplete}
            className={`w-full py-4 rounded-2xl transition-all ${isComplete
                ? 'bg-cyan-400 text-white shadow-lg shadow-cyan-400/30 hover:bg-cyan-500'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
          >
            この条件で探す
          </button>
        </div>
      </div>
    </div>
  );
}