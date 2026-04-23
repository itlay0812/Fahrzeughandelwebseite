import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  Calendar,
  Trash2,
  Search,
  Car,
  AlertCircle,
  LogOut,
  Lock,
  User,
  Gauge,
  Euro,
  Palette,
  MessageSquare,
  ArrowUpRight,
  Save,
  FileText,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import logoImg from "../../assets/87104b765c1a1399e8e4b2a45f3225515652a099.png";
import { motion, AnimatePresence } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const supabase = createClient(`https://${projectId}.supabase.co`, publicAnonKey);

// ─── HELPERS ───────────────────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
} as const;

function DataRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-1">{label}</span>
      <p className="text-black text-sm">{value}</p>
    </div>
  );
}

function normalizeText(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

const DEFAULT_DOC_FOLDERS = ["Kundendokumente", "Rechnungen"];
const CUSTOM_TAG_VALUE = "__custom__";

type FinanceChartPoint = {
  dateKey: string;
  dateLabel: string;
  umsatz: number;
  gewinn: number;
  kosten: number;
};

function asNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseNonNegativeNumber(value: unknown): number {
  const normalized = String(value ?? "").trim().replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function getSubmissionRevenue(submission: any): number {
  const salePrice = asNumber(submission.salePrice ?? submission.revenue ?? 0);
  const purchasePrice = asNumber(submission.purchasePrice ?? submission.costPrice ?? 0);
  return salePrice - purchasePrice;
}

function getSubmissionProfit(submission: any): number {
  return asNumber(submission.profit ?? 0);
}

function getSubmissionCosts(submission: any): number {
  return asNumber(submission.costs ?? 0);
}

function formatDateKey(value: string) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function buildDailyFinanceSeries(items: any[]): FinanceChartPoint[] {
  const dailyMap = new Map<string, FinanceChartPoint>();

  items.forEach((item) => {
    const date = new Date(item.createdAt);
    if (Number.isNaN(date.getTime())) return;

    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    if (!dailyMap.has(key)) {
      dailyMap.set(key, {
        dateKey: key,
        dateLabel: formatDateKey(key),
        umsatz: 0,
        gewinn: 0,
        kosten: 0,
      });
    }

    const current = dailyMap.get(key)!;
    current.umsatz += getSubmissionRevenue(item);
    current.gewinn += getSubmissionProfit(item);
    current.kosten += getSubmissionCosts(item);
  });

  return Array.from(dailyMap.values()).sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}

function formatEuro(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(value);
}

const LOGIN_GUARD_KEY = "gcn_admin_login_guard_v1";
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 5;
const LOGIN_LOCK_MINUTES = [5, 15, 30, 60] as const;

type LoginGuardState = {
  attemptCount: number;
  windowStart: number;
  lockUntil: number;
  penaltyLevel: number;
};

const DEFAULT_LOGIN_GUARD: LoginGuardState = {
  attemptCount: 0,
  windowStart: 0,
  lockUntil: 0,
  penaltyLevel: 0,
};

function readLoginGuard(): LoginGuardState {
  if (typeof window === "undefined") return DEFAULT_LOGIN_GUARD;
  try {
    const raw = window.localStorage.getItem(LOGIN_GUARD_KEY);
    if (!raw) return DEFAULT_LOGIN_GUARD;
    const parsed = JSON.parse(raw);
    return {
      attemptCount: asNumber(parsed?.attemptCount),
      windowStart: asNumber(parsed?.windowStart),
      lockUntil: asNumber(parsed?.lockUntil),
      penaltyLevel: asNumber(parsed?.penaltyLevel),
    };
  } catch {
    return DEFAULT_LOGIN_GUARD;
  }
}

function writeLoginGuard(state: LoginGuardState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOGIN_GUARD_KEY, JSON.stringify(state));
}

function formatLockTime(ms: number): string {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;
  return `${minutesPart}:${String(secondsPart).padStart(2, "0")}`;
}

function getTodayInputDate(): string {
  return new Date().toISOString().slice(0, 10);
}

function FinanceTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const revenue = asNumber(payload.find((item: any) => item.dataKey === "umsatz")?.value);
  const profit = asNumber(payload.find((item: any) => item.dataKey === "gewinn")?.value);
  const costs = asNumber(payload.find((item: any) => item.dataKey === "kosten")?.value);

  return (
    <div className="rounded-xl border border-black/10 bg-white px-3 py-2 shadow-sm">
      <p className="text-xs text-gray-500 mb-1">{formatDateKey(String(label || ""))}</p>
      <p className="text-xs text-gray-700">Umsatz: <span className="text-black" style={{ fontWeight: 600 }}>{formatEuro(revenue)}</span></p>
      <p className="text-xs text-gray-700">Gewinn: <span className="text-black" style={{ fontWeight: 600 }}>{formatEuro(profit)}</span></p>
      <p className="text-xs text-gray-700">Kosten: <span className="text-black" style={{ fontWeight: 600 }}>{formatEuro(costs)}</span></p>
    </div>
  );
}

function FinanceTrendChart({ data }: { data: FinanceChartPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-sm text-gray-400">
        Keine Finanzwerte vorhanden.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="dateKey"
          tickFormatter={(value) => formatDateKey(String(value))}
          tick={{ fontSize: 12 }}
          minTickGap={28}
        />
        <YAxis
          tickFormatter={(value) => `${Math.round(asNumber(value) / 1000)}k`}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<FinanceTooltip />} />
        <Legend />
        <Line
          type="monotone"
          dataKey="umsatz"
          name="Umsatz"
          stroke="#111827"
          strokeWidth={2.4}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="gewinn"
          name="Gewinn"
          stroke="#16a34a"
          strokeWidth={2.4}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="kosten"
          name="Kosten"
          stroke="#dc2626"
          strokeWidth={2.4}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── LOGIN SCREEN ──────────────────────────────────────────────────────────────

function LoginScreen({
  onLogin,
  lockedUntil,
}: {
  onLogin: (email: string, password: string) => Promise<void>;
  lockedUntil: number;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [now, setNow] = useState(Date.now());

  const remainingMs = Math.max(0, lockedUntil - now);
  const isLocked = remainingMs > 0;

  useEffect(() => {
    if (!isLocked) return;
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [isLocked]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setIsLoggingIn(true);
    try {
      await onLogin(email, password);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const inputCls =
    "block w-full rounded-2xl border border-black/10 py-3.5 px-5 bg-[#f7f7f7] text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm transition-all";

  return (
    <div className="flex-1 min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div {...fadeUp} className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={logoImg} alt="GCN Fahrzeughandel GbR" className="h-12 w-auto object-contain" />
        </div>

        {/* Card */}
        <div className="bg-[#f7f7f7] border border-black/8 rounded-3xl p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-2">Interner Bereich</p>
            <h1 className="text-2xl text-black" style={{ fontWeight: 300 }}>
              Willkommen zurück.
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isLocked ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                Zu viele Fehlversuche. Neuer Login in {formatLockTime(remainingMs)}.
              </div>
            ) : null}

            <div>
              <label className="block text-xs tracking-wide text-gray-500 uppercase mb-2">
                E-Mail
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@gcn-fahrzeughandel.de"
                  className={`${inputCls} pl-11`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-wide text-gray-500 uppercase mb-2">
                Passwort
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputCls} pl-11`}
                />
              </div>
            </div>

            {/* PRIMARY button */}
            <button
              type="submit"
              disabled={isLoggingIn || isLocked}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm text-white bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isLocked ? (
                "Temporär gesperrt"
              ) : (
                "Einloggen"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            Nur für autorisiertes Personal.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── SUBMISSION CARD ───────────────────────────────────────────────────────────

function SubmissionCard({
  sub,
  onDelete,
  onUpdateMeta,
  onUploadDocument,
  onDeleteDocument,
  showSectionConnector = false,
}: {
  sub: any;
  onDelete: (id: string) => void;
  onUpdateMeta: (
    id: string,
    payload: {
      status?: "unbearbeitet" | "in_progress" | "abgeschlossen";
      internalNotes?: string;
      purchasePrice?: number;
      salePrice?: number;
      costs?: number;
      profit?: number;
    },
  ) => Promise<void>;
  onUploadDocument: (id: string, displayName: string, file: File, folder: string, documentDate: string) => Promise<void>;
  onDeleteDocument: (id: string, docId: string) => Promise<void>;
  showSectionConnector?: boolean;
}) {
  const isSearch = sub.type === "search";
  const isInventorySale = sub.type === "inventory_sale";
  const submissionLabel = isSearch
    ? "Suchauftrag"
    : isInventorySale
      ? "Bestandsverkauf"
      : "Verkaufsangebot";
  const [status, setStatus] = useState<"unbearbeitet" | "in_progress" | "abgeschlossen">(sub.status || "unbearbeitet");
  const [internalNotes, setInternalNotes] = useState(sub.internalNotes || "");
  const [purchasePrice, setPurchasePrice] = useState(String(Number(sub.purchasePrice ?? sub.costPrice ?? 0)));
  const [salePrice, setSalePrice] = useState(String(Number(sub.salePrice ?? sub.revenue ?? 0)));
  const [costs, setCosts] = useState(String(Number(sub.costs || 0)));
  const [profit, setProfit] = useState(String(Number(sub.profit || 0)));
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [docName, setDocName] = useState("");
  const [docFile, setDocFile] = useState<File | null>(null);
  const [docFolderMode, setDocFolderMode] = useState<string>(DEFAULT_DOC_FOLDERS[0]);
  const [customDocTag, setCustomDocTag] = useState("");
  const [docDate, setDocDate] = useState(new Date().toISOString().slice(0, 10));
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [selectedDocFolder, setSelectedDocFolder] = useState("Alle");
  const [isCardExpanded, setIsCardExpanded] = useState(true);

  const existingDocumentFolders = Array.from(
    new Set((sub.documents || []).map((doc: any) => String(doc.folder || "Kundendokumente").trim()).filter(Boolean)),
  ) as string[];
  const uploadFolderOptions = Array.from(new Set([...DEFAULT_DOC_FOLDERS, ...existingDocumentFolders])) as string[];

  useEffect(() => {
    setStatus(sub.status || "unbearbeitet");
    setInternalNotes(sub.internalNotes || "");
    setPurchasePrice(String(Number(sub.purchasePrice ?? sub.costPrice ?? 0)));
    setSalePrice(String(Number(sub.salePrice ?? sub.revenue ?? 0)));
    setCosts(String(Number(sub.costs || 0)));
    setProfit(String(Number(sub.profit || 0)));
  }, [sub.status, sub.internalNotes, sub.purchasePrice, sub.costPrice, sub.salePrice, sub.revenue, sub.costs, sub.profit]);

  useEffect(() => {
    setSelectedDocFolder("Alle");
    setDocFolderMode(DEFAULT_DOC_FOLDERS[0]);
    setCustomDocTag("");
    setIsCardExpanded(true);
  }, [sub.id]);

  useEffect(() => {
    if (selectedDocFolder !== "Alle" && !existingDocumentFolders.includes(selectedDocFolder)) {
      setSelectedDocFolder("Alle");
    }
  }, [selectedDocFolder, existingDocumentFolders]);

  useEffect(() => {
    const parsedPurchasePrice = Number(purchasePrice.replace(",", "."));
    const parsedSalePrice = Number(salePrice.replace(",", "."));
    const parsedCosts = Number(costs.replace(",", "."));

    if (Number.isFinite(parsedPurchasePrice) && Number.isFinite(parsedSalePrice) && Number.isFinite(parsedCosts)) {
      setProfit(String(parsedSalePrice - parsedPurchasePrice - parsedCosts));
    }
  }, [purchasePrice, salePrice, costs]);

  const handleSaveMeta = async () => {
    const parsedPurchasePrice = Number(purchasePrice.replace(",", "."));
    const parsedSalePrice = Number(salePrice.replace(",", "."));
    const parsedCosts = Number(costs.replace(",", "."));
    if (!Number.isFinite(parsedPurchasePrice) || parsedPurchasePrice < 0) {
      toast.error("Kaufpreis muss eine Zahl >= 0 sein.");
      return;
    }
    if (!Number.isFinite(parsedSalePrice) || parsedSalePrice < 0) {
      toast.error("Verkaufspreis muss eine Zahl >= 0 sein.");
      return;
    }
    if (!Number.isFinite(parsedCosts) || parsedCosts < 0) {
      toast.error("Kosten müssen eine Zahl >= 0 sein.");
      return;
    }

    const computedProfit = parsedSalePrice - parsedPurchasePrice - parsedCosts;
    if (!Number.isFinite(computedProfit)) {
      toast.error("Gewinn muss eine gültige Zahl sein.");
      return;
    }

    setIsSavingMeta(true);
    try {
      await onUpdateMeta(sub.id, {
        status,
        internalNotes,
        purchasePrice: parsedPurchasePrice,
        salePrice: parsedSalePrice,
        costs: parsedCosts,
        profit: computedProfit,
      });
      setProfit(String(computedProfit));
      toast.success("Status, Notizen und Finanzdaten gespeichert.");
    } catch {
      toast.error("Speichern fehlgeschlagen.");
    } finally {
      setIsSavingMeta(false);
    }
  };

  const handleUploadDocument = async () => {
    if (!docName.trim()) {
      toast.error("Bitte einen Dokumentnamen eingeben.");
      return;
    }
    if (!docFile) {
      toast.error("Bitte eine Datei auswählen.");
      return;
    }

    const effectiveFolder = docFolderMode === CUSTOM_TAG_VALUE ? customDocTag.trim() : docFolderMode.trim();
    if (!effectiveFolder) {
      toast.error("Bitte einen Tag auswählen oder eingeben.");
      return;
    }

    setIsUploadingDoc(true);
    try {
      await onUploadDocument(sub.id, docName.trim(), docFile, effectiveFolder, docDate);
      setDocName("");
      setDocFile(null);
      setDocFolderMode(DEFAULT_DOC_FOLDERS[0]);
      setCustomDocTag("");
      toast.success("Dokument hochgeladen.");
    } catch {
      toast.error("Upload fehlgeschlagen.");
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const statusBadgeClass =
    status === "abgeschlossen"
      ? "bg-green-50 text-green-700 border-green-200"
      : status === "in_progress"
        ? "bg-amber-50 text-amber-700 border-amber-200"
        : "bg-gray-50 text-gray-700 border-gray-200";

  const visibleDocuments = selectedDocFolder === "Alle"
    ? (sub.documents || [])
    : (sub.documents || []).filter((doc: any) => (doc.folder || "Kundendokumente") === selectedDocFolder);
  const documentTags: Array<{ label: string; active: boolean }> = [
    { label: "Alle", active: selectedDocFolder === "Alle" },
    ...existingDocumentFolders.map((folder) => ({ label: folder, active: selectedDocFolder === folder })),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="relative bg-white border border-black/8 rounded-3xl p-6 sm:p-8 hover:shadow-md transition-shadow"
    >
      {showSectionConnector ? (
        <div className="absolute top-10 -right-10 h-px w-10 bg-black/10" aria-hidden="true" />
      ) : null}

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-black/6">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-[#f7f7f7] border border-black/6 flex items-center justify-center shrink-0">
            {isSearch ? (
              <Search className="w-5 h-5 text-gray-600" />
            ) : (
              <Car className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div className="min-w-0">
            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
              {submissionLabel}
            </span>
            <div className={`inline-flex mt-1 px-2.5 py-1 rounded-full border text-[11px] tracking-wide ${statusBadgeClass}`}>
              {status === "unbearbeitet" ? "Unbearbeitet" : status === "in_progress" ? "In Progress" : "Abgeschlossen"}
            </div>
            <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(sub.createdAt).toLocaleString("de-DE", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>

        {/* Delete — tertiary destructive */}
        <div className="self-end sm:self-auto flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsCardExpanded((prev) => !prev)}
            className="p-2 rounded-xl text-gray-500 hover:text-black hover:bg-black/5 transition-colors"
            title={isCardExpanded ? "Eintrag einklappen" : "Eintrag ausklappen"}
          >
            {isCardExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={() => onDelete(sub.id)}
            className="p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Anfrage löschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {isCardExpanded ? (
          <motion.div
            key="card-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
          >

        {/* Person */}
        <div className="space-y-4">
          <div>
            <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Kontaktperson</span>
            <p className="text-black" style={{ fontWeight: 600 }}>
              {sub.firstName || sub["first-name"]} {sub.lastName || sub["last-name"]}
            </p>
          </div>
          <div className="space-y-2">
            <a
              href={`mailto:${sub.email}`}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors group"
            >
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              {sub.email}
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
            {sub.phone && (
              <a
                href={`tel:${sub.phone}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-black transition-colors group"
              >
                <Phone className="w-3.5 h-3.5 text-gray-400" />
                {sub.phone}
                <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </div>

        {/* Vehicle */}
        <div className="space-y-4">
          <div>
            <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Fahrzeug</span>
            <p className="text-black" style={{ fontWeight: 600 }}>
              {sub.brand} {sub.model}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {isSearch ? (
              <>
                {sub.budget && (
                  <DataRow label="Max. Budget" value={`${sub.budget} €`} />
                )}
                {sub.year && <DataRow label="Baujahr ab" value={sub.year} />}
                {(sub.maxMileage || sub["max-mileage"]) && (
                  <DataRow label="Max. KM" value={`${sub.maxMileage || sub["max-mileage"]} km`} />
                )}
                {sub.color && <DataRow label="Farben" value={sub.color} />}
              </>
            ) : (
              <>
                {sub.year && <DataRow label="Baujahr" value={sub.year} />}
                {sub.power && <DataRow label="Leistung" value={`${sub.power} PS`} />}
                {sub.mileage && (
                  <DataRow label="Kilometerstand" value={`${sub.mileage} km`} />
                )}
                {isInventorySale && sub.purchasePrice !== undefined && (
                  <DataRow label="Einkauf" value={formatEuro(asNumber(sub.purchasePrice))} />
                )}
                {isInventorySale && sub.salePrice !== undefined && (
                  <DataRow label="Verkauf" value={formatEuro(asNumber(sub.salePrice))} />
                )}
                {sub.price && <DataRow label="Preisvorstellung" value={`${sub.price} €`} />}
              </>
            )}
          </div>
        </div>

        {/* Message */}
        {sub.message && (
          <div className="md:col-span-2 bg-[#f7f7f7] rounded-2xl p-5 border border-black/6">
            <span className="flex items-center gap-1.5 text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">
              <MessageSquare className="w-3 h-3" />
              Kommentar / Details
            </span>
            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">{sub.message}</p>
          </div>
        )}

        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-black/10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <span className="text-xs tracking-[0.15em] text-gray-400 uppercase">Bearbeitung</span>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "unbearbeitet" | "in_progress" | "abgeschlossen")}
                className="rounded-xl border border-black/12 bg-[#f7f7f7] px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              >
                <option value="unbearbeitet">Unbearbeitet</option>
                <option value="in_progress">In Progress</option>
                <option value="abgeschlossen">Abgeschlossen</option>
              </select>
              <button
                type="button"
                onClick={handleSaveMeta}
                disabled={isSavingMeta}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-black/15 text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-60"
              >
                <Save className="w-3.5 h-3.5" />
                {isSavingMeta ? "Speichert..." : "Speichern"}
              </button>
            </div>
          </div>

          <div>
            <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Interne Notizen</span>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Interne Notizen nur für das Adminpanel..."
              className="w-full h-36 overflow-y-auto rounded-2xl border border-black/10 bg-[#f7f7f7] p-4 text-sm text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <div>
              <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Kaufpreis (EUR)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                onBlur={handleSaveMeta}
                className="w-full rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Verkaufspreis (EUR)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                onBlur={handleSaveMeta}
                className="w-full rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Kosten (EUR)</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={costs}
                onChange={(e) => setCosts(e.target.value)}
                onBlur={handleSaveMeta}
                className="w-full rounded-2xl border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-sm text-black focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            <div>
              <span className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Gewinn (EUR)</span>
              <div className={`w-full rounded-2xl border px-4 py-2.5 text-sm font-semibold ${Number(profit) < 0 ? "border-red-200 bg-red-50 text-red-700" : "border-green-200 bg-green-50 text-green-700"}`}>
                {Number.isFinite(Number(profit)) ? formatEuro(Number(profit)) : formatEuro(0)}
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-2xl p-5 border border-black/10">
          <span className="flex items-center gap-1.5 text-xs tracking-[0.15em] text-gray-400 uppercase mb-3">
            <FileText className="w-3.5 h-3.5" />
            Dokumente
          </span>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="Dokumentname (z.B. Kaufvertrag)"
              className="md:col-span-1 rounded-xl border border-black/10 bg-[#f7f7f7] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <select
              value={docFolderMode}
              onChange={(e) => setDocFolderMode(e.target.value)}
              className="rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              {uploadFolderOptions.map((folder) => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
              <option value={CUSTOM_TAG_VALUE}>Eigener Tag...</option>
            </select>
            {docFolderMode === CUSTOM_TAG_VALUE && (
              <input
                type="text"
                value={customDocTag}
                onChange={(e) => setCustomDocTag(e.target.value)}
                placeholder="Eigenen Tag eingeben"
                className="rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            )}
            <input
              type="date"
              value={docDate}
              onChange={(e) => setDocDate(e.target.value)}
              className="rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
            <div className="md:col-span-1">
              <input
                type="file"
                onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                className="w-full rounded-xl border border-black/10 bg-[#f7f7f7] px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-xs file:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 truncate" title={docFile?.name || "Keine Datei ausgewählt"}>
                {docFile?.name || "Keine Datei ausgewählt"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleUploadDocument}
              disabled={isUploadingDoc}
              className="md:col-span-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-black text-white text-sm hover:bg-gray-900 transition-colors disabled:opacity-60"
            >
              <Upload className="w-4 h-4" />
              {isUploadingDoc ? "Lädt hoch..." : "Dokument hochladen"}
            </button>
          </div>

          <div className="flex items-center justify-between gap-3 mb-3">
            <p className="text-xs tracking-[0.15em] text-gray-400 uppercase">Tags zum Filtern</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {documentTags.map((tag) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setSelectedDocFolder(tag.label)}
                className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${tag.active ? "bg-black text-white border-black" : "bg-[#f7f7f7] text-gray-600 border-black/10 hover:border-black/20"}`}
              >
                {tag.label}
              </button>
            ))}
          </div>

          {visibleDocuments.length === 0 ? (
            <p className="text-sm text-gray-400">Noch keine Dokumente hinterlegt.</p>
          ) : (
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              {visibleDocuments.map((doc: any) => (
                <div key={doc.id} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-black/8 bg-[#f7f7f7]">
                  <div className="min-w-0">
                    <p className="text-sm text-black truncate" style={{ fontWeight: 600 }}>{doc.displayName}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border border-black/10 bg-white text-gray-700">
                        {doc.folder || "Kundendokumente"}
                      </span>
                      <span className="text-xs text-gray-400">
                        {doc.dateSegment || "-"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{doc.fileName} • {Math.max(1, Math.round((doc.size || 0) / 1024))} KB</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2.5 py-1.5 rounded-lg border border-black/15 hover:bg-black hover:text-white transition-colors"
                    >
                      Öffnen
                    </a>
                    <button
                      type="button"
                      onClick={() => onDeleteDocument(sub.id, doc.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Dokument löschen"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────

export function Admin() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [loginGuard, setLoginGuard] = useState<LoginGuardState>(() => readLoginGuard());
  const [searchFilter, setSearchFilter] = useState("");
  const [sellFilter, setSellFilter] = useState("");
  const [inventoryFilter, setInventoryFilter] = useState("");
  const [isSearchSectionCollapsed, setIsSearchSectionCollapsed] = useState(false);
  const [isSellSectionCollapsed, setIsSellSectionCollapsed] = useState(false);
  const [isInventorySectionCollapsed, setIsInventorySectionCollapsed] = useState(false);
  const [isManualCreateCollapsed, setIsManualCreateCollapsed] = useState(false);
  const [isOrderDashboardCollapsed, setIsOrderDashboardCollapsed] = useState(false);
  const [isCreatingSubmission, setIsCreatingSubmission] = useState(false);

  const [manualType, setManualType] = useState<"search" | "sell" | "inventory_sale">("inventory_sale");
  const [manualReceivedDate, setManualReceivedDate] = useState(getTodayInputDate());
  const [manualFirstName, setManualFirstName] = useState("");
  const [manualLastName, setManualLastName] = useState("");
  const [manualEmail, setManualEmail] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualBrand, setManualBrand] = useState("");
  const [manualModel, setManualModel] = useState("");
  const [manualYear, setManualYear] = useState("");
  const [manualPower, setManualPower] = useState("");
  const [manualMileage, setManualMileage] = useState("");
  const [manualBudget, setManualBudget] = useState("");
  const [manualMaxMileage, setManualMaxMileage] = useState("");
  const [manualColor, setManualColor] = useState("");
  const [manualSellPrice, setManualSellPrice] = useState("");
  const [manualPurchasePrice, setManualPurchasePrice] = useState("");
  const [manualCosts, setManualCosts] = useState("");
  const [manualMessage, setManualMessage] = useState("");

  const persistLoginGuard = (next: LoginGuardState) => {
    setLoginGuard(next);
    writeLoginGuard(next);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
      if (session) {
        fetchSubmissions(session.access_token);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchSubmissions(session.access_token);
      } else {
        setSubmissions([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);


  const fetchSubmissions = async (token: string) => {
    setIsFetching(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": token,
          },
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Fehler beim Laden");
      }
      const data = await response.json();
      setSubmissions(data.items || []);
    } catch (error: any) {
      toast.error(error.message || "Fehler beim Laden der Anfragen.");
    } finally {
      setIsFetching(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const now = Date.now();
    if (loginGuard.lockUntil > now) {
      const waitMs = loginGuard.lockUntil - now;
      toast.error(`Zu viele Fehlversuche. Bitte ${formatLockTime(waitMs)} warten.`);
      throw new Error("Login temporaer gesperrt");
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const isWindowExpired = now - loginGuard.windowStart > LOGIN_WINDOW_MS;
      const attemptCount = isWindowExpired ? 1 : loginGuard.attemptCount + 1;
      const windowStart = isWindowExpired ? now : loginGuard.windowStart;
      const shouldLock = attemptCount >= LOGIN_MAX_ATTEMPTS;

      if (shouldLock) {
        const nextPenaltyLevel = Math.min(loginGuard.penaltyLevel + 1, LOGIN_LOCK_MINUTES.length);
        const lockMinutes = LOGIN_LOCK_MINUTES[nextPenaltyLevel - 1];
        persistLoginGuard({
          attemptCount: 0,
          windowStart: now,
          lockUntil: now + lockMinutes * 60 * 1000,
          penaltyLevel: nextPenaltyLevel,
        });
        toast.error(`Login gesperrt. Zu viele Fehlversuche (${lockMinutes} Min. Wartezeit).`);
      } else {
        persistLoginGuard({
          ...loginGuard,
          attemptCount,
          windowStart,
          lockUntil: 0,
        });
        const attemptsLeft = LOGIN_MAX_ATTEMPTS - attemptCount;
        toast.error(`Login fehlgeschlagen. Noch ${attemptsLeft} Versuche bis zur Sperre.`);
      }

      throw error;
    }

    persistLoginGuard(DEFAULT_LOGIN_GUARD);
    toast.success("Erfolgreich eingeloggt.");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Erfolgreich abgemeldet.");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Anfrage wirklich löschen?")) return;
    const secondConfirm = prompt("Bitte zur Bestätigung LOESCHEN eingeben:");
    if (secondConfirm !== "LOESCHEN") {
      toast.error("Löschen abgebrochen.");
      return;
    }
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": session.access_token,
          },
        }
      );
      if (!response.ok) throw new Error();
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      toast.success("Anfrage gelöscht.");
    } catch {
      toast.error("Fehler beim Löschen.");
    }
  };

  const handleUpdateMeta = async (
    id: string,
    payload: {
      status?: "unbearbeitet" | "in_progress" | "abgeschlossen";
      internalNotes?: string;
      purchasePrice?: number;
      salePrice?: number;
      costs?: number;
      profit?: number;
    },
  ) => {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions/${id}/meta`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
          "X-User-Token": session.access_token,
        },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      throw new Error("Update failed");
    }

    const data = await response.json();
    setSubmissions((prev) => prev.map((item) => (item.id === id ? data.submission : item)));
  };

  const handleUploadDocument = async (id: string, displayName: string, file: File, folder: string, documentDate: string) => {
    const formData = new FormData();
    formData.append("displayName", displayName);
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("documentDate", documentDate);

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions/${id}/documents`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "X-User-Token": session.access_token,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    setSubmissions((prev) => prev.map((item) => (item.id === id ? data.submission : item)));
  };

  const handleDeleteDocument = async (id: string, docId: string) => {
    if (!confirm("Dokument wirklich löschen?")) return;

    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions/${id}/documents/${docId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
          "X-User-Token": session.access_token,
        },
      },
    );

    if (!response.ok) {
      toast.error("Dokument konnte nicht gelöscht werden.");
      return;
    }

    const data = await response.json();
    setSubmissions((prev) => prev.map((item) => (item.id === id ? data.submission : item)));
    toast.success("Dokument gelöscht.");
  };

  const resetManualForm = () => {
    setManualType("inventory_sale");
    setManualReceivedDate(getTodayInputDate());
    setManualFirstName("");
    setManualLastName("");
    setManualEmail("");
    setManualPhone("");
    setManualBrand("");
    setManualModel("");
    setManualYear("");
    setManualPower("");
    setManualMileage("");
    setManualBudget("");
    setManualMaxMileage("");
    setManualColor("");
    setManualSellPrice("");
    setManualPurchasePrice("");
    setManualCosts("");
    setManualMessage("");
  };

  const handleCreateSubmission = async () => {
    if (!manualFirstName.trim() || !manualLastName.trim()) {
      toast.error("Bitte Vor- und Nachname angeben.");
      return;
    }
    if (!manualEmail.trim()) {
      toast.error("Bitte E-Mail angeben.");
      return;
    }
    if (!manualBrand.trim() || !manualModel.trim()) {
      toast.error("Bitte Marke und Modell angeben.");
      return;
    }

    const purchasePrice = parseNonNegativeNumber(manualPurchasePrice);
    const salePrice = parseNonNegativeNumber(manualSellPrice);
    const costs = parseNonNegativeNumber(manualCosts);
    const profit = salePrice - purchasePrice - costs;

    const payload: Record<string, unknown> = {
      type: manualType,
      source: "admin_manual",
      createdAt: manualReceivedDate ? `${manualReceivedDate}T12:00:00.000Z` : undefined,
      firstName: manualFirstName.trim(),
      lastName: manualLastName.trim(),
      email: manualEmail.trim(),
      phone: manualPhone.trim(),
      brand: manualBrand.trim(),
      model: manualModel.trim(),
      year: manualYear.trim(),
      power: manualPower.trim(),
      mileage: manualMileage.trim(),
      message: manualMessage.trim(),
      purchasePrice,
      salePrice,
      costs,
      profit,
      price: manualType === "sell" ? manualSellPrice.trim() : undefined,
      budget: manualType === "search" ? manualBudget.trim() : undefined,
      maxMileage: manualType === "search" ? manualMaxMileage.trim() : undefined,
      color: manualType === "search" ? manualColor.trim() : undefined,
    };

    setIsCreatingSubmission(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/submissions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
            "X-User-Token": session.access_token,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Anlegen fehlgeschlagen");
      }

      const data = await response.json();
      if (data?.submission) {
        setSubmissions((prev) => [data.submission, ...prev]);
      } else {
        await fetchSubmissions(session.access_token);
      }
      toast.success("Auftrag erfolgreich angelegt.");
      resetManualForm();
    } catch (error: any) {
      toast.error(error.message || "Auftrag konnte nicht angelegt werden.");
    } finally {
      setIsCreatingSubmission(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-white">
        <div className="w-7 h-7 border-2 border-black/20 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  // Login
  if (!session) {
    return <LoginScreen onLogin={handleLogin} lockedUntil={loginGuard.lockUntil} />;
  }

  // Dashboard
  const matchesName = (sub: any, filterText: string) => {
    const normalizedFilter = normalizeText(filterText);
    if (!normalizedFilter) return true;
    const firstName = normalizeText(sub.firstName || sub["first-name"]);
    const lastName = normalizeText(sub.lastName || sub["last-name"]);
    const fullName = `${firstName} ${lastName}`.trim();
    const fallbackName = normalizeText(sub.name);
    return fullName.includes(normalizedFilter) || fallbackName.includes(normalizedFilter);
  };

  const searchSubmissions = submissions.filter((s) => s.type === "search" && matchesName(s, searchFilter));
  const sellSubmissions = submissions.filter((s) => s.type === "sell" && matchesName(s, sellFilter));
  const inventorySalesSubmissions = submissions.filter((s) => s.type === "inventory_sale" && matchesName(s, inventoryFilter));
  const completedSubmissionsCount = submissions.filter((s) => s.status === "abgeschlossen").length;
  const completedSubmissions = submissions.filter((sub) => sub.status === "abgeschlossen");
  const orderSaleTotal = completedSubmissions.reduce((sum, sub) => sum + getSubmissionRevenue(sub), 0);
  const orderRequestedSaleTotal = completedSubmissions
    .filter((sub) => sub.type === "sell")
    .reduce((sum, sub) => sum + asNumber(sub.price), 0);
  const orderPurchaseTotal = completedSubmissions.reduce((sum, sub) => sum + asNumber(sub.purchasePrice ?? sub.costPrice ?? 0), 0);
  const orderCostsTotal = completedSubmissions.reduce((sum, sub) => sum + asNumber(sub.costs || 0), 0);
  const orderProfitTotal = completedSubmissions.reduce((sum, sub) => sum + getSubmissionProfit(sub), 0);
  const ordersWithFinance = completedSubmissions.filter(
    (sub) => getSubmissionRevenue(sub) !== 0 || getSubmissionProfit(sub) !== 0,
  ).length;
  const orderFinanceChartData = buildDailyFinanceSeries(completedSubmissions).slice(-45);

  return (
    <div className="flex-1 min-h-screen bg-[#f7f7f7] text-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">

        {/* Header */}
        <motion.div
          {...fadeUp}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-8 border-b border-black/8"
        >
          <div>
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-2">GCN Admin</p>
            <h1 className="text-3xl text-black" style={{ fontWeight: 300 }}>
              Kundenanfragen
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">{session.user?.email}</span>
            {/* SECONDARY button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 text-sm text-black border border-black/15 rounded-2xl px-4 py-2.5 hover:bg-black hover:text-white hover:border-black transition-all"
            >
              <LogOut className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </motion.div>

        <motion.div {...fadeUp} className="bg-white border border-black/8 rounded-3xl p-5 sm:p-6 mb-8">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Auftragsdashboard</p>
              <h2 className="text-xl text-black mt-1" style={{ fontWeight: 600 }}>
                Such- und Verkaufsaufträge im Überblick
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                Das Dashboard berücksichtigt nur abgeschlossene Aufträge. Umsatz und Gewinn können Sie für jeden Eintrag im Auftrag selbst hinterlegen.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="inline-flex items-center gap-2 text-xs text-gray-500 mr-1">
                <BarChart3 className="w-4 h-4" />
                {ordersWithFinance} Einträge mit Finanzwerten
              </div>
              <button
                type="button"
                onClick={() => setIsOrderDashboardCollapsed((prev) => !prev)}
                className="w-9 h-9 rounded-xl border border-black/10 bg-white flex items-center justify-center"
                title={isOrderDashboardCollapsed ? "Dashboard ausklappen" : "Dashboard einklappen"}
              >
                {isOrderDashboardCollapsed ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {isOrderDashboardCollapsed ? null : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 mb-5">
            <div className="rounded-2xl border border-black/8 bg-[#f7f7f7] p-4">
              <p className="text-xs tracking-[0.12em] text-gray-400 uppercase mb-1">Umsatz gesamt</p>
              <p className="text-xl text-black" style={{ fontWeight: 600 }}>{formatEuro(orderSaleTotal)}</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-[#f7f7f7] p-4">
              <p className="text-xs tracking-[0.12em] text-gray-400 uppercase mb-1">Gewinn gesamt</p>
              <p className={`text-xl ${orderProfitTotal >= 0 ? "text-green-700" : "text-red-600"}`} style={{ fontWeight: 600 }}>
                {formatEuro(orderProfitTotal)}
              </p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-[#f7f7f7] p-4">
              <p className="text-xs tracking-[0.12em] text-gray-400 uppercase mb-1">Verkaufspreis</p>
              <p className="text-xl text-black" style={{ fontWeight: 600 }}>{formatEuro(orderRequestedSaleTotal)}</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-[#f7f7f7] p-4">
              <p className="text-xs tracking-[0.12em] text-gray-400 uppercase mb-1">Kaufpreis gesamt</p>
              <p className="text-xl text-black" style={{ fontWeight: 600 }}>{formatEuro(orderPurchaseTotal)}</p>
            </div>
            <div className="rounded-2xl border border-black/8 bg-[#f7f7f7] p-4">
              <p className="text-xs tracking-[0.12em] text-gray-400 uppercase mb-1">Kosten gesamt</p>
              <p className="text-xl text-black" style={{ fontWeight: 600 }}>{formatEuro(orderCostsTotal)}</p>
            </div>
          </div>

          <div className="h-72 w-full rounded-2xl border border-black/8 bg-[#fafafa] p-3">
            <FinanceTrendChart data={orderFinanceChartData} />
          </div>
          </>
          )}
        </motion.div>

        <motion.div {...fadeUp} className="bg-white border border-black/8 rounded-3xl p-5 sm:p-6 mb-8">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Manueller Auftrag</p>
              <h2 className="text-xl text-black mt-1" style={{ fontWeight: 600 }}>
                Auftrag direkt im Adminpanel anlegen
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Für Anfragen ohne Website-Formular: Typ auswählen und Basisdaten eintragen.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsManualCreateCollapsed((prev) => !prev)}
              className="w-9 h-9 rounded-xl border border-black/10 bg-white flex items-center justify-center shrink-0"
              title={isManualCreateCollapsed ? "Formular ausklappen" : "Formular einklappen"}
            >
              {isManualCreateCollapsed ? (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>

          {isManualCreateCollapsed ? null : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Typ</label>
              <select
                value={manualType}
                onChange={(e) => setManualType(e.target.value as "search" | "sell" | "inventory_sale")}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm"
              >
                <option value="inventory_sale">Bestandsverkauf</option>
                <option value="search">Suchauftrag</option>
                <option value="sell">Verkaufsauftrag</option>
              </select>
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Eingangsdatum</label>
              <input
                type="date"
                value={manualReceivedDate}
                onChange={(e) => setManualReceivedDate(e.target.value)}
                className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm"
              />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Vorname</label>
              <input value={manualFirstName} onChange={(e) => setManualFirstName(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Nachname</label>
              <input value={manualLastName} onChange={(e) => setManualLastName(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">E-Mail</label>
              <input value={manualEmail} onChange={(e) => setManualEmail(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Telefon</label>
              <input value={manualPhone} onChange={(e) => setManualPhone(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Marke</label>
              <input value={manualBrand} onChange={(e) => setManualBrand(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Modell</label>
              <input value={manualModel} onChange={(e) => setManualModel(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Baujahr</label>
              <input value={manualYear} onChange={(e) => setManualYear(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Leistung (PS)</label>
              <input value={manualPower} onChange={(e) => setManualPower(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>
            <div>
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Kilometerstand</label>
              <input value={manualMileage} onChange={(e) => setManualMileage(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
            </div>

            {manualType === "search" ? (
              <>
                <div>
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Budget</label>
                  <input value={manualBudget} onChange={(e) => setManualBudget(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Max. KM</label>
                  <input value={manualMaxMileage} onChange={(e) => setManualMaxMileage(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
                </div>
                <div>
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Farbe</label>
                  <input value={manualColor} onChange={(e) => setManualColor(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Verkaufspreis (EUR)</label>
                  <input value={manualSellPrice} onChange={(e) => setManualSellPrice(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
                </div>
                {manualType === "inventory_sale" ? (
                  <>
                    <div>
                      <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Einkaufspreis (EUR)</label>
                      <input value={manualPurchasePrice} onChange={(e) => setManualPurchasePrice(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Kosten (EUR)</label>
                      <input value={manualCosts} onChange={(e) => setManualCosts(e.target.value)} className="w-full rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm" />
                    </div>
                  </>
                ) : null}
              </>
            )}

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">Notiz</label>
              <textarea
                value={manualMessage}
                onChange={(e) => setManualMessage(e.target.value)}
                className="w-full h-24 rounded-2xl border border-black/10 px-4 py-2.5 bg-[#f7f7f7] text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              onClick={handleCreateSubmission}
              disabled={isCreatingSubmission}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black text-white text-sm hover:bg-gray-900 disabled:opacity-60"
            >
              {isCreatingSubmission ? "Legt an..." : "Auftrag anlegen"}
            </button>
            <button
              type="button"
              onClick={resetManualForm}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-black/15 text-sm hover:bg-black hover:text-white transition-colors"
            >
              Zurücksetzen
            </button>
          </div>
          </>
          )}
        </motion.div>

        {/* Stats bar */}
        <motion.div
          {...fadeUp}
          className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8"
        >
          {[
            { label: "Gesamt", value: submissions.length },
            { label: "Suchaufträge", value: submissions.filter((s) => s.type === "search").length },
            { label: "Verkaufsangebote", value: submissions.filter((s) => s.type === "sell").length },
            { label: "Bestandsverkäufe", value: submissions.filter((s) => s.type === "inventory_sale").length },
            { label: "Abgeschlossen", value: completedSubmissionsCount },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white border border-black/6 rounded-2xl p-4 sm:p-5"
            >
              <p className="text-xs tracking-[0.15em] text-gray-400 uppercase mb-1">{stat.label}</p>
              <p className="text-2xl text-black" style={{ fontWeight: 300 }}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Content */}
        {isFetching ? (
          <div className="flex justify-center py-24">
            <div className="w-7 h-7 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <motion.div
            {...fadeUp}
            className="bg-white border border-black/8 rounded-3xl py-20 px-8 text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-[#f7f7f7] border border-black/6 flex items-center justify-center mx-auto mb-5">
              <AlertCircle className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg text-black mb-2" style={{ fontWeight: 600 }}>
              Noch keine Anfragen
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto leading-relaxed">
              Sobald Kunden das Kontaktformular nutzen, erscheinen die Anfragen hier.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <div>
              {isSearchSectionCollapsed ? null : (
                <motion.div {...fadeUp} className="mb-4">
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">
                    Suchaufträge suchen
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={searchFilter}
                      onChange={(e) => setSearchFilter(e.target.value)}
                      placeholder="Vor- oder Nachname eingeben"
                      className="w-full rounded-2xl border border-black/10 py-3.5 pl-11 pr-4 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Suchaufträge</p>
                  <p className="text-sm text-black mt-1" style={{ fontWeight: 600 }}>
                    {searchSubmissions.length} Einträge
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSearchSectionCollapsed((prev) => !prev)}
                  className="w-9 h-9 rounded-xl border border-black/10 bg-white flex items-center justify-center"
                >
                  {isSearchSectionCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              {isSearchSectionCollapsed ? null : searchSubmissions.length === 0 ? (
                <div className="bg-white border border-black/8 rounded-3xl p-6">
                  <p className="text-sm text-gray-400">Keine Suchaufträge vorhanden.</p>
                </div>
              ) : (
                <div className="relative lg:pr-14">
                  <div className="hidden lg:block absolute right-4 top-0 bottom-2 w-px bg-black/10" aria-hidden="true" />
                  <div className="space-y-4">
                    <AnimatePresence>
                      {searchSubmissions.map((sub) => (
                        <SubmissionCard
                          key={sub.id}
                          sub={sub}
                          onDelete={handleDelete}
                          onUpdateMeta={handleUpdateMeta}
                          onUploadDocument={handleUploadDocument}
                          onDeleteDocument={handleDeleteDocument}
                          showSectionConnector
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div>
              {isInventorySectionCollapsed ? null : (
                <motion.div {...fadeUp} className="mb-4">
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">
                    Bestandsverkäufe suchen
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={inventoryFilter}
                      onChange={(e) => setInventoryFilter(e.target.value)}
                      placeholder="Vor- oder Nachname eingeben"
                      className="w-full rounded-2xl border border-black/10 py-3.5 pl-11 pr-4 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Bestandsverkäufe</p>
                  <p className="text-sm text-black mt-1" style={{ fontWeight: 600 }}>
                    {inventorySalesSubmissions.length} Einträge
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInventorySectionCollapsed((prev) => !prev)}
                  className="w-9 h-9 rounded-xl border border-black/10 bg-white flex items-center justify-center"
                >
                  {isInventorySectionCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              {isInventorySectionCollapsed ? null : inventorySalesSubmissions.length === 0 ? (
                <div className="bg-white border border-black/8 rounded-3xl p-6">
                  <p className="text-sm text-gray-400">Keine Bestandsverkäufe vorhanden.</p>
                </div>
              ) : (
                <div className="relative lg:pr-14">
                  <div className="hidden lg:block absolute right-4 top-0 bottom-2 w-px bg-black/10" aria-hidden="true" />
                  <div className="space-y-4">
                    <AnimatePresence>
                      {inventorySalesSubmissions.map((sub) => (
                        <SubmissionCard
                          key={sub.id}
                          sub={sub}
                          onDelete={handleDelete}
                          onUpdateMeta={handleUpdateMeta}
                          onUploadDocument={handleUploadDocument}
                          onDeleteDocument={handleDeleteDocument}
                          showSectionConnector
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            <div>
              {isSellSectionCollapsed ? null : (
                <motion.div {...fadeUp} className="mb-4">
                  <label className="block text-xs tracking-[0.15em] text-gray-400 uppercase mb-2">
                    Verkaufsangebote suchen
                  </label>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      value={sellFilter}
                      onChange={(e) => setSellFilter(e.target.value)}
                      placeholder="Vor- oder Nachname eingeben"
                      className="w-full rounded-2xl border border-black/10 py-3.5 pl-11 pr-4 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <div className="flex items-center justify-between mb-4 px-1">
                <div>
                  <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Verkaufsangebote</p>
                  <p className="text-sm text-black mt-1" style={{ fontWeight: 600 }}>
                    {sellSubmissions.length} Einträge
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSellSectionCollapsed((prev) => !prev)}
                  className="w-9 h-9 rounded-xl border border-black/10 bg-white flex items-center justify-center"
                >
                  {isSellSectionCollapsed ? (
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  ) : (
                    <ChevronUp className="w-4 h-4 text-gray-600" />
                  )}
                </button>
              </div>
              {isSellSectionCollapsed ? null : sellSubmissions.length === 0 ? (
                <div className="bg-white border border-black/8 rounded-3xl p-6">
                  <p className="text-sm text-gray-400">Keine Verkaufsangebote vorhanden.</p>
                </div>
              ) : (
                <div className="relative lg:pr-14">
                  <div className="hidden lg:block absolute right-4 top-0 bottom-2 w-px bg-black/10" aria-hidden="true" />
                  <div className="space-y-4">
                    <AnimatePresence>
                      {sellSubmissions.map((sub) => (
                        <SubmissionCard
                          key={sub.id}
                          sub={sub}
                          onDelete={handleDelete}
                          onUpdateMeta={handleUpdateMeta}
                          onUploadDocument={handleUploadDocument}
                          onDeleteDocument={handleDeleteDocument}
                          showSectionConnector
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
