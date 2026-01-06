import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, Searchbar, Avatar, Card, IconButton, FAB, Portal, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Palette, Code, Hammer, PenTool, Megaphone, Users, Star, Plus, RefreshCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { theme } from '../theme/colors';
import { marketplaceService } from '../services/marketplace';
import { profileService } from '../services/profiles';
import { transactionService } from '../services/transactions';

const CATEGORIES = [
    { id: 'design', name: 'Design', icon: Palette },
    { id: 'coding', name: 'Coding', icon: Code },
    { id: 'local', name: 'Local Help', icon: Hammer },
    { id: 'writing', name: 'Writing', icon: PenTool },
    { id: 'marketing', name: 'Marketing', icon: Megaphone },
    { id: 'consulting', name: 'Consulting', icon: Users },
];

const FEATURED_PROVIDERS = [
    {
        id: '1',
        name: 'Alex Johnson',
        role: 'UI/UX Designer',
        rating: 4.9,
        reviews: 120,
        price: 500,
        description: 'Specializing in modern, user-centric interfaces for web and mobile. 5+ years of experience.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
    {
        id: '2',
        name: 'David Chen',
        role: 'Full-Stack Developer',
        rating: 5.0,
        reviews: 85,
        price: 800,
        description: 'Expert in React, Node.js, and database management. Building scalable applications.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
];

export const DashboardScreen = () => {
    const router = useRouter();
    const { user, authenticated } = usePrivy();
    const [state, setState] = React.useState({ open: false });
    const [loading, setLoading] = React.useState(true);
    const [services, setServices] = React.useState<any[]>([]);
    const [profile, setProfile] = React.useState<any>(null);
    const [refreshing, setRefreshing] = React.useState(false);

    React.useEffect(() => {
        if (authenticated && user) {
            fetchData();
        }
    }, [authenticated, user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [servicesData, profileData] = await Promise.all([
                marketplaceService.getServices(),
                profileService.getProfile(user!.id)
            ]);
            setServices(servicesData || []);
            setProfile(profileData);
        } catch (err) {
            console.error('Failed to fetch dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleHire = async (service: any) => {
        if (!user || user.id === service.provider_id) {
            Alert.alert('Invalid Action', 'You cannot hire yourself.');
            return;
        }

        if (Number(profile?.exc_balance || 0) < Number(service.price_exc)) {
            Alert.alert('Insufficient Balance', 'You need more EXC to hire this provider.');
            return;
        }

        Alert.alert(
            'Confirm Hire',
            `Deposit ${service.price_exc} EXC into escrow to hire ${service.provider?.username}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await transactionService.hireProvider(
                                user.id,
                                service.provider_id,
                                service.id,
                                Number(service.price_exc)
                            );
                            Alert.alert('Success', 'Funds committed to escrow! You can track this in Transactions.');
                            fetchData(); // Refresh balance
                        } catch (err) {
                            console.error('Hire failed:', err);
                            Alert.alert('Error', 'Hire transaction failed.');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const onStateChange = ({ open }: { open: boolean }) => setState({ open });

    const { open } = state;
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text variant="headlineMedium" style={styles.logo}>The Exchange</Text>
                    <View style={styles.balanceContainer}>
                        <View>
                            <Text variant="labelSmall" style={styles.balanceLabel}>Balance:</Text>
                            <Text variant="headlineSmall" style={styles.balanceValue}>
                                {profile?.exc_balance?.toLocaleString() || '0'} EXC
                            </Text>
                            <Text variant="labelSmall" style={styles.balanceSub}>Exchange Credits</Text>
                        </View>
                        {profile?.avatar_url ? (
                            <Avatar.Image size={48} source={{ uri: profile.avatar_url }} />
                        ) : (
                            <Avatar.Icon size={48} icon="account" style={styles.avatarPlaceholder} />
                        )}
                    </View>
                </View>

                {/* Search */}
                <Searchbar
                    placeholder="Search services..."
                    value=""
                    style={styles.searchBar}
                    iconColor={theme.colors.textSecondary}
                    placeholderTextColor={theme.colors.textSecondary}
                    inputStyle={{ color: theme.colors.text }}
                />

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryList}>
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity key={cat.id} style={[styles.categoryCard, index === 0 && styles.activeCategoryCard]}>
                            <cat.icon size={24} color={index === 0 ? theme.colors.primary : theme.colors.textSecondary} />
                            <Text style={[styles.categoryName, index === 0 && styles.activeCategoryName]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Section */}
                <View style={styles.featuredHeader}>
                    <Text variant="titleMedium" style={styles.sectionTitle}>Featured Service Providers</Text>
                    <TouchableOpacity onPress={fetchData}>
                        <RefreshCcw size={16} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={styles.loaderContainer}>
                        <RefreshCcw size={24} color={theme.colors.primary} />
                        <Text style={styles.loadingText}>Fetching talent...</Text>
                    </View>
                ) : services.length > 0 ? (
                    services.map((service) => (
                        <Card key={service.id} style={styles.providerCard}>
                            <Card.Content style={styles.providerContent}>
                                <Avatar.Image
                                    size={64}
                                    source={{ uri: service.provider?.avatar_url || `https://i.pravatar.cc/150?u=${service.provider_id}` }}
                                />
                                <View style={styles.providerDetails}>
                                    <View style={styles.providerHeaderRow}>
                                        <View>
                                            <Text variant="titleMedium" style={styles.providerName}>
                                                {service.provider?.username || 'Expert Provider'}
                                            </Text>
                                            <Text variant="labelMedium" style={styles.providerRole}>{service.title}</Text>
                                        </View>
                                        <View style={styles.ratingRow}>
                                            <Star size={16} color={theme.colors.primary} fill={theme.colors.primary} />
                                            <Text variant="labelSmall" style={styles.ratingText}>
                                                ({service.provider?.rating || '0.0'})
                                            </Text>
                                        </View>
                                    </View>
                                    <Text variant="bodySmall" numberOfLines={2} style={styles.providerDesc}>
                                        {service.description}
                                    </Text>
                                    <View style={styles.cardActionRow}>
                                        <Text variant="labelLarge" style={styles.priceText}>{service.price_exc} EXC</Text>
                                        <Button
                                            mode="contained"
                                            onPress={() => handleHire(service)}
                                            style={styles.hireBtn}
                                            labelStyle={{ fontSize: 10 }}
                                        >
                                            Hire
                                        </Button>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No services found in your area yet.</Text>
                    </View>
                )}

                {/* Fill space at bottom for ScrollView */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* FAB Group for Actions */}
            <Portal>
                <FAB.Group
                    open={open}
                    visible
                    icon={open ? 'close' : 'plus'}
                    actions={[
                        {
                            icon: 'format-list-bulleted',
                            label: 'Bounty Feed',
                            onPress: () => router.push('/bounty-feed'),
                            containerStyle: { backgroundColor: theme.colors.surface },
                            labelTextColor: theme.colors.text,
                        },
                        {
                            icon: 'bullhorn-outline',
                            label: 'Request Service',
                            onPress: () => router.push('/request-service'),
                            containerStyle: { backgroundColor: theme.colors.surface },
                            labelTextColor: theme.colors.text,
                        },
                        {
                            icon: 'briefcase-outline',
                            label: 'List Service',
                            onPress: () => router.push('/create-service'),
                            containerStyle: { backgroundColor: theme.colors.surface },
                            labelTextColor: theme.colors.text,
                        },
                    ]}
                    onStateChange={onStateChange}
                    fabStyle={{ backgroundColor: theme.colors.primary }}
                />
            </Portal>

            {/* Basic Navigation Mockup Placeholder (Real Nav would be here) */}
            <View style={styles.bottomNav}>
                <IconButton icon="home" iconColor={theme.colors.primary} size={24} />
                <IconButton icon="magnify" iconColor={theme.colors.textSecondary} size={24} onPress={() => router.push('/bounty-feed')} />
                <IconButton icon="clipboard-list" iconColor={theme.colors.textSecondary} size={24} onPress={() => router.push('/transactions')} />
                <IconButton icon="wallet-outline" iconColor={theme.colors.textSecondary} size={24} onPress={() => router.push('/wallet')} />
                <IconButton icon="account-outline" iconColor={theme.colors.textSecondary} size={24} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: 20,
    },
    logo: {
        color: theme.colors.primary,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 20,
    },
    balanceContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.surface,
        padding: 20,
        borderRadius: 20,
    },
    balanceLabel: {
        color: theme.colors.textSecondary,
    },
    balanceValue: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    balanceSub: {
        color: theme.colors.textSecondary,
        fontSize: 10,
    },
    avatarPlaceholder: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    searchBar: {
        marginHorizontal: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 15,
        marginBottom: 20,
    },
    categoryList: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    categoryCard: {
        backgroundColor: theme.colors.surface,
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        marginRight: 10,
        width: 100,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    activeCategoryCard: {
        borderColor: theme.colors.primary,
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
    },
    categoryName: {
        color: theme.colors.textSecondary,
        fontSize: 12,
        marginTop: 8,
    },
    activeCategoryName: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    featuredHeader: {
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        color: theme.colors.text,
    },
    providerCard: {
        marginHorizontal: 20,
        marginBottom: 15,
        backgroundColor: theme.colors.surface,
        borderRadius: 15,
    },
    providerContent: {
        flexDirection: 'row',
    },
    providerDetails: {
        flex: 1,
        marginLeft: 15,
    },
    providerHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    providerName: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    providerRole: {
        color: theme.colors.primary,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: theme.colors.textSecondary,
        marginLeft: 4,
        fontSize: 10,
    },
    providerDesc: {
        color: theme.colors.textSecondary,
        marginBottom: 8,
    },
    cardActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    hireBtn: {
        borderRadius: 8,
        height: 32,
        justifyContent: 'center',
    },
    priceText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    loaderContainer: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: theme.colors.textSecondary,
        marginTop: 10,
        fontSize: 12,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 10,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
});
