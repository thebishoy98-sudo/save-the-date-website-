import { useState } from "react";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";

export const RSVPForm = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nombre: "", confirmacion: "", numInvitados: "1",
    telefono: "", alergias: "", aeropuerto: "", transporte: "",
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
          <p className="text-sm text-muted-foreground font-serif">{t("rsvp.thanks.message")}</p>
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
                className="w-full px-4 py-3 vintage-input rounded-sm text-sm" placeholder={t("rsvp.name.placeholder")} />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.confirm")}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="confirmacion" value="si" required onChange={handleChange} className="accent-accent" />
                  <span className="text-sm font-serif text-foreground">{t("rsvp.confirm.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="confirmacion" value="no" onChange={handleChange} className="accent-accent" />
                  <span className="text-sm font-serif text-foreground">{t("rsvp.confirm.no")}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.guests")}</label>
              <select name="numInvitados" value={form.numInvitados} onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-sm appearance-none">
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.phone")}</label>
              <input type="tel" name="telefono" value={form.telefono} onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-sm" placeholder="+52 ..." />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.allergies")}</label>
              <textarea name="alergias" value={form.alergias} onChange={handleChange} rows={3}
                className="w-full px-4 py-3 vintage-input rounded-sm text-sm resize-none" placeholder={t("rsvp.allergies.placeholder")} />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.airport")}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="aeropuerto" value="PBC" onChange={handleChange} className="accent-accent" />
                  <span className="text-sm font-serif text-foreground">Puebla (PBC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="aeropuerto" value="MEX" onChange={handleChange} className="accent-accent" />
                  <span className="text-sm font-serif text-foreground">CDMX (MEX)</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.transport")}</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="transporte" value="si" onChange={handleChange} className="accent-accent" />
                  <span className="text-sm font-serif text-foreground">{t("rsvp.transport.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="transporte" value="no" onChange={handleChange} className="accent-accent" />
                  <span className="text-sm font-serif text-foreground">{t("rsvp.transport.no")}</span>
                </label>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-secondary text-center">
              <p className="text-xs text-muted-foreground font-serif leading-relaxed whitespace-pre-line">
                {t("rsvp.travel.note")}
              </p>
            </div>

            <button type="submit"
              className="w-full py-3 rounded-sm font-serif text-sm tracking-[0.15em] uppercase transition-colors duration-200 bg-primary text-primary-foreground hover:bg-foreground">
              {t("rsvp.submit")}
            </button>
          </form>
        </div>
      </SectionReveal>
    </section>
  );
};
