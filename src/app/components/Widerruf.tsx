import { Printer } from "lucide-react";
import { EMAIL, TELEFON_INTERNATIONAL } from "../firma";
import { Abschnitt, AnschriftKasten, LINK_KLASSE, Rechtsseite, Unterabschnitt } from "./Rechtsseite";

function Kontakt() {
  return (
    <AnschriftKasten>
      <p className="mt-2">Telefon: {TELEFON_INTERNATIONAL}</p>
      <p>
        E-Mail:{" "}
        <a href={`mailto:${EMAIL}`} className={LINK_KLASSE}>
          {EMAIL}
        </a>
      </p>
    </AnschriftKasten>
  );
}

/* Gemeinsamer Teil beider Belehrungen: Ausübung des Widerrufs. */
function Ausuebung() {
  return (
    <>
      <p>
        Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B.
        ein mit der Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag
        zu widerrufen, informieren:
      </p>
      <Kontakt />
      <p>
        Sie können dafür das unten stehende Muster-Widerrufsformular verwenden, das jedoch nicht
        vorgeschrieben ist. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung
        über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
      </p>
    </>
  );
}

const RUECKZAHLUNG =
  "Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.";

export function Widerruf() {
  return (
    <Rechtsseite
      titel="Widerrufsbelehrung."
      seoTitel="Widerrufsbelehrung – GCN Fahrzeughandel GbR"
      seoBeschreibung="Widerrufsbelehrung und Muster-Widerrufsformular der GCN Fahrzeughandel GbR."
      einleitung="Das Widerrufsrecht gilt für Verbraucher bei Verträgen, die ausschließlich per Telefon, E-Mail oder auf anderem Weg aus der Ferne oder außerhalb unserer Geschäftsräume geschlossen werden."
      stand="September 2026"
    >
      <Abschnitt nummer="A" titel="Kauf eines Fahrzeugs">
        <Unterabschnitt titel="Widerrufsrecht">
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
            widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein
            von Ihnen benannter Dritter, der nicht der Beförderer ist, das Fahrzeug in Besitz
            genommen haben bzw. hat.
          </p>
          <Ausuebung />
        </Unterabschnitt>
        <Unterabschnitt titel="Folgen des Widerrufs">
          <p>{RUECKZAHLUNG}</p>
          <p>
            Wir können die Rückzahlung verweigern, bis wir das Fahrzeug wieder zurückerhalten haben
            oder bis Sie den Nachweis erbracht haben, dass Sie das Fahrzeug zurückgesandt haben, je
            nachdem, welches der frühere Zeitpunkt ist.
          </p>
          <p>
            Sie haben das Fahrzeug unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen
            ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns
            zurückzugeben oder zu übergeben. Die Frist ist gewahrt, wenn Sie das Fahrzeug vor
            Ablauf der Frist von vierzehn Tagen absenden bzw. an uns übergeben. Sie tragen die
            unmittelbaren Kosten der Rückgabe des Fahrzeugs.
          </p>
          <p>
            Sie müssen für einen etwaigen Wertverlust des Fahrzeugs nur aufkommen, wenn dieser
            Wertverlust auf einen zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise
            nicht notwendigen Umgang mit ihm zurückzuführen ist.
          </p>
        </Unterabschnitt>
      </Abschnitt>

      <Abschnitt nummer="B" titel="Suchauftrag und Vermittlungsauftrag">
        <Unterabschnitt titel="Widerrufsrecht">
          <p>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
            widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
            Vertragsabschlusses.
          </p>
          <Ausuebung />
        </Unterabschnitt>
        <Unterabschnitt titel="Folgen des Widerrufs">
          <p>{RUECKZAHLUNG}</p>
          <p>
            Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen
            sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis zu
            dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich dieses
            Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum
            Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
          </p>
        </Unterabschnitt>
      </Abschnitt>

      <Abschnitt nummer="C" titel="Muster-Widerrufsformular" id="formular">
        <p>
          Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
          senden Sie es zurück.
        </p>
        <div className="rounded-2xl border border-linea bg-crema p-5 space-y-3 text-nero">
          <p>
            An: GCN Fahrzeughandel GbR, Sommeraurstr. 46, 78112 Sankt Georgen im Schwarzwald,
            E-Mail: {EMAIL}
          </p>
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den
            Kauf der folgenden Waren (*) / die Erbringung der folgenden Dienstleistung (*) (Such- oder Vermittlungsauftrag):
          </p>
          <FormularZeile label="Fahrzeug bzw. Leistung" />
          <FormularZeile label="Bestellt am (*) / erhalten am (*)" />
          <FormularZeile label="Name des/der Verbraucher(s)" />
          <FormularZeile label="Anschrift des/der Verbraucher(s)" />
          <FormularZeile label="Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)" />
          <FormularZeile label="Datum" />
          <p className="text-xs text-asfalto">(*) Unzutreffendes streichen.</p>
        </div>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full border border-linea px-5 py-2.5 text-sm text-nero transition-colors hover:border-nero hover:bg-nero hover:text-crema-chiara active:scale-[0.98] print:hidden"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Seite drucken
        </button>
      </Abschnitt>
    </Rechtsseite>
  );
}

function FormularZeile({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs text-asfalto">{label}</p>
      <div className="mt-5 border-b border-dashed border-nero/30" aria-hidden="true" />
    </div>
  );
}
