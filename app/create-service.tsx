import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Switch } from 'react-native';
import { Text, TextInput, Button, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { usePrivySafe } from '../src/hooks/usePrivySafe';
import { theme } from '../src/theme/colors';
import { marketplaceService } from '../src/services/marketplace';

const CATEGORIES = ['Design', 'Coding', 'Local Help', 'Writing', 'Marketing', 'Consulting'];

export default function CreateServiceScreen() {
    const router = useRouter();
    const { user, authenticated } = usePrivySafe();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [isRemote, setIsRemote] = useState(true);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!authenticated || !user) return;
        if (!title || !price) return;

        setLoading(true);
        try {
            await marketplaceService.createService(
                user.id,
                title,
                description,
                parseInt(price),
                category
            );
            router.back();
        } catch (err) {
            console.error('Failed to post service:', err);
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
                <Text variant="titleLarge" style={styles.headerTitle}>List a Service</Text>
                <View style={{ width: 48 }} /> {/* Spacer */}
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text variant="labelLarge" style={styles.label}>Service Title</Text>
                <TextInput
                    mode="flat"
                    placeholder="e.g., Professional Logo Design"
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

                <Text variant="labelLarge" style={styles.label}>Description</Text>
                <TextInput
                    mode="flat"
                    placeholder="Explain what you offer..."
                    multiline
                    numberOfLines={4}
                    value={description}
                    onChangeText={setDescription}
                    style={[styles.input, styles.textArea]}
                    textColor={theme.colors.text}
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <Text variant="labelLarge" style={styles.label}>Price (EXC)</Text>
                <TextInput
                    mode="flat"
                    placeholder="0"
                    keyboardType="numeric"
                    value={price}
                    onChangeText={setPrice}
                    style={styles.input}
                    textColor={theme.colors.text}
                    placeholderTextColor={theme.colors.textSecondary}
                />

                <View style={styles.switchRow}>
                    <Text variant="labelLarge" style={styles.label}>Remote Service</Text>
                    <Switch
                        value={isRemote}
                        onValueChange={setIsRemote}
                        trackColor={{ false: '#334155', true: theme.colors.primary }}
                        thumbColor={isRemote ? '#FFF' : '#94A3B8'}
                    />
                </View>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={loading || !title || !price}
                    style={styles.submitButton}
                    contentStyle={styles.submitButtonContent}
                    buttonColor={theme.colors.primary}
                    textColor={theme.colors.background}
                >
                    Post Service
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
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
        backgroundColor: theme.colors.surface,
        padding: 15,
        borderRadius: 12,
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
    },
    submitButtonContent: {
        height: 55,
    },
});
