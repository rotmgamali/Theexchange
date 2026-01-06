import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Text, Card, Avatar, Searchbar, IconButton, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, SlidersHorizontal, ArrowUpRight, MessageSquare, Share2, RefreshCcw } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '../src/theme/colors';
import { marketplaceService } from '../src/services/marketplace';

const BOUNTIES = [
    {
        id: '1',
        user: 'CyberPioneer',
        avatar: 'https://i.pravatar.cc/100?u=1',
        title: 'Need a Python script for web scraping',
        description: 'Looking for a script to extract product data from e-commerce sites. Must handle pagination and proxies.',
        amount: '2,000 EXC',
        category: 'Coding',
        time: '2h ago',
    },
    {
        id: '2',
        user: 'SolanaDev',
        avatar: 'https://i.pravatar.cc/100?u=2',
        title: 'Design a logo for a crypto startup',
        description: 'Need a minimalist, futuristic logo for a new DeFi protocol. Vector files required.',
        amount: '5,000 EXC',
        category: 'Design',
        time: '5h ago',
    },
    {
        id: '3',
        user: 'MarketMage',
        avatar: 'https://i.pravatar.cc/100?u=3',
        title: 'Create a marketing strategy for an NFT drop',
        description: 'Experienced marketer needed to help launch a 10k collection. Focused on Twitter and Discord growth.',
        amount: '8,500 EXC',
        category: 'Marketing',
        time: '1d ago',
    },
];

const CATEGORIES = ['All', 'Coding', 'Design', 'Writing', 'Marketing', 'Local'];

export default function BountyFeedScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [bounties, setBounties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetchBounties();
    }, [activeCategory]);

    const fetchBounties = async () => {
        setLoading(true);
        try {
            const data = await marketplaceService.getBounties(activeCategory);
            setBounties(data || []);
        } catch (err) {
            console.error('Failed to fetch bounties:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderBounty = ({ item }: { item: any }) => (
        <Card style={styles.bountyCard}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    <Avatar.Image
                        size={32}
                        source={{ uri: item.requester?.avatar_url || `https://i.pravatar.cc/100?u=${item.requester_id}` }}
                    />
                    <View style={styles.userInfo}>
                        <Text variant="labelMedium" style={styles.username}>
                            {item.requester?.username || 'Anonymous'}
                        </Text>
                        <Text variant="labelSmall" style={styles.timeText}>
                            {new Date(item.created_at).toLocaleDateString()}
                        </Text>
                    </View>
                    {item.category && (
                        <Chip style={styles.categoryChip} textStyle={styles.categoryChipText}>
                            {item.category}
                        </Chip>
                    )}
                </View>

                <Text variant="titleMedium" style={styles.bountyTitle}>
                    {item.title}
                </Text>

                <Text variant="bodySmall" numberOfLines={2} style={styles.description}>
                    {item.description}
                </Text>

                <View style={styles.cardFooter}>
                    <View>
                        <Text variant="headlineSmall" style={styles.amountText}>{item.budget_exc} EXC</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.applyButton}
                        onPress={() => console.log('Apply to:', item.title)}
                    >
                        <Text style={styles.applyButtonText}>Apply</Text>
                        <ArrowUpRight size={16} color={theme.colors.background} />
                    </TouchableOpacity>
                </View>

                <View style={styles.socialActions}>
                    <TouchableOpacity style={styles.socialButton}>
                        <MessageSquare size={18} color={theme.colors.textSecondary} />
                        <Text style={styles.socialText}>12</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socialButton}>
                        <Share2 size={18} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text variant="headlineMedium" style={styles.title}>Bounty Feed</Text>
                    <View style={styles.headerIcons}>
                        <IconButton icon={() => <Filter size={20} color={theme.colors.text} />} />
                        <IconButton icon={() => <SlidersHorizontal size={20} color={theme.colors.text} />} />
                    </View>
                </View>

                <Searchbar
                    placeholder="Search bounties..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    iconColor={theme.colors.textSecondary}
                    placeholderTextColor={theme.colors.textSecondary}
                    inputStyle={{ color: theme.colors.text }}
                />

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoryScroll}
                    contentContainerStyle={styles.categoryContent}
                >
                    {CATEGORIES.map(cat => (
                        <Chip
                            key={cat}
                            selected={activeCategory === cat}
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.filterChip,
                                activeCategory === cat && styles.activeFilterChip
                            ]}
                            textStyle={[
                                styles.filterChipText,
                                activeCategory === cat && styles.activeFilterChipText
                            ]}
                            mode="outlined"
                        >
                            {cat}
                        </Chip>
                    ))}
                </ScrollView>
            </View>

            {/* Feed */}
            {loading ? (
                <View style={styles.loaderContainer}>
                    <RefreshCcw size={24} color={theme.colors.primary} />
                    <Text style={styles.loadingText}>Sourcing fresh bounties...</Text>
                </View>
            ) : bounties.length > 0 ? (
                <FlatList
                    data={bounties}
                    renderItem={renderBounty}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.feedContent}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={fetchBounties}
                />
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No bounties found in this category.</Text>
                </View>
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
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    headerIcons: {
        flexDirection: 'row',
    },
    searchBar: {
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        marginBottom: 15,
        height: 45,
    },
    categoryScroll: {
        marginBottom: 15,
    },
    categoryContent: {
        paddingHorizontal: 15,
    },
    filterChip: {
        marginHorizontal: 5,
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    activeFilterChip: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterChipText: {
        color: theme.colors.textSecondary,
        fontSize: 12,
    },
    activeFilterChipText: {
        color: theme.colors.background,
        fontWeight: 'bold',
    },
    feedContent: {
        padding: 20,
        paddingBottom: 40,
    },
    bountyCard: {
        backgroundColor: theme.colors.surface,
        marginBottom: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(34, 211, 238, 0.2)', // Subtle Cyan glow
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    userInfo: {
        marginLeft: 10,
        flex: 1,
    },
    username: {
        color: theme.colors.text,
        fontWeight: '600',
    },
    timeText: {
        color: theme.colors.textSecondary,
    },
    categoryChip: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        height: 24,
    },
    categoryChipText: {
        fontSize: 10,
        color: theme.colors.textSecondary,
    },
    bountyTitle: {
        color: theme.colors.text,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        color: theme.colors.textSecondary,
        marginBottom: 20,
        lineHeight: 18,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    amountText: {
        color: theme.colors.primary,
        fontWeight: 'bold',
    },
    applyButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    applyButtonText: {
        color: theme.colors.background,
        fontWeight: 'bold',
        marginRight: 5,
    },
    socialActions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.05)',
        paddingTop: 15,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 25,
    },
    socialText: {
        color: theme.colors.textSecondary,
        marginLeft: 6,
        fontSize: 12,
    },
    loaderContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: theme.colors.textSecondary,
        marginTop: 10,
        fontSize: 12,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyText: {
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
