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
            <Text style={styles.title}>Add Health Record</Text>
            <Text style={styles.subtitle}>
                Record your daily wellness activity.
            </Text>

            <View style={styles.card}>
                <Text style={styles.label}>Record date</Text>
                <TextInput
                    style={styles.input}
                    value={date}
                    onChangeText={setDate}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Steps</Text>
                <TextInput
                    style={styles.input}
                    value={steps}
                    onChangeText={setSteps}
                    placeholder="e.g. 8000"
                    keyboardType="number-pad"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Calories burned</Text>
                <TextInput
                    style={styles.input}
                    value={calories}
                    onChangeText={setCalories}
                    placeholder="e.g. 450"
                    keyboardType="number-pad"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>Water intake (ml)</Text>
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
                <Text style={styles.saveButtonText}>Save Health Record</Text>
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
    title: {
        fontSize: typography.title,
        fontWeight: '700',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.body,
        color: colors.secondaryText,
        marginBottom: spacing.xl,
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
        padding: spacing.lg,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: spacing.sm,
    },

    saveButtonText: {
        color: '#FFFFFF',
        fontSize: typography.subtitle,
        fontWeight: '700',
    },
});
