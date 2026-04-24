import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
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
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignIn() {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);
  const busy = useAuthStore((s) => s.busy);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const isValid = trimmedEmail.length > 0 && password.length >= 6;

  const handleSubmit = async () => {
    if (!isValid || busy) return;
    setErrorMessage(null);
    const result = await signIn(trimmedEmail, password);
    if (result.ok) {
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)/home");
    } else {
      setErrorMessage(result.errorMessage);
    }
  };

  if (!SUPABASE_CONFIGURED) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <UnavailableView onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Header title="로그인" onBack={() => router.back()} />

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-6 text-sm text-text-muted">
            이메일과 비밀번호로 로그인하세요. 로그인은 커플 공유 기능("우리" 탭)에만 사용되며, 기존 로컬 기능은 계정 없이도 작동합니다.
          </Text>

          <Field label="이메일">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="emailAddress"
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
          </Field>

          <Field label="비밀번호">
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="6자 이상"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="password"
              onSubmitEditing={handleSubmit}
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
          </Field>

          {errorMessage ? (
            <View
              className="mb-4 rounded-2xl border p-3"
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

          <PrimaryButton
            label="로그인"
            disabled={!isValid || busy}
            onPress={handleSubmit}
          />

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-sm text-text-muted">계정이 없으신가요? </Text>
            <Link href="/auth/sign-up" asChild>
              <Pressable>
                <Text className="text-sm font-semibold text-gold">회원가입</Text>
              </Pressable>
            </Link>
          </View>

          {/* STRINGS는 향후 테마 교체 시 편의용, 현재 미참조 */}
          <Text className="mt-8 text-[10px] text-text-muted">
            {STRINGS.app.name} · {STRINGS.app.tagline}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Header({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <View className="flex-row items-center justify-between border-b border-bg-softer px-5 py-3">
      <Pressable onPress={onBack} className="p-1">
        <Ionicons name="chevron-back" size={24} color={COLORS.text} />
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
    <View className="mb-4">
      <Text className="mb-1.5 text-xs text-text-muted">{label}</Text>
      {children}
    </View>
  );
}

function UnavailableView({ onBack }: { onBack: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Ionicons name="cloud-offline" size={40} color={COLORS.textMuted} />
      <Text className="mt-4 text-center text-base text-text">
        Supabase가 설정되지 않았습니다
      </Text>
      <Text className="mt-2 text-center text-sm text-text-muted">
        {".env 파일에 EXPO_PUBLIC_SUPABASE_URL과\nEXPO_PUBLIC_SUPABASE_ANON_KEY를 설정하고\n개발 서버를 재시작하세요."}
      </Text>
      <View className="mt-8 w-full">
        <PrimaryButton label="뒤로" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}
