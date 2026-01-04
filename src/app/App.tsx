import { useState, useEffect } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { StatusInput, UserStatus } from './components/StatusInput';
import { MatchList } from './components/MatchList';
import { CompatibilityModal } from './components/CompatibilityModal';
import { MiniChat } from './components/MiniChat';
import { CommonGoals } from './components/CommonGoals';
import { MyCalendar } from './components/MyCalendar';
import { UserProfile } from './components/UserProfile';
import { OtherUserProfile } from './components/OtherUserProfile';
import { GoMembers } from './components/GoMembers';
import { Welcome } from './components/Welcome';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { storage } from './lib/storage';

type Screen = 'matches' | 'status' | 'chat' | 'goals' | 'calendar' | 'profile' | 'otherProfile' | 'goMembers';
type ViewMode = 'desktop' | 'mobile';

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

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [screen, setScreen] = useState<Screen>('matches');
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [viewingMatch, setViewingMatch] = useState<Match | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [chatMatch, setChatMatch] = useState<Match | null>(null);

  // スマホ端末かどうかを判定
  const isPhysicalMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const [viewMode, setViewMode] = useState<ViewMode>(isPhysicalMobile ? 'mobile' : 'desktop');

  useEffect(() => {
    // 保存されたステータスを読み込む
    const savedStatus = storage.get<UserStatus>('USER_STATUS');
    if (savedStatus) {
      // Dateオブジェクトをデシリアライズ（JSON.parseは文字列にするため）
      setUserStatus({
        ...savedStatus,
        date: new Date(savedStatus.date)
      });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-cyan-400 border-t-transparent"></div>
      </div>
    );
  }


  const handleStatusComplete = (status: UserStatus) => {
    setUserStatus(status);
    storage.set('USER_STATUS', status);
    setScreen('matches');
  };

  const handleMatchSelect = (match: Match) => {
    setSelectedMatch(match);
    setShowModal(true);
  };

  const handleInvite = (match: Match) => {
    setShowModal(false);
    setChatMatch(match);
    setScreen('chat');
  };

  const handleBackToMatches = () => {
    setScreen('matches');
    setChatMatch(null);
  };

  const handleScheduleClick = (schedule: ScheduledWorkout) => {
    console.log('Clicked schedule:', schedule);
  };

  const handleOtherProfileClick = (match: Match) => {
    setViewingMatch(match);
    setScreen('otherProfile');
  };

  const handleInviteFromProfile = () => {
    if (viewingMatch) {
      setChatMatch(viewingMatch);
      setScreen('chat');
    }
  };

  const handleDirectChat = (match: Match) => {
    setChatMatch(match);
    setScreen('chat');
  };

  const handleCancelMatch = () => {
    setChatMatch(null);
    setScreen('matches');
  };

  return (
    <div className="relative min-h-screen bg-slate-100">
      {/* View Mode Toggle - PCの場合のみ表示 */}
      {!isPhysicalMobile && (
        <div className="fixed bottom-6 right-6 z-[9999] flex gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-white/20">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'desktop'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200 scale-105'
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            title="Desktop View"
          >
            <Monitor size={20} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-2.5 rounded-xl transition-all duration-300 ${viewMode === 'mobile'
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-200 scale-105'
              : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            title="Mobile View"
          >
            <Smartphone size={20} />
          </button>
        </div>
      )}

      <div className={`transition-all duration-500 ease-in-out flex items-center justify-center min-h-screen ${(viewMode === 'mobile' && !isPhysicalMobile) ? 'py-8' : ''
        }`}>
        <div className={`transition-all duration-500 ease-in-out bg-white overflow-hidden ${(viewMode === 'mobile' && !isPhysicalMobile)
          ? 'w-[375px] h-[667px] rounded-[3rem] shadow-2xl border-[8px] border-slate-900 relative'
          : 'w-full min-h-screen'
          }`}>
          {/* Mobile Notch simulation - PCでのプレビュー時のみ表示 */}
          {(viewMode === 'mobile' && !isPhysicalMobile) && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
              <div className="w-8 h-1 rounded-full bg-slate-800" />
            </div>
          )}

          <div className="w-full h-full overflow-y-auto scrollbar-hide">
            {!isAuthenticated ? (
              <Welcome />
            ) : (
              <>
                {/* マッチ一覧画面（ホーム） */}
                {screen === 'matches' && (
                  <MatchList
                    userStatus={userStatus}
                    onMatchSelect={handleMatchSelect}
                    onDirectChat={handleDirectChat}
                    onSearchClick={() => setScreen('status')}
                    onGoalsClick={() => setScreen('goals')}
                    onCalendarClick={() => setScreen('calendar')}
                    onProfileClick={() => setScreen('profile')}
                    onOtherProfileClick={handleOtherProfileClick}
                    onGoMembersClick={() => setScreen('goMembers')}
                  />
                )}

                {/* ステータス入力画面 */}
                {screen === 'status' && (
                  <StatusInput
                    onComplete={handleStatusComplete}
                    initialStatus={userStatus || undefined}
                  />
                )}

                {/* ミニチャット画面 */}
                {screen === 'chat' && chatMatch && (
                  <MiniChat
                    match={chatMatch}
                    onBack={handleBackToMatches}
                    onCancelMatch={handleCancelMatch}
                  />
                )}

                {/* 共通ゴール画面 */}
                {screen === 'goals' && (
                  <CommonGoals onBack={() => setScreen('matches')} />
                )}

                {/* マイカレンダー画面 */}
                {screen === 'calendar' && (
                  <MyCalendar
                    onBack={() => setScreen('matches')}
                    onScheduleClick={handleScheduleClick}
                  />
                )}

                {/* 相性詳細モーダル */}
                {showModal && (
                  <CompatibilityModal
                    match={selectedMatch}
                    onClose={() => setShowModal(false)}
                    onInvite={handleInvite}
                  />
                )}

                {/* ユーザープロフィール画面 */}
                {screen === 'profile' && (
                  <UserProfile onBack={() => setScreen('matches')} />
                )}

                {/* 他のユーザープロフィール画面 */}
                {screen === 'otherProfile' && (
                  <OtherUserProfile
                    match={viewingMatch}
                    onBack={() => setScreen('matches')}
                    onInvite={handleInviteFromProfile}
                  />
                )}

                {/* グループメンバー画面 */}
                {screen === 'goMembers' && (
                  <GoMembers onBack={() => setScreen('matches')} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}