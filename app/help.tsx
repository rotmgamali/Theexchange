import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, Card, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react-native';
import { theme } from '../src/theme/colors';

const FAQ_DATA = [
    {
        question: 'What are Exchange Credits (EXC)?',
        answer: 'EXC is our in-app currency used for all transactions. You earn EXC by providing services to other users. EXC ensures App Store compliance while enabling seamless peer-to-peer trading.',
    },
    {
        question: 'How does the escrow system work?',
        answer: 'When you hire a service provider, your EXC is held in escrow until the service is completed. Once you confirm the service is done, the funds are released to the provider.',
    },
    {
        question: 'How do I cash out my EXC?',
        answer: 'Verified providers can exchange their EXC for USDC through our wallet feature. This requires identity verification and linking a Solana wallet.',
    },
    {
        question: 'How do I become a verified provider?',
        answer: 'Go to Settings > Security and complete our identity verification process. This includes email verification and optional government ID verification for higher trust tiers.',
    },
    {
        question: 'What if there\'s a dispute?',
        answer: 'If you have issues with a service, contact our support team before releasing funds. We\'ll help mediate and ensure a fair resolution for both parties.',
    },
    {
        question: 'Is my data secure?',
        answer: 'Yes! We use industry-standard encryption and security practices. Your payment information is never stored on our servers.',
    },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <Card style={styles.faqCard}>
            <TouchableOpacity onPress={() => setExpanded(!expanded)}>
                <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{question}</Text>
                    {expanded ? (
                        <ChevronUp size={20} color={theme.colors.primary} />
                    ) : (
                        <ChevronDown size={20} color={theme.colors.textSecondary} />
                    )}
                </View>
            </TouchableOpacity>
            {expanded && (
                <View style={styles.faqAnswer}>
                    <Text style={styles.answerText}>{answer}</Text>
                </View>
            )}
        </Card>
    );
}

export default function HelpScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredFAQ = FAQ_DATA.filter(
        item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                    <Text variant="headlineMedium" style={styles.title}>Help & FAQ</Text>
                    <Text style={styles.subtitle}>Find answers to common questions</Text>

                    <Searchbar
                        placeholder="Search FAQ..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                        inputStyle={styles.searchInput}
                        iconColor={theme.colors.textSecondary}
                        placeholderTextColor={theme.colors.textSecondary}
                    />

                    {filteredFAQ.map((item, index) => (
                        <FAQItem key={index} question={item.question} answer={item.answer} />
                    ))}

                    {/* Contact Support */}
                    <Card style={styles.supportCard}>
                        <Card.Content style={styles.supportContent}>
                            <MessageCircle size={40} color={theme.colors.primary} />
                            <View style={styles.supportText}>
                                <Text variant="titleMedium" style={styles.supportTitle}>
                                    Still need help?
                                </Text>
                                <Text style={styles.supportSubtitle}>
                                    Contact our support team
                                </Text>
                            </View>
                        </Card.Content>
                        <Card.Actions>
                            <Button
                                mode="contained"
                                style={styles.contactButton}
                                buttonColor={theme.colors.primary}
                            >
                                Contact Support
                            </Button>
                        </Card.Actions>
                    </Card>

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
    },
    subtitle: {
        color: theme.colors.textSecondary,
        marginBottom: 20,
    },
    searchBar: {
        backgroundColor: theme.colors.surface,
        marginBottom: 20,
        borderRadius: 12,
    },
    searchInput: {
        color: theme.colors.text,
    },
    faqCard: {
        backgroundColor: theme.colors.surface,
        marginBottom: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    faqQuestion: {
        color: theme.colors.text,
        fontSize: 15,
        fontWeight: '600',
        flex: 1,
        marginRight: 10,
    },
    faqAnswer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
    },
    answerText: {
        color: theme.colors.textSecondary,
        lineHeight: 22,
        marginTop: 10,
    },
    supportCard: {
        backgroundColor: theme.colors.surface,
        marginTop: 20,
        borderRadius: 12,
    },
    supportContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    supportText: {
        marginLeft: 15,
    },
    supportTitle: {
        color: theme.colors.text,
    },
    supportSubtitle: {
        color: theme.colors.textSecondary,
    },
    contactButton: {
        flex: 1,
        marginHorizontal: 10,
        borderRadius: 8,
    },
    spacer: {
        height: 50,
    },
});
