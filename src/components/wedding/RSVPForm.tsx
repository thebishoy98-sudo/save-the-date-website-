import { useEffect, useMemo, useState } from "react";
import { SectionReveal } from "./SectionReveal";
import { useLanguage } from "@/contexts/LanguageContext";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

interface RSVPFormState {
  nombre: string;
  email: string;
  confirmacion: "yes" | "no" | "";
  numInvitados: string;
  telefono: string;
  aeropuerto: "PBC" | "MEX" | "LOCAL" | "";
  hotel: string;
  transporte: "yes" | "no" | "";
  bringingChildren: "yes" | "no" | "";
  childrenCount: string;
}

const initialForm: RSVPFormState = {
  nombre: "",
  email: "",
  confirmacion: "",
  numInvitados: "1",
  telefono: "",
  aeropuerto: "",
  hotel: "",
  transporte: "",
  bringingChildren: "",
  childrenCount: "",
};

export const RSVPForm = () => {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<RSVPFormState>(initialForm);
  const [hasStartedInvite, setHasStartedInvite] = useState(false);
  const inviteToken = useMemo(() => {
    if (typeof window === "undefined") return null;
    const params = new URLSearchParams(window.location.search);
    const value = params.get("invite");
    return value?.trim() || null;
  }, []);

  useEffect(() => {
    const markInviteOpened = async () => {
      if (!inviteToken || !supabase) return;
      await supabase.rpc("track_sms_invite_event", {
        p_invite_token: inviteToken,
        p_event: "opened",
      });
    };
    void markInviteOpened();
  }, [inviteToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "numInvitados" || name === "childrenCount") {
      const digitsOnly = value.replace(/\D/g, "");
      setForm({ ...form, [name]: digitsOnly });
      if (!hasStartedInvite && inviteToken && supabase) {
        setHasStartedInvite(true);
        void supabase.rpc("track_sms_invite_event", {
          p_invite_token: inviteToken,
          p_event: "started",
        });
      }
      return;
    }
    setForm({ ...form, [name]: value });

    if (!hasStartedInvite && inviteToken && supabase && value.trim()) {
      setHasStartedInvite(true);
      void supabase.rpc("track_sms_invite_event", {
        p_invite_token: inviteToken,
        p_event: "started",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.nombre.trim() ||
      !form.email.trim() ||
      !form.confirmacion ||
      !form.numInvitados.trim() ||
      !form.telefono.trim() ||
      !form.aeropuerto ||
      !form.transporte ||
      !form.bringingChildren ||
      !form.hotel
    ) {
      setError(
        lang === "es"
          ? "Por favor completa todos los campos obligatorios antes de enviar."
          : "Please complete all required fields before submitting.",
      );
      return;
    }
    if (!/^\d+$/.test(form.numInvitados) || Number.parseInt(form.numInvitados, 10) < 1) {
      setError(
        lang === "es"
          ? "El numero de invitados debe ser un numero valido mayor que 0."
          : "Number of guests must be a valid number greater than 0.",
      );
      return;
    }
    if (
      form.bringingChildren === "yes" &&
      (!/^\d+$/.test(form.childrenCount) || Number.parseInt(form.childrenCount, 10) < 1)
    ) {
      setError(
        lang === "es"
          ? "Por favor ingresa un numero valido de niños."
          : "Please enter a valid number of children.",
      );
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setError(
        lang === "es"
          ? "El servicio RSVP aun no esta configurado. Intenta de nuevo en unos minutos."
          : "RSVP service is not configured yet. Please try again soon.",
      );
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
      allergies_notes: null,
      transport_needed: form.transporte === "" ? null : form.transporte === "yes",
      kids_food_required:
        form.bringingChildren === "" ? null : form.bringingChildren === "yes",
      bringing_children: form.bringingChildren === "" ? null : form.bringingChildren === "yes",
      children_count:
        form.bringingChildren === "yes" ? Number.parseInt(form.childrenCount, 10) || null : null,
      invite_token: inviteToken,
    };

    const { error: insertError } = await supabase.from("rsvps").insert(payload);

    if (insertError) {
      setError(insertError.message);
      setIsSubmitting(false);
      return;
    }

    if (inviteToken) {
      await supabase.rpc("track_sms_invite_event", {
        p_invite_token: inviteToken,
        p_event: "responded",
        p_attending: form.confirmacion === "yes",
      });
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
                {lang === "es" ? "Correo electronico" : "Email"}
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
              <input
                type="text"
                name="numInvitados"
                required
                value={form.numInvitados}
                onChange={handleChange}
                inputMode="numeric"
                pattern="[0-9]*"
                minLength={1}
                className="w-full px-4 py-3 vintage-input rounded-sm text-base"
                placeholder="1"
              />
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
                  <input type="radio" name="aeropuerto" value="PBC" required checked={form.aeropuerto === "PBC"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">Puebla (PBC)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="aeropuerto" value="MEX" checked={form.aeropuerto === "MEX"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">CDMX (MEX)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="aeropuerto" value="LOCAL" checked={form.aeropuerto === "LOCAL"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">{lang === "es" ? "Soy local (sin aeropuerto)" : "I live local (no airport)"}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.transport")}</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="transporte" value="yes" required checked={form.transporte === "yes"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">{t("rsvp.transport.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="transporte" value="no" checked={form.transporte === "no"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">{t("rsvp.transport.no")}</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                {lang === "es" ? "Traes niños? (comida para niños)" : "Are you bringing children? (kids food)"}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="bringingChildren" value="yes" checked={form.bringingChildren === "yes"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">{lang === "es" ? "Si" : "Yes"}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="bringingChildren" value="no" checked={form.bringingChildren === "no"} onChange={handleChange} className="accent-accent" />
                  <span className="text-base font-serif text-foreground">No</span>
                </label>
              </div>
            </div>

            {form.bringingChildren === "yes" && (
              <div className="space-y-2">
                <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">
                  {lang === "es" ? "Cuantos niños?" : "How many children?"}
                </label>
                <input
                  type="text"
                  name="childrenCount"
                  required
                  value={form.childrenCount}
                  onChange={handleChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  minLength={1}
                  className="w-full px-4 py-3 vintage-input rounded-sm text-base"
                  placeholder="1"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs tracking-[0.16em] sm:tracking-[0.2em] uppercase text-muted-foreground font-serif">{t("rsvp.hotel")}</label>
              <select name="hotel" required value={form.hotel} onChange={handleChange} className="w-full px-4 py-3 vintage-input rounded-sm text-base appearance-none">
                <option value="">{t("rsvp.hotel.placeholder")}</option>
                <option value="posada">Posada del Tepozteco</option>
                <option value="palacio">Palacio del Cobre</option>
                <option value="casa-fernanda">Casa Fernanda Hotel Boutique</option>
                <option value="tatala">Hotel Tatala</option>
                <option value="buena-vibra">La Buena Vibra Wellness Resort</option>
                <option value="castillo">Hotel Boutique Castillo Piedras Vivas</option>
                <option value="amomoxtli">Amomoxtli</option>
                <option value="finca-catalina">Finca Catalina Hotel Boutique</option>
                <option value="other">{t("rsvp.hotel.other")}</option>
              </select>
            </div>

            <div className="p-4 rounded-sm bg-secondary text-center">
              <p className="text-xs text-muted-foreground font-serif leading-relaxed whitespace-pre-line">{t("rsvp.travel.note")}</p>
            </div>

            {error && <p className="text-sm text-destructive font-serif">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-sm font-serif text-sm sm:text-base tracking-[0.12em] sm:tracking-[0.15em] uppercase transition-colors duration-200 bg-primary text-primary-foreground hover:bg-foreground disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (lang === "es" ? "Enviando..." : "Submitting...") : t("rsvp.submit")}
            </button>
          </form>
        </div>
      </SectionReveal>
    </section>
  );
};
