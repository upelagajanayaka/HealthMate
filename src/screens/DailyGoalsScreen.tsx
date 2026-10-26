import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    Pressable,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import {
    getTodayHealthRecords,
} from '../database/healthRecordService';
import {
    DailyGoals,
    getDailyGoals,
    updateDailyGoals,
} from '../database/dailyGoalService';
import colors from '../theme/colors';
import spacing from '../theme/spacing';

type Metric = 'steps' | 'calories' | 'water';

type GoalItem = {
    key: Metric;
    title: string;
    unit: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    background: string;
    goalKey: keyof DailyGoals;
};

const goalItems: GoalItem[] = [
    {
        key: 'steps',
        title: 'Steps',
        unit: 'steps',
        icon: 'footsteps-outline',
        color: colors.steps,
        background: '#E4F7F1',
        goalKey: 'steps_goal',
    },
    {
        key: 'calories',
        title: 'Calories',
        unit: 'kcal',
        icon: 'flame-outline',
        color: colors.calories,
        background: '#FFF3DF',
        goalKey: 'calories_goal',
    },
    {
        key: 'water',
        title: 'Water',
        unit: 'ml',
        icon: 'water-outline',
        color: colors.water,
        background: '#E8F2FF',
        goalKey: 'water_goal',
    },
];

export default function DailyGoalsScreen() {
    const [goals, setGoals] = useState<DailyGoals>({
        steps_goal: 8000,
        calories_goal: 500,
        water_goal: 2000,
    });

    const [values, setValues] = useState({
        steps: 0,
        calories: 0,
        water: 0,
    });

    const [draftGoals, setDraftGoals] = useState({
        steps_goal: '8000',
        calories_goal: '500',
        water_goal: '2000',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);

    const loadData = useCallback(async () => {
        try {
            const [savedGoals, records] = await Promise.all([
                getDailyGoals(),
                getTodayHealthRecords(),
            ]);

            setGoals(savedGoals);
            setDraftGoals({
                steps_goal: String(savedGoals.steps_goal),
                calories_goal: String(savedGoals.calories_goal),
                water_goal: String(savedGoals.water_goal),
            });

            setValues({
                steps: records.reduce((sum, record) => sum + record.steps, 0),
                calories: records.reduce((sum, record) => sum + record.calories, 0),
                water: records.reduce((sum, record) => sum + record.water, 0),
            });
        } catch {
            Alert.alert(
                'Unable to load data',
                'Please try opening Daily Goals again.',
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const saveGoals = async () => {
        const parsed = {
            steps_goal: Number(draftGoals.steps_goal),
            calories_goal: Number(draftGoals.calories_goal),
            water_goal: Number(draftGoals.water_goal),
        };

        const valid = Object.values(parsed).every(
            (value) => Number.isSafeInteger(value) && value > 0,
        );

        if (!valid) {
            Alert.alert(
                'Invalid goals',
                'Enter a positive whole number for each daily goal.',
            );
            return;
        }

        setSaving(true);

        try {
            await updateDailyGoals(parsed);
            setGoals(parsed);
            setDraftGoals({
                steps_goal: String(parsed.steps_goal),
                calories_goal: String(parsed.calories_goal),
                water_goal: String(parsed.water_goal),
            });
            setEditing(false);
            Alert.alert('Goals saved', 'Your daily goals have been updated.');
        } catch {
            Alert.alert('Save failed', 'Please try saving your goals again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.muted}>Loading your daily goals...</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            <View style={styles.header}>
                <Text style={styles.eyebrow}>YOUR WELLNESS</Text>
                <Text style={styles.title}>Daily Goals</Text>
                <Text style={styles.subtitle}>
                    Build healthy habits one day at a time.
                </Text>
            </View>

            <View style={styles.overviewCard}>
                <View style={styles.overviewIcon}>
                    <Ionicons
                        name="trending-up-outline"
                        size={25}
                        color={colors.primary}
                    />
                </View>
                <View style={styles.overviewText}>
                    <Text style={styles.overviewTitle}>Today's progress</Text>
                    <Text style={styles.muted}>
                        Track your activity against your personal targets.
                    </Text>
                </View>
            </View>

            {goalItems.map((item) => {
                const current = values[item.key];
                const target = goals[item.goalKey];
                const percentage = Math.min(
                    Math.round((current / target) * 100),
                    100,
                );

                return (
                    <View key={item.key} style={styles.goalCard}>
                        <View style={styles.goalHeader}>
                            <View
                                style={[
                                    styles.goalIcon,
                                    { backgroundColor: item.background },
                                ]}
                            >
                                <Ionicons
                                    name={item.icon}
                                    size={23}
                                    color={item.color}
                                />
                            </View>

                            <View style={styles.goalTitleArea}>
                                <Text style={styles.goalTitle}>{item.title}</Text>
                                <Text style={styles.muted}>Daily target</Text>
                            </View>

                            <Text style={[styles.percentage, { color: item.color }]}>
                                {percentage}%
                            </Text>
                        </View>

                        <View style={styles.progressTrack}>
                            <View
                                style={[
                                    styles.progressFill,
                                    {
                                        width: `${percentage}%`,
                                        backgroundColor: item.color,
                                    },
                                ]}
                            />
                        </View>

                        <View style={styles.progressFooter}>
                            <Text style={styles.currentValue}>
                                {current.toLocaleString()} {item.unit}
                            </Text>
                            <Text style={styles.targetValue}>
                                Goal: {target.toLocaleString()} {item.unit}
                            </Text>
                        </View>

                        {current >= target ? (
                            <View style={styles.completedMessage}>
                                <Ionicons
                                    name="checkmark-circle"
                                    size={16}
                                    color={colors.steps}
                                />
                                <Text style={styles.completedText}>Daily goal reached</Text>
                            </View>
                        ) : (
                            <Text style={styles.remainingText}>
                                {(target - current).toLocaleString()} {item.unit} remaining
                            </Text>
                        )}
                    </View>
                );
            })}

            <View style={styles.editCard}>
                <View style={styles.editHeader}>
                    <View style={styles.editTextArea}>
                        <Text style={styles.sectionTitle}>Personalise your goals</Text>
                        <Text style={styles.muted}>
                            Adjust your daily targets whenever you need.
                        </Text>
                    </View>

                    {!editing && (
                        <Pressable
                            accessibilityRole="button"
                            onPress={() => setEditing(true)}
                            style={styles.editButton}
                        >
                            <Ionicons
                                name="create-outline"
                                size={18}
                                color={colors.primary}
                            />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </Pressable>
                    )}
                </View>

                {editing && (
                    <>
                        {goalItems.map((item) => (
                            <View key={item.goalKey} style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>
                                    {item.title} goal ({item.unit})
                                </Text>

                                <TextInput
                                    value={draftGoals[item.goalKey]}
                                    onChangeText={(value) =>
                                        setDraftGoals((previous) => ({
                                            ...previous,
                                            [item.goalKey]: value,
                                        }))
                                    }
                                    keyboardType="number-pad"
                                    selectTextOnFocus
                                    style={styles.input}
                                    placeholder={`Enter ${item.title.toLowerCase()} goal`}
                                    placeholderTextColor="#94A3B8"
                                    accessibilityLabel={`${item.title} daily goal`}
                                />
                            </View>
                        ))}

                        <Pressable
                            accessibilityRole="button"
                            disabled={saving}
                            onPress={saveGoals}
                            style={[
                                styles.saveButton,
                                saving && styles.disabledButton,
                            ]}
                        >
                            {saving ? (
                                <ActivityIndicator color="#FFFFFF" />
                            ) : (
                                <>
                                    <Ionicons
                                        name="checkmark-circle-outline"
                                        size={20}
                                        color="#FFFFFF"
                                    />
                                    <Text style={styles.saveButtonText}>Save goals</Text>
                                </>
                            )}
                        </Pressable>

                        <Pressable
                            accessibilityRole="button"
                            disabled={saving}
                            onPress={() => {
                                setDraftGoals({
                                    steps_goal: String(goals.steps_goal),
                                    calories_goal: String(goals.calories_goal),
                                    water_goal: String(goals.water_goal),
                                });
                                setEditing(false);
                            }}
                            style={styles.cancelButton}
                        >
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </Pressable>
                    </>
                )}
            </View>
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
        paddingBottom: spacing.xxxl,
        gap: spacing.lg,
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        backgroundColor: colors.background,
    },
    header: {
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    eyebrow: {
        color: colors.primary,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        marginBottom: spacing.xs,
    },
    title: {
        color: colors.text,
        fontSize: 27,
        fontWeight: '800',
    },
    subtitle: {
        color: colors.secondaryText,
        fontSize: 14,
        marginTop: spacing.xs,
    },
    overviewCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    overviewIcon: {
        width: 48,
        height: 48,
        borderRadius: 15,
        backgroundColor: '#E8F2FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    overviewText: {
        flex: 1,
        gap: spacing.xs,
    },
    overviewTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    goalCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    goalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    goalIcon: {
        width: 46,
        height: 46,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    goalTitleArea: {
        flex: 1,
        gap: 3,
    },
    goalTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    percentage: {
        fontSize: 20,
        fontWeight: '800',
    },
    progressTrack: {
        height: 9,
        borderRadius: 10,
        backgroundColor: '#EDF1F5',
        overflow: 'hidden',
        marginTop: spacing.lg,
    },
    progressFill: {
        height: '100%',
        borderRadius: 10,
    },
    progressFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    currentValue: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '700',
    },
    targetValue: {
        color: colors.secondaryText,
        fontSize: 12,
    },
    completedMessage: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        marginTop: spacing.md,
    },
    completedText: {
        color: colors.steps,
        fontSize: 12,
        fontWeight: '700',
    },
    remainingText: {
        color: colors.secondaryText,
        fontSize: 12,
        marginTop: spacing.md,
    },
    editCard: {
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    editHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    editTextArea: {
        flex: 1,
        gap: spacing.xs,
    },
    sectionTitle: {
        color: colors.text,
        fontSize: 16,
        fontWeight: '700',
    },
    muted: {
        color: colors.secondaryText,
        fontSize: 12,
        lineHeight: 18,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: '#E8F2FF',
        borderRadius: 10,
    },
    editButtonText: {
        color: colors.primary,
        fontSize: 13,
        fontWeight: '700',
    },
    inputGroup: {
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    inputLabel: {
        color: colors.text,
        fontSize: 13,
        fontWeight: '600',
    },
    input: {
        minHeight: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: spacing.md,
        color: colors.text,
        backgroundColor: colors.background,
        fontSize: 15,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        minHeight: 50,
        marginTop: spacing.xl,
        borderRadius: 14,
        backgroundColor: colors.primary,
    },
    disabledButton: {
        opacity: 0.6,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700',
    },
    cancelButton: {
        alignItems: 'center',
        padding: spacing.md,
        marginTop: spacing.xs,
    },
    cancelButtonText: {
        color: colors.secondaryText,
        fontSize: 14,
        fontWeight: '600',
    },
});
