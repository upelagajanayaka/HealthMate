import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


import {
    getAllHealthRecords,
    updateHealthRecord,
    deleteHealthRecord,
    type HealthRecord,
} from '../database/healthRecordService';

import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';


export default function RecordsScreen() {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    const [editingRecord, setEditingRecord] =
        useState<HealthRecord | null>(null);
    const [editDate, setEditDate] = useState('');
    const [editSteps, setEditSteps] = useState('');
    const [editCalories, setEditCalories] = useState('');
    const [editWater, setEditWater] = useState('');
    const [savingEdit, setSavingEdit] = useState(false);

    const handleEditPress = (record: HealthRecord) => {
        setEditingRecord(record);
        setEditDate(record.date);
        setEditSteps(String(record.steps));
        setEditCalories(String(record.calories));
        setEditWater(String(record.water));
    };
    const handleSaveEdit = async () => {
        if (!editingRecord) {
            return;
        }

        if (
            editDate.trim() === '' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(editDate.trim())
        ) {
            Alert.alert('Invalid date', 'Enter the date as YYYY-MM-DD.');
            return;
        }

        const stepsValue = Number(editSteps);
        const caloriesValue = Number(editCalories);
        const waterValue = Number(editWater);

        if (
            [editSteps, editCalories, editWater].some(
                (value) => value.trim() === ''
            ) ||
            [stepsValue, caloriesValue, waterValue].some(
                (value) => !Number.isSafeInteger(value) || value < 0
            )
        ) {
            Alert.alert(
                'Invalid values',
                'Enter non-negative whole numbers for steps, calories, and water.'
            );
            return;
        }

        try {
            setSavingEdit(true);

            await updateHealthRecord(editingRecord.id, {
                date: editDate.trim(),
                steps: stepsValue,
                calories: caloriesValue,
                water: waterValue,
            });

            const updatedRecords = await getAllHealthRecords();
            setRecords(updatedRecords);
            setEditingRecord(null);

            Alert.alert('Success', 'Health record updated successfully.');
        } catch (error) {
            console.error('Failed to update health record:', error);
            Alert.alert('Update failed', 'Please try again.');
        } finally {
            setSavingEdit(false);
        }
    };

    const handleDeletePress = (record: HealthRecord) => {
        Alert.alert(
            'Delete Health Record',
            `Are you sure you want to delete the record for ${record.date}? This action cannot be undone.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteHealthRecord(record.id);

                            const updatedRecords = await getAllHealthRecords();
                            setRecords(updatedRecords);

                            Alert.alert(
                                'Success',
                                'Health record deleted successfully.'
                            );
                        } catch (error) {
                            console.error('Failed to delete health record:', error);
                            Alert.alert(
                                'Delete failed',
                                'Could not delete the health record. Please try again.'
                            );
                        }
                    },
                },
            ]
        );
    };



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
        <View style={{ flex: 1 }}>
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

                                <Pressable
                                    style={styles.editButton}
                                    onPress={() => handleEditPress(record)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Edit health record for ${record.date}`}


                                >
                                    <Ionicons
                                        name="pencil-outline"
                                        size={18}
                                        color={colors.primary}
                                    />
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </Pressable>


                                <Pressable
                                    style={styles.deleteButton}
                                    onPress={() => handleDeletePress(record)}
                                    accessibilityRole="button"
                                    accessibilityLabel={`Delete health record for ${record.date}`}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={18}
                                        color="#DC2626"
                                    />
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </Pressable>

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

            <Modal
                visible={editingRecord !== null}
                animationType="slide"
                transparent
                onRequestClose={() => setEditingRecord(null)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitle}>
                            Edit Health Record
                        </Text>

                        <Text style={styles.modalSubtitle}>
                            Update your saved health information.
                        </Text>

                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            <Text style={styles.inputLabel}>Record date</Text>
                            <TextInput
                                style={styles.input}
                                value={editDate}
                                onChangeText={setEditDate}
                                placeholder="YYYY-MM-DD"
                                autoCapitalize="none"
                            />

                            <Text style={styles.inputLabel}>Steps</Text>
                            <TextInput
                                style={styles.input}
                                value={editSteps}
                                onChangeText={setEditSteps}
                                placeholder="e.g. 8000"
                                keyboardType="number-pad"
                            />

                            <Text style={styles.inputLabel}>Calories burned</Text>
                            <TextInput
                                style={styles.input}
                                value={editCalories}
                                onChangeText={setEditCalories}
                                placeholder="e.g. 450"
                                keyboardType="number-pad"
                            />

                            <Text style={styles.inputLabel}>Water intake (ml)</Text>
                            <TextInput
                                style={styles.input}
                                value={editWater}
                                onChangeText={setEditWater}
                                placeholder="e.g. 2000"
                                keyboardType="number-pad"
                            />
                        </ScrollView>

                        <Pressable
                            style={[
                                styles.saveButton,
                                savingEdit && styles.disabledButton,
                            ]}
                            onPress={handleSaveEdit}
                            disabled={savingEdit}
                        >
                            <Text style={styles.saveButtonText}>
                                {savingEdit ? 'Saving...' : 'Save Changes'}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={styles.cancelButton}
                            onPress={() => setEditingRecord(null)}
                            disabled={savingEdit}
                        >
                            <Text style={styles.cancelButtonText}>
                                Cancel
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </View>
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
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
    },
    editButtonText: {
        color: colors.primary,
        fontSize: typography.body,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.45)',
        justifyContent: 'center',
        padding: spacing.lg,
    },
    modalCard: {
        backgroundColor: colors.surface,
        borderRadius: 22,
        padding: spacing.xl,
        maxHeight: '90%',
    },
    modalTitle: {
        color: colors.text,
        fontSize: typography.heading,
        fontWeight: '700',
    },
    modalSubtitle: {
        color: colors.secondaryText,
        fontSize: typography.body,
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    inputLabel: {
        color: colors.text,
        fontSize: typography.body,
        fontWeight: '600',
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: spacing.md,
        color: colors.text,
        fontSize: typography.body,
    },
    saveButton: {
        backgroundColor: colors.primary,
        padding: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: typography.subtitle,
        fontWeight: '700',
    },
    disabledButton: {
        opacity: 0.6,
    },
    cancelButton: {
        padding: spacing.md,
        alignItems: 'center',
        marginTop: spacing.xs,
    },
    cancelButtonText: {
        color: colors.secondaryText,
        fontSize: typography.body,
        fontWeight: '600',
    },

    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FECACA',
        backgroundColor: '#FEF2F2',
    },
    deleteButtonText: {
        color: '#DC2626',
        fontSize: typography.body,
        fontWeight: '600',
    },

});
