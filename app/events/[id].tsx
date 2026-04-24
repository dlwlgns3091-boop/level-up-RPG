import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS } from "@/constants/theme";
import { signUrls } from "@/lib/photos";
import { useAuthStore } from "@/store/useAuthStore";
import { useEventStore } from "@/store/useEventStore";

const SCREEN_WIDTH = Dimensions.get("window").width;
const THUMB_SIZE = (SCREEN_WIDTH - 40 - 6 * 2) / 3;

type EventWithPhotos = {
  id: string;
  couple_id: string;
  created_by: string;
  event_date: string;
  title: string;
  memo: string | null;
  created_at: string;
  photos: {
    id: string;
    storage_path: string;
    caption: string | null;
    uploaded_by: string;
  }[];
};

export default function EventDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const id = typeof params.id === "string" ? params.id : "";

  const user = useAuthStore((s) => s.user);
  const fetchOne = useEventStore((s) => s.fetchOne);
  const update = useEventStore((s) => s.update);
  const remove = useEventStore((s) => s.remove);
  const busy = useEventStore((s) => s.busy);

  const [loaded, setLoaded] = useState<EventWithPhotos | null>(null);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [memoDraft, setMemoDraft] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      const e = await fetchOne(id);
      if (!e) {
        setLoaded(null);
        return;
      }
      setLoaded(e as EventWithPhotos);
      setTitleDraft(e.title);
      setMemoDraft(e.memo ?? "");
      // 사진 URL 서명
      const paths = e.photos.map((p) => p.storage_path);
      if (paths.length > 0) {
        try {
          const signed = await signUrls(paths);
          setUrls(signed);
        } catch (err) {
          console.error("[events] signUrls failed:", err);
        }
      }
    })();
  }, [id, fetchOne]);

  const isOwner = useMemo(
    () => !!loaded && user?.id === loaded.created_by,
    [loaded, user?.id],
  );

  const handleSave = async () => {
    if (!loaded || busy) return;
    const nextTitle = titleDraft.trim();
    if (nextTitle.length === 0 || nextTitle.length > 40) {
      Alert.alert("제목", "1~40자로 입력해주세요.");
      return;
    }
    const nextMemo = memoDraft.trim();
    const result = await update({
      id: loaded.id,
      title: nextTitle,
      memo: nextMemo.length > 0 ? nextMemo : null,
    });
    if (!result.ok) {
      Alert.alert("저장 실패", result.errorMessage);
      return;
    }
    setLoaded({
      ...loaded,
      title: nextTitle,
      memo: nextMemo.length > 0 ? nextMemo : null,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    if (!loaded) return;
    Alert.alert(
      "기록 삭제",
      "이 기록을 삭제합니다. 연결된 사진은 라이브러리에 남습니다.",
      [
        { text: STRINGS.common.cancel, style: "cancel" },
        {
          text: "삭제",
          style: "destructive",
          onPress: async () => {
            const result = await remove(loaded.id);
            if (!result.ok) {
              Alert.alert("삭제 실패", result.errorMessage);
              return;
            }
            if (router.canGoBack()) router.back();
            else router.replace("/log");
          },
        },
      ],
    );
  };

  if (!id) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <Header onBack={() => router.back()} />
        <CenteredText text="기록 ID가 없습니다." />
      </SafeAreaView>
    );
  }

  if (!loaded) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <Header onBack={() => router.back()} />
        <CenteredText text="불러오는 중…" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Header
          onBack={() => router.back()}
          right={
            isOwner ? (
              editing ? (
                <Pressable
                  onPress={() => {
                    setEditing(false);
                    setTitleDraft(loaded.title);
                    setMemoDraft(loaded.memo ?? "");
                  }}
                  disabled={busy}
                  className="p-1"
                >
                  <Text className="text-sm text-text-muted">취소</Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={handleDelete}
                  disabled={busy}
                  className="p-1"
                >
                  <Ionicons name="trash" size={20} color={COLORS.danger} />
                </Pressable>
              )
            ) : (
              <View className="w-6" />
            )
          }
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-xs text-text-muted">
            {formatDate(loaded.event_date)}
          </Text>

          {editing ? (
            <>
              <TextInput
                value={titleDraft}
                onChangeText={setTitleDraft}
                maxLength={40}
                className="mt-2 rounded-2xl border border-bg-softer bg-bg-soft px-3 py-2 text-xl font-bold text-text"
              />
              <TextInput
                value={memoDraft}
                onChangeText={setMemoDraft}
                placeholder="메모"
                placeholderTextColor={COLORS.textMuted}
                maxLength={500}
                multiline
                className="mt-3 min-h-[96px] rounded-2xl border border-bg-softer bg-bg-soft px-3 py-2 text-base text-text"
              />
              <View className="mt-4">
                <PrimaryButton
                  label={busy ? "저장 중…" : STRINGS.common.save}
                  onPress={handleSave}
                  disabled={busy}
                />
              </View>
            </>
          ) : (
            <>
              <View className="mt-1 flex-row items-start justify-between">
                <Text className="mr-3 flex-1 text-2xl font-bold text-text">
                  {loaded.title}
                </Text>
                {isOwner ? (
                  <Pressable onPress={() => setEditing(true)} className="p-1">
                    <Ionicons name="create" size={20} color={COLORS.gold} />
                  </Pressable>
                ) : null}
              </View>
              {loaded.memo ? (
                <Text className="mt-3 text-base leading-6 text-text">
                  {loaded.memo}
                </Text>
              ) : (
                <Text className="mt-3 text-base text-text-muted">
                  메모 없음
                </Text>
              )}
            </>
          )}

          {loaded.photos.length > 0 ? (
            <View className="mt-6">
              <Text className="mb-2 text-sm font-semibold text-text-muted">
                사진 {loaded.photos.length}장
              </Text>
              <View className="flex-row flex-wrap" style={{ gap: 6 }}>
                {loaded.photos.map((p) => {
                  const url = urls[p.storage_path];
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
                        width: THUMB_SIZE,
                        height: THUMB_SIZE,
                        borderRadius: 8,
                        overflow: "hidden",
                        backgroundColor: COLORS.bgSoft,
                      }}
                    >
                      {url ? (
                        <Image
                          source={{ uri: url }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          transition={120}
                        />
                      ) : (
                        <View className="flex-1 items-center justify-center">
                          <Ionicons
                            name="image"
                            size={18}
                            color={COLORS.textMuted}
                          />
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({
  onBack,
  right,
}: {
  onBack: () => void;
  right?: React.ReactNode;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-bg-softer px-5 py-3">
      <Pressable onPress={onBack} className="p-1">
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
      </Pressable>
      <Text className="text-base font-bold text-text">기록</Text>
      <View>{right ?? <View className="w-6" />}</View>
    </View>
  );
}

function CenteredText({ text }: { text: string }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-text-muted">{text}</Text>
    </View>
  );
}

function formatDate(key: string): string {
  const p = key.split("-").map(Number);
  const y = p[0];
  const m = p[1];
  const d = p[2];
  if (!y || !m || !d) return key;
  return `${y}년 ${m}월 ${d}일`;
}
