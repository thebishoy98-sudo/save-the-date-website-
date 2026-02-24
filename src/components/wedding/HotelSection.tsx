import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const USD_RATE = 17;
const formatMXN = (price: number) => `$${price.toLocaleString("en")} MXN`;
const formatUSD = (price: number) => `~$${Math.round(price / USD_RATE).toLocaleString("en")} USD`;

interface RoomRow {
  name: string;
  nameEn?: string;
  price: number;
  note?: string;
  noteEn?: string;
}

const posadaRooms: RoomRow[] = [
  { name: "Hacienda", price: 7580, note: "Cama KS, vista jardín", noteEn: "King bed, garden view" },
  { name: "Standard", price: 8800, note: "Diferentes vistas al jardín", noteEn: "Various garden views" },
  { name: "Superior", price: 10700, note: "Cama KS, terraza privada", noteEn: "King bed, private terrace" },
  { name: "Junior", price: 11200, note: "Vista jardín y montaña", noteEn: "Garden & mountain view" },
  { name: "Deluxe Suite", price: 13200, note: "Vista montaña, terraza", noteEn: "Mountain view, terrace" },
  { name: "Master Suite", price: 15600, note: "Jacuzzi, terraza privada", noteEn: "Jacuzzi, private terrace" },
  { name: "Gran Suite", price: 15900, note: "2 hab, cocina, sala", noteEn: "2 rooms, kitchen, living room" },
  { name: "Village (La Villa)", price: 22800, note: "3 hab, jardín, 6 huéspedes", noteEn: "3 rooms, garden, 6 guests" },
];

const HotelCard = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="vintage-card rounded-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 text-center space-y-2 cursor-pointer transition-colors duration-200 hover:bg-secondary/50"
      >
        <h3 className="text-lg font-serif tracking-[0.1em] uppercase text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground font-serif">{t("hotels.click")}</p>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-5 h-5 text-muted-foreground"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-8 pb-8 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HotelSection = () => {
  const { t, lang } = useLanguage();

  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-10">
        <SectionReveal>
          <div className="text-center mb-8">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("hotels.label")}</p>
            <h2 className="font-script text-4xl gold-text">{t("hotels.title")}</h2>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.15}>
          <HotelCard title="Posada del Tepozteco">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-serif">{t("hotels.posada.subtitle")}</p>
              <div className="w-8 h-px bg-accent mx-auto" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm font-serif">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">{t("hotels.room")}</th>
                    <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">{t("hotels.2nights")}</th>
                    <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">USD</th>
                  </tr>
                </thead>
                <tbody>
                  {posadaRooms.map((room) => (
                    <tr key={room.name} className="border-b border-border/50">
                      <td className="py-3">
                        <span className="text-foreground">{room.name}</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {lang === "en" ? room.noteEn : room.note}
                        </p>
                      </td>
                      <td className="text-right py-3 text-foreground">{formatMXN(room.price)}</td>
                      <td className="text-right py-3 text-muted-foreground">{formatUSD(room.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground font-serif leading-relaxed">
              <p>{t("hotels.posada.note1")}</p>
              <p>{t("hotels.posada.note2")}</p>
              <p>{t("hotels.posada.note3")}</p>
              <p>{t("hotels.posada.note4")}</p>
              <p>{t("hotels.posada.note5")}</p>
            </div>

            <div className="p-4 rounded-sm bg-secondary space-y-2 text-center">
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-serif">{t("hotels.reservations")}</p>
              <p className="text-sm text-foreground font-serif">
                WhatsApp: <a href="https://wa.me/527771030315" className="gold-text underline">777 103 0315</a>
              </p>
              <p className="text-sm text-foreground font-serif">
                Email: <a href="mailto:reserva@posadadeltepozteco.com" className="gold-text underline">reserva@posadadeltepozteco.com</a>
              </p>
              <a href="https://posadadeltepozteco.com.mx/habitaciones" target="_blank" rel="noopener noreferrer"
                className="inline-block mt-2 text-xs tracking-[0.15em] uppercase gold-text underline">
                {t("hotels.viewrooms")}
              </a>
            </div>
          </HotelCard>
        </SectionReveal>

        <SectionReveal delay={0.3}>
          <HotelCard title="Palacio del Cobre">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground font-serif">{t("hotels.palacio.subtitle")}</p>
              <div className="w-8 h-px bg-accent mx-auto" />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm font-serif">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">{t("hotels.room")}</th>
                    <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">{t("hotels.pernight")}</th>
                    <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">USD</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border/50">
                    <td className="py-3">
                      <span className="text-foreground">King</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lang === "en" ? "1-2 guests, King bed" : "1-2 personas, Cama KS"}
                      </p>
                    </td>
                    <td className="text-right py-3 text-foreground">{formatMXN(3353)}</td>
                    <td className="text-right py-3 text-muted-foreground">{formatUSD(3353)}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <td className="py-3">
                      <span className="text-foreground">Doble</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {lang === "en" ? "2-4 guests, queen bed" : "2-4 personas, cama matrimonial"}
                      </p>
                    </td>
                    <td className="text-right py-3 text-foreground">{formatMXN(3952)}</td>
                    <td className="text-right py-3 text-muted-foreground">{formatUSD(3952)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="space-y-3 text-xs text-muted-foreground font-serif leading-relaxed">
              <p>{t("hotels.palacio.note1")}</p>
              <p>{t("hotels.palacio.note2")}</p>
              <p>{t("hotels.palacio.note3")}</p>
              <p>{t("hotels.palacio.note4")}</p>
            </div>

            <p className="text-xs text-center text-muted-foreground font-serif">
              San Lorenzo No.7, Valle de Atongo, Tepoztlán, Morelos, C.P. 62520
            </p>
          </HotelCard>
        </SectionReveal>
      </div>
    </section>
  );
};
