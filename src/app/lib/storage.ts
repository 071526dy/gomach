
const STORAGE_KEYS = {
  USER_PROFILE: 'gomach_user_profile',
  USER_STATUS: 'gomach_user_status',
  MATCHES: 'gomach_matches',
  MESSAGES: 'gomach_messages',
  SCHEDULES: 'gomach_schedules',
  GO_MEMBERS: 'gomach_go_members',
  COMMON_GOALS: 'gomach_common_goals',
};

export const storage = {
  get: <T>(key: keyof typeof STORAGE_KEYS): T | null => {
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : null;
  },
  set: <T>(key: keyof typeof STORAGE_KEYS, value: T): void => {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(value));
  },
  clear: (key: keyof typeof STORAGE_KEYS): void => {
    localStorage.removeItem(STORAGE_KEYS[key]);
  }
};
