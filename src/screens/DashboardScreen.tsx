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
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>YOUR DAILY WELLNESS</Text>
                        <Text style={styles.title}>HealthMate</Text>
                    </View>

                    <View style={styles.profile}>
                        <Text style={styles.profileText}>HM</Text>
                    </View>
                </View>

                <View style={styles.dateSection}>
                    <Text style={styles.sectionTitle}>Today's overview</Text>
                    <Text style={styles.date}>
                        {new Date().toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Steps walked</Text>
                    <Text style={styles.cardValue}>7,850</Text>
                    <Text style={styles.cardDescription}>
                        of 10,000 steps
                    </Text>
                    <View style={styles.progressBackground}>
                        <View style={[styles.progressFill, { width: '78.5%' }]} />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={[styles.smallCard, styles.caloriesCard]}>
                        <Text style={styles.cardLabel}>Calories</Text>
                        <Text style={styles.smallValue}>420</Text>
                        <Text style={styles.cardDescription}>kcal burned</Text>
                    </View>

                    <View style={[styles.smallCard, styles.waterCard]}>
                        <Text style={styles.cardLabel}>Water intake</Text>
                        <Text style={styles.smallValue}>2,000</Text>
                        <Text style={styles.cardDescription}>ml consumed</Text>
                    </View>
                </View>

                <View style={styles.activitySection}>
                    <Text style={styles.sectionTitle}>Daily activity</Text>
                    <Text style={styles.activityDescription}>
                        Keep building healthy habits. Small steps make a difference.
                    </Text>

                    <View style={styles.activityRow}>
                        <Text style={styles.activityName}>Steps goal</Text>
                        <Text style={styles.activityAmount}>78.5%</Text>
                    </View>

                    <View style={styles.activityRow}>
                        <Text style={styles.activityName}>Water goal</Text>
                        <Text style={styles.activityAmount}>80%</Text>
                    </View>
                </View>

                <View style={styles.navigation}>
                    <Text style={styles.navActive}>Dashboard</Text>
                    <Text style={styles.navItem}>Records</Text>
                    <Text style={styles.navItem}>Add record</Text>
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

    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        color: '#718096',
        fontSize: 11,
        fontWeight: '600',
        letterSpacing: 1.5,
    },
    title: {
        color: '#172B4D',
        fontSize: 30,
        fontWeight: '700',
        marginTop: 8,
        letterSpacing: -0.5,
    },

    profile: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#DCE9FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileText: {
        color: '#2459A9',
        fontSize: typography.title,
        fontWeight: '700',
    },
    dateSection: {
        paddingHorizontal: 22,
        marginTop: 30,
        marginBottom: 18,
    },
    sectionTitle: {
        color: '#172B4D',
        fontSize: 19,
        fontWeight: '700',
    },
    date: {
        color: '#7B8798',
        fontSize: 13,
        marginTop: 6,
    },
    card: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        padding: 22,
        borderRadius: 20,
        marginBottom: 16,
    },
    cardLabel: {
        color: '#69788D',
        fontSize: 13,
        fontWeight: '500',
    },
    cardValue: {
        color: '#172B4D',
        fontSize: 34,
        fontWeight: '700',
        marginTop: 12,
    },
    cardDescription: {
        color: '#8995A7',
        fontSize: 12,
        marginTop: 5,
    },
    progressBackground: {
        height: 7,
        backgroundColor: '#E7EDF5',
        borderRadius: 10,
        marginTop: 18,
        overflow: 'hidden',
    },
    progressFill: {
        height: 7,
        backgroundColor: '#3678D4',
        borderRadius: 10,
    },
    row: {
        flexDirection: 'row',
        marginHorizontal: 20,
        gap: 12,
    },
    smallCard: {
        flex: 1,
        padding: spacing.lg,
        borderRadius: 18,
    },
    caloriesCard: {
        backgroundColor: '#FFF0EB',
    },
    waterCard: {
        backgroundColor: '#E8F4FF',
    },
    smallValue: {
        color: '#172B4D',
        fontSize: 25,
        fontWeight: '700',
        marginTop: 14,
    },
    activitySection: {
        backgroundColor: '#FFFFFF',
        margin: 20,
        marginBottom: 12,
        padding: 20,
        borderRadius: 20,
    },
    activityDescription: {
        color: '#7B8798',
        fontSize: 13,
        lineHeight: 20,
        marginTop: 8,
        marginBottom: 18,
    },
    activityRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    activityName: {
        color: '#58677D',
        fontSize: 14,
    },
    activityAmount: {
        color: '#2459A9',
        fontSize: 14,
        fontWeight: '700',
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        marginTop: 4,
    },
    navActive: {
        color: '#2459A9',
        fontSize: 13,
        fontWeight: '700',
    },
    navItem: {
        color: '#8995A7',
        fontSize: 13,
        fontWeight: '500',
    },
});
