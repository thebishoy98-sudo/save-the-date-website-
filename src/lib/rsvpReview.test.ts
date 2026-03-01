import { describe, expect, it } from "vitest";
import { isReviewPending, REVIEW_PENDING_STATUSES, sortResponsesForReview } from "@/lib/rsvpReview";
import type { RSVPRecord } from "@/types/rsvp";

const makeRow = (id: string, status: RSVPRecord["review_status"]): RSVPRecord => ({
  id,
  created_at: "2026-03-01T00:00:00.000Z",
  name: `Guest ${id}`,
  email: null,
  language: "en",
  attending: true,
  guest_count: 1,
  plus_one_name: null,
  phone: null,
  arrival_airport: null,
  hotel: null,
  allergies_notes: null,
  transport_needed: null,
  kids_food_required: null,
  bringing_children: null,
  children_count: null,
  invite_token: null,
  duplicate_flag: status !== "approved",
  duplicate_reason: status !== "approved" ? "Possible duplicate" : null,
  review_status: status,
});

describe("review helpers", () => {
  it("defines pending statuses", () => {
    expect(REVIEW_PENDING_STATUSES).toEqual(["pending_review", "needs_edit"]);
  });

  it("flags pending states only", () => {
    expect(isReviewPending("pending_review")).toBe(true);
    expect(isReviewPending("needs_edit")).toBe(true);
    expect(isReviewPending("approved")).toBe(false);
  });

  it("sorts pending rows to the top while keeping all rows", () => {
    const rows = [makeRow("1", "approved"), makeRow("2", "pending_review"), makeRow("3", "needs_edit")];
    const sorted = sortResponsesForReview(rows);
    expect(sorted.map((r) => r.id)).toEqual(["2", "3", "1"]);
    expect(sorted).toHaveLength(rows.length);
  });

  it("does not mutate input array", () => {
    const rows = [makeRow("1", "approved"), makeRow("2", "pending_review")];
    const original = rows.map((r) => r.id);
    void sortResponsesForReview(rows);
    expect(rows.map((r) => r.id)).toEqual(original);
  });
});
