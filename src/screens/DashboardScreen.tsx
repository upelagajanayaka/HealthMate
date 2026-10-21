
import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { getTodayHealthRecords } from '../database/healthRecordService';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function DashboardScreen() {
    const [todayTotals, setTodayTotals] = useState({
        steps: 0,
        calories: 0,
        water: 0,
    });

    const [loadError, setLoadError] = useState(false);

    const today = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    useEffect(() => {
        async function loadTodayTotals() {
            try {
                const records = await getTodayHealthRecords();

                const totals = records.reduce(
                    (sum, record) => ({
                        steps: sum.steps + record.steps,
                        calories: sum.calories + record.calories,
                        water: sum.water + record.water,
                    }),
                    { steps: 0, calories: 0, water: 0 }
                );

                setTodayTotals(totals);
                setLoadError(false);
            } catch (error) {
                console.error('Failed to load health records:', error);
                setLoadError(true);
            }
        }

        loadTodayTotals();
    }, []);

    const stepProgress = Math.min(
        (todayTotals.steps / 10000) * 100,
        100
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.eyebrow}>
                            YOUR WELLNESS SPACE
                        </Text>
                        <Text style={styles.title}>HealthMate</Text>
                    </View>

                    <View style={styles.logo}>
                        <Ionicons
                            name="heart"
                            size={25}
                            color={colors.primary}
                        />
                    </View>
                </View>

                {/* Greeting */}
                <View style={styles.intro}>
                    <Text style={styles.greeting}>
                        Your daily overview
                    </Text>
                    <View style={styles.dateRow}>
                        <Ionicons
                            name="calendar-outline"
                            size={16}
                            color={colors.secondaryText}
                        />
                        <Text style={styles.date}>{today}</Text>
                    </View>
                </View>

                {loadError && (
                    <View style={styles.errorCard}>
                        <Text style={styles.errorText}>
                            Unable to load today's records. Please try again.
                        </Text>
                    </View>
                )}

                {/* Steps card */}
                <View style={styles.stepsCard}>
                    <View style={styles.cardHeading}>
                        <View style={styles.stepsIcon}>
                            <Ionicons
                                name="footsteps-outline"
                                size={24}
                                color={colors.steps}
                            />
                        </View>

                        <View style={styles.headingText}>
                            <Text style={styles.metricLabel}>
                                Steps walked
                            </Text>
                            <Text style={styles.cardSubtitle}>
                                Keep moving towards your goal
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.stepsValue}>
                        {todayTotals.steps.toLocaleString()}
                    </Text>

                    <View style={styles.goalRow}>
                        <Text style={styles.mutedText}>
                            Daily goal: 10,000 steps
                        </Text>
                        <Text style={styles.goalPercent}>
                            {stepProgress.toFixed(1)}%
                        </Text>
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${stepProgress}%` },
                            ]}
                        />
                    </View>
                </View>

                {/* Activity summary */}
                <View style={styles.sectionHeading}>
                    <Text style={styles.sectionTitle}>
                        Today's activity
                    </Text>
                    <Text style={styles.sectionSubtitle}>
                        Your recorded health metrics
                    </Text>
                </View>

                <View style={styles.metricsRow}>
                    <View style={styles.metricCard}>
                        <View style={styles.caloriesIcon}>
                            <Ionicons
                                name="flame-outline"
                                size={23}
                                color={colors.calories}
                            />
                        </View>

                        <Text style={styles.metricLabel}>
                            Calories burned
                        </Text>
                        <Text style={styles.metricValue}>
                            {todayTotals.calories.toLocaleString()}
                        </Text>
                        <Text style={styles.unit}>kcal</Text>
                    </View>

                    <View style={styles.metricCard}>
                        <View style={styles.waterIcon}>
                            <Ionicons
                                name="water-outline"
                                size={23}
                                color={colors.water}
                            />
                        </View>

                        <Text style={styles.metricLabel}>
                            Water intake
                        </Text>
                        <Text style={styles.metricValue}>
                            {todayTotals.water.toLocaleString()}
                        </Text>
                        <Text style={styles.unit}>ml</Text>
                    </View>
                </View>

                {/* Wellness tip */}
                <View style={styles.tipCard}>
                    <View style={styles.tipIcon}>
                        <Ionicons
                            name="leaf-outline"
                            size={22}
                            color={colors.primary}
                        />
                    </View>

                    <View style={styles.tipContent}>
                        <Text style={styles.tipTitle}>
                            Build healthy habits
                        </Text>
                        <Text style={styles.tipDescription}>
                            Small, consistent actions can help you build
                            a healthier daily routine. Keep tracking
                            your progress.
                        </Text>
                    </View>
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
        letterSpacing: 1.4,
    },
    title: {
        color: colors.text,
        fontSize: typography.title,
        fontWeight: '800',
        marginTop: spacing.xs,
        letterSpacing: -0.5,
    },
    logo: {
        width: 50,
        height: 50,
        borderRadius: 17,
        backgroundColor: '#DCE9FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    intro: {
        marginBottom: spacing.xl,
    },
    greeting: {
        color: colors.text,
        fontSize: typography.heading,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    date: {
        color: colors.secondaryText,
        fontSize: typography.body,
    },
    errorCard: {
        backgroundColor: '#FDECEC',
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    errorText: {
        color: '#B42318',
        fontSize: typography.body,
    },
    stepsCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
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
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: '#DDF7EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headingText: {
        flex: 1,
    },
    metricLabel: {
        color: colors.secondaryText,
        fontSize: typography.body,
        fontWeight: '500',
    },
    cardSubtitle: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: 4,
    },
    stepsValue: {
        color: colors.text,
        fontSize: 40,
        fontWeight: '800',
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
        letterSpacing: -1,
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
        height: 9,
        backgroundColor: '#E8EEF5',
        borderRadius: 10,
        overflow: 'hidden',
        marginTop: spacing.md,
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.steps,
        borderRadius: 10,
    },
    sectionHeading: {
        marginBottom: spacing.md,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: typography.heading,
        fontWeight: '700',
    },
    sectionSubtitle: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: spacing.xs,
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
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
    },
    caloriesIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FFF0D6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    waterIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#E1EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    metricValue: {
        color: colors.text,
        fontSize: 25,
        fontWeight: '800',
        marginTop: spacing.md,
    },
    unit: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: spacing.xs,
    },
    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        backgroundColor: '#EAF1FF',
        borderRadius: 20,
        padding: spacing.lg,
    },
    tipIcon: {
        width: 42,
        height: 42,
        borderRadius: 14,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tipContent: {
        flex: 1,
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
