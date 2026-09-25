import { PROVISION } from "../firma";
import { Tusche, type TuscheName } from "./Tusche";

/* „Unser Versprechen an Sie.“ – auf der Startseite kurz, auf „Über uns“
   ausführlich. Ein Block für beide Seiten, damit sich nichts widerspricht. */
const VERSPRECHEN: { icon: TuscheName; titel: string; kurz: string; lang: string }[] = [
  {
    icon: "betreuung",
    titel: "Persönliche Betreuung",
    kurz: "Kein Callcenter, keine Warteschleife. Sie haben einen festen Ansprechpartner, der Ihren Auftrag kennt und Sie durch den gesamten Prozess begleitet.",
    lang: "Kein Callcenter, keine Warteschleife. Sie haben einen festen Ansprechpartner, der Ihren Auftrag kennt und Sie von der ersten Frage bis zur Schlüsselübergabe begleitet. Jeder Auftrag ist anders – deshalb hören wir zuerst zu und beraten dann individuell und auf Augenhöhe, ohne Verkaufsdruck.",
  },
  {
    icon: "garantie",
    titel: "Garantie über ProGarant",
    kurz: "Jedes Fahrzeug, das wir verkaufen, sichern wir mit einer Gebrauchtwagengarantie von ProGarant ab. Laufzeit, Umfang und Bedingungen erhalten Sie vor dem Kauf schriftlich. Ihre gesetzlichen Rechte bleiben davon unberührt.",
    lang: "Jedes Fahrzeug, das wir verkaufen, sichern wir mit einer Gebrauchtwagengarantie von ProGarant ab. Laufzeit, Umfang und Bedingungen erhalten Sie vor dem Kauf schriftlich, Ihre gesetzlichen Rechte bleiben davon unberührt. Und auch nach der Übergabe bleiben wir Ihr Ansprechpartner.",
  },
  {
    icon: "preis",
    titel: "Faire, transparente Preise",
    kurz: `Wir kennen die aktuellen Marktpreise und setzen realistisch an. Unsere Provision beträgt ${PROVISION} und wird vorab schriftlich vereinbart – keine versteckten Kosten.`,
    lang: `Wir beobachten den Markt täglich und kennen die aktuellen Preise. So setzen wir beim Verkauf einen realistischen Preis an und verhandeln beim Kauf faire Konditionen. Unsere Provision beträgt ${PROVISION} und wird vor Auftragsbeginn schriftlich vereinbart – keine versteckten Kosten, keine versteckten Mängel. Und wenn ein Geschäft für Sie keinen Sinn ergibt, sagen wir das auch.`,
  },
  {
    icon: "uhr",
    titel: "Ihre Zeit bleibt Ihre",
    kurz: "Keine Besichtigungstouristen, keine zähen Verhandlungen am Feierabend. Sie entscheiden – den Rest erledigen wir.",
    lang: "Keine Besichtigungstouristen, keine zähen Verhandlungen am Feierabend. Inserate, Anfragen, Probefahrten und Papierkram übernehmen wir. Sie treffen die Entscheidungen – den Rest erledigen wir.",
  },
];

export function VersprechenSektion({ ausfuehrlich = false }: { ausfuehrlich?: boolean }) {
  return (
    <section className="bg-crema-chiara" aria-labelledby="versprechen">
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-6 sm:py-24 lg:px-12">
        <h2 id="versprechen" className="max-w-2xl border-b border-linea pb-9">
          Unser Versprechen an Sie.
        </h2>

        <dl className="grid grid-cols-1 gap-x-12 sm:grid-cols-2">
          {VERSPRECHEN.map((v) => (
            <div key={v.titel} className="flex gap-6 border-b border-linea-chiara py-8">
              <Tusche name={v.icon} className="h-14 w-14 text-nero" />
              <div>
                <dt className="text-[17px] leading-snug text-nero" style={{ fontWeight: 700 }}>
                  {v.titel}
                </dt>
                <dd className="mt-2 leading-relaxed text-asfalto">{ausfuehrlich ? v.lang : v.kurz}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
