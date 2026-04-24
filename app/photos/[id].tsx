import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
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
import { useAuthStore } from "@/store/useAuthStore";
import { usePhotoStore } from "@/store/usePhotoStore";

export default function PhotoDetail() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const photoId = typeof params.id === "string" ? params.id : "";

  const user = useAuthStore((s) => s.user);
  const photos = usePhotoStore((s) => s.photos);
  const signedUrls = usePhotoStore((s) => s.signedUrls);
  const busy = usePhotoStore((s) => s.busy);
  const editCaption = usePhotoStore((s) => s.editCaption);
  const remove = usePhotoStore((s) => s.remove);

  const photo = useMemo(
    () => photos.find((p) => p.id === photoId) ?? null,
    [photos, photoId],
  );

  const [caption, setCaption] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setCaption(photo?.caption ?? "");
  }, [photo?.caption]);

  if (!photoId) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <Header onBack={() => router.back()} />
        <CenteredText text="사진 ID가 없습니다." />
      </SafeAreaView>
    );
  }

  if (!photo) {
    // 목록에 없음 — 방금 지워졌거나 라우팅 꼬임
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <Header onBack={() => router.back()} />
        <CenteredText text="해당 사진을 찾을 수 없습니다." />
      </SafeAreaView>
    );
  }

  const url = signedUrls[photo.storage_path];
  const isOwner = user?.id === photo.uploaded_by;

  const handleSave = async () => {
    const trimmed = caption.trim();
    const next = trimmed.length === 0 ? null : trimmed;
    if (next === (photo.caption ?? null)) {
      setEditing(false);
      return;
    }
    const result = await editCaption(photo.id, next);
    if (result.ok) {
      setEditing(false);
    } else {
      Alert.alert("저장 실패", result.errorMessage);
    }
  };

  const handleDelete = () => {
    Alert.alert("사진 삭제", "이 사진을 삭제합니다. 되돌릴 수 없습니다.", [
      { text: STRINGS.common.cancel, style: "cancel" },
      {
        text: "삭제",
        style: "destructive",
        onPress: async () => {
          const result = await remove(photo);
          if (result.ok) {
            if (router.canGoBack()) router.back();
          } else {
            Alert.alert("삭제 실패", result.errorMessage);
          }
        },
      },
    ]);
  };

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
              <Pressable onPress={handleDelete} disabled={busy} className="p-1">
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </Pressable>
            ) : (
              <View className="w-6" />
            )
          }
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: "100%", aspectRatio: 1, backgroundColor: COLORS.bgSoft }}>
            {url ? (
              <Image
                source={{ uri: url }}
                style={{ width: "100%", height: "100%" }}
                contentFit="contain"
                transition={150}
              />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Ionicons name="image" size={40} color={COLORS.textMuted} />
              </View>
            )}
          </View>

          <View className="px-5 pt-5">
            <Text className="text-sm text-text-muted">
              촬영일 {photo.taken_at}
              {"  "}·{"  "}
              업로드 {photo.uploaded_at.slice(0, 10)}
            </Text>

            <View className="mt-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-semibold text-text-muted">
                  캡션
                </Text>
                {isOwner ? (
                  <Pressable
                    onPress={() => setEditing((v) => !v)}
                    disabled={busy}
                  >
                    <Text className="text-xs font-semibold text-gold">
                      {editing ? "취소" : photo.caption ? "수정" : "추가"}
                    </Text>
                  </Pressable>
                ) : null}
              </View>

              {editing ? (
                <>
                  <TextInput
                    value={caption}
                    onChangeText={setCaption}
                    placeholder="캡션을 입력하세요"
                    placeholderTextColor={COLORS.textMuted}
                    maxLength={140}
                    multiline
                    className="mt-2 min-h-[80px] rounded-2xl border border-bg-softer bg-bg-soft px-3 py-2 text-sm text-text"
                  />
                  <View className="mt-3">
                    <PrimaryButton
                      label={busy ? "저장 중…" : STRINGS.common.save}
                      onPress={handleSave}
                      disabled={busy}
                    />
                  </View>
                </>
              ) : (
                <Text className="mt-2 text-base text-text">
                  {photo.caption?.length
                    ? photo.caption
                    : isOwner
                      ? "아직 캡션이 없습니다."
                      : "-"}
                </Text>
              )}
            </View>
          </View>
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
      <Text className="text-base font-bold text-text">사진</Text>
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
