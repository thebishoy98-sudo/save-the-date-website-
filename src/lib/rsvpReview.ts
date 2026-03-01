import type { RSVPRecord } from "@/types/rsvp";

export const REVIEW_PENDING_STATUSES: RSVPRecord["review_status"][] = ["pending_review", "needs_edit"];

export const isReviewPending = (status: RSVPRecord["review_status"]) => REVIEW_PENDING_STATUSES.includes(status);

export const sortResponsesForReview = (rows: RSVPRecord[]) =>
  [...rows].sort((a, b) => Number(isReviewPending(b.review_status)) - Number(isReviewPending(a.review_status)));
