import { normalizeErrorMessage } from "./errors";
import {
  attachPhotosToEvent,
  type CouplePhoto,
  listPhotosByEvent,
  uploadPhoto,
  type UploadInput,
} from "./photos";
import { requireSupabase } from "./supabase";

export type CoupleEvent = {
  id: string;
  couple_id: string;
  created_by: string;
  event_date: string; // YYYY-MM-DD
  title: string;
  memo: string | null;
  created_at: string;
};

export type EventWithPhotos = CoupleEvent & {
  photos: CouplePhoto[];
};

export type NewEventInput = {
  coupleId: string;
  createdBy: string;
  eventDate: string; // YYYY-MM-DD
  title: string;
  memo: string | null;
  /** 새로 업로드할 로컬 사진들. */
  newPhotos?: readonly {
    localUri: string;
    takenAt?: string;
  }[];
  /** 이미 라이브러리에 있는 사진 중 이벤트에 연결할 id들. */
  existingPhotoIds?: readonly string[];
};

export type UpdateEventInput = {
  id: string;
  eventDate?: string;
  title?: string;
  memo?: string | null;
};

export async function listEvents(coupleId: string): Promise<CoupleEvent[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couple_events")
    .select("*")
    .eq("couple_id", coupleId)
    .order("event_date", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CoupleEvent[];
}

export async function listEventsBetween(
  coupleId: string,
  startDate: string,
  endDate: string,
): Promise<CoupleEvent[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couple_events")
    .select("*")
    .eq("couple_id", coupleId)
    .gte("event_date", startDate)
    .lte("event_date", endDate)
    .order("event_date", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CoupleEvent[];
}

export async function getEventWithPhotos(
  id: string,
): Promise<EventWithPhotos | null> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couple_events")
    .select("*")
    .eq("id", id)
    .maybeSingle<CoupleEvent>();
  if (error) throw error;
  if (!data) return null;
  const photos = await listPhotosByEvent(id);
  return { ...data, photos };
}

/**
 * 이벤트를 만들고 로컬 사진이 있으면 업로드해 event_id로 묶는다.
 * 이벤트 insert가 성공한 뒤 사진 업로드에서 실패하면, 이미 올라간 사진들은
 * 라이브러리에 남고(event_id만 설정되거나 null), 이벤트는 그대로 유지.
 */
export async function createEvent(
  input: NewEventInput,
): Promise<EventWithPhotos> {
  const supabase = requireSupabase();

  const { data: row, error: insertError } = await supabase
    .from("couple_events")
    .insert({
      couple_id: input.coupleId,
      created_by: input.createdBy,
      event_date: input.eventDate,
      title: input.title,
      memo: input.memo,
    })
    .select()
    .single<CoupleEvent>();
  if (insertError || !row) {
    throw insertError ?? new Error("event_insert_failed");
  }

  // 기존 라이브러리 사진 연결
  if (input.existingPhotoIds && input.existingPhotoIds.length > 0) {
    try {
      await attachPhotosToEvent(row.id, input.existingPhotoIds);
    } catch (e) {
      console.error("[events] attachPhotosToEvent failed:", e);
      // 계속 진행 — 이벤트는 만들어짐
    }
  }

  // 새 사진 업로드
  if (input.newPhotos && input.newPhotos.length > 0) {
    for (const p of input.newPhotos) {
      const uploadInput: UploadInput = {
        coupleId: input.coupleId,
        uploadedBy: input.createdBy,
        localUri: p.localUri,
        takenAt: p.takenAt ?? input.eventDate,
        caption: null,
        eventId: row.id,
      };
      try {
        await uploadPhoto(uploadInput);
      } catch (e) {
        console.error("[events] uploadPhoto failed:", e);
        // 다음 사진으로 계속
      }
    }
  }

  const photos = await listPhotosByEvent(row.id);
  return { ...row, photos };
}

export async function updateEvent(input: UpdateEventInput): Promise<CoupleEvent> {
  const supabase = requireSupabase();
  const patch: Record<string, string | null> = {};
  if (input.eventDate !== undefined) patch.event_date = input.eventDate;
  if (input.title !== undefined) patch.title = input.title;
  if (input.memo !== undefined) patch.memo = input.memo;

  const { data, error } = await supabase
    .from("couple_events")
    .update(patch)
    .eq("id", input.id)
    .select()
    .single<CoupleEvent>();
  if (error || !data) throw error ?? new Error("event_update_failed");
  return data;
}

export async function deleteEvent(id: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("couple_events").delete().eq("id", id);
  if (error) throw error;
  // 연결된 사진의 event_id는 ON DELETE SET NULL로 자동 해제됨.
}

export function translateEventError(input: unknown): string {
  const raw = normalizeErrorMessage(input);
  const lower = raw.toLowerCase();
  if (lower.includes("event_insert_failed")) return "기록 생성에 실패했습니다.";
  if (lower.includes("network") || lower.includes("fetch"))
    return "네트워크 오류입니다. 연결을 확인해주세요.";
  if (lower.includes("row-level security") || lower.includes("rls"))
    return "접근 권한이 없습니다. 커플 연결 상태를 확인해주세요.";
  return raw;
}
