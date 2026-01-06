import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Text, Card, Avatar, Button, IconButton, List, Divider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Wallet, Copy, ExternalLink, ArrowUpRight, ShieldCheck, History } from 'lucide-react-native';
import { usePrivySafe } from '../src/hooks/usePrivySafe';
import { theme } from '../src/theme/colors';
import { solanaService } from '../src/services/solana';
import { profileService } from '../src/services/profiles';

export default function WalletScreen() {
    const router = useRouter();
    const { user, authenticated } = usePrivySafe();
    const [loading, setLoading] = useState(true);
    const [usdcBalance, setUsdcBalance] = useState(0);
    const [excBalance, setExcBalance] = useState(0);
    const [escrowBalance, setEscrowBalance] = useState(0);

    // Get the Solana address from Privy user object
    const wallet = user?.linkedAccounts?.find(a => a.type === 'smart_wallet' || a.type === 'wallet');
    const solAddress = wallet?.address || 'Connection Pending...';

    useEffect(() => {
        if (authenticated && wallet?.address) {
            fetchBalances();
        } else {
            setLoading(false);
        }
    }, [authenticated, wallet?.address]);

    const fetchBalances = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const [profile, usdc] = await Promise.all([
                profileService.getProfile(user.id),
                wallet?.address ? solanaService.getUSDCBalance(wallet.address) : Promise.resolve(0)
            ]);

            if (profile) {
                setExcBalance(Number(profile.exc_balance) || 0);
                setEscrowBalance(Number(profile.escrow_balance) || 0);
            }
            setUsdcBalance(usdc);
        } catch (err) {
            console.error('Failed to fetch balances:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        // Expo clipboard would go here
        console.log('Copied:', solAddress);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="chevron-left"
                    iconColor={theme.colors.text}
                    onPress={() => router.back()}
                />
                <Text variant="headlineSmall" style={styles.title}>Exchange Wallet</Text>
                <View style={{ width: 48 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Main Card */}
                <Card style={styles.mainCard}>
                    <Card.Content>
                        <View style={styles.balanceHeader}>
                            <Text variant="labelLarge" style={styles.balanceLabel}>Total Value (Estimated)</Text>
                            <Chip style={styles.networkChip} textStyle={styles.networkText}>Solana</Chip>
                        </View>
                        <Text variant="displaySmall" style={styles.mainBalance}>
                            ${(usdcBalance + (excBalance * 0.01)).toFixed(2)}
                        </Text>

                        <View style={styles.addressRow}>
                            <Text variant="bodySmall" style={styles.addressText} numberOfLines={1}>
                                {solAddress}
                            </Text>
                            <View style={styles.addressActions}>
                                <TouchableOpacity onPress={handleCopy}><Copy size={16} color={theme.colors.primary} /></TouchableOpacity>
                                <TouchableOpacity style={{ marginLeft: 15 }}><ExternalLink size={16} color={theme.colors.primary} /></TouchableOpacity>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                {/* Currency Breakdown */}
                <Text variant="titleMedium" style={styles.sectionTitle}>Your Currencies</Text>

                <Card style={styles.currencyCard}>
                    <List.Item
                        title="Exchange Credits (EXC)"
                        description="In-App Game Currency"
                        left={props => <Avatar.Icon {...props} size={40} icon="star" style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }} color={theme.colors.primary} />}
                        right={() => (
                            <View style={styles.balanceRight}>
                                <Text variant="titleMedium" style={styles.currencyValue}>{excBalance.toLocaleString()}</Text>
                                <Text variant="bodySmall" style={styles.subValue}>Available</Text>
                            </View>
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        title="In Escrow"
                        description="Locked till completion"
                        left={props => <Avatar.Icon {...props} size={40} icon="lock-outline" style={{ backgroundColor: 'rgba(234, 179, 8, 0.1)' }} color="#EAB308" />}
                        right={() => (
                            <View style={styles.balanceRight}>
                                <Text variant="titleMedium" style={[styles.currencyValue, { color: '#EAB308' }]}>{escrowBalance.toLocaleString()}</Text>
                                <Text variant="bodySmall" style={styles.subValue}>EXC</Text>
                            </View>
                        )}
                    />
                    <Divider style={styles.divider} />
                    <List.Item
                        title="USDC (Solana)"
                        description="Stablecoin Payouts"
                        left={props => <Avatar.Icon {...props} size={40} icon="currency-usd" style={{ backgroundColor: 'rgba(34, 211, 238, 0.1)' }} color={theme.colors.success} />}
                        right={() => (
                            <View style={styles.balanceRight}>
                                <Text variant="titleMedium" style={styles.currencyValue}>{usdcBalance.toFixed(2)}</Text>
                                <Text variant="bodySmall" style={styles.subValue}>$1.00</Text>
                            </View>
                        )}
                    />
                </Card>

                {/* Action Buttons */}
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => console.log('Cash out')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 211, 238, 0.1)' }]}>
                            <ArrowUpRight size={24} color={theme.colors.primary} />
                        </View>
                        <Text variant="labelLarge" style={styles.actionLabel}>Cash Out</Text>
                        <Text variant="bodySmall" style={styles.actionSub}>Swap EXC to USDC</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => console.log('Buy credits')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: 'rgba(234, 179, 8, 0.1)' }]}>
                            <ArrowUpRight size={24} color="#EAB308" style={{ transform: [{ rotate: '180deg' }] }} />
                        </View>
                        <Text variant="labelLarge" style={styles.actionLabel}>Buy Credits</Text>
                        <Text variant="bodySmall" style={styles.actionSub}>Add EXC via Apple</Text>
                    </TouchableOpacity>
                </View>

                {/* Security Info */}
                <View style={styles.securityNote}>
                    <ShieldCheck size={16} color={theme.colors.success} />
                    <Text variant="bodySmall" style={styles.securityText}>
                        Secured by Privy non-custodial wallets.
                    </Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const Chip = ({ children, style, textStyle }: any) => (
    <View style={[styles.chip, style]}>
        <Text style={[styles.chipText, textStyle]}>{children}</Text>
    </View>
);

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
        marginBottom: 10,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    mainCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(34, 211, 238, 0.3)',
        marginBottom: 30,
        elevation: 4,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    balanceLabel: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    networkChip: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    networkText: {
        color: theme.colors.primary,
        fontSize: 10,
        fontWeight: 'bold',
    },
    mainBalance: {
        color: theme.colors.text,
        fontWeight: '800',
        marginBottom: 15,
    },
    addressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 12,
    },
    addressText: {
        color: theme.colors.textSecondary,
        flex: 1,
        marginRight: 15,
    },
    addressActions: {
        flexDirection: 'row',
    },
    sectionTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        marginBottom: 15,
        marginLeft: 5,
    },
    currencyCard: {
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
        marginBottom: 25,
    },
    balanceRight: {
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingRight: 10,
    },
    currencyValue: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    subValue: {
        color: theme.colors.textSecondary,
    },
    divider: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    actionGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    actionCard: {
        backgroundColor: theme.colors.surface,
        width: '48%',
        padding: 15,
        borderRadius: 16,
        alignItems: 'center',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionLabel: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    actionSub: {
        color: theme.colors.textSecondary,
        fontSize: 10,
    },
    securityNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.6,
    },
    securityText: {
        color: theme.colors.textSecondary,
        marginLeft: 8,
    },
    chip: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    chipText: {
        color: '#FFF',
        fontSize: 12,
    }
});
