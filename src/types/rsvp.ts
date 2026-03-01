export interface RSVPRecord {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  language: "en" | "es";
  attending: boolean;
  guest_count: number;
  plus_one_name: string | null;
  phone: string | null;
  arrival_airport: string | null;
  hotel: string | null;
  allergies_notes: string | null;
  transport_needed: boolean | null;
  kids_food_required: boolean | null;
  bringing_children: boolean | null;
  children_count: number | null;
  invite_token: string | null;
}

export type SMSInviteStatus =
  | "draft"
  | "sent"
  | "opened"
  | "started"
  | "accepted"
  | "declined";

export interface SMSInviteRecord {
  id: string;
  created_at: string;
  guest_name: string;
  phone: string;
  invite_token: string;
  invite_url: string;
  status: SMSInviteStatus;
  sent_at: string | null;
  opened_at: string | null;
  started_at: string | null;
  responded_at: string | null;
  notes: string | null;
}

