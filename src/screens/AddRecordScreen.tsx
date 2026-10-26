import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { addHealthRecord } from '../database/healthRecordService';
import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function AddRecordScreen() {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };
    const [steps, setSteps] = useState('');
    const [calories, setCalories] = useState('');
    const [water, setWater] = useState('');
    const [date, setDate] = useState(getTodayDate);



    const handleSave = async () => {
        const trimmedDate = date.trim();
        const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmedDate);

        if (!dateMatch) {
            Alert.alert(
                'Invalid date',
                'Enter the date in YYYY-MM-DD format.'
            );
            return;
        }

        const year = Number(dateMatch[1]);
        const month = Number(dateMatch[2]);
        const day = Number(dateMatch[3]);

        const parsedDate = new Date(year, month - 1, day);

        const validDate =
            parsedDate.getFullYear() === year &&
            parsedDate.getMonth() === month - 1 &&
            parsedDate.getDate() === day;

        if (!validDate) {
            Alert.alert(
                'Invalid date',
                'Enter a real calendar date, such as 2026-10-22.'
            );
            return;
        }

        if (
            steps.trim() === '' ||
            calories.trim() === '' ||
            water.trim() === ''
        ) {
            Alert.alert(
                'Missing information',
                'Please fill in all fields.'
            );
            return;
        }

        const stepsValue = Number(steps);
        const caloriesValue = Number(calories);
        const waterValue = Number(water);

        const values = [stepsValue, caloriesValue, waterValue];

        if (
            values.some(
                (value) => !Number.isSafeInteger(value) || value < 0
            )
        ) {
            Alert.alert(
                'Invalid values',
                'Steps, calories, and water must be non-negative whole numbers.'
            );
            return;
        }

        try {
            await addHealthRecord({
                date: trimmedDate,
                steps: stepsValue,
                calories: caloriesValue,
                water: waterValue,
            });

            Alert.alert('Success', 'Your health record has been saved.');

            setSteps('');
            setCalories('');
            setWater('');
        } catch (error) {
            console.error('Failed to save health record:', error);

            Alert.alert(
                'Save failed',
                'Could not save your record. Please try again.'
            );
        }
    };


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <Ionicons
                        name="add-circle-outline"
                        size={28}
                        color={colors.primary}
                    />
                </View>

                <View style={styles.headerText}>
                    <Text style={styles.title}>Add Health Record</Text>
                    <Text style={styles.subtitle}>
                        Track your daily wellness progress.
                    </Text>
                </View>
            </View>


            <View style={styles.card}>
                <View style={styles.fieldHeader}>
                    <View style={styles.dateIcon}>
                        <Ionicons
                            name="calendar-outline"
                            size={22}
                            color={colors.primary}
                        />
                    </View>
                    <View style={styles.fieldHeading}>
                        <Text style={styles.label}>Record date</Text>
                        <Text style={styles.fieldHint}>
                            Use the YYYY-MM-DD format
                        </Text>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                    keyboardType="numbers-and-punctuation"
                    maxLength={10}
                    autoCapitalize="none"
                />
            </View>



            <View style={styles.card}>
                <View style={styles.fieldHeader}>
                    <View style={styles.stepsIcon}>
                        <Ionicons name="footsteps-outline" size={22} color="#08A88A" />
                    </View>
                    <View style={styles.fieldHeading}>
                        <Text style={styles.label}>Steps</Text>
                        <Text style={styles.fieldHint}>Daily steps completed</Text>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    value={steps}
                    onChangeText={setSteps}
                    placeholder="e.g. 8000"
                    keyboardType="number-pad"
                />
            </View>



            <View style={styles.card}>
                <View style={styles.fieldHeader}>
                    <View style={styles.caloriesIcon}>
                        <Ionicons name="flame-outline" size={22} color="#F59E0B" />
                    </View>
                    <View style={styles.fieldHeading}>
                        <Text style={styles.label}>Calories burned</Text>
                        <Text style={styles.fieldHint}>Daily energy burned (kcal)</Text>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="e.g. 450"
                    keyboardType="number-pad"
                />
            </View>



            <View style={styles.card}>
                <View style={styles.fieldHeader}>
                    <View style={styles.waterIcon}>
                        <Ionicons name="water-outline" size={22} color="#3678D4" />
                    </View>
                    <View style={styles.fieldHeading}>
                        <Text style={styles.label}>Water intake</Text>
                        <Text style={styles.fieldHint}>Daily water consumed (ml)</Text>
                    </View>
                </View>

                <TextInput
                    style={styles.input}
                    value={water}
                    onChangeText={setWater}
                    placeholder="e.g. 2000"
                    keyboardType="number-pad"
                />
            </View>


            <Pressable
                style={styles.saveButton}
                onPress={handleSave}
            >
                <Ionicons
                    name="checkmark-circle-outline"
                    size={22}
                    color="#FFFFFF"
                />
                <Text style={styles.saveButtonText}>Save Health Record</Text>
                <Ionicons
                    name="arrow-forward"
                    size={20}
                    color="#FFFFFF"
                />
            </Pressable>



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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xl,
        gap: spacing.md,
    },
    headerIcon: {
        width: 54,
        height: 54,
        borderRadius: 16,
        backgroundColor: '#E8F0FE',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerText: {
        flex: 1,
    },
    title: {
        fontSize: typography.title,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontSize: typography.body,
        color: colors.secondaryText,
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    label: {
        fontSize: typography.subtitle,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.md,
    },
    input: {
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        padding: spacing.lg,
        fontSize: typography.body,
        color: colors.text,
    },
    saveButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.xl,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: typography.subtitle,
        fontWeight: '700',
    },
    fieldHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        marginBottom: spacing.lg,
    },
    stepsIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#DDF7EF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    fieldHeading: {
        flex: 1,
    },
    fieldHint: {
        fontSize: typography.small,
        color: colors.secondaryText,
        marginTop: spacing.xs,
    },
    caloriesIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#FFF0D9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    waterIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E5EEFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dateIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#E5EEFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
