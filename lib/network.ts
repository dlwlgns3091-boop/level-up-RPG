import NetInfo, { type NetInfoState } from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

/**
 * 네트워크 연결 상태. Supabase 호출 가능 여부를 거칠게 판단할 때 사용.
 *
 * isInternetReachable이 null인 케이스: 측정 중 / 일부 플랫폼에서 미보고.
 * UX 보수적으로 "온라인일 가능성"으로 간주(true).
 *
 * 실제 호출이 실패하면 store들이 catch에서 한국어 메시지로 fallback하므로
 * 이 훅은 가시적 안내(배너)와 버튼 비활성화 용도.
 */
export function useOnlineStatus(): {
  isOnline: boolean;
  isUnknown: boolean;
} {
  const [state, setState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    let mounted = true;
    NetInfo.fetch()
      .then((s) => {
        if (mounted) setState(s);
      })
      .catch(() => undefined);
    const unsubscribe = NetInfo.addEventListener((s) => {
      setState(s);
    });
    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  if (!state) return { isOnline: true, isUnknown: true };

  const reachable =
    state.isInternetReachable === null ? null : state.isInternetReachable;
  const isOnline = state.isConnected === true && reachable !== false;
  return { isOnline, isUnknown: state.isConnected === null };
}
