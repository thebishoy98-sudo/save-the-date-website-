import { describe, expect, it } from "vitest";
import { buildSmsText, normalizePhoneByLanguage, parseCsvLine } from "@/lib/dashboardSms";
import type { SMSInviteRecord } from "@/types/rsvp";

const baseInvite: SMSInviteRecord = {
  id: "id-1",
  created_at: "2026-03-01T00:00:00.000Z",
  guest_name: "Alex",
  phone: "+15551234567",
  invite_language: "en",
  reserved_seats: 2,
  invite_token: "token-1",
  invite_url: "https://example.com/?invite=token-1",
  status: "draft",
  sent_at: null,
  opened_at: null,
  started_at: null,
  responded_at: null,
  notes: null,
};

describe("normalizePhoneByLanguage", () => {
  it("returns empty trimmed input", () => {
    expect(normalizePhoneByLanguage("   ", "en")).toBe("");
  });

  it("keeps already normalized + number as-is", () => {
    expect(normalizePhoneByLanguage("+19735550102", "en")).toBe("+19735550102");
  });

  it("returns original trimmed value when there are no digits", () => {
    expect(normalizePhoneByLanguage("abc", "en")).toBe("abc");
  });

  it("adds +1 prefix for english if missing", () => {
    expect(normalizePhoneByLanguage("9735550102", "en")).toBe("+19735550102");
  });

  it("does not duplicate 1 for english numbers that start with 1", () => {
    expect(normalizePhoneByLanguage("19735550102", "en")).toBe("+19735550102");
  });

  it("adds +52 prefix for spanish if missing", () => {
    expect(normalizePhoneByLanguage("5541234567", "es")).toBe("+525541234567");
  });

  it("does not duplicate 52 for spanish numbers that start with 52", () => {
    expect(normalizePhoneByLanguage("525541234567", "es")).toBe("+525541234567");
  });

  it("strips formatting characters and still normalizes", () => {
    expect(normalizePhoneByLanguage("(973) 555-0102", "en")).toBe("+19735550102");
    expect(normalizePhoneByLanguage("55 41 23 45 67", "es")).toBe("+525541234567");
  });
});

describe("buildSmsText", () => {
  it("builds english message with seats", () => {
    const text = buildSmsText(baseInvite);
    expect(text).toContain("Hello Alex");
    expect(text).toContain("We have reserved 2 seat(s) for you.");
    expect(text).toContain(baseInvite.invite_url);
    expect(text).toContain("Please RSVP before 3/15/2026");
  });

  it("defaults to english when language is null", () => {
    const text = buildSmsText({ ...baseInvite, invite_language: null });
    expect(text).toContain("Hello Alex");
    expect(text).toContain("seat(s) for you.");
  });

  it("builds spanish message with singular seat text", () => {
    const text = buildSmsText({ ...baseInvite, invite_language: "es", reserved_seats: 1 });
    expect(text).toContain("Hola Alex");
    expect(text).toContain("1 lugar reservado para ti.");
    expect(text).toContain("Por favor confirma tu asistencia antes del 15/03/2026");
  });

  it("builds spanish message with plural seat text", () => {
    const text = buildSmsText({ ...baseInvite, invite_language: "es", reserved_seats: 4 });
    expect(text).toContain("4 lugares reservados para ti y tus invitados.");
  });

  it("defaults seats to 1 when reserved_seats is null", () => {
    const text = buildSmsText({ ...baseInvite, invite_language: "es", reserved_seats: null });
    expect(text).toContain("1 lugar reservado para ti.");
  });
});

describe("parseCsvLine", () => {
  it("parses simple comma-separated row", () => {
    expect(parseCsvLine("Name,Phone,Language,Seats")).toEqual(["Name", "Phone", "Language", "Seats"]);
  });

  it("handles quoted commas", () => {
    expect(parseCsvLine('"Lopez, Maria",5550102,es,2')).toEqual(["Lopez, Maria", "5550102", "es", "2"]);
  });

  it("handles escaped quotes in quoted text", () => {
    expect(parseCsvLine('"Ana ""Annie"" Lopez",5550102,en,1')).toEqual(["Ana \"Annie\" Lopez", "5550102", "en", "1"]);
  });

  it("trims whitespace around unquoted cells", () => {
    expect(parseCsvLine("  John  ,  9735550102  , en , 1 ")).toEqual(["John", "9735550102", "en", "1"]);
  });
});
