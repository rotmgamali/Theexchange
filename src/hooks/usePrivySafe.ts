import { Platform } from 'react-native';

// Mock Privy state for web
const mockPrivyState = {
    user: null,
    authenticated: false,
    ready: true,
    login: async () => { },
    logout: async () => { },
};

// Web-safe usePrivy hook
export function usePrivySafe() {
    if (Platform.OS === 'web') {
        return mockPrivyState;
    }

    // On native, use the real Privy hook
    try {
        const { usePrivy } = require('@privy-io/expo');
        return usePrivy();
    } catch (e) {
        console.warn('Privy not available, using mock');
        return mockPrivyState;
    }
}

// Get user ID safely
export function useUserId(): string | null {
    const { user, authenticated } = usePrivySafe();
    if (!authenticated || !user) return null;
    return user.id;
}
