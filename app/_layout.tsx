import '../src/utils/polyfills';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme';
import { Platform } from 'react-native';
import React from 'react';

// Conditionally import Privy only on native platforms
let PrivyProvider: React.ComponentType<any> | null = null;
let PRIVY_CONFIG: { appId: string } | null = null;

if (Platform.OS !== 'web') {
    // Dynamic import for native only
    const privyModule = require('@privy-io/expo');
    const privyConfig = require('../src/services/privy');
    PrivyProvider = privyModule.PrivyProvider;
    PRIVY_CONFIG = privyConfig.PRIVY_CONFIG;
}

// Simple wrapper for web that provides a mock context
function AuthWrapper({ children }: { children: React.ReactNode }) {
    if (Platform.OS === 'web' || !PrivyProvider || !PRIVY_CONFIG) {
        // On web, skip Privy entirely
        return <>{children}</>;
    }

    return (
        <PrivyProvider
            appId={PRIVY_CONFIG.appId}
            config={{
                loginMethods: ['email', 'google', 'apple'],
                appearance: {
                    theme: 'dark' as 'dark',
                    accentColor: '#22D3EE',
                    showPrivyLogo: false,
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthWrapper>
                <PaperProvider theme={theme}>
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: '#0F172A' },
                        }}
                    >
                        <Stack.Screen name="index" />
                        <Stack.Screen name="dashboard" />
                        <Stack.Screen name="create-service" />
                        <Stack.Screen name="request-service" />
                        <Stack.Screen name="bounty-feed" />
                        <Stack.Screen name="transactions" />
                        <Stack.Screen name="wallet" />
                    </Stack>
                </PaperProvider>
            </AuthWrapper>
        </SafeAreaProvider>
    );
}
