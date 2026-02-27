import { useState } from "react";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

export const RSVPForm = () => {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "", confirmacion: "", numInvitados: "1",
    telefono: "", aeropuerto: "", hotel: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("RSVP Data:", form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-16 px-6">
        <div className="max-w-md mx-auto vintage-card rounded-sm p-10 text-center space-y-4">
          <h2 className="font-script text-3xl gold-text">{t("rsvp.thanks")}</h2>
          <p className="text-base text-muted-foreground font-serif">{t("rsvp.thanks.message")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-6" id="rsvp">
      <SectionReveal>
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("rsvp.label")}</p>
            <h2 className="font-script text-4xl gold-text">{t("rsvp.title")}</h2>
          </div>

          <form onSubmit={handleSubmit} className="vintage-card rounded-sm p-8 sm:p-10 space-y-6">
            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.name")}</label>
              <input type="text" name="nombre" required value={form.nombre} onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base" placeholder={t("rsvp.name.placeholder")} />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.confirm")}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="confirmacion" value="si" required onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">{t("rsvp.confirm.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="confirmacion" value="no" onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">{t("rsvp.confirm.no")}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.guests")}</label>
              <select name="numInvitados" value={form.numInvitados} onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base appearance-none">
                {[1, 2].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              <p className="text-xs text-muted-foreground font-serif leading-relaxed">
                {lang === "es"
                  ? "Si serán más de 2 personas, por favor comunícate con Bishoy o Arantxa para confirmar la cantidad."
                  : "If your party is more than 2, please reach out to Bishoy or Arantxa to confirm the number of guests."}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.phone")}</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base" placeholder={lang === "es" ? "+52 ..." : "+1 ..."} />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.airport")}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="aeropuerto" value="PBC" onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">Puebla (PBC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="aeropuerto" value="MEX" onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">CDMX (MEX)</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.hotel")}</label>
              <select name="hotel" value={form.hotel} onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base appearance-none">
                <option value="">{t("rsvp.hotel.placeholder")}</option>
                <option value="posada">Posada del Tepozteco ★★★★</option>
                <option value="palacio">Palacio del Cobre ★★★★</option>
                <option value="casa-fernanda">Casa Fernanda Hotel Boutique ★★★★★</option>
                <option value="tatala">Hotel Tatala ★★★</option>
                <option value="buena-vibra">La Buena Vibra Wellness Resort ★★★★★</option>
                <option value="castillo">Hotel Boutique Castillo Piedras Vivas ★★★</option>
                <option value="amomoxtli">Amomoxtli ★★★★★</option>
                <option value="finca-catalina">Finca Catalina Hotel Boutique ★★★★</option>
                <option value="other">{t("rsvp.hotel.other")}</option>
              </select>
            </div>

            <div className="p-4 rounded-sm bg-secondary text-center">
              <p className="text-xs text-muted-foreground font-serif leading-relaxed whitespace-pre-line">
                {t("rsvp.travel.note")}
              </p>
            </div>

            <button type="submit"
              className="w-full py-3 rounded-sm font-serif text-base tracking-[0.15em] uppercase transition-colors duration-200 bg-primary text-primary-foreground hover:bg-foreground">
              {t("rsvp.submit")}
            </button>
          </form>
        </div>
      </SectionReveal>
    </section>
  );
};
