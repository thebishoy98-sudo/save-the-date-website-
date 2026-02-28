export interface RSVPRecord {
  id: string;
  created_at: string;
  name: string;
  email: string | null;
  language: "en" | "es";
  attending: boolean;
  guest_count: number;
  phone: string | null;
  arrival_airport: string | null;
  hotel: string | null;
  allergies_notes: string | null;
  transport_needed: boolean | null;
  kids_food_required: boolean | null;
  bringing_children: boolean | null;
  children_count: number | null;
}
