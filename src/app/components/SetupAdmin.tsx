import { useState } from "react";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";
import { motion } from "motion/react";
import logoImg from "../../assets/87104b765c1a1399e8e4b2a45f3225515652a099.png";
import { ADMIN_ROUTE_SEGMENT } from "../adminRoute";

export function SetupAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-004f047d/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || "Fehler. Möglicherweise existiert der Benutzer bereits.");
      }
      toast.success(`Admin-Account erstellt. Login unter /${ADMIN_ROUTE_SEGMENT}`);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputCls =
    "block w-full rounded-2xl border border-black/10 py-3.5 px-5 bg-[#f7f7f7] text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 text-sm transition-all";

  return (
    <div className="flex-1 min-h-screen bg-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={logoImg} alt="GCN Fahrzeughandel GbR" className="h-12 w-auto object-contain" />
        </div>

        {/* Card */}
        <div className="bg-[#f7f7f7] border border-black/8 rounded-3xl p-8 sm:p-10">
          <div className="mb-8">
            <p className="text-xs tracking-[0.25em] text-gray-400 uppercase mb-2">Ersteinrichtung</p>
            <h1 className="text-2xl text-black" style={{ fontWeight: 300 }}>
              Admin-Account einrichten.
            </h1>
            <p className="text-gray-400 text-sm mt-2 leading-relaxed">
              Erstellen Sie den ersten Administrator-Zugang für den internen Bereich.
            </p>
          </div>

          <form onSubmit={handleSetup} className="space-y-4">
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
                Passwort{" "}
                <span className="normal-case tracking-normal text-gray-400">(min. 6 Zeichen)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  minLength={6}
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
              disabled={isLoading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-sm text-white bg-black hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Account erstellen"
              )}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-6">
            Diese Seite ist nach der Einrichtung nicht mehr benötigt.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
