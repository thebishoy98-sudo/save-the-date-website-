import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

const FlightLeg = ({
  label,
  dep,
  arr,
  duration,
}: {
  label: string;
  dep: string;
  arr: string;
  duration: string;
}) => (
  <div className="space-y-1">
    <p className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground">{label}</p>
    <div className="flex items-center gap-2">
      <span className="font-serif text-base text-foreground tabular-nums">{dep}</span>
      <div className="flex-1 flex items-center gap-1 min-w-0">
        <div className="h-px flex-1 bg-border" />
        <span className="text-[9px] text-muted-foreground whitespace-nowrap">{duration}</span>
        <div className="h-px flex-1 bg-border" />
      </div>
      <span className="font-serif text-base text-foreground tabular-nums">{arr}</span>
    </div>
  </div>
);

export const SuggestedFlights = () => {
  const { lang } = useLanguage();
  const isEs = lang === "es";

  return (
    <section className="py-16 px-6">
      <SectionReveal>
        <div className="max-w-3xl mx-auto space-y-8">

          <div className="text-center">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">
              {isEs ? "Para invitados desde Nueva York" : "For guests from New Jersey/New York"}
            </p>
            <h2 className="font-script text-4xl gold-text">
              {isEs ? "Vuelos Sugeridos" : "Suggested Flights"}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Volaris — EWR → PBC */}
            <div className="vintage-card rounded-sm p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1">Volaris</p>
                  <p className="font-serif text-lg font-medium text-foreground tracking-wide">EWR → PBC</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isEs ? "Vuelo directo" : "Non-stop"} · Newark → Puebla
                  </p>
                </div>
                <span className="text-[9px] px-2 py-1 rounded-sm border border-accent/30 text-accent tracking-[0.12em] uppercase">
                  {isEs ? "Recomendado" : "Recommended"}
                </span>
              </div>

              <div className="space-y-3">
                <FlightLeg
                  label={isEs ? "Ida · Vie 17 Jul 2026" : "Outbound · Fri Jul 17, 2026"}
                  dep="6:59 AM"
                  arr="10:15 AM"
                  duration="5h 16m"
                />
                <div className="h-px bg-border" />
                <FlightLeg
                  label={isEs ? "Regreso · Dom 19 Jul 2026" : "Return · Sun Jul 19, 2026"}
                  dep="10:50 PM"
                  arr="5:29 AM ＋1"
                  duration="4h 39m"
                />
              </div>
            </div>

            {/* Aeromexico — EWR → MEX */}
            <div className="vintage-card rounded-sm p-6 space-y-5">
              <div>
                <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-1">Aeromexico</p>
                <p className="font-serif text-lg font-medium text-foreground tracking-wide">EWR → MEX</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isEs ? "Vuelo directo" : "Non-stop"} · Newark → Mexico City
                </p>
              </div>

              <div className="space-y-3">
                <FlightLeg
                  label={isEs ? "Ida · Jue 16 Jul 2026" : "Outbound · Thu Jul 16, 2026"}
                  dep="8:01 AM"
                  arr="11:05 AM"
                  duration="5h 04m"
                />
                <div className="h-px bg-border" />
                <FlightLeg
                  label={isEs ? "Regreso · Dom 19 Jul 2026" : "Return · Sun Jul 19, 2026"}
                  dep="3:00 PM"
                  arr="10:00 PM"
                  duration="5h 00m"
                />
              </div>
            </div>

          </div>

          {/* Shared shuttle callout */}
          <div className="vintage-card rounded-sm px-8 py-5 text-center space-y-2">
            <p className="text-xs tracking-[0.25em] uppercase gold-text mb-1">
              {isEs ? "🚐 Transporte Organizado" : "🚐 Shuttle Arranged"}
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {isEs
                ? "Organizamos transporte desde ambos aeropuertos el viernes 17 de julio. El regreso será el domingo 19 de julio. Coordina el horario con Bishoy."
                : "We'll arrange van pickup from both airports on Friday, July 17. Drop-off back to the airport will be Sunday, July 19. Coordinate pickup time with Bishoy."}
            </p>
          </div>

        </div>
      </SectionReveal>
    </section>
  );
};
