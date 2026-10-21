import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
    getAllHealthRecords,
    type HealthRecord,
} from '../database/healthRecordService';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';


export default function RecordsScreen() {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        async function loadRecords() {
            try {
                setLoading(true);
                setLoadError(false);

                const savedRecords = await getAllHealthRecords();
                setRecords(savedRecords);
            } catch (error) {
                console.error('Failed to load health records:', error);
                setLoadError(true);
            } finally {
                setLoading(false);
            }
        }

        loadRecords();
    }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
        >
            <Text style={styles.eyebrow}>YOUR HEALTH HISTORY</Text>
            <Text style={styles.title}>Records</Text>
            <Text style={styles.subtitle}>
                Review your daily health activity in one place.
            </Text>

            {loading ? (
                <View style={styles.card}>
                    <ActivityIndicator
                        size="large"
                        color={colors.primary}
                    />
                    <Text style={styles.description}>
                        Loading your health records...
                    </Text>
                </View>
            ) : loadError ? (
                <View style={styles.card}>
                    <Text style={styles.emptyTitle}>
                        Unable to load records
                    </Text>
                    <Text style={styles.description}>
                        Please try opening this screen again.
                    </Text>
                </View>
            ) : records.length === 0 ? (
                <View style={styles.card}>
                    <View style={styles.emptyIcon}>
                        <Ionicons
                            name="document-text-outline"
                            size={32}
                            color={colors.primary}
                        />
                    </View>

                    <Text style={styles.emptyTitle}>
                        No records yet
                    </Text>
                    <Text style={styles.description}>
                        Add your daily steps, calories burned, and water
                        intake to start building your health history.
                    </Text>
                </View>
            ) : (
                records.map((record) => (
                    <View key={record.id} style={styles.recordCard}>
                        <View style={styles.recordHeader}>
                            <View style={styles.recordDateIcon}>
                                <Ionicons
                                    name="calendar-outline"
                                    size={20}
                                    color={colors.primary}
                                />
                            </View>

                            <View style={styles.recordDateContainer}>
                                <Text style={styles.recordDate}>
                                    {record.date}
                                </Text>
                                <Text style={styles.recordCaption}>
                                    Daily health summary
                                </Text>
                            </View>
                        </View>

                        <View style={styles.recordMetrics}>
                            <View style={styles.recordMetric}>
                                <Ionicons
                                    name="footsteps-outline"
                                    size={21}
                                    color={colors.steps}
                                />
                                <Text style={styles.recordMetricValue}>
                                    {record.steps.toLocaleString()}
                                </Text>
                                <Text style={styles.recordMetricLabel}>
                                    Steps
                                </Text>
                            </View>

                            <View style={styles.recordMetric}>
                                <Ionicons
                                    name="flame-outline"
                                    size={21}
                                    color={colors.calories}
                                />
                                <Text style={styles.recordMetricValue}>
                                    {record.calories.toLocaleString()}
                                </Text>
                                <Text style={styles.recordMetricLabel}>
                                    Calories
                                </Text>
                            </View>

                            <View style={styles.recordMetric}>
                                <Ionicons
                                    name="water-outline"
                                    size={21}
                                    color={colors.water}
                                />
                                <Text style={styles.recordMetricValue}>
                                    {record.water.toLocaleString()}
                                </Text>
                                <Text style={styles.recordMetricLabel}>
                                    Water (ml)
                                </Text>
                            </View>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: spacing.lg,
        paddingTop: spacing.xxl,
        paddingBottom: spacing.xxl,
        flexGrow: 1,
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
        marginTop: spacing.sm,
    },
    subtitle: {
        color: colors.secondaryText,
        fontSize: typography.body,
        lineHeight: 22,
        marginTop: spacing.sm,
        marginBottom: spacing.xl,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.xl,
        alignItems: 'center',
    },
    emptyIcon: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: '#E1EDFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    emptyTitle: {
        color: colors.text,
        fontSize: typography.subtitle,
        fontWeight: '700',
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    description: {
        color: colors.secondaryText,
        fontSize: typography.body,
        lineHeight: 22,
        textAlign: 'center',
    },
    recordCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.lg,
        marginBottom: spacing.md,
    },
    recordHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    recordDateIcon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: '#E1EDFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recordDateContainer: {
        flex: 1,
    },
    recordDate: {
        color: colors.text,
        fontSize: typography.subtitle,
        fontWeight: '700',
    },
    recordCaption: {
        color: colors.secondaryText,
        fontSize: typography.small,
        marginTop: spacing.xs,
    },
    recordMetrics: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: spacing.lg,
        gap: spacing.sm,
    },
    recordMetric: {
        flex: 1,
        alignItems: 'center',
        gap: spacing.xs,
    },
    recordMetricValue: {
        color: colors.text,
        fontSize: typography.subtitle,
        fontWeight: '700',
    },
    recordMetricLabel: {
        color: colors.secondaryText,
        fontSize: typography.small,
        textAlign: 'center',
    },
});
