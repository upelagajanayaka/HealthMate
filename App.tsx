
import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './src/screens/DashboardScreen';
import RecordsScreen from './src/screens/RecordsScreen';
import AddRecordScreen from './src/screens/AddRecordScreen';
import colors from './src/theme/colors';
import spacing from './src/theme/spacing';

type ScreenName = 'dashboard' | 'records' | 'addRecord';

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
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    elevation: 12,
    shadowColor: '#172B4D',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    minHeight: 62,
    borderRadius: 16,
  },
  tabLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: '500',
  },
  activeLabel: {
    color: colors.primary,
    fontWeight: '700',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -spacing.lg,
    height: 3,
    width: 42,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
