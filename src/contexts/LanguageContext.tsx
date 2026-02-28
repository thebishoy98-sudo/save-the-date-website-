import { createContext, useContext, useState, type ReactNode } from "react";

type Language = "es" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Hero
  "hero.subtitle": { es: "Nos casamos", en: "We're getting married" },
  "hero.location": { es: "TepoztlÃ¡n, Morelos", en: "TepoztlÃ¡n, Morelos" },

  // Countdown
  "countdown.days": { es: "DÃ­as", en: "Days" },
  "countdown.hours": { es: "Horas", en: "Hours" },
  "countdown.minutes": { es: "Min", en: "Min" },
  "countdown.seconds": { es: "Seg", en: "Sec" },

  // Envelope
  "envelope.label": { es: "InvitaciÃ³n", en: "Invitation" },
  "envelope.request": { es: "Solicitan el honor de su presencia", en: "Request the honor of your presence" },
  "envelope.ceremony": { es: "en su ceremonia de matrimonio", en: "at their wedding ceremony" },
  "envelope.tap": { es: "Toca para abrir", en: "Tap to open" },
  "envelope.blessing": { es: "Con la bendiciÃ³n de Dios y la alegrÃ­a de nuestras familias", en: "With God's blessing and the joy of our families" },
  "envelope.honor": { es: "les invitan a compartir la celebraciÃ³n de su matrimonio el dÃ­a", en: "invite you to share in the celebration of their marriage on" },
  "envelope.date": { es: "SÃ¡bado, 18 de Julio de 2026", en: "Saturday, July 18, 2026" },
  "envelope.place": { es: "TepoztlÃ¡n, Morelos, MÃ©xico", en: "TepoztlÃ¡n, Morelos, Mexico" },
  "envelope.details": { es: "Detalles a continuaciÃ³n", en: "Details below" },

  // Events
  "events.label": { es: "Detalles del Evento", en: "Event Details" },
  "events.title": { es: "Itinerario", en: "Itinerary" },
  "events.ceremony": { es: "Ceremonia Religiosa", en: "Religious Ceremony" },
  "events.ceremony.venue": { es: "Iglesia Copta Ortodoxa", en: "Coptic Orthodox Church" },
  "events.ceremony.address": { es: "DirecciÃ³n de la iglesia", en: "Church address" },
  "events.reception": { es: "RecepciÃ³n", en: "Reception" },
  "events.reception.venue": { es: "El Suspiro TepoztlÃ¡n", en: "El Suspiro TepoztlÃ¡n" },
  "events.reception.address": { es: "TepoztlÃ¡n, Morelos", en: "TepoztlÃ¡n, Morelos" },

  // Dress code
  "dress.label": { es: "CÃ³digo de Vestimenta", en: "Dress Code" },
  "dress.title": { es: "Etiqueta Formal", en: "Formal Attire" },
  "dress.men": { es: "Caballeros", en: "Gentlemen" },
  "dress.women": { es: "Damas", en: "Ladies" },
  "dress.men.desc": { es: "Traje con corbata opcional", en: "Suit Â· Tie optional" },

  // Our Story
  "story.label": { es: "Nuestra Historia", en: "Our Story" },
  "story.title": { es: "Cómo Todo Comenzó", en: "How It All Started" },
  "story.p1": { es: "Nos conocimos en la Ciudad de MÃ©xico, y desde ese dÃ­a, Bishoy encontrÃ³ de repente razones muy importantes para seguir regresando.", en: "We met in Mexico City, and from that day on, Bishoy suddenly had very important reasons to keep coming back." },
  "story.p2": { es: "Entre vuelos, videollamadas a distancia, tacos, shawarma y debates muy competitivos sobre si gana el picante mexicano o el sabor egipcio (spoiler: ganamos los dos), nuestro amor a distancia fue creciendo hasta convertirse en esta hermosa aventura.", en: "Between flights, long-distance video calls, tacos, shawarma, and highly competitive debates about whether Mexican spice or Egyptian flavor wins (spoiler: we both do), our long-distance love kept growing into this beautiful adventure." },
  "dress.women.desc": { es: "Vestido largo", en: "Floor-length gown" },
  "dress.note": { es: "El blanco y todas sus tonalidades quedan reservados exclusivamente para la novia.", en: "White and all its shades are reserved exclusively for the bride." },

  // Gifts
  "gifts.label": { es: "Mesa de Regalos", en: "Gift Registry" },
  "gifts.title": { es: "Regalos", en: "Gifts" },
  "gifts.message": { es: "Su presencia es nuestro mejor regalo. Si desean hacernos un obsequio, una aportaciÃ³n en efectivo serÃ¡ muy apreciada.", en: "Your presence is our greatest gift. If you wish to give us something, a cash contribution would be greatly appreciated." },
  "gifts.note": { es: "Sobre en la recepciÃ³n", en: "Envelope at the reception" },

  // RSVP
  "rsvp.label": { es: "Confirma tu Asistencia", en: "Confirm Your Attendance" },
  "rsvp.title": { es: "RSVP", en: "RSVP" },
  "rsvp.name": { es: "Nombre completo", en: "Full name" },
  "rsvp.name.placeholder": { es: "Tu nombre", en: "Your name" },
  "rsvp.confirm": { es: "ConfirmaciÃ³n", en: "Confirmation" },
  "rsvp.confirm.yes": { es: "SÃ­, asistirÃ©", en: "Yes, I'll attend" },
  "rsvp.confirm.no": { es: "No podrÃ© asistir", en: "I won't be able to attend" },
  "rsvp.guests": { es: "NÃºmero de invitados", en: "Number of guests" },
  "rsvp.phone": { es: "TelÃ©fono / WhatsApp", en: "Phone / WhatsApp" },
  "rsvp.allergies": { es: "Alergias / Notas", en: "Allergies / Notes" },
  "rsvp.allergies.placeholder": { es: "Alguna alergia o restricciÃ³n alimentaria...", en: "Any allergies or dietary restrictions..." },
  "rsvp.airport": { es: "Aeropuerto de llegada", en: "Arrival airport" },
  "rsvp.transport": { es: "Â¿Necesitas transporte?", en: "Do you need transportation?" },
  "rsvp.transport.yes": { es: "SÃ­", en: "Yes" },
  "rsvp.transport.no": { es: "No", en: "No" },
  "rsvp.kidsFood": { es: "¿Comida para niños?", en: "Kids food option?" },
  "rsvp.kidsFood.yes": { es: "Si, por favor", en: "Yes, please" },
  "rsvp.kidsFood.no": { es: "No necesario", en: "Not needed" },
  "rsvp.travel.note": { es: "âœˆ Favor de volar a Puebla (PBC) o Ciudad de MÃ©xico (MEX).\nCoordina tu transporte con Bishoy.", en: "âœˆ Please fly to Puebla (PBC) or Mexico City (MEX).\nCoordinate your transportation with Bishoy." },
  "rsvp.submit": { es: "Confirmar Asistencia", en: "Confirm Attendance" },
  "rsvp.thanks": { es: "Â¡Gracias!", en: "Thank you!" },
  "rsvp.thanks.message": { es: "Hemos recibido tu confirmaciÃ³n. Â¡Nos vemos pronto!", en: "We've received your confirmation. See you soon!" },
  "rsvp.hotel": { es: "Hotel de preferencia", en: "Preferred hotel" },
  "rsvp.hotel.placeholder": { es: "Selecciona un hotel...", en: "Select a hotel..." },
  "rsvp.hotel.other": { es: "Otro / No estoy seguro", en: "Other / Not sure yet" },

  // Hotels
  "hotels.label": { es: "Hospedaje", en: "Accommodation" },
  "hotels.title": { es: "Hoteles", en: "Hotels" },
  "hotels.click": { es: "Toca para ver detalles", en: "Tap to see details" },
  "hotels.posada.subtitle": { es: "Paquete Nupcias â€” 2 Noches", en: "Wedding Package â€” 2 Nights" },
  "hotels.room": { es: "HabitaciÃ³n", en: "Room" },
  "hotels.2nights": { es: "2 Noches", en: "2 Nights" },
  "hotels.pernight": { es: "Por Noche", en: "Per Night" },
  "hotels.posada.note1": { es: "âœ¦ Incluye 2 desayunos buffet y 1 circuito hidrotermal por persona", en: "âœ¦ Includes 2 buffet breakfasts and 1 hydrothermal circuit per person" },
  "hotels.posada.note2": { es: "âœ¦ Precio por habitaciÃ³n, 1-2 personas, impuestos incluidos", en: "âœ¦ Price per room, 1-2 guests, taxes included" },
  "hotels.posada.note3": { es: "âœ¦ 10% de descuento â€” mencionar el nombre de los novios", en: "âœ¦ 10% discount â€” mention the couple's name" },
  "hotels.posada.note4": { es: "âœ¦ Estancia mÃ­nima: 2 noches en fin de semana", en: "âœ¦ Minimum stay: 2 nights on weekends" },
  "hotels.posada.note5": { es: "âœ¦ Cama extra disponible: $2,550 MXN (~$150 USD) incluye desayuno", en: "âœ¦ Extra bed available: $2,550 MXN (~$150 USD) includes breakfast" },
  "hotels.reservations": { es: "Reservaciones", en: "Reservations" },
  "hotels.viewrooms": { es: "Ver habitaciones â†’", en: "View rooms â†’" },
  "hotels.palacio.subtitle": { es: "Hospedaje por noche", en: "Accommodation per night" },
  "hotels.palacio.note1": { es: "âœ¦ Precios incluyen IVA e ISH", en: "âœ¦ Prices include VAT and lodging tax" },
  "hotels.palacio.note2": { es: "âœ¦ 10% de descuento en pagos en efectivo", en: "âœ¦ 10% discount for cash payments" },
  "hotels.palacio.note3": { es: "âœ¦ Check-in: 3:00 pm Â· Check-out: 11:00 am", en: "âœ¦ Check-in: 3:00 pm Â· Check-out: 11:00 am" },
  "hotels.palacio.note4": { es: "âœ¦ Incluye desayuno continental", en: "âœ¦ Includes continental breakfast" },

  // Location / Map
  "location.label": { es: "UbicaciÃ³n", en: "Location" },
  "location.title": { es: "", en: "Getting There" },
  "location.note": { es: "Sugerimos reservar tu hospedaje en Tepoztlán, en el hermoso pueblo mágico junto a la montaña donde celebraremos nuestra boda.", en: "Please reserve your stay in Tepoztlán, the beautiful mountain village where our wedding takes place. Do not book near the airport." },

  // Footer
  "footer.date": { es: "18 de Julio, 2026 Â· TepoztlÃ¡n", en: "July 18, 2026 Â· TepoztlÃ¡n" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

