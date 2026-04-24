-- ============================================================================
-- LifeQuest Phase 11 — Couple sharing schema (photos + events)
-- ============================================================================
-- Run once in Supabase SQL Editor after creating the project.
-- Idempotent: uses IF NOT EXISTS / OR REPLACE where possible.
--
-- What this sets up:
--   1. couples              — two users paired by invite code
--   2. couple_photos        — shared photo library (metadata only; blobs in Storage)
--   3. couple_events        — shared calendar entries
--   4. my_couple_id()       — helper that RLS policies use
--   5. Row-Level Security   — every user only sees their own couple's rows
--   6. Storage policies     — 'couple-photos' bucket, folder per couple_id
--
-- ============================================================================

-- ---------- Tables ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS couples (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_b       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_code  TEXT UNIQUE,
  anniversary  DATE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  connected_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS couple_photos (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id    UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  uploaded_by  UUID NOT NULL REFERENCES auth.users(id),
  storage_path TEXT NOT NULL,
  taken_at     DATE NOT NULL,
  caption      TEXT,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_photos_couple_date
  ON couple_photos(couple_id, taken_at DESC);

CREATE TABLE IF NOT EXISTS couple_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id    UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  created_by   UUID NOT NULL REFERENCES auth.users(id),
  event_date   DATE NOT NULL,
  title        TEXT NOT NULL,
  memo         TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_couple_date
  ON couple_events(couple_id, event_date);

-- ---------- Helper function -------------------------------------------------
-- Returns the couple id the current user belongs to, or NULL if none.
-- Runs with invoker rights so it respects RLS on couples itself.

CREATE OR REPLACE FUNCTION my_couple_id() RETURNS UUID
LANGUAGE SQL STABLE
AS $$
  SELECT id FROM couples
   WHERE user_a = auth.uid() OR user_b = auth.uid()
   LIMIT 1
$$;

-- ---------- RLS -------------------------------------------------------------

ALTER TABLE couples       ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE couple_events ENABLE ROW LEVEL SECURITY;

-- couples: you can see / update rows you are a member of; you can create rows
-- where you are user_a. Joining by invite code happens via a later function
-- (Phase 11.3) — this policy set already permits it since user_b becomes a
-- member once they claim the row.

DROP POLICY IF EXISTS couples_select ON couples;
CREATE POLICY couples_select ON couples
  FOR SELECT
  USING (user_a = auth.uid() OR user_b = auth.uid());

DROP POLICY IF EXISTS couples_insert ON couples;
CREATE POLICY couples_insert ON couples
  FOR INSERT
  WITH CHECK (user_a = auth.uid());

DROP POLICY IF EXISTS couples_update ON couples;
CREATE POLICY couples_update ON couples
  FOR UPDATE
  USING (user_a = auth.uid() OR user_b = auth.uid())
  WITH CHECK (user_a = auth.uid() OR user_b = auth.uid());

-- couple_photos: scoped to the viewer's couple.

DROP POLICY IF EXISTS couple_photos_all ON couple_photos;
CREATE POLICY couple_photos_all ON couple_photos
  FOR ALL
  USING (couple_id = my_couple_id())
  WITH CHECK (couple_id = my_couple_id() AND uploaded_by = auth.uid());

-- couple_events: same scoping.

DROP POLICY IF EXISTS couple_events_all ON couple_events;
CREATE POLICY couple_events_all ON couple_events
  FOR ALL
  USING (couple_id = my_couple_id())
  WITH CHECK (couple_id = my_couple_id() AND created_by = auth.uid());

-- ---------- Storage policies ------------------------------------------------
-- Bucket 'couple-photos' must be created manually (private) in the Storage UI.
-- Object keys follow the pattern: {couple_id}/{photo_id}.jpg
--
-- storage.foldername(name) returns the path split by "/".
-- We compare the first segment to the current user's couple_id.

DROP POLICY IF EXISTS couple_photos_storage_select ON storage.objects;
CREATE POLICY couple_photos_storage_select ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'couple-photos'
    AND (storage.foldername(name))[1] = my_couple_id()::text
  );

DROP POLICY IF EXISTS couple_photos_storage_insert ON storage.objects;
CREATE POLICY couple_photos_storage_insert ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'couple-photos'
    AND (storage.foldername(name))[1] = my_couple_id()::text
  );

DROP POLICY IF EXISTS couple_photos_storage_delete ON storage.objects;
CREATE POLICY couple_photos_storage_delete ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'couple-photos'
    AND (storage.foldername(name))[1] = my_couple_id()::text
  );

-- ============================================================================
-- Done. Next: create the 'couple-photos' bucket (private) in Storage UI.
-- ============================================================================
