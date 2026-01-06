import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePrivySafe } from '../src/hooks/usePrivySafe';
import { theme } from '../src/theme/colors';
import { marketplaceService } from '../src/services/marketplace';

const CATEGORIES = ['Design', 'Coding', 'Local Help', 'Writing', 'Marketing', 'Consulting'];

export default function RequestServiceScreen() {
    const router = useRouter();
    const { user, authenticated } = usePrivySafe();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [budget, setBudget] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!authenticated || !user) return;
        if (!title) return;

        setLoading(true);
        try {
            await marketplaceService.createBounty(
                user.id,
                title,
                description,
                budget ? parseInt(budget) : 0,
                category
            );
            router.back();
        } catch (err) {
            console.error('Failed to submit request:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="close"
                    iconColor={theme.colors.text}
                    onPress={() => router.back()}
                />
                <Text variant="titleLarge" style={styles.headerTitle}>Request a Service</Text>
                <View style={{ width: 48 }} /> {/* Spacer */}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.infoCard}>
                    <Text variant="bodySmall" style={styles.infoText}>
                        Can't find what you're looking for? Tell us what you need, and The Exchange team will actively source a provider for you.
                    </Text>
                </View>

                <Text variant="labelLarge" style={styles.label}>What do you need?</Text>
                <TextInput
                    mode="flat"
                    placeholder="e.g., Reliable plumber in Utah"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                    textColor={theme.colors.text}
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <Text variant="labelLarge" style={styles.label}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {CATEGORIES.map(cat => (
                        <Button
                            key={cat}
                            mode={category === cat ? "contained" : "outlined"}
                            onPress={() => setCategory(cat)}
                            style={styles.categoryChip}
                            labelStyle={{ fontSize: 12 }}
                        >
                            {cat}
                        </Button>
                    ))}
                </ScrollView>

                <Text variant="labelLarge" style={styles.label}>Details</Text>
                <TextInput
                    mode="flat"
                    placeholder="Be as specific as possible..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, styles.textArea]}
                    textColor={theme.colors.text}
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <Text variant="labelLarge" style={styles.label}>Budget (EXC)</Text>
                <TextInput
                    mode="flat"
                    placeholder="Optional"
                    keyboardType="numeric"
                    value={budget}
                    onChangeText={setBudget}
                    style={styles.input}
                    textColor={theme.colors.text}
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading || !title}
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                    buttonColor={theme.colors.primary}
                    textColor={theme.colors.background}
                >
                    Submit Request
                </Button>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    headerTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
    },
    infoCard: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        padding: 15,
        borderRadius: 12,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: 'rgba(34, 211, 238, 0.2)',
    },
    infoText: {
        color: theme.colors.primary,
        lineHeight: 18,
    },
    label: {
        color: theme.colors.text,
        marginBottom: 8,
    },
    input: {
        backgroundColor: theme.colors.surface,
        marginBottom: 20,
        borderRadius: 8,
    },
    textArea: {
        height: 120,
    },
    categoryScroll: {
        marginBottom: 20,
    },
    categoryChip: {
        marginRight: 10,
        borderRadius: 8,
    },
    submitButton: {
        borderRadius: 12,
        marginTop: 10,
    },
    submitButtonContent: {
        height: 55,
    },
});
