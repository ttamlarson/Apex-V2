# OVERLOAD Platform Roadmap

**Product direction:** a complete performance platform spanning training, nutrition, recovery, AI coaching, analytics and secure cross-device sync.

## Product principles

- OVERLOAD is the product and user-facing brand. CORV remains the underlying legacy data/functionality foundation only.
- Preserve the existing local-storage key `apexProtocolData_v1`, current record shapes, routines and backups until a deliberate, tested migration exists.
- Keep the PWA usable offline. Cloud services must be additive, not a prerequisite for logging a workout.
- Never place AI provider secrets or privileged database credentials in browser code.
- Make AI recommendations explainable, grounded in logged data, and clearly distinguish suggestions from medical advice.
- Give users control over account creation, sync, export, restore and deletion.

## Delivery phases

### 1. Coaching foundation — started in 5.3.0

- Dedicated Coach workspace.
- Transparent readiness indicator from recent, complete recovery check-ins.
- Rolling seven-day workout-frequency comparison.
- Logged working sets and tonnage trend (load × reps), clearly labelled as volume rather than physiological fatigue.
- Daily calories and protein context.
- Isolated deterministic engine with automated tests.

**Remaining:** volume-load trends, exercise-specific progression recommendations, programme adherence, training calendar and user-adjustable coaching preferences.

### 2. Training intelligence

- Session volume by muscle group and exercise.
- Set-level progression, rep PRs and estimated strength trends.
- Deload and fatigue flags based on trends, not single measurements.
- Adaptive programme recommendations with user approval before changing a saved plan.
- Roster-aware calendar and shift-aware session scheduling as an optional setting.

### 3. Nutrition platform

- Meal plans and repeatable meal templates.
- Recipe and meal-prep builder with editable portions.
- Macro and micronutrient coverage where reliable source data exists.
- Shopping-list export and food-log shortcuts.
- Clear provenance for barcode/database nutrition values.

### 4. Recovery and wellbeing

- Recovery trends across sleep, energy, stress and soreness.
- Rest-day and lower-intensity suggestions.
- Optional wearable imports only after explicit connection and consent.
- No diagnosis or unsupported medical risk scores.

### 5. AI coaching service

- Provider-neutral coaching API behind a server-side service.
- Send only the minimum context needed for each request.
- Structured outputs for session suggestions, exercise substitutions, nutrition guidance and progress reviews.
- Ground responses in the user's recorded history; label uncertainty and missing data.
- User approval required before AI changes programmes, targets or records.
- Keep the deterministic engine available as an offline fallback.

### 6. Secure cloud sync

- Local-first operation remains the source of immediate writes.
- Account-based sync API with per-user authorization on every record.
- Conflict-aware record IDs, revisions and tombstones; never silently overwrite newer user data.
- Encrypted transport, server-side secrets, access controls, audit events and rate limits.
- Explicit export, account deletion and sync disable controls.
- Test restore and multi-device conflict cases before enabling general use.

### 7. Platform integrations

- Wearables and health platforms through permissioned integrations.
- Calendar and notification support.
- Optional coach chat and voice interface.
- Integration status and data-source provenance shown inside Settings.

## Proposed technical architecture

- **Client:** existing OVERLOAD PWA, offline-first, with a stable local data repository.
- **Domain modules:** training, nutrition, recovery, analytics and coaching, separated from UI rendering.
- **Sync boundary:** versioned API contract and a sync queue; no provider credentials in the PWA.
- **Backend:** deployable behind the existing web hosting setup. Cloudflare Workers plus a durable database are a candidate, subject to cost, privacy and operational validation.
- **AI boundary:** server-side provider adapter with strict input/output schemas, timeouts, quotas and a deterministic fallback.
- **Quality:** unit tests for domain logic, migration fixtures, API authorization tests, end-to-end PWA smoke tests and release checks.

## Release gates

A phase is not complete until:
1. Existing local records and backups still load.
2. Tests cover normal, missing, stale and malformed data.
3. Mobile Safari and desktop browser flows are checked.
4. Offline behaviour and service-worker upgrades are checked.
5. No credentials or private user data are exposed in the client bundle.
6. Release notes describe what is implemented versus planned.
