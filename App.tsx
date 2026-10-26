import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import AddRecordScreen from './src/screens/AddRecordScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import DailyGoalsScreen from './src/screens/DailyGoalsScreen';
import colors from './src/theme/colors';
import spacing from './src/theme/spacing';

type ScreenName =
  | 'dashboard'
  | 'records'
  | 'statistics'
  | 'dailyGoals'
  | 'addRecord';

export default function App() {
  const [currentScreen, setCurrentScreen] =
    useState<ScreenName>('dashboard');

  const [refreshKey, setRefreshKey] = useState(0);

  const tabs = [
    {
      name: 'dashboard' as const,
      label: 'Dashboard',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
    },
    {
      name: 'records' as const,
      label: 'Records',
      icon: 'document-text-outline' as const,
      activeIcon: 'document-text' as const,
    },
    {
      name: 'statistics' as const,
      label: 'Statistics',
      icon: 'bar-chart-outline' as const,
      activeIcon: 'bar-chart' as const,
    },
    {
      name: 'dailyGoals' as const,
      label: 'Daily Goals',
      icon: 'flag-outline' as const,
      activeIcon: 'flag' as const,
    },
    {
      name: 'addRecord' as const,
      label: 'Add record',
      icon: 'add-circle-outline' as const,
      activeIcon: 'add-circle' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.screen}>
        {currentScreen === 'dashboard' ? (
          <DashboardScreen />
        ) : currentScreen === 'records' ? (
          <RecordsScreen />
        ) : currentScreen === 'statistics' ? (
          <StatisticsScreen />
        ) : currentScreen === 'dailyGoals' ? (
          <DailyGoalsScreen />
        ) : (
          <AddRecordScreen />
        )}
      </View>

      <View style={styles.navigation}>
        {tabs.map((tab) => {
          const active = currentScreen === tab.name;

          return (
            <Pressable
              key={tab.name}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
              accessibilityState={{ selected: active }}
              style={styles.tab}
              onPress={() => setCurrentScreen(tab.name)}
            >
              <Ionicons
                name={active ? tab.activeIcon : tab.icon}
                size={26}
                color={
                  active
                    ? colors.primary
                    : colors.secondaryText
                }
              />

              <Text
                style={[
                  styles.tabLabel,
                  active && styles.activeLabel,
                ]}
              >
                {tab.label}
              </Text>

              {active && <View style={styles.activeIndicator} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screen: {
    flex: 1,
  },

  navigation: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 2,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 12,
    shadowColor: '#172B4D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },

  tab: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 56,
    borderRadius: 12,
  },

  tabLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: '500',
    textAlign: 'center',
  },

  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },

  activeIndicator: {
    position: 'absolute',
    top: -8,
    height: 3,
    width: 28,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },

});
