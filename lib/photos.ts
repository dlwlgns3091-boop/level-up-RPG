import { decode as decodeBase64 } from "base64-arraybuffer";
// expo-file-system v19: classic API(readAsStringAsync, EncodingType)는 /legacy에 있음.
// 새 클래스 기반 API로 옮기려면 File(uri).base64() 한 번 호출로 끝나지만
// 우선 legacy로 두고 SDK55에서 재평가.
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";
import { normalizeErrorMessage } from "./errors";
import { requireSupabase } from "./supabase";

const BUCKET = "couple-photos";
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.7;
const SIGNED_URL_TTL_SEC = 60 * 60; // 1시간

export type CouplePhoto = {
  id: string;
  couple_id: string;
  uploaded_by: string;
  storage_path: string;
  taken_at: string;
  caption: string | null;
  uploaded_at: string;
  event_id: string | null;
};

export type PickedPhotoMeta = {
  uri: string;
  exif?: Record<string, unknown> | null;
};

export type UploadInput = {
  coupleId: string;
  uploadedBy: string;
  localUri: string;
  takenAt: string; // YYYY-MM-DD
  caption: string | null;
  /** Phase 11.5: 이벤트에 묶어 업로드할 때 해당 id. 없으면 라이브러리 전용. */
  eventId?: string | null;
};

/**
 * expo-image-picker가 돌려준 EXIF에서 촬영 일자(YYYY-MM-DD)를 뽑는다.
 * 없거나 파싱 실패 시 오늘 날짜(KST).
 */
export function extractTakenAt(exif: Record<string, unknown> | null | undefined): string {
  if (exif) {
    const candidateKeys = [
      "DateTimeOriginal",
      "DateTimeDigitized",
      "DateTime",
    ] as const;
    for (const k of candidateKeys) {
      const raw = exif[k];
      if (typeof raw !== "string") continue;
      // EXIF 표준: "YYYY:MM:DD HH:MM:SS"
      const match = raw.match(/^(\d{4}):(\d{2}):(\d{2})/);
      if (match) {
        const y = match[1];
        const mm = match[2];
        const dd = match[3];
        if (y && mm && dd) {
          return `${y}-${mm}-${dd}`;
        }
      }
    }
  }
  return todayKst();
}

function todayKst(): string {
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const kstNow = new Date(Date.now() + kstOffsetMs);
  const y = kstNow.getUTCFullYear().toString().padStart(4, "0");
  const m = (kstNow.getUTCMonth() + 1).toString().padStart(2, "0");
  const d = kstNow.getUTCDate().toString().padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export async function listPhotos(coupleId: string): Promise<CouplePhoto[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couple_photos")
    .select("*")
    .eq("couple_id", coupleId)
    .order("taken_at", { ascending: false })
    .order("uploaded_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as CouplePhoto[];
}

export async function listPhotosByEvent(
  eventId: string,
): Promise<CouplePhoto[]> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couple_photos")
    .select("*")
    .eq("event_id", eventId)
    .order("uploaded_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CouplePhoto[];
}

export async function attachPhotosToEvent(
  eventId: string,
  photoIds: readonly string[],
): Promise<void> {
  if (photoIds.length === 0) return;
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("couple_photos")
    .update({ event_id: eventId })
    .in("id", [...photoIds]);
  if (error) throw error;
}

export async function detachPhotoFromEvent(photoId: string): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase
    .from("couple_photos")
    .update({ event_id: null })
    .eq("id", photoId);
  if (error) throw error;
}

/**
 * 여러 storage_path에 대해 한 번에 signed URL을 얻는다. 만료 시간은 1시간.
 * 잘못된 path는 null로 들어갈 수 있으니 호출부에서 undefined 체크.
 */
export async function signUrls(
  paths: readonly string[],
): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls([...paths], SIGNED_URL_TTL_SEC);
  if (error) throw error;
  const out: Record<string, string> = {};
  for (const entry of data ?? []) {
    if (entry.path && entry.signedUrl) {
      out[entry.path] = entry.signedUrl;
    }
  }
  return out;
}

export async function signSingleUrl(path: string): Promise<string> {
  const supabase = requireSupabase();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SEC);
  if (error) throw error;
  if (!data?.signedUrl) throw new Error("no_signed_url");
  return data.signedUrl;
}

async function compressToJpeg(localUri: string): Promise<string> {
  const manipulated = await ImageManipulator.manipulateAsync(
    localUri,
    [{ resize: { width: MAX_DIMENSION } }],
    {
      compress: JPEG_QUALITY,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );
  return manipulated.uri;
}

async function readAsArrayBuffer(uri: string): Promise<ArrayBuffer> {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return decodeBase64(base64);
}

function newId(): string {
  // crypto.randomUUID는 RN에서 보장 안 되므로 간단한 ID 생성
  const rand = () =>
    Math.floor(Math.random() * 0xffffffff).toString(16).padStart(8, "0");
  return `${Date.now().toString(16)}-${rand()}-${rand()}`;
}

export async function uploadPhoto(input: UploadInput): Promise<CouplePhoto> {
  const supabase = requireSupabase();

  const compressedUri = await compressToJpeg(input.localUri);
  const bytes = await readAsArrayBuffer(compressedUri);

  const fileId = newId();
  const storagePath = `${input.coupleId}/${fileId}.jpg`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, bytes, {
      contentType: "image/jpeg",
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const { data: row, error: insertError } = await supabase
    .from("couple_photos")
    .insert({
      couple_id: input.coupleId,
      uploaded_by: input.uploadedBy,
      storage_path: storagePath,
      taken_at: input.takenAt,
      caption: input.caption,
      event_id: input.eventId ?? null,
    })
    .select()
    .single<CouplePhoto>();

  if (insertError || !row) {
    // DB insert 실패 시 Storage 파일도 정리
    await supabase.storage
      .from(BUCKET)
      .remove([storagePath])
      .catch(() => undefined);
    throw insertError ?? new Error("insert_failed");
  }

  return row;
}

export async function deletePhoto(photo: CouplePhoto): Promise<void> {
  const supabase = requireSupabase();
  // DB 먼저 — RLS가 통과하면 스토리지 파일도 삭제
  const { error: dbError } = await supabase
    .from("couple_photos")
    .delete()
    .eq("id", photo.id);
  if (dbError) throw dbError;
  await supabase.storage
    .from(BUCKET)
    .remove([photo.storage_path])
    .catch(() => undefined);
}

export async function updateCaption(
  photoId: string,
  caption: string | null,
): Promise<CouplePhoto> {
  const supabase = requireSupabase();
  const { data, error } = await supabase
    .from("couple_photos")
    .update({ caption })
    .eq("id", photoId)
    .select()
    .single<CouplePhoto>();
  if (error || !data) throw error ?? new Error("update_failed");
  return data;
}

export function translatePhotoError(input: unknown): string {
  const raw = normalizeErrorMessage(input);
  const lower = raw.toLowerCase();
  if (lower.includes("permission")) return "사진 권한이 필요합니다.";
  if (lower.includes("network") || lower.includes("fetch")) {
    return "네트워크 오류입니다. 연결을 확인해주세요.";
  }
  if (lower.includes("payload too large") || lower.includes("size"))
    return "사진 파일이 너무 큽니다.";
  if (lower.includes("row-level security") || lower.includes("rls")) {
    return "접근 권한이 없습니다. 커플 연결 상태를 확인해주세요.";
  }
  return raw;
}
