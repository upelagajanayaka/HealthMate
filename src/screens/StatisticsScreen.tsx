import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
    getWeeklyHealthRecords,
    HealthRecord,
} from '../database/healthRecordService';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

type DaySummary = {
    date: string;
    label: string;
    steps: number;
    calories: number;
    water: number;
};

export default function StatisticsScreen() {
    const [days, setDays] = useState<DaySummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadStatistics = useCallback(async () => {
        try {
            setError('');

            const records: HealthRecord[] = await getWeeklyHealthRecords();

            const today = new Date();
            const summaries: DaySummary[] = [];

            for (let offset = 6; offset >= 0; offset--) {
                const date = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    today.getDate() - offset,
                );

                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const dateString = `${year}-${month}-${day}`;

                const dayRecords = records.filter(
                    (record) => record.date === dateString,
                );

                summaries.push({
                    date: dateString,
                    label: date.toLocaleDateString('en-US', {
                        weekday: 'short',
                    }),
                    steps: dayRecords.reduce(
                        (total, record) => total + record.steps,
                        0,
                    ),
                    calories: dayRecords.reduce(
                        (total, record) => total + record.calories,
                        0,
                    ),
                    water: dayRecords.reduce(
                        (total, record) => total + record.water,
                        0,
                    ),
                });
            }

            setDays(summaries);
        } catch {
            setError('Unable to load your weekly statistics. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStatistics();
    }, [loadStatistics]);

    const totalSteps = days.reduce((sum, day) => sum + day.steps, 0);
    const totalCalories = days.reduce((sum, day) => sum + day.calories, 0);
    const totalWater = days.reduce((sum, day) => sum + day.water, 0);

    const maxSteps = Math.max(...days.map((day) => day.steps), 1);

    const formatNumber = (value: number) =>
        value.toLocaleString('en-US');

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.helperText}>Loading weekly statistics...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Ionicons
                    name="alert-circle-outline"
                    size={36}
                    color={colors.primary}
                />
                <Text style={styles.errorText}>{error}</Text>
                <Text onPress={loadStatistics} style={styles.retryText}>
                    Tap here to retry
                </Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={() => {
                        setLoading(true);
                        loadStatistics();
                    }}
                    tintColor={colors.primary}
                />
            }
        >
            <View style={styles.header}>
                <Text style={styles.eyebrow}>YOUR HEALTH</Text>
                <Text style={styles.title}>Weekly Statistics</Text>
                <Text style={styles.subtitle}>
                    Your activity over the last 7 days
                </Text>
            </View>

            <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                    <Ionicons name="footsteps-outline" size={24} color="#08A88A" />
                </View>
                <Text style={styles.metricLabel}>Total steps</Text>
                <Text style={styles.metricValue}>{formatNumber(totalSteps)}</Text>
                <Text style={styles.metricHint}>
                    {formatNumber(Math.round(totalSteps / 7))} average steps per day
                </Text>
            </View>

            <View style={styles.metricRow}>
                <View style={styles.metricCard}>
                    <View style={[styles.smallIcon, { backgroundColor: '#FFF3DF' }]}>
                        <Ionicons name="flame-outline" size={20} color="#F59E0B" />
                    </View>
                    <Text style={styles.metricLabel}>Calories</Text>
                    <Text style={styles.smallMetricValue}>
                        {formatNumber(totalCalories)}
                    </Text>
                    <Text style={styles.metricHint}>Total kcal</Text>
                </View>

                <View style={styles.metricCard}>
                    <View style={[styles.smallIcon, { backgroundColor: '#E8F2FF' }]}>
                        <Ionicons name="water-outline" size={20} color="#3678D4" />
                    </View>
                    <Text style={styles.metricLabel}>Water</Text>
                    <Text style={styles.smallMetricValue}>
                        {formatNumber(totalWater)}
                    </Text>
                    <Text style={styles.metricHint}>Total ml</Text>
                </View>
            </View>

            <View style={styles.chartCard}>
                <Text style={styles.sectionTitle}>Daily steps</Text>
                <Text style={styles.sectionSubtitle}>
                    Compare your activity across the week
                </Text>

                <View style={styles.chart}>
                    {days.map((day) => {
                        const barHeight =
                            day.steps === 0 ? 4 : Math.max((day.steps / maxSteps) * 130, 8);

                        return (
                            <View key={day.date} style={styles.barColumn}>
                                <Text style={styles.barValue}>
                                    {day.steps >= 1000
                                        ? `${(day.steps / 1000).toFixed(1)}k`
                                        : day.steps}
                                </Text>

                                <View style={styles.barArea}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: barHeight,
                                                backgroundColor:
                                                    day.steps > 0 ? '#08A88A' : '#DCE5E9',
                                            },
                                        ]}
                                    />
                                </View>

                                <Text style={styles.dayLabel}>{day.label}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            <View style={styles.breakdownCard}>
                <Text style={styles.sectionTitle}>Daily breakdown</Text>

                {days.map((day) => (
                    <View key={day.date} style={styles.dayRow}>
                        <View style={styles.dayInfo}>
                            <Text style={styles.dayName}>{day.label}</Text>
                            <Text style={styles.dateLabel}>{day.date}</Text>
                        </View>

                        <View style={styles.dayMetrics}>
                            <Text style={styles.daySteps}>
                                {formatNumber(day.steps)} steps
                            </Text>
                            <Text style={styles.daySecondary}>
                                {formatNumber(day.calories)} kcal ?? {formatNumber(day.water)} ml
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
    },
    centered: {
        flex: 1,
        backgroundColor: '#F5F7FB',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.md,
    },
    header: {
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    eyebrow: {
        color: '#3678D4',
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: spacing.xs,
    },
    title: {
        color: '#172B4D',
        fontSize: 27,
        fontWeight: '800',
    },
    subtitle: {
        color: '#64748B',
        fontSize: 14,
        marginTop: spacing.xs,
    },
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    summaryIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        backgroundColor: '#E4F7F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    metricLabel: {
        color: '#64748B',
        fontSize: 13,
        fontWeight: '500',
    },
    metricValue: {
        color: '#172B4D',
        fontSize: 30,
        fontWeight: '800',
        marginTop: spacing.xs,
    },
    metricHint: {
        color: '#64748B',
        fontSize: 12,
        marginTop: spacing.xs,
    },
    metricRow: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    smallIcon: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    smallMetricValue: {
        color: '#172B4D',
        fontSize: 22,
        fontWeight: '800',
        marginTop: spacing.xs,
    },
    chartCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    sectionTitle: {
        color: '#172B4D',
        fontSize: 17,
        fontWeight: '700',
    },
    sectionSubtitle: {
        color: '#64748B',
        fontSize: 12,
        marginTop: spacing.xs,
    },
    chart: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: spacing.xl,
        minHeight: 175,
    },
    barColumn: {
        flex: 1,
        alignItems: 'center',
    },
    barValue: {
        color: '#64748B',
        fontSize: 9,
        marginBottom: spacing.xs,
    },
    barArea: {
        height: 130,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bar: {
        width: 18,
        borderRadius: 7,
    },
    dayLabel: {
        color: '#64748B',
        fontSize: 11,
        marginTop: spacing.sm,
    },
    breakdownCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    dayRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        gap: spacing.sm,
    },
    dayInfo: {
        flex: 1,
    },
    dayName: {
        color: '#172B4D',
        fontSize: 13,
        fontWeight: '700',
    },
    dateLabel: {
        color: '#94A3B8',
        fontSize: 11,
        marginTop: 3,
    },
    dayMetrics: {
        alignItems: 'flex-end',
        flex: 1.5,
    },
    daySteps: {
        color: '#172B4D',
        fontSize: 12,
        fontWeight: '700',
    },
    daySecondary: {
        color: '#64748B',
        fontSize: 10,
        marginTop: 4,
        textAlign: 'right',
    },
    helperText: {
        color: '#64748B',
        fontSize: 14,
    },
    errorText: {
        color: '#172B4D',
        fontSize: 14,
        textAlign: 'center',
    },
    retryText: {
        color: '#3678D4',
        fontSize: 14,
        fontWeight: '700',
    },
});
