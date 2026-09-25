import { Link } from "react-router";
import { EMAIL, TELEFON_INTERNATIONAL } from "../firma";
import { Abschnitt, LINK_KLASSE, Rechtsseite, Unterabschnitt } from "./Rechtsseite";

function Absaetze({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal pl-5 space-y-2">{children}</ol>;
}

/* Die AGB sind in Teile A–E gegliedert; die Paragrafen stehen darunter als h3. */
function Teil({ buchstabe, titel }: { buchstabe: string; titel: string }) {
  return (
    <h2
      className="mt-12 border-t-2 border-nero pt-5 text-lg text-nero first:mt-0 [&+section]:mt-4 [&+section]:border-t-0 [&+section]:pt-4"
      style={{ fontWeight: 700, letterSpacing: "-0.01em" }}
    >
      Teil {buchstabe} – {titel}
    </h2>
  );
}

function Formularzeile({ label }: { label: string }) {
  return (
    <div>
      <p className="text-xs text-asfalto">{label}</p>
      <div className="mt-5 border-b border-dashed border-nero/30" aria-hidden="true" />
    </div>
  );
}

export function Agb() {
  return (
    <Rechtsseite
      titel="Allgemeine Geschäftsbedingungen."
      seoTitel="AGB – GCN Fahrzeughandel GbR"
      seoBeschreibung="Allgemeine Geschäftsbedingungen der GCN Fahrzeughandel GbR für den Verkauf gebrauchter Fahrzeuge, die Vermittlung von Kundenfahrzeugen, Suchaufträge und Exportgeschäfte."
      einleitung="Diese AGB gelten für den Verkauf gebrauchter Kraftfahrzeuge an Verbraucher und Unternehmer, für die Vermittlung von Kundenfahrzeugen, für Suchaufträge und für Exportgeschäfte von GCN Fahrzeughandel (im Folgenden „Verkäufer“ bzw. „GCN“)."
      stand="September 2026"
    >
      {/* ── Teil A ─────────────────────────────────────────────────────── */}
      <Teil buchstabe="A" titel="Allgemeine Bestimmungen" />

      <Abschnitt ebene="h3" nummer="§ 1" titel="Geltungsbereich">
        <Absaetze>
          <li>
            Diese AGB gelten für alle Verträge zwischen GCN und seinen Kunden über den Kauf
            gebrauchter Fahrzeuge (Teil A und B), die Vermittlung von Fahrzeugen im Auftrag des
            Kunden (Teil C), den Suchauftrag (Teil D) und den Verkauf zur Ausfuhr (Teil E).
          </li>
          <li>
            Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt,
            die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen
            Tätigkeit zugerechnet werden können (§ 13 BGB). Unternehmer ist jede natürliche oder
            juristische Person oder rechtsfähige Personengesellschaft, die bei Abschluss des
            Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen
            Tätigkeit handelt (§ 14 BGB).
          </li>
          <li>
            Abweichende oder ergänzende Bedingungen des Kunden werden nicht Vertragsbestandteil,
            auch wenn GCN ihnen nicht ausdrücklich widerspricht.
          </li>
          <li>
            Individuelle Vereinbarungen im Kaufvertrag oder Vermittlungsauftrag haben Vorrang vor
            diesen AGB.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 2" titel="Angebote und Vertragsschluss">
        <Absaetze>
          <li>
            Fahrzeugangebote von GCN in Inseraten, auf Online-Plattformen und in schriftlichen
            Angeboten sind freibleibend. Sie gelten, solange das jeweilige Fahrzeug verfügbar ist.
            Ein Zwischenverkauf bleibt vorbehalten.
          </li>
          <li>
            Werden für ein Fahrzeug mehrere Angebotsvarianten mit unterschiedlichen Preisen
            erstellt (etwa mit oder ohne Zusatzleistungen), ist nur die Variante verbindlich, die
            der Kunde ausdrücklich annimmt.
          </li>
          <li>
            Der Kaufvertrag kommt mit der Unterzeichnung des Kaufvertrags durch beide Parteien oder
            mit der schriftlichen Auftragsbestätigung von GCN zustande. Bei Bestellung durch den
            Kunden (z. B. per verbindlicher Bestellung oder E-Mail) ist dieser vierzehn Tage an
            seine Bestellung gebunden.
          </li>
          <li>
            Angaben zu Ausstattung, Laufleistung, Vorbesitzern und Unfallfreiheit beruhen auf den
            GCN vorliegenden Unterlagen und Informationen. Maßgeblich für die Beschaffenheit des
            Fahrzeugs ist die Beschreibung im Kaufvertrag.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 3" titel="Preise und Zahlung">
        <Absaetze>
          <li>
            Es gelten die im Kaufvertrag vereinbarten Preise. Sie verstehen sich als Endpreise
            einschließlich der gesetzlichen Umsatzsteuer, soweit diese anfällt. Bei
            differenzbesteuerten Fahrzeugen (§ 25a UStG) wird die Umsatzsteuer nicht gesondert
            ausgewiesen.
          </li>
          <li>
            Kosten für Zulassung, Überführung, Kennzeichen, Transport und Nebenleistungen sind nur
            im Preis enthalten, wenn dies im Kaufvertrag ausdrücklich vereinbart ist.
          </li>
          <li>
            Der Kaufpreis ist spätestens bei Übergabe des Fahrzeugs ohne Abzug fällig. Die Zahlung
            erfolgt per Überweisung oder in bar. Das Fahrzeug wird erst nach vollständigem
            Zahlungseingang übergeben.
          </li>
          <li>
            Bei Barzahlungen ab 10.000 € ist GCN gesetzlich verpflichtet, den Kunden anhand eines
            gültigen Ausweisdokuments zu identifizieren und die Daten aufzubewahren
            (Geldwäschegesetz).
          </li>
          <li>Eine vereinbarte Anzahlung wird auf den Kaufpreis angerechnet.</li>
          <li>
            Gegen Forderungen von GCN kann der Kunde nur mit unbestrittenen oder rechtskräftig
            festgestellten Forderungen aufrechnen. Ein Zurückbehaltungsrecht besteht nur, soweit es
            auf demselben Vertragsverhältnis beruht.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 4" titel="Übergabe und Abnahme">
        <Absaetze>
          <li>
            Das Fahrzeug wird am Betriebssitz von GCN übergeben, soweit nichts anderes vereinbart
            ist. Bei Übergabe wird ein Übergabeprotokoll erstellt.
          </li>
          <li>
            Der Kunde ist verpflichtet, das Fahrzeug innerhalb von vierzehn Tagen nach Zugang der
            Bereitstellungsanzeige abzunehmen.
          </li>
          <li>
            Nimmt der Kunde das Fahrzeug nicht fristgerecht ab, kann GCN nach Setzen einer
            angemessenen Nachfrist vom Vertrag zurücktreten und Schadensersatz verlangen. Der
            Schadensersatz beträgt pauschal 15 % des Kaufpreises. Beiden Parteien bleibt der
            Nachweis vorbehalten, dass ein höherer oder ein wesentlich geringerer oder gar kein
            Schaden entstanden ist.
          </li>
          <li>
            Für die Zeit des Annahmeverzugs kann GCN ein Standgeld von 10 € je Kalendertag
            berechnen. Dem Kunden bleibt der Nachweis eines geringeren Schadens vorbehalten.
          </li>
          <li>
            Fahrzeugbrief (Zulassungsbescheinigung Teil II) und Schlüssel werden erst nach
            vollständiger Zahlung übergeben.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 5" titel="Eigentumsvorbehalt">
        <Absaetze>
          <li>
            Das Fahrzeug bleibt bis zur vollständigen Bezahlung des Kaufpreises Eigentum von GCN.
          </li>
          <li>
            Gegenüber Unternehmern gilt der Eigentumsvorbehalt zusätzlich bis zur Begleichung
            aller Forderungen aus der laufenden Geschäftsbeziehung.
          </li>
          <li>
            Während des Eigentumsvorbehalts darf der Kunde das Fahrzeug weder veräußern noch
            verpfänden oder sicherungsübereignen. Zugriffe Dritter, etwa Pfändungen, hat er GCN
            unverzüglich mitzuteilen.
          </li>
        </Absaetze>
      </Abschnitt>

      {/* ── Teil B ─────────────────────────────────────────────────────── */}
      <Teil buchstabe="B" titel="Sachmängelhaftung und Haftung" />

      <Abschnitt ebene="h3" nummer="§ 6" titel="Sachmängelansprüche gegenüber Verbrauchern">
        <Absaetze>
          <li>
            Gegenüber Verbrauchern verjähren Ansprüche wegen Sachmängeln ein Jahr nach Übergabe
            des Fahrzeugs, sofern diese Verkürzung im Kaufvertrag ausdrücklich und gesondert
            vereinbart wurde und der Verbraucher vor Abgabe seiner Vertragserklärung eigens darauf
            hingewiesen wurde (§ 476 Abs. 2 BGB). Andernfalls gilt die gesetzliche Frist von zwei
            Jahren.
          </li>
          <li>
            Abweichungen des Fahrzeugs von den objektiven Anforderungen (z. B. bekannte Vorschäden,
            Verschleiß, fehlende Ausstattung) gelten nur als vereinbart, wenn sie im Kaufvertrag
            ausdrücklich und gesondert festgehalten sind (§ 476 Abs. 1 BGB).
          </li>
          <li>
            Gebrauchsbedingter Verschleiß, der dem Alter und der Laufleistung des Fahrzeugs
            entspricht, stellt keinen Sachmangel dar.
          </li>
          <li>
            Die Verkürzung nach Absatz 1 gilt nicht für Ansprüche auf Schadensersatz nach § 8
            dieser AGB.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 7" titel="Sachmängelansprüche gegenüber Unternehmern">
        <Absaetze>
          <li>
            Gegenüber Unternehmern werden Fahrzeuge unter Ausschluss jeglicher Sachmängelhaftung
            verkauft.
          </li>
          <li>
            Der Ausschluss gilt nicht bei arglistigem Verschweigen eines Mangels, bei Übernahme
            einer Garantie für die Beschaffenheit, bei Ansprüchen nach § 8 dieser AGB sowie bei
            Ansprüchen aus dem Rückgriff in der Lieferkette nach §§ 445a, 478 BGB.
          </li>
          <li>
            Unternehmer müssen das Fahrzeug bei Übergabe untersuchen und erkennbare Mängel
            unverzüglich schriftlich rügen (§ 377 HGB, soweit anwendbar).
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 8" titel="Haftung">
        <Absaetze>
          <li>
            GCN haftet unbeschränkt für Schäden aus der Verletzung des Lebens, des Körpers oder der
            Gesundheit, für Vorsatz und grobe Fahrlässigkeit, bei Arglist, bei Übernahme einer
            Garantie sowie nach dem Produkthaftungsgesetz.
          </li>
          <li>
            Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten haftet GCN nur für
            den vertragstypischen, vorhersehbaren Schaden. Wesentliche Vertragspflichten sind
            solche, deren Erfüllung die ordnungsgemäße Durchführung des Vertrags erst ermöglicht
            und auf deren Einhaltung der Kunde regelmäßig vertrauen darf.
          </li>
          <li>Im Übrigen ist die Haftung für leichte Fahrlässigkeit ausgeschlossen.</li>
          <li>
            Diese Beschränkungen gelten auch zugunsten der Mitarbeiter und Erfüllungsgehilfen von
            GCN.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 9" titel="Abwicklung von Mängelansprüchen">
        <Absaetze>
          <li>
            Mängel sind GCN unverzüglich nach Entdeckung anzuzeigen. Der Kunde soll GCN das
            Fahrzeug zur Nacherfüllung am Betriebssitz zur Verfügung stellen.
          </li>
          <li>
            Wird das Fahrzeug wegen eines Mangels betriebsunfähig, kann sich der Kunde nach
            Rücksprache mit GCN an den nächstgelegenen geeigneten Fachbetrieb wenden.
          </li>
          <li>
            Rechte aus einer gesondert abgeschlossenen Gebrauchtwagengarantie richten sich
            ausschließlich nach deren Bedingungen und lassen die gesetzlichen Rechte unberührt.
          </li>
        </Absaetze>
      </Abschnitt>

      {/* ── Teil C ─────────────────────────────────────────────────────── */}
      <Teil buchstabe="C" titel="Verkauf im Auftrag des Kunden (Vermittlung)" />

      <Abschnitt ebene="h3" nummer="§ 10" titel="Vermittlungsauftrag">
        <Absaetze>
          <li>
            Beauftragt ein Kunde (Auftraggeber) GCN, sein Fahrzeug zu verkaufen, wird GCN als
            Vermittler im Namen und für Rechnung des Auftraggebers tätig. Der Kaufvertrag kommt
            unmittelbar zwischen dem Auftraggeber und dem Käufer zustande.
          </li>
          <li>
            Grundlage ist ein schriftlicher Vermittlungsauftrag. Darin werden insbesondere das
            Fahrzeug, der Mindestverkaufspreis, die Provision, die Laufzeit und etwaige
            Standgebühren festgelegt.
          </li>
          <li>
            Ist keine Laufzeit vereinbart, gilt der Auftrag für drei Monate. Er verlängert sich
            danach auf unbestimmte Zeit und kann dann von beiden Seiten mit einer Frist von zwei
            Wochen schriftlich gekündigt werden.
          </li>
          <li>
            GCN ist berechtigt, das Fahrzeug zu inserieren, Probefahrten mit Interessenten
            durchzuführen und Verkaufsverhandlungen zu führen. Einen Verkauf unter dem vereinbarten
            Mindestpreis schließt GCN nur mit Zustimmung des Auftraggebers ab.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 11" titel="Pflichten des Auftraggebers">
        <Absaetze>
          <li>
            Der Auftraggeber versichert, dass er Eigentümer des Fahrzeugs und verfügungsberechtigt
            ist und dass das Fahrzeug frei von Rechten Dritter ist, soweit im Vermittlungsauftrag
            nichts anderes angegeben ist.
          </li>
          <li>
            Er hat GCN alle ihm bekannten Mängel, Unfall- und Vorschäden, die tatsächliche
            Laufleistung sowie alle für den Verkauf wesentlichen Umstände vollständig und
            wahrheitsgemäß mitzuteilen. Für Folgen unrichtiger oder unvollständiger Angaben haftet
            der Auftraggeber.
          </li>
          <li>
            Der Auftraggeber übergibt GCN Fahrzeug, Schlüssel, Zulassungsbescheinigungen Teil I und
            II sowie vorhandene Serviceunterlagen und Prüfberichte.
          </li>
          <li>
            Während der Laufzeit hat der Auftraggeber für einen fortbestehenden Haftpflicht- und
            Kaskoversicherungsschutz zu sorgen, soweit nichts anderes vereinbart ist.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 12" titel="Provision und Kosten">
        <Absaetze>
          <li>
            GCN erhält für die erfolgreiche Vermittlung die im Vermittlungsauftrag vereinbarte
            Provision. Sie wird mit Abschluss des Kaufvertrags zwischen Auftraggeber und Käufer
            fällig.
          </li>
          <li>
            Der Provisionsanspruch entsteht auch, wenn der Auftraggeber das Fahrzeug während der
            Laufzeit an einen Interessenten verkauft, der ihm von GCN nachgewiesen wurde.
          </li>
          <li>
            Kündigt der Auftraggeber vorzeitig oder holt er das Fahrzeug vor Ablauf der Laufzeit
            ab, kann GCN die nachgewiesenen Aufwendungen (z. B. Aufbereitung, Inserate, Standgeld)
            verlangen.
          </li>
          <li>
            GCN leitet den Verkaufserlös abzüglich der Provision und vereinbarter Kosten innerhalb
            von sieben Werktagen nach Zahlungseingang an den Auftraggeber weiter.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 13" titel="Haftung im Vermittlungsgeschäft">
        <Absaetze>
          <li>
            Ansprüche des Käufers wegen Mängeln des Fahrzeugs richten sich gegen den Auftraggeber
            als Verkäufer, nicht gegen GCN.
          </li>
          <li>
            GCN haftet für Schäden am Fahrzeug, die während der Verwahrung durch GCN entstehen,
            nach Maßgabe von § 8 dieser AGB.
          </li>
          <li>
            Ist der Auftraggeber Unternehmer und der Käufer Verbraucher, gelten für den
            Kaufvertrag die gesetzlichen Vorschriften zum Verbrauchsgüterkauf.
          </li>
        </Absaetze>
      </Abschnitt>

      {/* ── Teil D ─────────────────────────────────────────────────────── */}
      <Teil buchstabe="D" titel="Suchauftrag" />

      <Abschnitt ebene="h3" nummer="§ 14" titel="Suchauftrag">
        <Absaetze>
          <li>
            Mit einem Suchauftrag beauftragt der Kunde GCN, ein Fahrzeug nach seinen Vorgaben zu
            suchen (z. B. Marke, Modell, Budget, Ausstattung, Laufleistung). GCN prüft gefundene
            Fahrzeuge, kauft sie ein und bietet sie dem Kunden zum Kauf an.
          </li>
          <li>
            Für den Suchauftrag selbst fallen keine Kosten an, soweit nichts anderes schriftlich
            vereinbart ist.
          </li>
          <li>
            Der Suchauftrag läuft drei Monate. Beide Seiten können ihn jederzeit ohne Angabe von
            Gründen beenden.
          </li>
          <li>
            Einen Sucherfolg schuldet GCN nicht. Aus dem Suchauftrag entsteht für den Kunden keine
            Pflicht, ein angebotenes Fahrzeug zu kaufen.
          </li>
          <li>
            Ein Kaufvertrag über ein angebotenes Fahrzeug kommt nur nach § 2 Abs. 3 zustande. Für
            ihn gelten Teil A und B dieser AGB.
          </li>
        </Absaetze>
      </Abschnitt>

      {/* ── Teil E ─────────────────────────────────────────────────────── */}
      <Teil buchstabe="E" titel="Exportgeschäfte" />

      <Abschnitt ebene="h3" nummer="§ 15" titel="Verkauf zur Ausfuhr">
        <Absaetze>
          <li>
            Die Bestimmungen dieses Teils gelten ergänzend, wenn das Fahrzeug in einen anderen
            EU-Mitgliedstaat oder in ein Drittland verbracht werden soll.
          </li>
          <li>
            Der Käufer ist selbst dafür verantwortlich, dass das Fahrzeug die technischen,
            zulassungs- und zollrechtlichen Vorschriften des Bestimmungslandes erfüllt. GCN
            übernimmt keine Gewähr für die Zulassungsfähigkeit im Ausland.
          </li>
          <li>
            Zölle, Einfuhrabgaben, Steuern des Bestimmungslandes, Ausfuhrkennzeichen,
            Kurzzeitkennzeichen und Transportkosten trägt der Käufer, soweit nichts anderes
            vereinbart ist.
          </li>
          <li>
            Soweit nichts anderes vereinbart ist, erfolgt die Übergabe am Betriebssitz von GCN
            (EXW / ab Werk gemäß Incoterms 2020). Die Gefahr geht mit der Übergabe an den Käufer
            oder dessen Beauftragten über.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 16" titel="Umsatzsteuer und Nachweise">
        <Absaetze>
          <li>
            Ein Verkauf ohne Umsatzsteuer als steuerfreie Ausfuhrlieferung oder
            innergemeinschaftliche Lieferung erfolgt nur, wenn die gesetzlichen Voraussetzungen
            vorliegen. Für differenzbesteuerte Fahrzeuge (§ 25a UStG) ist eine steuerfreie
            innergemeinschaftliche Lieferung ausgeschlossen.
          </li>
          <li>
            Bei innergemeinschaftlichen Lieferungen muss der Käufer eine gültige
            Umsatzsteuer-Identifikationsnummer eines anderen EU-Mitgliedstaats angeben und die
            Gelangensbestätigung oder einen gleichwertigen Nachweis innerhalb von vier Wochen nach
            Übergabe an GCN übermitteln.
          </li>
          <li>
            Bei Ausfuhren in Drittländer muss der Käufer den zollamtlichen Ausfuhrnachweis
            innerhalb von vier Wochen nach Übergabe an GCN übermitteln.
          </li>
          <li>
            Bis zum Eingang des Nachweises kann GCN eine Sicherheitsleistung in Höhe der
            Umsatzsteuer verlangen, die nach Eingang des vollständigen Nachweises erstattet wird.
            Wird der Nachweis nicht fristgerecht erbracht, schuldet der Käufer die gesetzliche
            Umsatzsteuer zusätzlich zum Nettokaufpreis.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 17" titel="Exportbeschränkungen">
        <Absaetze>
          <li>
            Der Käufer versichert, dass das Fahrzeug nicht entgegen geltender Embargos, Sanktionen
            oder Exportbeschränkungen der Europäischen Union oder der Bundesrepublik Deutschland
            ausgeführt oder weiterveräußert wird.
          </li>
          <li>
            GCN ist berechtigt, die Lieferung zu verweigern oder vom Vertrag zurückzutreten, wenn
            Anhaltspunkte für einen Verstoß bestehen. Schadensersatzansprüche des Käufers sind in
            diesem Fall ausgeschlossen, soweit GCN kein Verschulden trifft.
          </li>
          <li>
            Der Käufer stellt GCN von Schäden und Kosten frei, die durch einen von ihm zu
            vertretenden Verstoß gegen diese Pflichten entstehen.
          </li>
        </Absaetze>
      </Abschnitt>

      {/* ── Teil F ─────────────────────────────────────────────────────── */}
      <Teil buchstabe="F" titel="Schlussbestimmungen" />

      <Abschnitt ebene="h3" nummer="§ 18" titel="Widerrufsrecht bei Fernabsatz">
        <Absaetze>
          <li>
            Verbrauchern steht ein gesetzliches Widerrufsrecht nur zu, wenn der Vertrag – ein
            Kaufvertrag, ein Vermittlungsauftrag oder ein Suchauftrag – ausschließlich über
            Fernkommunikationsmittel (z. B. Telefon, E-Mail, Online-Plattform) oder außerhalb der
            Geschäftsräume geschlossen wurde. Bei Vertragsschluss in den Geschäftsräumen von GCN
            besteht kein Widerrufsrecht.
          </li>
          <li>
            In diesen Fällen gilt für den Kauf eines Fahrzeugs Belehrung A, für Vermittlungs- und
            Suchaufträge Belehrung B.
          </li>
        </Absaetze>

        <div className="rounded-2xl border border-linea bg-crema p-5 space-y-4">
          <Unterabschnitt titel="A · Widerrufsbelehrung für den Kauf eines Fahrzeugs">
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein
              von Ihnen benannter Dritter, der nicht der Beförderer ist, das Fahrzeug in Besitz
              genommen haben bzw. hat.
            </p>
            <p>
              Um Ihr Widerrufsrecht auszuüben, müssen Sie uns (Anbieter gemäß § 21) mittels einer
              eindeutigen Erklärung (z. B. ein mit der Post versandter Brief oder eine E-Mail) über
              Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das
              beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die
              Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </Unterabschnitt>
          <Unterabschnitt titel="Folgen des Widerrufs (Kauf)">
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
              erhalten haben, einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen
              Kosten, die sich daraus ergeben, dass Sie eine andere Art der Lieferung als die von
              uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und
              spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung
              über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung
              verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart;
              in keinem Fall werden Ihnen wegen dieser Rückzahlung Entgelte berechnet. Wir können
              die Rückzahlung verweigern, bis wir das Fahrzeug wieder zurückerhalten haben oder bis
              Sie den Nachweis erbracht haben, dass Sie das Fahrzeug zurückgesandt haben, je
              nachdem, welches der frühere Zeitpunkt ist.
            </p>
            <p>
              Sie haben das Fahrzeug unverzüglich und in jedem Fall spätestens binnen vierzehn
              Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an
              uns zurückzugeben oder zu übergeben. Die Frist ist gewahrt, wenn Sie das Fahrzeug vor
              Ablauf der Frist von vierzehn Tagen zurückgeben. Sie tragen die unmittelbaren Kosten
              der Rücksendung bzw. Rückführung des Fahrzeugs. Sie müssen für einen etwaigen
              Wertverlust des Fahrzeugs nur aufkommen, wenn dieser Wertverlust auf einen zur
              Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise nicht notwendigen Umgang
              mit ihm zurückzuführen ist.
            </p>
          </Unterabschnitt>
          <Unterabschnitt titel="B · Widerrufsbelehrung für Vermittlungs- und Suchaufträge">
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des
              Vertragsabschlusses. Für die Ausübung des Widerrufsrechts und die Rückzahlung gilt das
              unter A Gesagte entsprechend.
            </p>
            <p>
              Haben Sie verlangt, dass die Dienstleistungen während der Widerrufsfrist beginnen
              sollen, so haben Sie uns einen angemessenen Betrag zu zahlen, der dem Anteil der bis
              zu dem Zeitpunkt, zu dem Sie uns von der Ausübung des Widerrufsrechts hinsichtlich
              dieses Vertrags unterrichten, bereits erbrachten Dienstleistungen im Vergleich zum
              Gesamtumfang der im Vertrag vorgesehenen Dienstleistungen entspricht.
            </p>
          </Unterabschnitt>
          <Unterabschnitt titel="Muster-Widerrufsformular">
            <p>
              Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und
              senden Sie es zurück.
            </p>
            <div className="space-y-3 text-nero">
              <p>
                An: GCN Fahrzeughandel GbR, Sommeraurstr. 46, 78112 Sankt Georgen im Schwarzwald,
                E-Mail: {EMAIL}
              </p>
              <p>
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über
                den Kauf des folgenden Fahrzeugs (*) / die Erbringung der folgenden Dienstleistung
                (Vermittlungs- oder Suchauftrag) (*):
              </p>
              <Formularzeile label="Fahrzeug (Marke, Modell, Fahrzeug-Ident.-Nr.) bzw. Auftrag" />
              <Formularzeile label="Bestellt am (*) / erhalten am (*)" />
              <Formularzeile label="Name des/der Verbraucher(s)" />
              <Formularzeile label="Anschrift des/der Verbraucher(s)" />
              <Formularzeile label="Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)" />
              <Formularzeile label="Datum" />
              <p className="text-xs text-asfalto">(*) Unzutreffendes streichen.</p>
            </div>
            <p>
              Eine druckbare Fassung finden Sie auch in der{" "}
              <Link to="/widerruf" className={LINK_KLASSE}>
                Widerrufsbelehrung
              </Link>
              .
            </p>
          </Unterabschnitt>
        </div>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 19" titel="Datenschutz und Streitbeilegung">
        <Absaetze>
          <li>
            GCN verarbeitet personenbezogene Daten der Kunden zur Vertragsabwicklung, zur Erfüllung
            gesetzlicher Pflichten (insbesondere nach Steuer-, Handels- und Geldwäscherecht) und
            nach Maßgabe der{" "}
            <Link to="/datenschutz" className={LINK_KLASSE}>
              Datenschutzerklärung
            </Link>{" "}
            von GCN.
          </li>
          <li>
            GCN ist nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen (§ 36 VSBG).
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 20" titel="Anwendbares Recht, Gerichtsstand, Salvatorische Klausel">
        <Absaetze>
          <li>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts
            (CISG). Gegenüber Verbrauchern gilt diese Rechtswahl nur, soweit dadurch nicht der
            Schutz zwingender Bestimmungen des Staates entzogen wird, in dem der Verbraucher seinen
            gewöhnlichen Aufenthalt hat.
          </li>
          <li>
            Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder
            öffentlich-rechtliches Sondervermögen oder hat er keinen allgemeinen Gerichtsstand in
            Deutschland, ist ausschließlicher Gerichtsstand für alle Streitigkeiten der Sitz von
            GCN.
          </li>
          <li>
            Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der
            übrigen Bestimmungen unberührt. An die Stelle der unwirksamen Bestimmung tritt die
            gesetzliche Regelung.
          </li>
        </Absaetze>
      </Abschnitt>

      <Abschnitt ebene="h3" nummer="§ 21" titel="Anbieter">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-[11rem_1fr]">
          <dt className="text-nero" style={{ fontWeight: 600 }}>Firma und Rechtsform</dt>
          <dd>GCN Fahrzeughandel GbR</dd>
          <dt className="text-nero" style={{ fontWeight: 600 }}>Anschrift</dt>
          <dd>Sommeraurstr. 46, 78112 Sankt Georgen im Schwarzwald</dd>
          <dt className="text-nero" style={{ fontWeight: 600 }}>Vertreten durch</dt>
          <dd>Giosuè Canobbio, Christopher Neun</dd>
          <dt className="text-nero" style={{ fontWeight: 600 }}>Telefon / E-Mail</dt>
          <dd>
            {TELEFON_INTERNATIONAL} ·{" "}
            <a href={`mailto:${EMAIL}`} className={LINK_KLASSE}>
              {EMAIL}
            </a>
          </dd>
        </dl>
      </Abschnitt>
    </Rechtsseite>
  );
}
