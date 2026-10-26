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


    function StepProgressRing({ progress }: { progress: number }) {
        return (
            <View style={styles.ringOuter}>
                <View style={styles.ringInner}>
                    <Ionicons
                        name="footsteps-outline"
                        size={25}
                        color={colors.steps}
                    />
                    <Text style={styles.ringPercent}>
                        {progress.toFixed(0)}%
                    </Text>
                    <Text style={styles.ringLabel}>of goal</Text>
                </View>
            </View>
        );
    }

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
    const remainingSteps = Math.max(10000 - todayTotals.steps, 0);
    const goalReached = todayTotals.steps >= 10000;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.brandRow}>
                        <View style={styles.logo}>
                            <Ionicons
                                name="heart"
                                size={23}
                                color="#FFFFFF"
                            />
                        </View>

                        <View style={styles.brandText}>
                            <Text style={styles.title}>HealthMate</Text>
                            <Text style={styles.eyebrow}>
                                YOUR DAILY WELLNESS
                            </Text>
                        </View>
                    </View>

                    <View style={styles.headerBadge}>
                        <Ionicons
                            name="leaf-outline"
                            size={22}
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
                    <View style={styles.heroTopRow}>
                        <View style={styles.heroTitleGroup}>
                            <View style={styles.stepsIcon}>
                                <Ionicons
                                    name="footsteps-outline"
                                    size={22}
                                    color={colors.steps}
                                />
                            </View>

                            <View style={styles.headingText}>
                                <Text style={styles.metricLabel}>
                                    Daily steps
                                </Text>
                                <Text style={styles.cardSubtitle}>
                                    Your movement today
                                </Text>
                            </View>
                        </View>

                        <View style={styles.goalBadge}>
                            <Ionicons
                                name="flag-outline"
                                size={14}
                                color={colors.steps}
                            />
                            <Text style={styles.goalBadgeText}>10K goal</Text>
                        </View>
                    </View>

                    <View style={styles.heroBody}>
                        <View style={styles.heroStats}>
                            <Text style={styles.stepsValue}>
                                {todayTotals.steps.toLocaleString()}
                            </Text>

                            <Text style={styles.heroDescription}>
                                steps completed
                            </Text>

                            <View style={styles.heroDivider} />

                            <Text style={styles.remainingSteps}>
                                {goalReached
                                    ? 'Daily goal completed!'
                                    : `${remainingSteps.toLocaleString()} steps to go`}
                            </Text>
                        </View>

                        <StepProgressRing progress={stepProgress} />
                    </View>

                    <View style={styles.progressTrack}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${stepProgress}%` },
                            ]}
                        />
                    </View>

                    <View style={styles.heroFooter}>
                        <Text style={styles.mutedText}>Daily target</Text>
                        <Text style={styles.goalPercent}>
                            {stepProgress.toFixed(1)}% completed
                        </Text>
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
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    brandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },

    brandText: {
        justifyContent: 'center',
    },

    headerBadge: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#E1EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    eyebrow: {
        color: colors.secondaryText,
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginTop: 3,
    },

    title: {
        color: colors.text,
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: -0.6,
    },

    logo: {
        width: 44,
        height: 44,
        borderRadius: 15,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    intro: {
        marginBottom: spacing.lg,
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

    heroTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
    },

    heroTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        flex: 1,
    },

    goalBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: '#DDF7EF',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 20,
    },

    goalBadgeText: {
        color: colors.steps,
        fontSize: typography.small,
        fontWeight: '700',
    },

    heroBody: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginTop: spacing.xl,
        marginBottom: spacing.lg,
    },

    heroStats: {
        flex: 1,
        minWidth: 0,
    },

    heroDescription: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: spacing.xs,
    },

    heroDivider: {
        width: 36,
        height: 3,
        borderRadius: 2,
        backgroundColor: '#DDF7EF',
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },

    heroFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginTop: spacing.md,
    },


    ringOuter: {
        width: 112,
        height: 112,
        borderRadius: 56,
        backgroundColor: '#DDF7EF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 5,
        borderColor: colors.steps,
    },

    ringInner: {
        width: 94,
        height: 94,
        borderRadius: 47,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },

    ringPercent: {
        color: colors.text,
        fontSize: 19,
        fontWeight: '800',
        marginTop: 2,
    },

    ringLabel: {
        color: colors.secondaryText,
        fontSize: 10,
        fontWeight: '500',
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
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        overflow: 'hidden',
    },


    caloriesIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#FFF0D6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#FFE4B5',
    },

    waterIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#E1EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: '#CFE0FF',
    },


    metricValue: {
        color: colors.text,
        fontSize: 28,
        fontWeight: '800',
        marginTop: spacing.sm,
        letterSpacing: -0.8,
    },


    unit: {
        color: colors.secondaryText,
        fontSize: typography.small,
        fontWeight: '600',
        marginTop: spacing.xs,
    },


    tipCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.md,
        backgroundColor: '#EAF1FF',
        borderRadius: 22,
        borderWidth: 1,
        borderColor: '#D7E5FF',
        padding: spacing.xl,
    },


    tipIcon: {
        width: 46,
        height: 46,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D7E5FF',
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
    remainingSteps: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: spacing.sm,
        fontWeight: '500',
    },
});
