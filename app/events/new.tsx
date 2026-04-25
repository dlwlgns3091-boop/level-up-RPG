import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { PrimaryButton } from "@/components/PrimaryButton";
import { STRINGS } from "@/constants/strings.ko";
import { COLORS, useColors } from "@/constants/theme";
import { useOnlineStatus } from "@/lib/network";
import { extractTakenAt } from "@/lib/photos";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";
import { useEventStore } from "@/store/useEventStore";
import { usePhotoStore } from "@/store/usePhotoStore";

const CALENDAR_THEME = {
  backgroundColor: COLORS.bgSoft,
  calendarBackground: COLORS.bgSoft,
  textSectionTitleColor: COLORS.textMuted,
  dayTextColor: COLORS.text,
  todayTextColor: COLORS.gold,
  selectedDayTextColor: COLORS.bg,
  selectedDayBackgroundColor: COLORS.gold,
  monthTextColor: COLORS.text,
  arrowColor: COLORS.gold,
  textDisabledColor: COLORS.bgSofter,
};

type PickedPhoto = {
  uri: string;
  takenAt: string;
};

export default function NewEvent() {
  const router = useRouter();
  const params = useLocalSearchParams<{ date?: string }>();

  const user = useAuthStore((s) => s.user);
  const couple = useCoupleStore((s) => s.couple);
  const createEvent = useEventStore((s) => s.create);
  const busy = useEventStore((s) => s.busy);
  const reloadPhotos = usePhotoStore((s) => s.load);
  const { isOnline } = useOnlineStatus();

  const [eventDate, setEventDate] = useState<string>(
    typeof params.date === "string" ? params.date : todayKst(),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState("");
  const [memo, setMemo] = useState("");
  const [picked, setPicked] = useState<PickedPhoto[]>([]);

  const trimmedTitle = title.trim();
  const isValid =
    !!couple?.id &&
    !!couple.user_b &&
    !!user?.id &&
    isOnline &&
    trimmedTitle.length > 0 &&
    trimmedTitle.length <= 40;

  const handlePickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "사진 권한 필요",
        "첨부할 사진을 선택하려면 사진 권한이 필요합니다.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
      exif: true,
      allowsMultipleSelection: true,
      selectionLimit: 10,
    });
    if (result.canceled) return;
    const nextPicks: PickedPhoto[] = [];
    for (const asset of result.assets) {
      const exif =
        (asset.exif as Record<string, unknown> | null | undefined) ?? null;
      nextPicks.push({
        uri: asset.uri,
        takenAt: extractTakenAt(exif),
      });
    }
    setPicked((prev) => [...prev, ...nextPicks]);
  };

  const removePhoto = (uri: string) => {
    setPicked((prev) => prev.filter((p) => p.uri !== uri));
  };

  const handleSave = async () => {
    if (!isValid || !couple?.id || !couple.user_b || !user?.id || busy) return;
    const result = await createEvent({
      coupleId: couple.id,
      createdBy: user.id,
      eventDate,
      title: trimmedTitle,
      memo: memo.trim().length > 0 ? memo.trim() : null,
      newPhotos: picked.map((p) => ({ localUri: p.uri, takenAt: p.takenAt })),
    });
    if (!result.ok) {
      Alert.alert("저장 실패", result.errorMessage);
      return;
    }
    // 업로드된 사진이 라이브러리에 즉시 반영되도록
    await reloadPhotos(couple.id);
    if (router.canGoBack()) router.back();
    else router.replace("/log");
  };

  if (!couple || !couple.user_b) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <Header title="새 기록" onBack={() => router.back()} />
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-center text-sm text-text-muted">
            커플 연결 후 사용할 수 있습니다.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Header title="새 기록" onBack={() => router.back()} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <Field label="날짜">
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center justify-between rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 active:opacity-80"
            >
              <Text className="text-base text-text">{formatDate(eventDate)}</Text>
              <Ionicons name="calendar" size={18} color={COLORS.gold} />
            </Pressable>
          </Field>

          <Field label="제목">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="예: 한강 나들이"
              placeholderTextColor={COLORS.textMuted}
              maxLength={40}
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
            <Text className="mt-1 text-xs text-text-muted">
              {trimmedTitle.length}/40자
            </Text>
          </Field>

          <Field label="메모 (선택)">
            <TextInput
              value={memo}
              onChangeText={setMemo}
              placeholder="오늘 어땠는지 자유롭게"
              placeholderTextColor={COLORS.textMuted}
              maxLength={500}
              multiline
              className="min-h-[96px] rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
          </Field>

          <Field label={`사진 (${picked.length}장)`}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              {picked.map((p) => (
                <View
                  key={p.uri}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: COLORS.bgSoft,
                  }}
                >
                  <Image
                    source={{ uri: p.uri }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                  <Pressable
                    onPress={() => removePhoto(p.uri)}
                    className="absolute right-1 top-1 rounded-full bg-black/70 p-1"
                  >
                    <Ionicons name="close" size={14} color={COLORS.text} />
                  </Pressable>
                </View>
              ))}
              <Pressable
                onPress={handlePickPhoto}
                disabled={busy}
                className="items-center justify-center rounded-xl border border-dashed"
                style={{
                  width: 96,
                  height: 96,
                  borderColor: COLORS.bgSofter,
                  backgroundColor: COLORS.bgSoft,
                }}
              >
                <Ionicons name="add" size={28} color={COLORS.gold} />
                <Text className="mt-1 text-[10px] text-text-muted">사진 추가</Text>
              </Pressable>
            </ScrollView>
          </Field>
        </ScrollView>

        <View className="border-t border-bg-softer bg-bg px-5 pt-4 pb-6">
          <PrimaryButton
            label={busy ? "저장 중…" : STRINGS.common.save}
            disabled={!isValid || busy}
            onPress={handleSave}
          />
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={showDatePicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDatePicker(false)}
      >
        <Pressable
          onPress={() => setShowDatePicker(false)}
          className="flex-1 items-center justify-center bg-black/70 px-6"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="w-full max-w-md overflow-hidden rounded-3xl border border-bg-softer bg-bg-soft"
          >
            <Calendar
              current={eventDate}
              markedDates={{
                [eventDate]: { selected: true },
              }}
              onDayPress={(day) => {
                setEventDate(day.dateString);
                setShowDatePicker(false);
              }}
              theme={CALENDAR_THEME}
              monthFormat={"yyyy년 M월"}
              enableSwipeMonths
              firstDay={0}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

function Header({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between border-b border-bg-softer px-5 py-3">
      <Pressable onPress={onBack} className="p-1">
        <Ionicons name="close" size={24} color={COLORS.text} />
      </Pressable>
      <Text className="text-base font-bold text-text">{title}</Text>
      <View className="w-6" />
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-5">
      <Text className="mb-2 text-sm text-text-muted">{label}</Text>
      {children}
    </View>
  );
}

function todayKst(): string {
  const ms = 9 * 60 * 60 * 1000;
  const d = new Date(Date.now() + ms);
  const y = d.getUTCFullYear().toString().padStart(4, "0");
  const m = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const dd = d.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function formatDate(key: string): string {
  const p = key.split("-").map(Number);
  const y = p[0];
  const m = p[1];
  const d = p[2];
  if (!y || !m || !d) return key;
  return `${y}년 ${m}월 ${d}일`;
}
