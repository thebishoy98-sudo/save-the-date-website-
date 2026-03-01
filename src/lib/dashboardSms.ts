import type { SMSInviteRecord } from "@/types/rsvp";

export const normalizePhoneByLanguage = (phone: string, language: "en" | "es"): string => {
  const trimmed = phone.trim();
  if (!trimmed) return trimmed;
  if (trimmed.startsWith("+")) return trimmed;

  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;

  if (language === "es") return digits.startsWith("52") ? `+${digits}` : `+52${digits}`;
  return digits.startsWith("1") ? `+${digits}` : `+1${digits}`;
};

export const buildSmsText = (invite: SMSInviteRecord) => {
  const language = invite.invite_language ?? "en";
  const seats = invite.reserved_seats ?? 1;
  if (language === "es") {
    const seatsText = seats === 1 ? "1 lugar reservado para ti." : `${seats} lugares reservados para ti y tus invitados.`;
    return `Hola ${invite.guest_name} \u{1F90D}

Estamos contando los dias para nuestra boda y nos encantaria que fueras parte de este momento tan especial.

Tenemos ${seatsText}

Todos los detalles estan disponibles aqui:
${invite.invite_url}

Por favor haznos saber si planeas asistir antes del 15/03/2026.

Más adelamte, cerca de la fecha de la fecha, te contactaremos para re-confirmar.`;
  }
  return `Hello ${invite.guest_name} \u{1F90D}

We are counting down the days to our wedding and would love for you to be part of this special moment.

We have reserved ${seats} seat(s) for you.

All the details are available here:
${invite.invite_url}

Please let us know if you are planning to attend by 3/15/2026.

We will follow up later for a final confirmation closer to the wedding date.`;
};

export const parseCsvLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
};
