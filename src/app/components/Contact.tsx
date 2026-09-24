import { useEffect, useState } from "react";
import { useForm, type UseFormRegisterReturn } from "react-hook-form";
import { toast } from "sonner";
import { Send, Car, Search, Phone, Mail, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { sendInquiryEmail } from "/utils/emailjs";
import suchauftragImg from "../../assets/illustrations/suchauftrag.jpg";
import uebergabeImg from "../../assets/illustrations/uebergabe.jpg";
import { SEO } from "./SEO";
import { ADMIN_ROUTE_SEGMENT } from "../adminRoute";

// ─── TYPEN ────────────────────────────────────────────────────────────────────

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

// ─── VALIDIERUNG ──────────────────────────────────────────────────────────────

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
    required: "E-Mail-Adresse ist erforderlich",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      message: "Bitte eine gültige E-Mail-Adresse eingeben",
    },
  },
  phone: {
    pattern: {
      value: /^[+\d\s\-()]{6,20}$/,
      message: "Ungültiges Format (z. B. +49 176 12345678)",
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
      if (!/^[\d\s.,]+$/.test(val)) return "Nur Zahlen eingeben (z. B. 25000)";
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

// ─── FELDER ───────────────────────────────────────────────────────────────────

function FieldError({ id, message }: { id: string; message?: string }) {
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
          <p id={id} className="ml-1 mt-1.5 flex items-center gap-1.5 text-xs text-rosso-scuro">
            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
            {message}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type FieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  filled: boolean;
  touched: boolean;
  required?: boolean;
  hint?: string;
  className?: string;
  textarea?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

function Field({
  id,
  label,
  registration,
  error,
  filled,
  touched,
  required,
  hint,
  className,
  textarea,
  inputProps,
}: FieldProps) {
  const valid = touched && filled && !error;
  const base =
    "block w-full rounded-2xl border px-5 py-3.5 text-sm text-nero transition-colors placeholder:text-alluminio focus:outline-none";
  const state = error
    ? "border-rosso bg-rosso-wash/50"
    : valid
      ? "border-nero/30 bg-crema-chiara"
      : "border-linea bg-crema-chiara focus:border-nero/35";

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-center gap-1 pl-1 text-sm text-asfalto">
        {label}
        {required && (
          <span className="text-rosso" aria-hidden="true">
            *
          </span>
        )}
        {hint && <span className="text-alluminio">· {hint}</span>}
      </label>
      <div className="relative">
        {textarea ? (
          <textarea
            id={id}
            rows={4}
            {...registration}
            {...(inputProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${base} ${state} resize-none`}
          />
        ) : (
          <input
            id={id}
            {...registration}
            {...inputProps}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={`${base} ${state}`}
          />
        )}
        {valid && !textarea && (
          <Check
            className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-nero/45"
            aria-hidden="true"
          />
        )}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

// ─── ERFOLG ───────────────────────────────────────────────────────────────────

function SuccessScreen({ type, onReset }: { type: "search" | "sell"; onReset: () => void }) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="finestra flex flex-col items-center gap-6 border border-linea bg-crema-chiara p-10 text-center sm:p-14"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.1 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-rosso"
      >
        <svg viewBox="0 0 52 52" className="h-10 w-10" aria-hidden="true">
          <motion.path
            d="M14 27 L22 35 L38 18"
            fill="none"
            stroke="#FBF7F0"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.22, ease: "easeInOut" }}
          />
        </svg>
      </motion.div>

      <div>
        <h2 className="text-xl" style={{ fontWeight: 700 }}>
          {type === "search" ? "Suchauftrag ist raus." : "Verkaufsangebot ist raus."}
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-asfalto">
          Ihre Anfrage ist bei uns eingegangen. Wir melden uns zeitnah – in der
          Regel noch am selben Werktag.
        </p>
      </div>

      <button
        onClick={onReset}
        className="mt-2 inline-flex items-center gap-2 rounded-full border border-linea px-6 py-3 text-sm text-nero transition-all hover:border-nero hover:bg-nero hover:text-crema-chiara active:scale-[0.98]"
      >
        Weiteres Anliegen senden
      </button>
    </motion.div>
  );
}

// ─── SEITE ────────────────────────────────────────────────────────────────────

function getRequestTypeFromQuery(search: string): "search" | "sell" {
  const type = new URLSearchParams(search).get("type");
  return type === "sell" ? "sell" : "search";
}

export function Contact() {
  const location = useLocation();
  const [requestType, setRequestType] = useState<"search" | "sell">(() =>
    getRequestTypeFromQuery(location.search),
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
    mode: "onTouched",
    shouldUnregister: true,
  });

  useEffect(() => {
    setRequestType(getRequestTypeFromQuery(location.search));
  }, [location.search]);

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
        },
      );
      if (!response.ok) throw new Error();

      const fullName = `${data.firstName} ${data.lastName}`.trim();
      const isSearch = requestType === "search";
      const adminLink = `${window.location.origin}${import.meta.env.BASE_URL}${ADMIN_ROUTE_SEGMENT}`;
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

  const state = (name: keyof FormData) => {
    const val = watched[name];
    return {
      error: errors[name]?.message as string | undefined,
      touched: !!touchedFields[name],
      filled: !!val && String(val).trim() !== "",
    };
  };

  const requestTypeDescription =
    requestType === "search"
      ? "Sie beschreiben Ihr Wunschfahrzeug, wir übernehmen die Suche und melden uns mit geprüften Angeboten."
      : "Sie übermitteln Ihre Fahrzeugdaten, wir prüfen den Markt und übernehmen den Verkauf.";

  return (
    <>
      <SEO
        title="Kontakt – Suchauftrag oder Verkaufsangebot"
        description="Hinterlegen Sie Ihren Suchauftrag für Ihr Traumfahrzeug oder bieten Sie uns Ihr aktuelles Fahrzeug zum Verkauf an. Persönliche Beratung unter 0176 41651086."
        keywords="Suchauftrag Fahrzeug, Auto Verkaufsangebot, Kontakt Autohandel, Fahrzeug Ankauf, Auto kaufen lassen"
      />

      <div className="min-h-screen flex-1 bg-crema px-4 py-12 text-nero sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="mb-10 border-b border-linea pb-9 sm:mb-12">
            <h1 className="titolo-pagina">Wir sind persönlich für Sie da.</h1>
            <p className="mt-5 max-w-xl text-lg text-asfalto">
              Hinterlegen Sie einen Suchauftrag oder bieten Sie uns Ihr Fahrzeug
              an. Beides dauert keine drei Minuten.
            </p>
          </header>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href="tel:+4917641651086"
              className="finestra-sm group flex items-center gap-4 border border-linea bg-crema-chiara p-5 transition-all hover:border-nero/25 active:scale-[0.99] sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rosso-wash text-rosso transition-colors group-hover:bg-rosso group-hover:text-crema-chiara">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-xs text-asfalto">Direkt anrufen</span>
                <span className="numeri block text-sm text-nero" style={{ fontWeight: 700 }}>
                  0176 41651086
                </span>
              </span>
            </a>

            <a
              href="mailto:gcn-farzeughandel@outlook.de"
              className="finestra-sm group flex items-center gap-4 border border-linea bg-crema-chiara p-5 transition-all hover:border-nero/25 active:scale-[0.99] sm:p-6"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rosso-wash text-rosso transition-colors group-hover:bg-rosso group-hover:text-crema-chiara">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-asfalto">E-Mail schreiben</span>
                <span className="block truncate text-sm text-nero" style={{ fontWeight: 700 }}>
                  gcn-farzeughandel@outlook.de
                </span>
              </span>
            </a>
          </div>

          <div className="finestra relative mb-8 h-40 overflow-hidden border border-linea sm:h-56">
            <AnimatePresence mode="sync">
              <motion.img
                key={requestType}
                src={requestType === "search" ? suchauftragImg : uebergabeImg}
                alt={
                  requestType === "search"
                    ? "Illustration: eine Lupe, unter der ein rotes Auto sichtbar wird"
                    : "Illustration: ein Autoschlüssel wird von einer Hand in eine andere gelegt"
                }
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>

          <div
            role="tablist"
            aria-label="Art der Anfrage"
            className="relative mb-3 flex rounded-full border border-linea bg-crema-chiara p-1.5"
          >
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 380, damping: 34 }}
              aria-hidden="true"
              className={`pointer-events-none absolute bottom-1.5 top-1.5 w-[calc(50%-0.375rem)] rounded-full bg-rosso ${
                requestType === "search" ? "left-1.5" : "left-1/2"
              }`}
            />
            <button
              type="button"
              role="tab"
              aria-selected={requestType === "search"}
              onClick={() => setRequestType("search")}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm transition-colors duration-200 ${
                requestType === "search" ? "text-crema-chiara" : "text-asfalto hover:text-nero"
              }`}
            >
              <Search className="h-4 w-4" aria-hidden="true" />
              Suchauftrag
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={requestType === "sell"}
              onClick={() => setRequestType("sell")}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm transition-colors duration-200 ${
                requestType === "sell" ? "text-crema-chiara" : "text-asfalto hover:text-nero"
              }`}
            >
              <Car className="h-4 w-4" aria-hidden="true" />
              Verkaufen
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={requestType}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="mb-8 px-1 text-sm text-asfalto"
            >
              {requestTypeDescription}
            </motion.p>
          </AnimatePresence>

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
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
                className="finestra border border-linea bg-crema-chiara p-6 sm:p-10"
              >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
                  <fieldset>
                    <legend className="mb-5 text-[17px]" style={{ fontWeight: 700 }}>
                      Persönliche Daten
                    </legend>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        id="firstName"
                        label="Vorname"
                        required
                        registration={register("firstName", rules.firstName)}
                        inputProps={{ type: "text", autoComplete: "given-name" }}
                        {...state("firstName")}
                      />
                      <Field
                        id="lastName"
                        label="Nachname"
                        required
                        registration={register("lastName", rules.lastName)}
                        inputProps={{ type: "text", autoComplete: "family-name" }}
                        {...state("lastName")}
                      />
                      <Field
                        id="email"
                        label="E-Mail-Adresse"
                        required
                        className="sm:col-span-2"
                        registration={register("email", rules.email)}
                        inputProps={{ type: "email", autoComplete: "email" }}
                        {...state("email")}
                      />
                      <Field
                        id="phone"
                        label="Telefonnummer"
                        hint="optional"
                        className="sm:col-span-2"
                        registration={register("phone", rules.phone)}
                        inputProps={{
                          type: "tel",
                          autoComplete: "tel",
                          placeholder: "+49 176 12345678",
                        }}
                        {...state("phone")}
                      />
                    </div>
                  </fieldset>

                  <fieldset className="border-t border-linea pt-6">
                    <legend className="mb-5 text-[17px]" style={{ fontWeight: 700 }}>
                      {requestType === "search" ? "Fahrzeugwünsche" : "Fahrzeugdaten"}
                    </legend>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field
                        id="brand"
                        label="Marke"
                        required
                        registration={register("brand", rules.brand)}
                        inputProps={{ type: "text", placeholder: "z. B. Volkswagen" }}
                        {...state("brand")}
                      />
                      <Field
                        id="model"
                        label="Modell"
                        required
                        registration={register("model", rules.model)}
                        inputProps={{ type: "text", placeholder: "z. B. Golf" }}
                        {...state("model")}
                      />

                      {requestType === "search" && (
                        <>
                          <Field
                            id="budget"
                            label="Budget in €"
                            hint="optional"
                            registration={register("budget", rules.budget)}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              placeholder: "25000",
                            }}
                            {...state("budget")}
                          />
                          <Field
                            id="year"
                            label="Baujahr ab"
                            hint="optional"
                            registration={register("year", rules.year(false))}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              maxLength: 4,
                              placeholder: "2018",
                            }}
                            {...state("year")}
                          />
                          <Field
                            id="maxMileage"
                            label="Maximaler Kilometerstand"
                            hint="optional"
                            registration={register("maxMileage", rules.numericOptional)}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              placeholder: "80000",
                            }}
                            {...state("maxMileage")}
                          />
                          <Field
                            id="color"
                            label="Farbwünsche"
                            hint="optional"
                            registration={register("color")}
                            inputProps={{ type: "text", placeholder: "Schwarz, Weiß" }}
                            {...state("color")}
                          />
                        </>
                      )}

                      {requestType === "sell" && (
                        <>
                          <Field
                            id="year"
                            label="Baujahr"
                            required
                            registration={register("year", rules.year(true))}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              maxLength: 4,
                              placeholder: "2019",
                            }}
                            {...state("year")}
                          />
                          <Field
                            id="power"
                            label="Leistung in PS"
                            required
                            registration={register("power", rules.numericRequired)}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              placeholder: "150",
                            }}
                            {...state("power")}
                          />
                          <Field
                            id="mileage"
                            label="Kilometerstand"
                            required
                            registration={register("mileage", rules.numericRequired)}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              placeholder: "92000",
                            }}
                            {...state("mileage")}
                          />
                          <Field
                            id="price"
                            label="Preisvorstellung in €"
                            hint="optional"
                            registration={register("price", rules.budget)}
                            inputProps={{
                              type: "text",
                              inputMode: "numeric",
                              placeholder: "15000",
                            }}
                            {...state("price")}
                          />
                        </>
                      )}

                      <Field
                        id="message"
                        label="Nachricht"
                        hint="optional"
                        className="sm:col-span-2"
                        textarea
                        registration={register("message")}
                        inputProps={{
                          placeholder:
                            requestType === "search"
                              ? "Weitere Wünsche, Ausstattung, Zeitrahmen"
                              : "Zustand, bekannte Mängel, Besonderheiten",
                        }}
                        {...state("message")}
                      />
                    </div>
                  </fieldset>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-rosso px-8 py-4 text-sm text-crema-chiara transition-all hover:bg-rosso-scuro active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? (
                        <>
                          <span
                            className="h-4 w-4 animate-spin rounded-full border-2 border-crema-chiara/30 border-t-crema-chiara"
                            aria-hidden="true"
                          />
                          Wird gesendet
                        </>
                      ) : (
                        <>
                          {requestType === "search" ? "Suchauftrag senden" : "Angebot senden"}
                          <Send className="h-4 w-4" aria-hidden="true" />
                        </>
                      )}
                    </button>
                    <p className="mt-3 text-center text-xs text-asfalto">
                      Mit <span className="text-rosso">*</span> markierte Felder sind
                      Pflichtfelder.
                    </p>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
