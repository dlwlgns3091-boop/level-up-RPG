import { Tabs } from "expo-router";
import {
  GuildIcon,
  HomeIcon,
  PersonIcon,
  StarIcon,
  SwordIcon,
} from "@/components/sprites";
import { PIXEL_BORDER_WIDTH, PIXEL_FONT } from "@/components/pixelStyles";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, useColors } from "@/constants/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.gold,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.bgSoft,
          borderTopColor: COLORS.ink,
          borderTopWidth: PIXEL_BORDER_WIDTH,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontFamily: PIXEL_FONT.uiBold,
          fontSize: 11,
          letterSpacing: 0.3,
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: STRINGS.tabs.home,
          tabBarIcon: ({ size }) => <HomeIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="quests"
        options={{
          title: STRINGS.tabs.quests,
          tabBarIcon: ({ size }) => <SwordIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: STRINGS.tabs.stats,
          tabBarIcon: ({ size }) => <StarIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: STRINGS.tabs.profile,
          tabBarIcon: ({ size }) => <PersonIcon size={size} />,
        }}
      />
      <Tabs.Screen
        name="couple"
        options={{
          title: STRINGS.tabs.couple,
          tabBarIcon: ({ size }) => <GuildIcon size={size} />,
        }}
      />
    </Tabs>
  );
}
