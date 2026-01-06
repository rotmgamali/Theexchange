import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { Text, Button, Avatar } from 'react-native-paper';
import { LogIn, Github, Mail, Smartphone } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { theme } from '../src/theme/colors';
import { profileService } from '../src/services/profiles';

export default function LoginScreen() {
    const router = useRouter();
    const { login, ready, authenticated, user } = usePrivy();

    useEffect(() => {
        const syncUser = async () => {
            if (ready && authenticated && user) {
                try {
                    await profileService.syncProfile(
                        user.id,
                        user.email?.address,
                        user.email?.address?.split('@')[0],
                        undefined
                    );
                    router.replace('/dashboard');
                } catch (err) {
                    console.error('Profile sync failed:', err);
                }
            }
        };
        syncUser();
    }, [ready, authenticated, user]);

    const handleLogin = async () => {
        try {
            await login();
        } catch (err) {
            console.error('Login failed:', err);
        }
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
                        disabled={!ready}
                    >
                        Continue with Email
                    </Button>

                    <View style={styles.divider}>
                        <View style={styles.line} />
                        <Text style={styles.dividerText}>OR</Text>
                        <View style={styles.line} />
                    </View>

                    <View style={styles.socialRow}>
                        <TouchableOpacity style={styles.socialButton} onPress={handleLogin} disabled={!ready}>
                            <Avatar.Icon size={40} icon="google" color="#DB4437" style={styles.socialIcon} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton} onPress={handleLogin} disabled={!ready}>
                            <Avatar.Icon size={40} icon="apple" color="#FFFFFF" style={styles.socialIcon} />
                        </TouchableOpacity>
                    </View>

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
    authButton: {
        marginBottom: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    buttonContent: {
        height: 55,
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
