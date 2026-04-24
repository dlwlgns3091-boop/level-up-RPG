import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { daysSince } from "@/lib/couples";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useCoupleStore } from "@/store/useCoupleStore";

export default function CoupleTab() {
  const router = useRouter();

  const authReady = useAuthStore((s) => s.isReady);
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);

  const couple = useCoupleStore((s) => s.couple);
  const isLoading = useCoupleStore((s) => s.isLoading);
  const busy = useCoupleStore((s) => s.busy);
  const loadCouple = useCoupleStore((s) => s.loadCouple);
  const clearCouple = useCoupleStore((s) => s.clear);

  // 로그인 상태 변화에 반응해서 커플 정보 로드/클리어
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return;
    if (session) {
      loadCouple();
    } else {
      clearCouple();
    }
  }, [session, loadCouple, clearCouple]);

  // 탭에 재진입할 때마다 최신 상태 로드 (상대가 막 연결했을 수도 있음)
  useFocusEffect(
    useCallback(() => {
      if (SUPABASE_CONFIGURED && session) {
        loadCouple();
      }
    }, [session, loadCouple]),
  );

  if (!SUPABASE_CONFIGURED) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
        <Header />
        <NotConfiguredView />
      </SafeAreaView>
    );
  }

  if (!authReady) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
        <Header />
        <CenteredMessage text="세션 확인 중…" />
      </SafeAreaView>
    );
  }

  if (!session) {
    return (
      <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
        <Header />
        <LoggedOutView onLogin={() => router.push("/auth/sign-in")} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "left", "right"]}>
      <Header />
      {isLoading && !couple ? (
        <CenteredMessage text="커플 정보 불러오는 중…" />
      ) : couple && couple.user_b ? (
        <ConnectedView
          coupleId={couple.id}
          meId={user?.id ?? null}
          userA={couple.user_a}
          userB={couple.user_b}
          anniversary={couple.anniversary}
          connectedAt={couple.connected_at}
        />
      ) : couple && !couple.user_b ? (
        <WaitingForPartnerView inviteCode={couple.invite_code} busy={busy} />
      ) : (
        <UnconnectedView busy={busy} />
      )}
    </SafeAreaView>
  );
}

function Header() {
  return (
    <View className="px-5 pt-4 pb-2">
      <Text className="text-2xl font-bold text-gold">
        💑 {STRINGS.tabs.couple}
      </Text>
    </View>
  );
}

function CenteredMessage({ text }: { text: string }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-text-muted">{text}</Text>
    </View>
  );
}

function NotConfiguredView() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="cloud-offline" size={40} color={COLORS.textMuted} />
      <Text className="mt-4 text-center text-base text-text">
        Supabase가 설정되지 않았습니다
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-text-muted">
        {"커플 공유 기능을 쓰려면 .env에\nEXPO_PUBLIC_SUPABASE_URL과\nEXPO_PUBLIC_SUPABASE_ANON_KEY를\n설정하세요."}
      </Text>
    </View>
  );
}

function LoggedOutView({ onLogin }: { onLogin: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="heart-outline" size={48} color={COLORS.textMuted} />
      <Text className="mt-4 text-center text-base text-text">
        로그인하면 연인과 사진·일정을 공유할 수 있어요.
      </Text>
      <Text className="mt-2 text-center text-xs text-text-muted">
        기존 로컬 데이터(레벨·퀘스트·스탯)는 로그인과 무관하게 유지됩니다.
      </Text>
      <View className="mt-6 w-full">
        <PrimaryButton label="로그인 / 회원가입" onPress={onLogin} />
      </View>
    </View>
  );
}

function UnconnectedView({ busy }: { busy: boolean }) {
  const createInvite = useCoupleStore((s) => s.createInvite);
  const redeem = useCoupleStore((s) => s.redeem);

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCreate = async () => {
    setErrorMessage(null);
    const result = await createInvite();
    if (!result.ok) setErrorMessage(result.errorMessage);
  };

  const handleRedeem = async () => {
    if (code.trim().length < 6) {
      setErrorMessage("6자리 코드를 입력해주세요.");
      return;
    }
    setErrorMessage(null);
    const result = await redeem(code);
    if (!result.ok) setErrorMessage(result.errorMessage);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-6 items-center">
          <Ionicons name="heart" size={48} color={COLORS.gold} />
          <Text className="mt-3 text-lg font-semibold text-text">
            커플 연결
          </Text>
          <Text className="mt-1 text-center text-sm text-text-muted">
            한 명이 코드를 만들고, 다른 한 명이 그 코드를 입력하세요.
          </Text>
        </View>

        <Section title="1. 내가 먼저 시작하는 경우">
          <Text className="text-sm text-text-muted">
            6자리 초대 코드를 만들어 연인에게 전달하세요.
          </Text>
          <View className="mt-3">
            <PrimaryButton
              label="초대 코드 생성"
              onPress={handleCreate}
              disabled={busy}
            />
          </View>
        </Section>

        <View className="my-4 flex-row items-center">
          <View className="h-px flex-1 bg-bg-softer" />
          <Text className="mx-3 text-xs text-text-muted">또는</Text>
          <View className="h-px flex-1 bg-bg-softer" />
        </View>

        <Section title="2. 상대 코드를 받은 경우">
          <Text className="text-sm text-text-muted">
            연인이 보내준 6자리 코드를 입력하세요.
          </Text>
          <TextInput
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            placeholder="예: ABC23F"
            placeholderTextColor={COLORS.textMuted}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={10}
            className="mt-3 rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-center text-lg font-bold text-text"
            style={{ letterSpacing: 4 }}
          />
          <View className="mt-3">
            <PrimaryButton
              label="연결"
              onPress={handleRedeem}
              disabled={busy || code.trim().length < 6}
            />
          </View>
        </Section>

        {errorMessage ? (
          <View
            className="mt-4 rounded-2xl border p-3"
            style={{
              borderColor: `${COLORS.danger}66`,
              backgroundColor: `${COLORS.danger}22`,
            }}
          >
            <Text className="text-sm" style={{ color: COLORS.danger }}>
              {errorMessage}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function WaitingForPartnerView({
  inviteCode,
  busy,
}: {
  inviteCode: string | null;
  busy: boolean;
}) {
  const cancelInvite = useCoupleStore((s) => s.cancelInvite);

  const handleCopy = async () => {
    if (!inviteCode) return;
    try {
      await Clipboard.setStringAsync(inviteCode);
      Alert.alert("복사됨", "초대 코드를 클립보드에 복사했습니다.");
    } catch {
      // 무시
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "초대 취소",
      "생성한 초대 코드를 무효화합니다. 다시 생성할 수 있습니다.",
      [
        { text: STRINGS.common.cancel, style: "cancel" },
        {
          text: "취소하기",
          style: "destructive",
          onPress: async () => {
            await cancelInvite();
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <View className="mb-6 items-center">
        <Ionicons name="mail-open" size={48} color={COLORS.gold} />
        <Text className="mt-3 text-lg font-semibold text-text">
          상대의 연결을 기다리는 중
        </Text>
        <Text className="mt-1 text-center text-sm text-text-muted">
          아래 코드를 연인에게 전달해주세요. 연인이 "우리" 탭에서 코드를 입력하면 연결됩니다.
        </Text>
      </View>

      <View className="mb-4 rounded-2xl border border-bg-softer bg-bg-soft p-6">
        <Text className="mb-2 text-center text-xs text-text-muted">
          초대 코드
        </Text>
        <Text
          className="text-center text-4xl font-bold text-gold"
          style={{ letterSpacing: 6 }}
        >
          {inviteCode ?? "——————"}
        </Text>
      </View>

      <View className="flex-row">
        <View className="mr-2 flex-1">
          <PrimaryButton
            label="코드 복사"
            variant="secondary"
            onPress={handleCopy}
            disabled={!inviteCode}
          />
        </View>
        <View className="flex-1">
          <PrimaryButton
            label="초대 취소"
            variant="secondary"
            onPress={handleCancel}
            disabled={busy}
          />
        </View>
      </View>

      <Text className="mt-6 text-center text-xs text-text-muted">
        연인이 연결하면 이 화면이 자동으로 바뀝니다. 탭을 한 번 다시 열어보세요.
      </Text>
    </ScrollView>
  );
}

function ConnectedView({
  coupleId,
  meId,
  userA,
  userB,
  anniversary,
  connectedAt,
}: {
  coupleId: string;
  meId: string | null;
  userA: string;
  userB: string;
  anniversary: string | null;
  connectedAt: string | null;
}) {
  const router = useRouter();
  const dPlus = useMemo(() => daysSince(anniversary), [anniversary]);
  const partnerId = meId === userA ? userB : userA;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <View className="mb-4 rounded-3xl border border-bg-softer bg-bg-soft p-5">
        <View className="flex-row items-center">
          <View
            className="mr-3 h-12 w-12 items-center justify-center rounded-2xl"
            style={{ backgroundColor: `${COLORS.gold}33` }}
          >
            <Ionicons name="heart" size={24} color={COLORS.gold} />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-text">
              우리
            </Text>
            {dPlus !== null ? (
              <Text className="mt-0.5 text-sm text-gold">D+{dPlus}일</Text>
            ) : connectedAt ? (
              <Text className="mt-0.5 text-xs text-text-muted">
                {connectedAt.slice(0, 10)}부터 연결됨
              </Text>
            ) : null}
          </View>
        </View>

        <View className="mt-4 rounded-xl bg-bg p-3">
          <InfoRow label="내 ID" value={meId ? short(meId) : "-"} />
          <InfoRow label="상대 ID" value={short(partnerId)} />
          <InfoRow label="커플 ID" value={short(coupleId)} />
        </View>
      </View>

      <Section title="기능">
        <FeatureRow
          icon="camera"
          title="사진 라이브러리"
          subtitle="날짜별로 모아 보기 + 업로드"
          onPress={() => router.push("/photos")}
        />
        <DisabledFeatureRow
          icon="calendar"
          title="일정 공유"
          subtitle="Phase 11.5에서 구현"
        />
      </Section>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold text-text-muted">
        {title}
      </Text>
      <View className="rounded-2xl border border-bg-softer bg-bg-soft p-4">
        {children}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-center justify-between py-1">
      <Text className="text-[11px] text-text-muted">{label}</Text>
      <Text className="text-[11px] text-text">{value}</Text>
    </View>
  );
}

function DisabledFeatureRow({
  icon,
  title,
  subtitle,
}: {
  icon: "camera" | "calendar";
  title: string;
  subtitle: string;
}) {
  return (
    <View className="mb-1 flex-row items-center py-1 opacity-60 last:mb-0">
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: COLORS.bg }}
      >
        <Ionicons name={icon} size={18} color={COLORS.textMuted} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-text">{title}</Text>
        <Text className="text-[11px] text-text-muted">{subtitle}</Text>
      </View>
    </View>
  );
}

function FeatureRow({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: "camera" | "calendar";
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="mb-1 flex-row items-center py-1 active:opacity-70 last:mb-0"
    >
      <View
        className="mr-3 h-9 w-9 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${COLORS.gold}33` }}
      >
        <Ionicons name={icon} size={18} color={COLORS.gold} />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-text">{title}</Text>
        <Text className="text-[11px] text-text-muted">{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
    </Pressable>
  );
}

function short(id: string | null): string {
  if (!id) return "-";
  return id.length > 10 ? `${id.slice(0, 8)}…` : id;
}
