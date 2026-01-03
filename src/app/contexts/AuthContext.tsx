
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../lib/storage';

interface UserProfile {
    name: string;
    area: string;
    nearbyStations: string[];
    experienceLevel: string;
    preferredTime: string;
    preferredCategories: string[];
    companionStyle: string;
    gender: string;
    genderPreference: string;
}

interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    login: (profile: UserProfile) => void;
    logout: () => void;
    updateProfile: (profile: Partial<UserProfile>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = storage.get<UserProfile>('USER_PROFILE');
        if (savedUser) {
            setUser(savedUser);
        }
        setIsLoading(false);
    }, []);

    const login = (profile: UserProfile) => {
        storage.set('USER_PROFILE', profile);
        setUser(profile);
    };

    const logout = () => {
        storage.clear('USER_PROFILE');
        storage.clear('USER_STATUS');
        setUser(null);
    };

    const updateProfile = (profileUpdate: Partial<UserProfile>) => {
        if (user) {
            const updatedUser = { ...user, ...profileUpdate };
            storage.set('USER_PROFILE', updatedUser);
            setUser(updatedUser);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, updateProfile, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
