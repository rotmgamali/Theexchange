import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { theme } from '../src/theme/colors';

export default function TermsScreen() {
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
                    <Text variant="headlineMedium" style={styles.title}>Terms of Service</Text>
                    <Text variant="bodySmall" style={styles.updated}>Last updated: January 2026</Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                    <Text style={styles.paragraph}>
                        By accessing The Exchange, you agree to be bound by these Terms of Service.
                        If you do not agree, please do not use our services.
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>2. Service Description</Text>
                    <Text style={styles.paragraph}>
                        The Exchange is a peer-to-peer marketplace for trading services. Users can
                        offer services, request services, and complete transactions using Exchange Credits (EXC).
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>3. User Responsibilities</Text>
                    <Text style={styles.paragraph}>
                        • Provide accurate information{'\n'}
                        • Complete services as described{'\n'}
                        • Communicate professionally{'\n'}
                        • Report any issues promptly
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>4. Exchange Credits</Text>
                    <Text style={styles.paragraph}>
                        EXC is an in-app currency used for transactions. Credits have no cash value
                        and cannot be purchased directly. They are earned through providing services.
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>5. Escrow System</Text>
                    <Text style={styles.paragraph}>
                        All transactions use our escrow system. Funds are held until the service
                        is completed and approved by the buyer.
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>6. Prohibited Activities</Text>
                    <Text style={styles.paragraph}>
                        • Fraudulent or misleading services{'\n'}
                        • Harassment or abuse{'\n'}
                        • Circumventing the platform{'\n'}
                        • Illegal activities
                    </Text>

                    <Text variant="titleMedium" style={styles.sectionTitle}>7. Termination</Text>
                    <Text style={styles.paragraph}>
                        We reserve the right to suspend or terminate accounts that violate these terms.
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
