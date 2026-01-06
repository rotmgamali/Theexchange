import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../src/theme/colors';

export default function PrivacyScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Button
                        mode="text"
                        onPress={() => router.back()}
                        icon={() => <ArrowLeft size={24} color={theme.colors.text} />}
                        textColor={theme.colors.text}
                    >
                        Back
                    </Button>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text variant="headlineMedium" style={styles.title}>Privacy Policy</Text>
                    <Text variant="bodySmall" style={styles.updated}>Last updated: January 2026</Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>1. Information We Collect</Text>
                    <Text style={styles.paragraph}>
                        The Exchange collects information you provide directly, including your email address,
                        profile information, and transaction history. We use this to provide our services
                        and improve your experience.
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>2. How We Use Your Information</Text>
                    <Text style={styles.paragraph}>
                        • To facilitate service transactions between users{'\n'}
                        • To process payments and maintain escrow{'\n'}
                        • To communicate important updates{'\n'}
                        • To improve our platform and services
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>3. Data Security</Text>
                    <Text style={styles.paragraph}>
                        We implement industry-standard security measures to protect your data.
                        All financial transactions are processed through secure, encrypted channels.
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>4. Your Rights</Text>
                    <Text style={styles.paragraph}>
                        You have the right to access, correct, or delete your personal data.
                        Contact support@theexchange.app for any privacy-related requests.
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>5. Contact Us</Text>
                    <Text style={styles.paragraph}>
                        For questions about this privacy policy, please contact us at:{'\n'}
                        support@theexchange.app
                    </Text>

                    <View style={styles.spacer} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    updated: {
        color: theme.colors.textSecondary,
        marginBottom: 30,
    },
    sectionTitle: {
        color: theme.colors.primary,
        marginTop: 20,
        marginBottom: 10,
    },
    paragraph: {
        color: theme.colors.text,
        lineHeight: 24,
        opacity: 0.9,
    },
    spacer: {
        height: 50,
    },
});
