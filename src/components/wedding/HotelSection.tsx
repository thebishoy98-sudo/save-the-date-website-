import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const USD_RATE = 17;
const formatMXN = (price: number) => `$${price.toLocaleString("en")} MXN`;
const formatUSD = (price: number) => `~$${Math.round(price / USD_RATE).toLocaleString("en")} USD`;

interface RoomRow {
  name: string;
  note?: string;
  noteEn?: string;
  price: number;
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

const moreHotels = [
  {
    name: "Casa Fernanda Hotel Boutique",
    phone: "739 395 0522",
    tel: "+527393950522",
    maps: "https://maps.google.com/?q=Casa+Fernanda+Hotel+Boutique+Tepoztlan+Morelos",
  },
  {
    name: "Hotel Tatala Boutique",
    phone: "442 821 0001",
    tel: "+524428210001",
    maps: "https://maps.google.com/?q=Hotel+Tatala+Boutique+Tepoztlan+Morelos",
  },
  {
    name: "La Buena Vibra Wellness Resort",
    phone: "739 395 1491",
    tel: "+527393951491",
    maps: "https://maps.google.com/?q=La+Buena+Vibra+Wellness+Resort+Tepoztlan+Morelos",
  },
  {
    name: "Castillo de Piedras Vivas",
    phone: "739 395 2910",
    tel: "+527393952910",
    maps: "https://maps.google.com/?q=Hotel+Boutique+Castillo+de+Piedras+Vivas+Tepoztlan+Morelos",
  },
  {
    name: "Amomoxtli",
    phone: "739 395 0012",
    tel: "+527393950012",
    maps: "https://maps.google.com/?q=Amomoxtli+Tepoztlan+Morelos",
  },
  {
    name: "Finca Catalina Hotel Boutique",
    phone: "777 222 6633",
    tel: "+527772226633",
    maps: "https://maps.google.com/?q=Finca+Catalina+Hotel+Boutique+Tepoztlan+Morelos",
  },
];

const HotelCard = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="vintage-card rounded-sm overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
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
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
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
            <div className="px-4 sm:px-8 pb-8 space-y-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ExpandableHotelBlock = ({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { t } = useLanguage();

  return (
    <div className="vintage-card rounded-sm overflow-hidden">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full p-5 sm:p-6 text-center space-y-2 cursor-pointer transition-colors duration-200 hover:bg-secondary/40"
      >
        <h4 className="text-base sm:text-lg font-serif tracking-[0.08em] uppercase text-foreground">{title}</h4>
        <p className="text-xs text-muted-foreground font-serif">{t("hotels.click")}</p>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="mx-auto w-5 h-5 text-muted-foreground"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const HotelSection = () => {
  const { t, lang } = useLanguage();
  const openMap = (url: string) => window.location.assign(url);

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
          <HotelCard title={lang === "en" ? "Hotel Options" : "Opciones de Hotel"}>
            <div className="space-y-6">
              <ExpandableHotelBlock title="Posada del Tepozteco">
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground font-serif">{t("hotels.posada.subtitle")}</p>
                    <div className="w-8 h-px bg-accent mx-auto" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-serif">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">
                            {t("hotels.room")}
                          </th>
                          <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">
                            {t("hotels.2nights")}
                          </th>
                          <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">
                            USD
                          </th>
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
                </div>
              </ExpandableHotelBlock>

              <ExpandableHotelBlock title="Palacio del Cobre">
                <div className="space-y-5">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground font-serif">{t("hotels.palacio.subtitle")}</p>
                    <div className="w-8 h-px bg-accent mx-auto" />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-serif">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">
                            {t("hotels.room")}
                          </th>
                          <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">
                            {t("hotels.pernight")}
                          </th>
                          <th className="text-right py-2 text-xs tracking-[0.15em] uppercase text-muted-foreground font-normal">
                            USD
                          </th>
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
                </div>
              </ExpandableHotelBlock>

              <div className="vintage-card rounded-sm p-4 sm:p-6 space-y-4">
                <div className="text-center">
                  <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground font-serif">
                    {lang === "en" ? "More Options" : "Más Opciones"}
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moreHotels.map((hotel) => (
                    <div
                      key={hotel.name}
                      role="link"
                      tabIndex={0}
                      onClick={() => openMap(hotel.maps)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          openMap(hotel.maps);
                        }
                      }}
                      className="vintage-card rounded-sm p-5 text-center space-y-3 transition-colors hover:bg-secondary/30 cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent/60"
                    >
                      <div>
                        <p className="text-sm font-serif text-foreground leading-snug">{hotel.name}</p>
                      </div>
                      <div className="w-6 h-px bg-accent mx-auto" />
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`tel:${hotel.tel}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-[10px] tracking-[0.12em] uppercase font-serif border border-border text-foreground hover:bg-secondary/70 transition-colors"
                        >
                          {lang === "en" ? "Call" : "Llamar"}
                        </a>
                        <a
                          href={hotel.maps}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-sm text-[10px] tracking-[0.12em] uppercase font-serif border border-accent text-accent hover:bg-accent/10 transition-colors"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {lang === "en" ? "Map" : "Mapa"}
                        </a>
                      </div>
                      <p className="text-xs text-muted-foreground font-serif">{hotel.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </HotelCard>
        </SectionReveal>
      </div>
    </section>
  );
};
