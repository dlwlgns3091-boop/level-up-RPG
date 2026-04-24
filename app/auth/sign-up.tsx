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
import { COLORS } from "@/constants/theme";
import { SUPABASE_CONFIGURED } from "@/lib/supabase";
import { useAuthStore } from "@/store/useAuthStore";

export default function SignUp() {
  const router = useRouter();
  const signUp = useAuthStore((s) => s.signUp);
  const busy = useAuthStore((s) => s.busy);
  const session = useAuthStore((s) => s.session);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const trimmedEmail = email.trim();
  const passwordsMatch = password === passwordConfirm;
  const isValid =
    trimmedEmail.length > 0 &&
    password.length >= 6 &&
    passwordConfirm.length > 0 &&
    passwordsMatch;

  const handleSubmit = async () => {
    if (!isValid || busy) return;
    setErrorMessage(null);
    setSuccessMessage(null);
    const result = await signUp(trimmedEmail, password);
    if (!result.ok) {
      setErrorMessage(result.errorMessage);
      return;
    }
    // 이메일 확인이 켜져 있으면 즉시 세션이 안 생긴다.
    if (useAuthStore.getState().session) {
      if (router.canGoBack()) router.back();
      else router.replace("/(tabs)/home");
    } else {
      setSuccessMessage(
        "가입 요청이 전송되었습니다. 이메일 확인이 필요할 수 있으니 받은 편지함을 확인해주세요.",
      );
    }
  };

  if (!SUPABASE_CONFIGURED) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <UnavailableView onBack={() => router.back()} />
      </SafeAreaView>
    );
  }

  // 이미 로그인된 상태면 돌려보냄
  if (session) {
    return (
      <SafeAreaView className="flex-1 bg-bg">
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-base text-text">이미 로그인된 상태입니다.</Text>
          <View className="w-full">
            <PrimaryButton
              label="돌아가기"
              onPress={() => {
                if (router.canGoBack()) router.back();
                else router.replace("/(tabs)/home");
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <Header title="회원가입" onBack={() => router.back()} />

        <ScrollView
          className="flex-1 px-6"
          contentContainerStyle={{ paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="mb-6 text-sm text-text-muted">
            이메일로 계정을 만들면 연인과 사진·일정을 공유할 수 있습니다.
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
              textContentType="newPassword"
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
          </Field>

          <Field label="비밀번호 확인">
            <TextInput
              value={passwordConfirm}
              onChangeText={setPasswordConfirm}
              placeholder="비밀번호를 다시 입력"
              placeholderTextColor={COLORS.textMuted}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="newPassword"
              onSubmitEditing={handleSubmit}
              className="rounded-2xl border border-bg-softer bg-bg-soft px-4 py-3 text-base text-text"
            />
            {passwordConfirm.length > 0 && !passwordsMatch ? (
              <Text
                className="mt-1 text-xs"
                style={{ color: COLORS.danger }}
              >
                비밀번호가 일치하지 않습니다.
              </Text>
            ) : null}
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

          {successMessage ? (
            <View
              className="mb-4 rounded-2xl border p-3"
              style={{
                borderColor: `${COLORS.gold}66`,
                backgroundColor: `${COLORS.gold}22`,
              }}
            >
              <Text className="text-sm" style={{ color: COLORS.gold }}>
                {successMessage}
              </Text>
            </View>
          ) : null}

          <PrimaryButton
            label="계정 만들기"
            disabled={!isValid || busy}
            onPress={handleSubmit}
          />

          <View className="mt-6 flex-row items-center justify-center">
            <Text className="text-sm text-text-muted">이미 계정이 있나요? </Text>
            <Link href="/auth/sign-in" asChild>
              <Pressable>
                <Text className="text-sm font-semibold text-gold">로그인</Text>
              </Pressable>
            </Link>
          </View>
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
