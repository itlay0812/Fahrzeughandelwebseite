import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { X, Phone, Mail, Clock, Send, CheckCircle, AlertCircle, User } from "lucide-react";
import { toast } from "sonner";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { sendInquiryEmail } from "/utils/emailjs";
import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type Car = {
  id: string;
  brand: string;
  model: string;
  year: string;
  price: string;
};

type InquiryFormData = {
  name: string;
  email: string;
  phone: string;
  availability: string;
  availabilityCustom?: string;
};

interface Props {
  car: Car | null;
  onClose: () => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          transition={{ duration: 0.16 }}
          className="flex items-center gap-1.5 text-red-500 text-xs mt-1.5 ml-1 overflow-hidden"
        >
          <AlertCircle className="w-3 h-3 shrink-0" />
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

const inputBase =
  "block w-full rounded-2xl py-3.5 px-5 text-black placeholder:text-gray-400 text-sm transition-all duration-200 focus:outline-none bg-white border";

function inputCls(hasError: boolean, isTouched: boolean, isEmpty: boolean) {
  if (hasError) return `${inputBase} border-red-400 focus:ring-2 focus:ring-red-100`;
  if (isTouched && !isEmpty) return `${inputBase} border-green-400/70 focus:ring-2 focus:ring-green-100`;
  return `${inputBase} border-black/10 focus:ring-2 focus:ring-black/10 focus:border-black/25`;
}

const AVAILABILITY_OPTIONS = [
  { value: "Morgens (8–12 Uhr)", label: "Morgens (8–12 Uhr)" },
  { value: "Mittags (12–15 Uhr)", label: "Mittags (12–15 Uhr)" },
  { value: "Nachmittags (15–18 Uhr)", label: "Nachmittags (15–18 Uhr)" },
  { value: "Abends (18–20 Uhr)", label: "Abends (18–20 Uhr)" },
  { value: "Jederzeit", label: "Jederzeit" },
  { value: "Sonstiges", label: "Andere Zeit angeben…" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function CarInquiryModal({ car, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, touchedFields },
  } = useForm<InquiryFormData>({ mode: "onTouched" });

  const watched = watch();
  const availabilityValue = watched.availability;

  // Reset form when car changes
  useEffect(() => {
    reset();
    setSubmitted(false);
  }, [car, reset]);

  // Prevent body scroll when modal open
  useEffect(() => {
    if (car) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [car]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const field = (name: keyof InquiryFormData) => {
    const hasError = !!errors[name];
    const isTouched = !!touchedFields[name];
    const val = watched[name];
    const isEmpty = !val || String(val).trim() === "";
    return inputCls(hasError, isTouched, isEmpty);
  };

  const onSubmit = async (data: InquiryFormData) => {
    if (!car) return;
    setIsSubmitting(true);
    const availability =
      data.availability === "Sonstiges" && data.availabilityCustom
        ? data.availabilityCustom
        : data.availability;
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            type: "car_inquiry",
            carId: car.id,
            carName: `${car.brand} ${car.model}`,
            carYear: car.year,
            carPrice: car.price,
            name: data.name,
            email: data.email,
            phone: data.phone,
            availability,
          }),
        }
      );
      if (!response.ok) throw new Error();

      try {
        await sendInquiryEmail({
          inquiryType: "car_inquiry",
          subject: `Neue Fahrzeuganfrage: ${car.brand} ${car.model}`,
          name: data.name,
          email: data.email,
          phone: data.phone,
          message: `Neue Anfrage zum Fahrzeug ${car.brand} ${car.model}`,
          carName: `${car.brand} ${car.model}`,
          carYear: car.year,
          carPrice: car.price,
          availability,
        });
      } catch (error) {
        console.error("EmailJS notification failed", error);
      }

      setSubmitted(true);
    } catch {
      toast.error("Es gab ein Problem. Bitte versuchen Sie es später erneut.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {car && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
            className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[101] px-0 sm:px-4"
          >
            <div
              className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[95dvh] sm:max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-black/8 shrink-0">
                <div>
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase mb-1">Interesse anmelden</p>
                  <h2 className="text-lg text-black" style={{ fontWeight: 600 }}>
                    {car.brand} {car.model}
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5">EZ {car.year} · {car.price}</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-[#f7f7f7] hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-black transition-colors shrink-0 ml-4 mt-0.5"
                  aria-label="Schließen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    /* ── Success ── */
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="flex flex-col items-center text-center gap-5 px-6 py-12"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22, delay: 0.08 }}
                        className="w-16 h-16 bg-black rounded-full flex items-center justify-center"
                      >
                        <CheckCircle className="w-8 h-8 text-white" strokeWidth={1.5} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg text-black mb-2" style={{ fontWeight: 600 }}>
                          Anfrage gesendet!
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                          Vielen Dank! Wir melden uns schnellstmöglich persönlich bei Ihnen – zum vereinbarten Zeitpunkt.
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="mt-2 px-6 py-3 rounded-2xl bg-black text-white text-sm hover:bg-gray-900 transition-colors"
                      >
                        Schließen
                      </button>
                    </motion.div>
                  ) : (
                    /* ── Form ── */
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      onSubmit={handleSubmit(onSubmit)}
                      className="px-6 py-6 space-y-4"
                      noValidate
                    >
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Hinterlassen Sie uns Ihre Kontaktdaten – wir melden uns zum gewünschten Zeitpunkt persönlich bei Ihnen bezüglich des Fahrzeugs.
                      </p>

                      {/* Name */}
                      <div>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                          <input
                            {...register("name", {
                              required: "Name ist erforderlich",
                              minLength: { value: 2, message: "Mindestens 2 Zeichen" },
                            })}
                            type="text"
                            placeholder="Vor- und Nachname *"
                            autoComplete="name"
                            className={`${field("name")} pl-11`}
                          />
                        </div>
                        <FieldError message={errors.name?.message} />
                      </div>

                      {/* E-Mail */}
                      <div>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                          <input
                            {...register("email", {
                              required: "E-Mail ist erforderlich",
                              pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                message: "Gültige E-Mail Adresse eingeben",
                              },
                            })}
                            type="email"
                            placeholder="E-Mail Adresse *"
                            autoComplete="email"
                            className={`${field("email")} pl-11`}
                          />
                        </div>
                        <FieldError message={errors.email?.message} />
                      </div>

                      {/* Telefon */}
                      <div>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                          <input
                            {...register("phone", {
                              required: "Telefonnummer ist erforderlich",
                              pattern: {
                                value: /^[+\d\s\-()]{6,20}$/,
                                message: "Ungültiges Format (z.B. +49 176 123456)",
                              },
                            })}
                            type="tel"
                            placeholder="Telefonnummer *"
                            autoComplete="tel"
                            className={`${field("phone")} pl-11`}
                          />
                        </div>
                        <FieldError message={errors.phone?.message} />
                      </div>

                      {/* Erreichbarkeit */}
                      <div>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                          <select
                            {...register("availability", { required: "Bitte Erreichbarkeit wählen" })}
                            className={`${field("availability")} pl-11 appearance-none cursor-pointer`}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Bester Erreichbarkeitszeitpunkt *
                            </option>
                            {AVAILABILITY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <FieldError message={errors.availability?.message} />
                      </div>

                      {/* Custom time input (only when "Sonstiges" selected) */}
                      <AnimatePresence>
                        {availabilityValue === "Sonstiges" && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: "easeOut" }}
                            className="overflow-hidden"
                          >
                            <input
                              {...register("availabilityCustom", {
                                required:
                                  availabilityValue === "Sonstiges"
                                    ? "Bitte Zeitpunkt angeben"
                                    : false,
                              })}
                              type="text"
                              placeholder="z.B. Dienstag ab 17 Uhr"
                              className={field("availabilityCustom")}
                            />
                            <FieldError message={errors.availabilityCustom?.message} />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm text-white bg-black hover:bg-gray-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all active:scale-[0.98] mt-2"
                      >
                        {isSubmitting ? (
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            Anfrage senden
                            <Send className="w-4 h-4" />
                          </>
                        )}
                      </button>

                      <p className="text-center text-gray-400 text-xs pb-2">
                        Mit * markierte Felder sind Pflichtfelder
                      </p>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
