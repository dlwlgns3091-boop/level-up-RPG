import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "@/constants/theme";
import { useOnlineStatus } from "@/lib/network";

/**
 * 오프라인 상태일 때 화면 상단에 얇게 노출되는 배너.
 * 루트 레이아웃 SafeAreaProvider 안쪽 최상단에 마운트.
 */
export function OfflineBanner() {
  const { isOnline } = useOnlineStatus();
  if (isOnline) return null;
  return (
    <SafeAreaView edges={["top"]} style={{ backgroundColor: COLORS.danger }}>
      <View className="flex-row items-center justify-center py-1.5">
        <Ionicons name="cloud-offline" size={14} color={COLORS.text} />
        <Text className="ml-1.5 text-xs font-semibold text-text">
          오프라인 — 일부 기능이 제한됩니다
        </Text>
      </View>
    </SafeAreaView>
  );
}
