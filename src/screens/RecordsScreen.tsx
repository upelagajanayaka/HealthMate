import { ScrollView, StyleSheet, Text, View } from 'react-native';

import colors from '../theme/colors';
import spacing from '../theme/spacing';
import typography from '../theme/typography';

export default function RecordsScreen() {
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

            <View style={styles.card}>
                <Text style={styles.emptyTitle}>Your records will appear here</Text>
                <Text style={styles.description}>
                    Add your daily steps, calories burned, and water intake
                    to start building your health history.
                </Text>
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
        paddingTop: spacing.xxl,
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
    },
    emptyTitle: {
        color: colors.text,
        fontSize: typography.subtitle,
        fontWeight: '700',
        marginBottom: spacing.sm,
    },
    description: {
        color: colors.secondaryText,
        fontSize: typography.body,
        lineHeight: 22,
    },
});
