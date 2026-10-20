
import { StatusBar } from 'expo-status-bar';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function DashboardScreen() {
    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <View style={styles.header}>
                    <View>
                        <Text style={styles.eyebrow}>
                            YOUR WELLNESS SPACE
                        </Text>
                        <Text style={styles.title}>HealthMate</Text>
                    </View>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>HM</Text>
                    </View>
                </View>

                <View style={styles.intro}>
                    <Text style={styles.greeting}>Your daily overview</Text>
                    <Text style={styles.date}>{today}</Text>
                </View>

                <View style={styles.stepsCard}>
                    <View style={styles.cardHeading}>
                        <View style={styles.stepsIcon}>
                            <Text style={styles.stepsIconText}>ST</Text>
                        </View>
                        <Text style={styles.metricLabel}>Steps walked</Text>
                    </View>

                    <Text style={styles.stepsValue}>7,850</Text>

                    <View style={styles.goalRow}>
                        <Text style={styles.mutedText}>
                            Daily goal: 10,000 steps
                        </Text>
                        <Text style={styles.goalPercent}>78.5%</Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View style={styles.progressFill} />
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Today's activity</Text>

                <View style={styles.metricsRow}>
                    <View style={styles.metricCard}>
                        <View style={styles.caloriesIcon}>
                            <Text style={styles.caloriesIconText}>CA</Text>
                        </View>
                        <Text style={styles.metricLabel}>Calories</Text>
                        <Text style={styles.metricValue}>420</Text>
                        <Text style={styles.unit}>kcal burned</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={styles.waterIcon}>
                            <Text style={styles.waterIconText}>WA</Text>
                        </View>
                        <Text style={styles.metricLabel}>Water intake</Text>
                        <Text style={styles.metricValue}>2,000</Text>
                        <Text style={styles.unit}>ml consumed</Text>
                    </View>
                </View>

                <View style={styles.tipCard}>
                    <Text style={styles.tipTitle}>Build healthy habits</Text>
                    <Text style={styles.tipDescription}>
                        Track your daily activity to understand your
                        progress and stay consistent with your goals.
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xxl,
    },
    eyebrow: {
        color: colors.secondaryText,
        fontSize: typography.small,
        fontWeight: '600',
        letterSpacing: 1.2,
    },
    title: {
        color: colors.text,
        fontSize: typography.title,
        fontWeight: '700',
        marginTop: spacing.xs,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 15,
        backgroundColor: '#DCE9FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: '700',
    },
    intro: {
        marginBottom: spacing.lg,
    },
    greeting: {
        color: colors.text,
        fontSize: typography.heading,
        fontWeight: '700',
    },
    date: {
        color: colors.secondaryText,
        fontSize: typography.body,
        marginTop: spacing.xs,
    },
    stepsCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl,
        marginBottom: spacing.xxl,
    },
    cardHeading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    stepsIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#DDF7EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepsIconText: {
        color: colors.steps,
        fontSize: typography.small,
        fontWeight: '700',
    },
    metricLabel: {
        color: colors.secondaryText,
        fontSize: typography.body,
        fontWeight: '500',
    },
    stepsValue: {
        color: colors.text,
        fontSize: 38,
        fontWeight: '700',
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: spacing.sm,
    },
    mutedText: {
        color: colors.secondaryText,
        fontSize: typography.small,
    },
    goalPercent: {
        color: colors.steps,
        fontSize: typography.body,
        fontWeight: '700',
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#E8EEF5',
        borderRadius: 8,
        overflow: 'hidden',
        marginTop: spacing.md,
    },
    progressFill: {
        width: '78.5%',
        height: '100%',
        backgroundColor: colors.steps,
        borderRadius: 8,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: typography.heading,
        fontWeight: '700',
        marginBottom: spacing.md,
    },
    metricsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    metricCard: {
        flex: 1,
        minWidth: 0,
        backgroundColor: colors.surface,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
    },
    caloriesIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#FFF0D6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    caloriesIconText: {
        color: colors.calories,
        fontSize: typography.small,
        fontWeight: '700',
    },
    waterIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#E1EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    waterIconText: {
        color: colors.water,
        fontSize: typography.small,
        fontWeight: '700',
    },
    metricValue: {
        color: colors.text,
        fontSize: 25,
        fontWeight: '700',
        marginTop: spacing.md,
    },
    unit: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: spacing.xs,
    },
    tipCard: {
        backgroundColor: '#EAF1FF',
        borderRadius: 18,
        padding: spacing.xl,
    },
    tipTitle: {
        color: colors.text,
        fontSize: typography.subtitle,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    tipDescription: {
        color: colors.secondaryText,
        fontSize: typography.body,
        lineHeight: 22,
    },
});
