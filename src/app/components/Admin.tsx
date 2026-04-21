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

function getSubmissionRevenue(submission: any): number {
  return asNumber(submission.salePrice ?? submission.revenue ?? 0);
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
}: {
  onLogin: (email: string, password: string) => Promise<void>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
              disabled={isLoggingIn}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm text-white bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
      <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-black/6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-[#f7f7f7] border border-black/6 flex items-center justify-center shrink-0">
            {isSearch ? (
              <Search className="w-5 h-5 text-gray-600" />
            ) : (
              <Car className="w-5 h-5 text-gray-600" />
            )}
          </div>
          <div>
            <span className="text-xs tracking-[0.2em] text-gray-400 uppercase">
              {isSearch ? "Suchauftrag" : "Verkaufsangebot"}
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
        <div className="flex items-center gap-2 shrink-0">
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
  const [searchFilter, setSearchFilter] = useState("");
  const [sellFilter, setSellFilter] = useState("");
  const [isSearchSectionCollapsed, setIsSearchSectionCollapsed] = useState(false);
  const [isSellSectionCollapsed, setIsSellSectionCollapsed] = useState(false);

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
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Login fehlgeschlagen. Bitte Zugangsdaten prüfen.");
      throw error;
    }
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
    return <LoginScreen onLogin={handleLogin} />;
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
  const completedSubmissionsCount = submissions.filter((s) => s.status === "abgeschlossen").length;
  const orderSaleTotal = submissions.reduce((sum, sub) => sum + getSubmissionRevenue(sub), 0);
  const orderRequestedSaleTotal = submissions
    .filter((sub) => sub.type === "sell")
    .reduce((sum, sub) => sum + asNumber(sub.price), 0);
  const orderPurchaseTotal = submissions.reduce((sum, sub) => sum + asNumber(sub.purchasePrice ?? sub.costPrice ?? 0), 0);
  const orderCostsTotal = submissions.reduce((sum, sub) => sum + asNumber(sub.costs || 0), 0);
  const orderProfitTotal = submissions.reduce((sum, sub) => sum + getSubmissionProfit(sub), 0);
  const ordersWithFinance = submissions.filter(
    (sub) => getSubmissionRevenue(sub) !== 0 || getSubmissionProfit(sub) !== 0,
  ).length;
  const orderFinanceChartData = buildDailyFinanceSeries(submissions).slice(-45);

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
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
            <div>
              <p className="text-xs tracking-[0.2em] text-gray-400 uppercase">Auftragsdashboard</p>
              <h2 className="text-xl text-black mt-1" style={{ fontWeight: 600 }}>
                Such- und Verkaufsaufträge im Überblick
              </h2>
              <p className="text-sm text-gray-500 mt-2 max-w-2xl">
                Die Kennzahlen unten werden direkt aus den Anfragen berechnet. Umsatz und Gewinn können Sie für jeden Eintrag im Auftrag selbst hinterlegen.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 text-xs text-gray-500">
              <BarChart3 className="w-4 h-4" />
              {ordersWithFinance} Einträge mit Finanzwerten
            </div>
          </div>

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
        </motion.div>

        {/* Stats bar */}
        <motion.div
          {...fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: "Gesamt", value: submissions.length },
            { label: "Suchaufträge", value: submissions.filter((s) => s.type === "search").length },
            { label: "Verkaufsangebote", value: submissions.filter((s) => s.type === "sell").length },
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
                <div className="relative pr-14">
                  <div className="absolute right-4 top-0 bottom-2 w-px bg-black/10" aria-hidden="true" />
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

            <div>
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
                <div className="relative pr-14">
                  <div className="absolute right-4 top-0 bottom-2 w-px bg-black/10" aria-hidden="true" />
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
