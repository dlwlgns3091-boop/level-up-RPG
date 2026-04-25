import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { CenteredSpinner } from "@/components/Spinner";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, useColors } from "@/constants/theme";
import { useOnlineStatus } from "@/lib/network";
import { extractTakenAt } from "@/lib/photos";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { usePhotoStore } from "@/store/usePhotoStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const GRID_COLUMNS = 3;
const GRID_GAP = 2;
const GRID_TILE_SIZE =
  (SCREEN_WIDTH - 40 - GRID_GAP * (GRID_COLUMNS - 1)) / GRID_COLUMNS;

type PendingUpload = {
  uri: string;
  takenAt: string;
  caption: string;
};

export default function PhotosGrid() {
  const router = useRouter();

  const user = useAuthStore((s) => s.user);
  const couple = useCoupleStore((s) => s.couple);

  const photos = usePhotoStore((s) => s.photos);
  const signedUrls = usePhotoStore((s) => s.signedUrls);
  const isLoading = usePhotoStore((s) => s.isLoading);
  const busy = usePhotoStore((s) => s.busy);
  const load = usePhotoStore((s) => s.load);
  const upload = usePhotoStore((s) => s.upload);

  const { isOnline } = useOnlineStatus();

  const [pending, setPending] = useState<PendingUpload | null>(null);
  const [captionInput, setCaptionInput] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (couple?.id) load(couple.id);
    }, [couple?.id, load]),
  );

  const groups = useMemo(() => groupByDate(photos), [photos]);

  const canUpload = Boolean(
    couple?.id && couple.user_b && user?.id && isOnline,
  );

  const onRefresh = useCallback(async () => {
    if (!couple?.id) return;
    setRefreshing(true);
    try {
      await load(couple.id);
    } finally {
      setRefreshing(false);
    }
  }, [couple?.id, load]);

  const handlePick = async () => {
    if (!canUpload) {
      if (!isOnline) {
        Alert.alert("오프라인", "사진 업로드는 인터넷 연결이 필요합니다.");
      }
      return;
    }
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "사진 권한 필요",
        "사진을 업로드하려면 설정에서 사진 접근 권한을 허용해주세요.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      exif: true,
      allowsMultipleSelection: false,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    if (!asset) return;
    const exif = (asset.exif as Record<string, unknown> | null | undefined) ?? null;
    setPending({
      uri: asset.uri,
      takenAt: extractTakenAt(exif),
      caption: "",
    });
    setCaptionInput("");
  };

  const confirmUpload = async () => {
    if (!pending || !couple?.id || !couple.user_b || !user?.id || busy) return;
    const result = await upload({
      coupleId: couple.id,
      uploadedBy: user.id,
      localUri: pending.uri,
      takenAt: pending.takenAt,
      caption: captionInput.trim() ? captionInput.trim() : null,
    });
    if (result.ok) {
      setPending(null);
      setCaptionInput("");
    } else {
      Alert.alert("업로드 실패", result.errorMessage);
    }
  };

  if (!couple || !couple.user_b) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
        <Header onBack={() => router.back()} title="사진" />
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="heart-outline" size={40} color={COLORS.textMuted} />
          <Text className="mt-3 text-center text-sm text-text-muted">
            커플 연결 후 사용할 수 있습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <Header
        onBack={() => router.back()}
        title="사진"
        right={
          <Pressable
            onPress={handlePick}
            disabled={!canUpload || busy}
            className="p-1"
          >
            <Ionicons
              name="add-circle"
              size={28}
              color={!canUpload || busy ? COLORS.textMuted : COLORS.gold}
            />
          </Pressable>
        }
      />

      {isLoading && photos.length === 0 ? (
        <CenteredSpinner label="사진 불러오는 중…" />
      ) : photos.length === 0 ? (
        <EmptyState onAdd={handlePick} busy={busy} />
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.gold}
              colors={[COLORS.gold]}
            />
          }
        >
          {groups.map(({ dateKey, items }) => (
            <View key={dateKey} className="mb-4">
              <Text className="mb-2 text-sm font-semibold text-text-muted">
                {formatDateHeader(dateKey)}
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: GRID_GAP }}>
                {items.map((p) => {
                  const url = signedUrls[p.storage_path];
                  return (
                    <Pressable
                      key={p.id}
                      onPress={() =>
                        router.push({
                          pathname: "/photos/[id]",
                          params: { id: p.id },
                        })
                      }
                      style={{
                        width: GRID_TILE_SIZE,
                        height: GRID_TILE_SIZE,
                        backgroundColor: COLORS.bgSoft,
                        borderRadius: 8,
                        overflow: "hidden",
                      }}
                    >
                      {url ? (
                        <Image
                          source={{ uri: url }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          transition={150}
                        />
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <Ionicons
                            name="image"
                            size={20}
                            color={COLORS.textMuted}
                          />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <Modal
        visible={!!pending}
        transparent
        animationType="fade"
        onRequestClose={() => setPending(null)}
      >
        <View className="flex-1 items-center justify-center bg-black/70 px-6">
          <View className="w-full max-w-md rounded-3xl border border-bg-softer bg-bg-soft p-5">
            <Text className="mb-3 text-lg font-bold text-text">
              업로드할까요?
            </Text>
            {pending ? (
              <>
                <Image
                  source={{ uri: pending.uri }}
                  style={{
                    width: "100%",
                    aspectRatio: 1,
                    borderRadius: 12,
                    backgroundColor: COLORS.bg,
                  }}
                  contentFit="cover"
                />
                <Text className="mt-3 text-xs text-text-muted">
                  촬영일: {pending.takenAt}
                </Text>
                <TextInput
                  value={captionInput}
                  onChangeText={setCaptionInput}
                  placeholder="캡션 (선택)"
                  placeholderTextColor={COLORS.textMuted}
                  maxLength={140}
                  multiline
                  className="mt-3 min-h-[56px] rounded-2xl border border-bg-softer bg-bg px-3 py-2 text-sm text-text"
                />
                <View className="mt-4 flex-row">
                  <View className="mr-2 flex-1">
                    <PrimaryButton
                      label={STRINGS.common.cancel}
                      variant="secondary"
                      onPress={() => setPending(null)}
                      disabled={busy}
                    />
                  </View>
                  <View className="flex-1">
                    <PrimaryButton
                      label={busy ? "업로드 중…" : "업로드"}
                      onPress={confirmUpload}
                      disabled={busy}
                    />
                  </View>
                </View>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Header({
  onBack,
  title,
  right,
}: {
  onBack: () => void;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-bg-softer px-5 py-3">
      <Pressable onPress={onBack} className="p-1">
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
      </Pressable>
      <Text className="text-base font-bold text-text">{title}</Text>
      <View>{right ?? <View className="w-6" />}</View>
    </View>
  );
}

function EmptyState({
  onAdd,
  busy,
}: {
  onAdd: () => void;
  busy: boolean;
}) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="images" size={48} color={COLORS.textMuted} />
      <Text className="mt-4 text-center text-base text-text">
        아직 사진이 없습니다
      </Text>
      <Text className="mt-1 text-center text-sm text-text-muted">
        첫 사진을 업로드해보세요.
      </Text>
      <View className="mt-6 w-full max-w-xs">
        <PrimaryButton
          label="사진 추가"
          onPress={onAdd}
          disabled={busy}
        />
      </View>
    </View>
  );
}

type Photo = {
  id: string;
  couple_id: string;
  uploaded_by: string;
  storage_path: string;
  taken_at: string;
  caption: string | null;
  uploaded_at: string;
};

function groupByDate(
  photos: readonly Photo[],
): { dateKey: string; items: Photo[] }[] {
  const map = new Map<string, Photo[]>();
  for (const p of photos) {
    const list = map.get(p.taken_at) ?? [];
    list.push(p);
    map.set(p.taken_at, list);
  }
  const result = Array.from(map.entries())
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([dateKey, items]) => ({ dateKey, items }));
  return result;
}

function formatDateHeader(dateKey: string): string {
  // YYYY-MM-DD -> "YYYY년 M월 D일"
  const parts = dateKey.split("-").map((s) => Number(s));
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return dateKey;
  return `${y}년 ${m}월 ${d}일`;
}
