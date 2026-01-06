import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Avatar, Chip, IconButton, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Clock, CheckCircle, AlertTriangle, XCircle } from 'lucide-react-native';
import { theme } from '../src/theme/colors';
import { usePrivy } from '@privy-io/expo';
import { transactionService } from '../src/services/transactions';
import { supabase } from '../src/services/supabase';

export default function TransactionsScreen() {
    const router = useRouter();
    const { user, authenticated } = usePrivy();
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        if (authenticated && user) {
            fetchTransactions();
        }
    }, [authenticated, user, filter]);

    const fetchTransactions = async () => {
        if (!user) return;
        setLoading(true);
        try {
            let query = supabase
                .from('transactions')
                .select('*, provider:profiles!transactions_provider_id_fkey(username, avatar_url), buyer:profiles!transactions_buyer_id_fkey(username, avatar_url), service:services(title)')
                .or(`buyer_id.eq.${user.id},provider_id.eq.${user.id}`)
                .order('created_at', { ascending: false });

            if (filter !== 'all') {
                query = query.eq('status', filter);
            }

            const { data, error } = await query;
            if (error) throw error;

            const structuredData = data.map((tx: any) => ({
                ...tx,
                role: tx.buyer_id === user.id ? 'buyer' : 'provider'
            }));

            setTransactions(structuredData);
        } catch (err) {
            console.error('Failed to fetch transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { icon: Clock, color: '#EAB308', label: 'In Escrow' };
            case 'completed': return { icon: CheckCircle, color: theme.colors.success, label: 'Completed' };
            case 'disputed': return { icon: AlertTriangle, color: '#F97316', label: 'Disputed' };
            case 'cancelled': return { icon: XCircle, color: theme.colors.error, label: 'Cancelled' };
            default: return { icon: Clock, color: theme.colors.textSecondary, label: status };
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const config = getStatusConfig(item.status);
        const StatusIcon = config.icon;
        const isBuyer = item.role === 'buyer';
        const partner = isBuyer ? item.provider : item.buyer;

        return (
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.cardHeader}>
                        <View style={styles.typeTag}>
                            <Text variant="labelSmall" style={styles.typeText}>{isBuyer ? 'OUTGOING' : 'INCOMING'}</Text>
                        </View>
                        <View style={styles.statusRow}>
                            <StatusIcon size={14} color={config.color} />
                            <Text variant="labelSmall" style={[styles.statusText, { color: config.color }]}>{config.label}</Text>
                        </View>
                    </View>

                    <View style={styles.mainInfo}>
                        <Avatar.Image size={40} source={{ uri: partner.avatar_url }} />
                        <View style={styles.details}>
                            <Text variant="titleMedium" style={styles.serviceTitle}>{item.service?.title || 'Custom Service'}</Text>
                            <Text variant="labelMedium" style={styles.partnerText}>
                                {isBuyer ? 'Provider: ' : 'Buyer: '}{partner.username}
                            </Text>
                        </View>
                        <Text variant="titleLarge" style={[styles.amount, isBuyer ? styles.outAmount : styles.inAmount]}>
                            {isBuyer ? '-' : '+'}{item.amount_exc} EXC
                        </Text>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.dateText}>{new Date(item.created_at).toLocaleDateString()}</Text>
                        {item.status === 'pending' && isBuyer && (
                            <TouchableOpacity
                                style={styles.actionButton}
                                onPress={async () => {
                                    try {
                                        await transactionService.releaseFunds(item.id);
                                        fetchTransactions();
                                    } catch (err) {
                                        console.error('Failed to release funds:', err);
                                    }
                                }}
                            >
                                <Text style={styles.actionButtonText}>Release Funds</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </Card.Content>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="chevron-left"
                    iconColor={theme.colors.text}
                    onPress={() => router.back()}
                />
                <Text variant="headlineSmall" style={styles.title}>Orders & Escrow</Text>
                <View style={{ width: 48 }} />
            </View>

            <View style={styles.filterSection}>
                <SegmentedButtons
                    value={filter}
                    onValueChange={setFilter}
                    buttons={[
                        { value: 'all', label: 'All' },
                        { value: 'pending', label: 'Escrow' },
                        { value: 'completed', label: 'Finished' },
                    ]}
                    style={styles.segments}
                    theme={{ colors: { secondaryContainer: 'rgba(34, 211, 238, 0.2)' } }}
                />
            </View>

            {loading ? (
                <View style={styles.loader}>
                    <ActivityIndicator color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        marginBottom: 20,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    filterSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    segments: {
        backgroundColor: theme.colors.surface,
    },
    list: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: theme.colors.surface,
        marginBottom: 15,
        borderRadius: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    typeTag: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    typeText: {
        color: theme.colors.textSecondary,
        fontSize: 9,
        fontWeight: 'bold',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusText: {
        marginLeft: 6,
        fontWeight: 'bold',
    },
    mainInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    details: {
        flex: 1,
        marginLeft: 12,
    },
    serviceTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    partnerText: {
        color: theme.colors.textSecondary,
    },
    amount: {
        fontWeight: 'bold',
    },
    outAmount: {
        color: theme.colors.textSecondary,
    },
    inAmount: {
        color: theme.colors.success,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        paddingTop: 12,
    },
    dateText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    actionButton: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    actionButtonText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        fontSize: 12,
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
    },
});
