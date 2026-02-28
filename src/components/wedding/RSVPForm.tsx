import { useState } from "react";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface RSVPFormState {
  nombre: string;
  email: string;
  confirmacion: "yes" | "no" | "";
  numInvitados: string;
  telefono: string;
  aeropuerto: "PBC" | "MEX" | "";
  hotel: string;
  notas: string;
  transporte: "yes" | "no" | "";
  kidsFood: "yes" | "no" | "";
}

const initialForm: RSVPFormState = {
  nombre: "",
  email: "",
  confirmacion: "",
  numInvitados: "1",
  telefono: "",
  aeropuerto: "",
  hotel: "",
  notas: "",
  transporte: "",
  kidsFood: "",
};

export const RSVPForm = () => {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<RSVPFormState>(initialForm);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.nombre.trim() ||
      !form.email.trim() ||
      !form.confirmacion ||
      !form.telefono.trim() ||
      !form.aeropuerto ||
      !form.transporte ||
      !form.kidsFood ||
      !form.hotel
    ) {
      setError("Please complete all required fields before submitting.");
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError("RSVP service is not configured yet. Please try again soon.");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: form.nombre.trim(),
      email: form.email.trim() || null,
      language: lang,
      attending: form.confirmacion === "yes",
      guest_count: Number.parseInt(form.numInvitados, 10) || 1,
      phone: form.telefono.trim() || null,
      arrival_airport: form.aeropuerto || null,
      hotel: form.hotel || null,
      allergies_notes: form.notas.trim() || null,
      transport_needed:
        form.transporte === ""
          ? null
          : form.transporte === "yes",
      kids_food_required:
        form.kidsFood === ""
          ? null
          : form.kidsFood === "yes",
    };

    const { error: insertError } = await supabase.from("rsvps").insert(payload);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    const { error: notifyError } = await supabase.functions.invoke("rsvp-notify", {
      body: payload,
    });

    if (notifyError) {
      console.warn("Email notification failed:", notifyError.message);
    }

    setSubmitted(true);
    setForm(initialForm);
    setIsSubmitting(false);
  };

  if (submitted) {
    return (
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-md mx-auto vintage-card rounded-sm p-8 sm:p-10 text-center space-y-4">
          <h2 className="font-script text-3xl gold-text">{t("rsvp.thanks")}</h2>
          <p className="text-base text-muted-foreground font-serif">{t("rsvp.thanks.message")}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6" id="rsvp">
      <SectionReveal>
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-xs tracking-[0.22em] sm:tracking-[0.3em] uppercase text-muted-foreground mb-3">
              {t("rsvp.label")}
            </p>
            <h2 className="font-script text-4xl gold-text">{t("rsvp.title")}</h2>
          </div>

          <form onSubmit={handleSubmit} className="vintage-card rounded-sm p-5 sm:p-10 space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.name")}
              </label>
              <input
                type="text"
                name="nombre"
                required
                value={form.nombre}
                onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base"
                placeholder={t("rsvp.name.placeholder")}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base"
                placeholder="name@email.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.confirm")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmacion"
                    value="yes"
                    required
                    checked={form.confirmacion === "yes"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">{t("rsvp.confirm.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="confirmacion"
                    value="no"
                    checked={form.confirmacion === "no"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">{t("rsvp.confirm.no")}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.guests")}
              </label>
              <select
                name="numInvitados"
                value={form.numInvitados}
                onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base appearance-none"
              >
                {[1, 2].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground font-serif leading-relaxed">
                {lang === "es"
                  ? "Si seran mas de 2 personas, por favor comunicate con Bishoy o Arantxa para confirmar la cantidad."
                  : "If your party is more than 2, please reach out to Bishoy or Arantxa to confirm the number of guests."}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.phone")}
              </label>
              <input
                type="tel"
                name="telefono"
                required
                value={form.telefono}
                onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base"
                placeholder={lang === "es" ? "+52 ..." : "+1 ..."}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.airport")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aeropuerto"
                    value="PBC"
                    required
                    checked={form.aeropuerto === "PBC"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">Puebla (PBC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="aeropuerto"
                    value="MEX"
                    checked={form.aeropuerto === "MEX"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">CDMX (MEX)</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.transport")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transporte"
                    value="yes"
                    required
                    checked={form.transporte === "yes"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">{t("rsvp.transport.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="transporte"
                    value="no"
                    checked={form.transporte === "no"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">{t("rsvp.transport.no")}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.kidsFood")}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kidsFood"
                    value="yes"
                    required
                    checked={form.kidsFood === "yes"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">{t("rsvp.kidsFood.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="kidsFood"
                    value="no"
                    checked={form.kidsFood === "no"}
                    onChange={handleChange}
                    className="accent-accent"
                  />
                  <span className="text-base font-serif text-foreground">{t("rsvp.kidsFood.no")}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.hotel")}
              </label>
              <select
                name="hotel"
                required
                value={form.hotel}
                onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base appearance-none"
              >
                <option value="">{t("rsvp.hotel.placeholder")}</option>
                <option value="posada">Posada del Tepozteco ****</option>
                <option value="palacio">Palacio del Cobre ****</option>
                <option value="casa-fernanda">Casa Fernanda Hotel Boutique *****</option>
                <option value="tatala">Hotel Tatala ***</option>
                <option value="buena-vibra">La Buena Vibra Wellness Resort *****</option>
                <option value="castillo">Hotel Boutique Castillo Piedras Vivas ***</option>
                <option value="amomoxtli">Amomoxtli *****</option>
                <option value="finca-catalina">Finca Catalina Hotel Boutique ****</option>
                <option value="other">{t("rsvp.hotel.other")}</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {t("rsvp.allergies")}
              </label>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base min-h-24"
                placeholder={t("rsvp.allergies.placeholder")}
              />
            </div>

            <div className="p-4 rounded-sm bg-secondary text-center">
              <p className="text-xs text-muted-foreground font-serif leading-relaxed whitespace-pre-line">
                {t("rsvp.travel.note")}
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive font-serif">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-sm font-serif text-sm sm:text-base tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-colors duration-200 bg-primary text-primary-foreground hover:bg-foreground disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : t("rsvp.submit")}
            </button>
          </form>
        </div>
      </SectionReveal>
    </section>
  );
};
