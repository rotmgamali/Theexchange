import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Avatar, Card, List, Switch, Divider, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight, User, Bell, Shield, CreditCard, HelpCircle, FileText, LogOut } from 'lucide-react-native';
import { theme } from '../src/theme/colors';

export default function SettingsScreen() {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    const menuItems = [
        { icon: User, label: 'Edit Profile', route: '/profile' },
        { icon: CreditCard, label: 'Payment Methods', route: '/payments' },
        { icon: Shield, label: 'Security', route: '/security' },
    ];

    const supportItems = [
        { icon: HelpCircle, label: 'Help & FAQ', route: 'help' },
        { icon: FileText, label: 'Terms of Service', route: 'terms' },
        { icon: FileText, label: 'Privacy Policy', route: 'privacy' },
    ];

    const handleNavigation = (route: string) => {
        router.push(`/${route}` as any);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text variant="headlineMedium" style={styles.title}>Settings</Text>
                    </View>

                    {/* Profile Card */}
                    <Card style={styles.profileCard}>
                        <Card.Content style={styles.profileContent}>
                            <Avatar.Icon
                                size={80}
                                icon="account"
                                style={styles.avatar}
                                color={theme.colors.primary}
                            />
                            <View style={styles.profileInfo}>
                                <Text variant="titleLarge" style={styles.userName}>Guest User</Text>
                                <Text variant="bodyMedium" style={styles.userEmail}>
                                    {Platform.OS === 'web' ? 'Web Preview Mode' : 'Sign in to access all features'}
                                </Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Account Section */}
                    <Text variant="labelLarge" style={styles.sectionTitle}>ACCOUNT</Text>
                    <Card style={styles.menuCard}>
                        {menuItems.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => { }}
                                >
                                    <View style={styles.menuLeft}>
                                        <item.icon size={22} color={theme.colors.primary} />
                                        <Text style={styles.menuLabel}>{item.label}</Text>
                                    </View>
                                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                                {index < menuItems.length - 1 && <Divider style={styles.divider} />}
                            </React.Fragment>
                        ))}
                    </Card>

                    {/* Notifications */}
                    <Text variant="labelLarge" style={styles.sectionTitle}>PREFERENCES</Text>
                    <Card style={styles.menuCard}>
                        <View style={styles.menuItem}>
                            <View style={styles.menuLeft}>
                                <Bell size={22} color={theme.colors.primary} />
                                <Text style={styles.menuLabel}>Push Notifications</Text>
                            </View>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                color={theme.colors.primary}
                            />
                        </View>
                    </Card>

                    {/* Support Section */}
                    <Text variant="labelLarge" style={styles.sectionTitle}>SUPPORT</Text>
                    <Card style={styles.menuCard}>
                        {supportItems.map((item, index) => (
                            <React.Fragment key={item.label}>
                                <TouchableOpacity
                                    style={styles.menuItem}
                                    onPress={() => { }}
                                >
                                    <View style={styles.menuLeft}>
                                        <item.icon size={22} color={theme.colors.primary} />
                                        <Text style={styles.menuLabel}>{item.label}</Text>
                                    </View>
                                    <ChevronRight size={20} color={theme.colors.textSecondary} />
                                </TouchableOpacity>
                                {index < supportItems.length - 1 && <Divider style={styles.divider} />}
                            </React.Fragment>
                        ))}
                    </Card>

                    {/* Sign Out */}
                    <Button
                        mode="outlined"
                        onPress={() => router.replace('/')}
                        style={styles.signOutButton}
                        textColor={theme.colors.error}
                        icon={() => <LogOut size={18} color={theme.colors.error} />}
                    >
                        Sign Out
                    </Button>

                    {/* Version */}
                    <Text style={styles.version}>Version 1.0.0</Text>
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
        padding: 20,
        paddingBottom: 10,
    },
    title: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    profileCard: {
        margin: 20,
        marginTop: 10,
        backgroundColor: theme.colors.surface,
        borderRadius: 16,
    },
    profileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
    },
    avatar: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
    },
    profileInfo: {
        marginLeft: 15,
        flex: 1,
    },
    userName: {
        color: theme.colors.text,
        fontWeight: 'bold',
    },
    userEmail: {
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    sectionTitle: {
        color: theme.colors.textSecondary,
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    menuCard: {
        marginHorizontal: 20,
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuLabel: {
        color: theme.colors.text,
        marginLeft: 12,
        fontSize: 16,
    },
    divider: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    signOutButton: {
        marginHorizontal: 20,
        marginTop: 30,
        borderColor: theme.colors.error,
        borderRadius: 12,
    },
    version: {
        textAlign: 'center',
        color: theme.colors.textSecondary,
        marginTop: 20,
        marginBottom: 40,
        fontSize: 12,
    },
});
