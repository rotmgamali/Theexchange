import '../src/utils/polyfills';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrivyProvider } from '@privy-io/expo';
import { theme } from '../src/theme';
import { PRIVY_CONFIG } from '../src/services/privy';

export default function RootLayout() {
    return (
        <SafeAreaProvider>
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
            </PrivyProvider>
        </SafeAreaProvider>
    );
}
