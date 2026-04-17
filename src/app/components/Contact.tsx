import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Send, Car, Search, Phone, Mail, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { sendInquiryEmail } from "/utils/emailjs";
import { SEO } from "./SEO";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

type SearchFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  brand: string;
  model: string;
  budget?: string;
  year?: string;
  maxMileage?: string;
  color?: string;
  message?: string;
};

type SellFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  brand: string;
  model: string;
  year: string;
  power: string;
  mileage: string;
  price?: string;
  message?: string;
};

type FormData = SearchFormData & SellFormData;

// ─── VALIDATION RULES ──────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const rules = {
  firstName: {
    required: "Vorname ist erforderlich",
    minLength: { value: 2, message: "Mindestens 2 Zeichen" },
    pattern: {
      value: /^[A-Za-zÄÖÜäöüß\s\-]+$/,
      message: "Nur Buchstaben, Leerzeichen und Bindestriche erlaubt",
    },
  },
  lastName: {
    required: "Nachname ist erforderlich",
    minLength: { value: 2, message: "Mindestens 2 Zeichen" },
    pattern: {
      value: /^[A-Za-zÄÖÜäöüß\s\-]+$/,
      message: "Nur Buchstaben, Leerzeichen und Bindestriche erlaubt",
    },
  },
  email: {
    required: "E-Mail Adresse ist erforderlich",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      message: "Bitte eine gültige E-Mail Adresse eingeben",
    },
  },
  phone: {
    pattern: {
      value: /^[+\d\s\-()]{6,20}$/,
      message: "Ungültiges Format (z.B. +49 176 12345678)",
    },
  },
  brand: {
    required: "Marke ist erforderlich",
    minLength: { value: 2, message: "Mindestens 2 Zeichen" },
    pattern: {
      value: /^[A-Za-zÄÖÜäöüß0-9\s\-]+$/,
      message: "Nur Buchstaben und Leerzeichen erlaubt",
    },
  },
  model: {
    required: "Modell ist erforderlich",
    minLength: { value: 1, message: "Bitte Modell angeben" },
    pattern: {
      value: /^[A-Za-zÄÖÜäöüß0-9\s\-\/\.]+$/,
      message: "Ungültige Zeichen",
    },
  },
  year: (required: boolean) => ({
    ...(required ? { required: "Baujahr ist erforderlich" } : {}),
    validate: (val: string | undefined) => {
      if (!val || val.trim() === "") return true;
      const num = parseInt(val, 10);
      if (!/^\d{4}$/.test(val)) return "4-stellige Jahreszahl eingeben";
      if (num < 1900 || num > CURRENT_YEAR) return `Zwischen 1900 und ${CURRENT_YEAR}`;
      return true;
    },
  }),
  budget: {
    validate: (val: string | undefined) => {
      if (!val || val.trim() === "") return true;
      if (!/^[\d\s.,]+$/.test(val)) return "Nur Zahlen eingeben (z.B. 25000)";
      return true;
    },
  },
  numericOptional: {
    validate: (val: string | undefined) => {
      if (!val || val.trim() === "") return true;
      if (!/^[\d\s.]+$/.test(val)) return "Nur Zahlen eingeben";
      return true;
    },
  },
  numericRequired: {
    required: "Dieses Feld ist erforderlich",
    validate: (val: string | undefined) => {
      if (!val || val.trim() === "") return "Dieses Feld ist erforderlich";
      if (!/^[\d\s.]+$/.test(val)) return "Nur Zahlen eingeben";
      return true;
    },
  },
};

// ─── FIELD WRAPPER ──────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <p className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 ml-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function inputCls(hasError: boolean, isTouched: boolean, isEmpty: boolean) {
  const base =
    "block w-full rounded-2xl py-3.5 px-5 text-black placeholder:text-gray-400 focus:outline-none text-sm transition-all duration-200";
  if (hasError)
    return `${base} bg-red-50 border border-red-400 focus:ring-2 focus:ring-red-200`;
  if (isTouched && !isEmpty)
    return `${base} bg-[#f7f7f7] border border-green-400/70 focus:ring-2 focus:ring-green-100`;
  return `${base} bg-[#f7f7f7] border border-black/10 focus:ring-2 focus:ring-black/10 focus:border-black/20`;
}

// ─── SUCCESS SCREEN ────────────────────────────────────────────────────────────

function SuccessScreen({ type, onReset }: { type: "search" | "sell"; onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-[#f7f7f7] rounded-3xl p-10 sm:p-14 border border-black/6 flex flex-col items-center text-center gap-6"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
          className="w-20 h-20 bg-black rounded-full flex items-center justify-center"
        >
          <svg viewBox="0 0 52 52" className="w-10 h-10" aria-hidden="true">
            <motion.path
              d="M14 27 L22 35 L38 18"
              fill="none"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.22, ease: "easeInOut" }}
            />
          </svg>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="absolute inset-0 bg-black/15 rounded-full pointer-events-none"
        />
      </div>

      <div>
        <h3 className="text-xl text-black mb-2" style={{ fontWeight: 600 }}>
          {type === "search" ? "Suchauftrag erfolgreich gesendet!" : "Verkaufsauftrag erfolgreich gesendet!"}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
          Ihre Anfrage ist bei uns eingegangen. Wir kuemmern uns schnellstmoeglich darum und melden uns zeitnah bei Ihnen.
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-2 px-6 py-3 rounded-2xl border border-black/12 text-sm text-gray-500 hover:text-black hover:border-black/25 transition-colors"
      >
        Weiteres Anliegen senden
      </button>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, ease: "easeOut" },
};

function getRequestTypeFromQuery(search: string): "search" | "sell" {
  const type = new URLSearchParams(search).get("type");
  return type === "sell" ? "sell" : "search";
}

export function Contact() {
  const location = useLocation();
  const [requestType, setRequestType] = useState<"search" | "sell">(() =>
    getRequestTypeFromQuery(location.search)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, touchedFields },
  } = useForm<FormData>({
    mode: "onTouched",       // validate on blur first, then on every keystroke after
    shouldUnregister: true,  // unregister fields that unmount (when switching modes)
  });

  useEffect(() => {
    setRequestType(getRequestTypeFromQuery(location.search));
  }, [location.search]);

  // Reset vehicle fields when switching modes
  useEffect(() => {
    reset((prev) => ({
      firstName: prev.firstName,
      lastName: prev.lastName,
      email: prev.email,
      phone: prev.phone,
    }));
  }, [requestType, reset]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ ...data, type: requestType }),
        }
      );
      if (!response.ok) throw new Error();

      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const isSearch = requestType === "search";
      const adminLink = `${window.location.origin}${window.location.pathname.endsWith("/") ? window.location.pathname : `${window.location.pathname}/`}#/admin`;
      const summary = isSearch
        ? [
            "=== ANFRAGE ===",
            "Typ: Suchauftrag",
            "",
            "=== KUNDE ===",
            `Name: ${fullName}`,
            `E-Mail: ${data.email}`,
            `Telefon: ${data.phone || "-"}`,
            "",
            "=== FAHRZEUGWUNSCH ===",
            `Marke: ${data.brand}`,
            `Modell: ${data.model}`,
            `Baujahr ab: ${data.year || "-"}`,
            `Budget: ${data.budget ? `${data.budget} EUR` : "-"}`,
            `Max. Kilometer: ${data.maxMileage || "-"}`,
            `Farben: ${data.color || "-"}`,
            "",
            "=== NACHRICHT ===",
            data.message || "-",
          ]
        : [
            "=== ANFRAGE ===",
            "Typ: Verkaufsangebot",
            "",
            "=== KUNDE ===",
            `Name: ${fullName}`,
            `E-Mail: ${data.email}`,
            `Telefon: ${data.phone || "-"}`,
            "",
            "=== FAHRZEUGDATEN ===",
            `Marke: ${data.brand}`,
            `Modell: ${data.model}`,
            `Baujahr: ${data.year || "-"}`,
            `Leistung (PS): ${data.power || "-"}`,
            `Kilometerstand: ${data.mileage || "-"}`,
            `Preisvorstellung: ${data.price ? `${data.price} EUR` : "-"}`,
            "",
            "=== NACHRICHT ===",
            data.message || "-",
          ];

      try {
        await sendInquiryEmail({
          inquiryType: requestType,
          subject: isSearch ? "Neuer Suchauftrag" : "Neues Verkaufsangebot",
          name: fullName,
          email: data.email,
          phone: data.phone,
          carName: `${data.brand} ${data.model}`,
          carYear: data.year,
          carPrice: isSearch ? data.budget : data.price,
          message: summary.filter(Boolean).join("\n"),
          adminLink,
        });
      } catch (error) {
        console.error("EmailJS notification failed", error);
      }

      setSubmitted(true);
      reset();
    } catch {
      toast.error("Es gab ein Problem. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const watched = watch();

  const field = (name: keyof FormData) => {
    const hasError = !!errors[name];
    const isTouched = !!touchedFields[name];
    const val = watched[name];
    const isEmpty = !val || String(val).trim() === "";
    return inputCls(hasError, isTouched, isEmpty);
  };

  return (
    <>
      <SEO
        title="Kontakt – Suchauftrag oder Verkaufsangebot"
        description="Hinterlegen Sie Ihren Suchauftrag für Ihr Traumfahrzeug oder bieten Sie uns Ihr aktuelles Fahrzeug zum Verkauf an. Persönliche Beratung unter 0176 41651086."
        keywords="Suchauftrag Fahrzeug, Auto Verkaufsangebot, Kontakt Autohandel, Fahrzeug Ankauf, Auto kaufen lassen"
      />

      <div className="flex-1 min-h-screen bg-white text-black py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">

          {/* Page Header */}
          <motion.div {...fadeUp} className="border-b border-black/8 pb-8 mb-10 sm:mb-14">
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-3">Kontakt</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-black" style={{ fontWeight: 300, lineHeight: 1.1 }}>
              Wir sind für Sie <span style={{ fontWeight: 700 }}>persönlich da.</span>
            </h1>
            <p className="text-gray-500 text-sm leading-relaxed mt-4 max-w-xl">
              Hinterlegen Sie einen Suchauftrag oder bieten Sie uns Ihr aktuelles Fahrzeug an – wir melden uns schnellstmöglich bei Ihnen.
            </p>
          </motion.div>

          {/* Quick Contact Cards */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
          >
            <a
              href="tel:+4917641651086"
              className="bg-[#f7f7f7] border border-black/6 rounded-3xl p-5 sm:p-6 hover:shadow-md transition-all group flex items-center gap-4 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shrink-0 group-hover:bg-gray-800 transition-colors">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Direkt anrufen</p>
                <p className="text-black text-sm" style={{ fontWeight: 600 }}>0176 41651086</p>
              </div>
            </a>

            <a
              href="mailto:gcn-farzeughandel@outlook.de"
              className="bg-[#f7f7f7] border border-black/6 rounded-3xl p-5 sm:p-6 hover:shadow-md transition-all group flex items-center gap-4 active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shrink-0 group-hover:bg-gray-800 transition-colors">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-400 mb-0.5">E-Mail schreiben</p>
                <p className="text-black text-sm truncate" style={{ fontWeight: 600 }}>gcn-farzeughandel@outlook.de</p>
              </div>
            </a>
          </motion.div>

          {/* Divider */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
            className="flex items-center gap-4 mb-8"
          >
            <div className="flex-1 h-px bg-black/8" />
            <span className="text-gray-400 text-xs">oder Formular ausfüllen</span>
            <div className="flex-1 h-px bg-black/8" />
          </motion.div>

          {/* Type Toggle */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.35, ease: "easeOut", delay: 0.12 }}
            className="bg-[#f7f7f7] border border-black/8 p-1.5 rounded-2xl flex mb-8 relative"
          >
            {/* Sliding pill */}
            <motion.div
              layout
              layoutId="toggle-pill"
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              className={`absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] bg-white rounded-xl shadow-sm border border-black/8 pointer-events-none ${
                requestType === "search" ? "left-1.5" : "left-[calc(50%+0.375rem)]"
              }`}
            />
            <button
              type="button"
              onClick={() => setRequestType("search")}
              className={`relative flex-1 py-3 px-4 rounded-xl text-sm transition-colors duration-200 flex justify-center items-center gap-2 z-10 ${
                requestType === "search" ? "text-black" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Search className="w-4 h-4" />
              Suchauftrag
            </button>
            <button
              type="button"
              onClick={() => setRequestType("sell")}
              className={`relative flex-1 py-3 px-4 rounded-xl text-sm transition-colors duration-200 flex justify-center items-center gap-2 z-10 ${
                requestType === "sell" ? "text-black" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Car className="w-4 h-4" />
              Verkaufen
            </button>
          </motion.div>

          {/* Form or Success */}
          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessScreen
                key="success"
                type={requestType}
                onReset={() => setSubmitted(false)}
              />
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.15 }}
                className="bg-[#f7f7f7] rounded-3xl p-6 sm:p-10 border border-black/6 shadow-sm"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

                  {/* ── Persönliche Daten ─────────────────────────────────── */}
                  <div>
                    <h3 className="text-base text-black mb-5" style={{ fontWeight: 600 }}>
                      Persönliche Daten
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                      {/* Vorname */}
                      <div>
                        <input
                          {...register("firstName", rules.firstName)}
                          type="text"
                          placeholder="Vorname *"
                          autoComplete="given-name"
                          className={field("firstName")}
                        />
                        <FieldError message={errors.firstName?.message} />
                      </div>

                      {/* Nachname */}
                      <div>
                        <input
                          {...register("lastName", rules.lastName)}
                          type="text"
                          placeholder="Nachname *"
                          autoComplete="family-name"
                          className={field("lastName")}
                        />
                        <FieldError message={errors.lastName?.message} />
                      </div>

                      {/* E-Mail */}
                      <div className="sm:col-span-2">
                        <input
                          {...register("email", rules.email)}
                          type="email"
                          placeholder="E-Mail Adresse *"
                          autoComplete="email"
                          className={field("email")}
                        />
                        <FieldError message={errors.email?.message} />
                      </div>

                      {/* Telefon */}
                      <div className="sm:col-span-2">
                        <input
                          {...register("phone", rules.phone)}
                          type="tel"
                          placeholder="Telefonnummer (optional, z.B. +49 176 12345678)"
                          autoComplete="tel"
                          className={field("phone")}
                        />
                        <FieldError message={errors.phone?.message} />
                      </div>

                    </div>
                  </div>

                  {/* ── Fahrzeugdaten ─────────────────────────────────────── */}
                  <div className="pt-4 border-t border-black/8">
                    <h3 className="text-base text-black mb-5" style={{ fontWeight: 600 }}>
                      {requestType === "search" ? "Fahrzeugwünsche" : "Fahrzeugdaten"}
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                      {/* Marke */}
                      <div>
                        <input
                          {...register("brand", rules.brand)}
                          type="text"
                          placeholder="Marke * (z.B. Porsche)"
                          className={field("brand")}
                        />
                        <FieldError message={errors.brand?.message} />
                      </div>

                      {/* Modell */}
                      <div>
                        <input
                          {...register("model", rules.model)}
                          type="text"
                          placeholder="Modell * (z.B. 911)"
                          className={field("model")}
                        />
                        <FieldError message={errors.model?.message} />
                      </div>

                      {/* ── SUCHAUFTRAG fields ── */}
                      {requestType === "search" && (
                        <>
                          <div>
                            <input
                              {...register("budget", rules.budget)}
                              type="text"
                              inputMode="numeric"
                              placeholder="Max. Budget in € (z.B. 25000)"
                              className={field("budget")}
                            />
                            <FieldError message={errors.budget?.message} />
                          </div>

                          <div>
                            <input
                              {...register("year", rules.year(false))}
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder={`Baujahr ab (z.B. 2018)`}
                              className={field("year")}
                            />
                            <FieldError message={errors.year?.message} />
                          </div>

                          <div>
                            <input
                              {...register("maxMileage", rules.numericOptional)}
                              type="text"
                              inputMode="numeric"
                              placeholder="Max. Kilometerstand (z.B. 80000)"
                              className={field("maxMileage")}
                            />
                            <FieldError message={errors.maxMileage?.message} />
                          </div>

                          <div>
                            <input
                              {...register("color")}
                              type="text"
                              placeholder="Favorisierte Farben (z.B. Schwarz, Weiß)"
                              className={field("color")}
                            />
                          </div>
                        </>
                      )}

                      {/* ── VERKAUF fields ── */}
                      {requestType === "sell" && (
                        <>
                          <div>
                            <input
                              {...register("year", rules.year(true))}
                              type="text"
                              inputMode="numeric"
                              maxLength={4}
                              placeholder={`Baujahr * (z.B. 2019)`}
                              className={field("year")}
                            />
                            <FieldError message={errors.year?.message} />
                          </div>

                          <div>
                            <input
                              {...register("power", rules.numericRequired)}
                              type="text"
                              inputMode="numeric"
                              placeholder="Leistung in PS * (z.B. 150)"
                              className={field("power")}
                            />
                            <FieldError message={errors.power?.message} />
                          </div>

                          <div>
                            <input
                              {...register("mileage", rules.numericRequired)}
                              type="text"
                              inputMode="numeric"
                              placeholder="Kilometerstand * (z.B. 92000)"
                              className={field("mileage")}
                            />
                            <FieldError message={errors.mileage?.message} />
                          </div>

                          <div>
                            <input
                              {...register("price", rules.budget)}
                              type="text"
                              inputMode="numeric"
                              placeholder="Preisvorstellung in € (z.B. 15000)"
                              className={field("price")}
                            />
                            <FieldError message={errors.price?.message} />
                          </div>
                        </>
                      )}

                      {/* Nachricht */}
                      <div className="sm:col-span-2">
                        <textarea
                          {...register("message")}
                          rows={4}
                          className={`${field("message")} resize-none`}
                          placeholder={
                            requestType === "search"
                              ? "Weitere Wünsche oder Kommentar (optional)"
                              : "Weitere Details zum Fahrzeug – Zustand, bekannte Mängel, Besonderheiten... (optional)"
                          }
                        />
                      </div>

                    </div>
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm text-white bg-black hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {requestType === "search" ? "Suchauftrag senden" : "Angebot senden"}
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-400 text-xs">
                    Mit * markierte Felder sind Pflichtfelder
                  </p>

                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}