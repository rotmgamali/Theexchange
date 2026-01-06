import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { Mail } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme/colors';

// Only import Privy on native platforms
let usePrivy: any = null;
if (Platform.OS !== 'web') {
    try {
        usePrivy = require('@privy-io/expo').usePrivy;
    } catch (e) {
        console.log('Privy not available');
    }
}

export default function LoginScreen() {
    const router = useRouter();

    // Use Privy only on native
    let privyState = { login: null as any, ready: true, authenticated: false, user: null };
    if (Platform.OS !== 'web' && usePrivy) {
        try {
            privyState = usePrivy();
        } catch (e) {
            console.log('Privy hook error:', e);
        }
    }

    const handleLogin = async () => {
        if (Platform.OS === 'web') {
            // On web, go directly to dashboard
            router.replace('/dashboard');
        } else if (privyState.login) {
            try {
                await privyState.login();
            } catch (err) {
                console.error('Login failed:', err);
            }
        }
    };

    const handleSkip = () => {
        router.replace('/dashboard');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.overlay}>
                <View style={styles.heroSection}>
                    <Text variant="displaySmall" style={styles.logoText}>The Exchange</Text>
                    <Text variant="titleMedium" style={styles.tagline}>
                        Trade Services. Earn Credits. Exchange for Value.
                    </Text>
                </View>

                <View style={styles.authSection}>
                    <Text variant="headlineSmall" style={styles.getStarted}>Get Started</Text>

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        style={styles.loginButton}
                        contentStyle={styles.buttonContent}
                        icon={() => <Mail size={20} color={theme.colors.background} />}
                    >
                        {Platform.OS === 'web' ? 'Enter App' : 'Continue with Email'}
                    </Button>

                    {Platform.OS === 'web' && (
                        <Text style={styles.webNote}>
                            Web Preview Mode - Full auth on mobile app
                        </Text>
                    )}

                    {Platform.OS !== 'web' && (
                        <>
                            <View style={styles.divider}>
                                <View style={styles.line} />
                                <Text style={styles.dividerText}>OR</Text>
                                <View style={styles.line} />
                            </View>

                            <View style={styles.socialRow}>
                                <TouchableOpacity style={styles.socialButton} onPress={handleLogin}>
                                    <Avatar.Icon size={40} icon="google" color="#DB4437" style={styles.socialIcon} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton} onPress={handleLogin}>
                                    <Avatar.Icon size={40} icon="apple" color="#FFFFFF" style={styles.socialIcon} />
                                </TouchableOpacity>
                            </View>
                        </>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            By continuing, you agree to our Terms of Service.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    overlay: {
        flex: 1,
        padding: 30,
        justifyContent: 'space-between',
    },
    heroSection: {
        marginTop: 80,
        alignItems: 'center',
    },
    logoText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontStyle: 'italic',
        letterSpacing: 1,
    },
    tagline: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 10,
        opacity: 0.8,
    },
    authSection: {
        marginBottom: 40,
    },
    getStarted: {
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: 'bold',
    },
    loginButton: {
        borderRadius: 12,
        backgroundColor: theme.colors.primary,
    },
    buttonContent: {
        height: 55,
    },
    webNote: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: 15,
        fontSize: 12,
        opacity: 0.7,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 25,
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    dividerText: {
        color: theme.colors.textSecondary,
        marginHorizontal: 15,
        fontSize: 12,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
    },
    socialButton: {
        padding: 5,
    },
    socialIcon: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    footer: {
        marginTop: 20,
        alignItems: 'center',
    },
    footerText: {
        color: theme.colors.textSecondary,
        fontSize: 10,
        textAlign: 'center',
    },
});
