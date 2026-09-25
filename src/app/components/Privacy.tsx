import { EMAIL, TELEFON_INTERNATIONAL } from "../firma";
import { Abschnitt, AnschriftKasten, LINK_KLASSE, Rechtsseite, Unterabschnitt } from "./Rechtsseite";

function Extern({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_KLASSE}>
      {children}
    </a>
  );
}

export function Privacy() {
  return (
    <Rechtsseite
      titel="Datenschutzerklärung."
      seoTitel="Datenschutz – GCN Fahrzeughandel GbR"
      seoBeschreibung="Datenschutzerklärung der GCN Fahrzeughandel GbR gemäß DSGVO."
      einleitung="Informationen gemäß Art. 13 und 14 DSGVO zum Umgang mit Ihren personenbezogenen Daten."
      stand="September 2026"
    >
      <Abschnitt nummer="01" titel="Verantwortlicher">
        <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
        <AnschriftKasten>
          <p className="mt-2">Vertreten durch die Gesellschafter Giosuè Canobbio und Christopher Neun</p>
          <p className="mt-2">Telefon: {TELEFON_INTERNATIONAL}</p>
          <a href={`mailto:${EMAIL}`} className={LINK_KLASSE}>
            {EMAIL}
          </a>
        </AnschriftKasten>
        <p>
          Einen Datenschutzbeauftragten haben wir nicht benannt, weil wir dazu gesetzlich nicht
          verpflichtet sind.
        </p>
      </Abschnitt>

      <Abschnitt nummer="02" titel="Hosting und Server-Log-Dateien">
        <Unterabschnitt titel="Hoster">
          <p>
            Diese Website wird über GitHub Pages bereitgestellt. Anbieter ist die GitHub, Inc.,
            88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Die Website enthält nur
            statische Dateien. Es werden keine Cookies gesetzt und keine Analyse- oder
            Tracking-Werkzeuge eingesetzt.
          </p>
        </Unterabschnitt>
        <Unterabschnitt titel="Server-Log-Dateien">
          <p>
            Beim Aufruf der Website übermittelt Ihr Browser automatisch Daten an den Server von
            GitHub. Dazu gehören insbesondere:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>IP-Adresse</li>
            <li>Datum und Uhrzeit der Anfrage</li>
            <li>aufgerufene Seite bzw. Datei</li>
            <li>Referrer-URL</li>
            <li>Browsertyp, Browserversion und Betriebssystem</li>
          </ul>
          <p>
            Diese Daten sind technisch erforderlich, um die Website auszuliefern, und werden nach
            Angaben von GitHub zur Gewährleistung der Sicherheit protokolliert. Rechtsgrundlage ist
            Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse liegt in einer sicheren und
            stabilen Bereitstellung der Website.
          </p>
          <p>
            <strong className="text-nero" style={{ fontWeight: 600 }}>Speicherdauer:</strong> Wir
            selbst haben keinen Zugriff auf diese Log-Dateien und werten sie nicht aus. GitHub
            speichert sie nur so lange, wie es für Sicherheitszwecke erforderlich ist, und nennt
            dafür keine feste Frist. Einzelheiten finden Sie in der{" "}
            <Extern href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement">
              Datenschutzerklärung von GitHub
            </Extern>
            .
          </p>
          <p>
            GitHub ist unter dem EU-US Data Privacy Framework zertifiziert. Die Übermittlung in die
            USA stützt sich auf den Angemessenheitsbeschluss der EU-Kommission (Art. 45 DSGVO).
          </p>
        </Unterabschnitt>
      </Abschnitt>

      <Abschnitt nummer="03" titel="Kontaktformular (Suchauftrag und Verkaufsangebot)">
        <p>
          Wenn Sie uns über das Formular einen Suchauftrag oder ein Verkaufsangebot senden,
          verarbeiten wir Ihre Angaben: Name, E-Mail-Adresse, optional Telefonnummer, die
          Fahrzeugangaben und Ihre Nachricht. Wir nutzen diese Daten ausschließlich, um Ihre
          Anfrage zu bearbeiten und uns bei Ihnen zu melden.
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, weil die Anfrage der Anbahnung eines
          Vertrags dient. Soweit das im Einzelfall nicht zutrifft, stützen wir uns auf unser
          berechtigtes Interesse an der Beantwortung von Anfragen (Art. 6 Abs. 1 lit. f DSGVO).
        </p>
        <Unterabschnitt titel="Eingesetzte Dienstleister">
          <p>
            <strong className="text-nero" style={{ fontWeight: 600 }}>Supabase:</strong> Die
            Formulardaten werden in einer Datenbank der Supabase, Inc. (USA) gespeichert, damit wir
            Anfragen intern bearbeiten können. Mit Supabase besteht ein Vertrag zur
            Auftragsverarbeitung. Soweit Daten in die USA übermittelt werden, geschieht das auf
            Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
          </p>
          <p>
            <strong className="text-nero" style={{ fontWeight: 600 }}>EmailJS:</strong> Über den
            Dienst EmailJS (EmailJS Pte. Ltd., Singapur) erhalten wir eine E-Mail-Benachrichtigung
            mit dem Inhalt Ihrer Anfrage. Dafür werden die Formulardaten an EmailJS übermittelt.
            Die Übermittlung erfolgt auf Grundlage der EU-Standardvertragsklauseln (Art. 46 Abs. 2
            lit. c DSGVO).
          </p>
        </Unterabschnitt>
        <Unterabschnitt titel="Speicherdauer">
          <p>
            Wir löschen Ihre Anfrage, sobald sie abschließend bearbeitet ist, spätestens sechs
            Monate nach dem letzten Kontakt. Kommt ein Vertrag zustande, bewahren wir die dafür
            nötigen Unterlagen so lange auf, wie es handels- und steuerrechtlich vorgeschrieben ist
            (bis zu zehn Jahre, § 257 HGB, § 147 AO).
          </p>
        </Unterabschnitt>
      </Abschnitt>

      <Abschnitt nummer="04" titel="Kontakt per E-Mail (Microsoft Outlook)">
        <p>
          Für unser E-Mail-Postfach nutzen wir Microsoft Outlook. Anbieter ist die Microsoft
          Ireland Operations Limited, One Microsoft Place, South County Business Park,
          Leopardstown, Dublin 18, Irland. Wenn Sie uns eine E-Mail schreiben und wenn uns eine
          Formularbenachrichtigung erreicht, werden Ihre Angaben auf Servern von Microsoft
          gespeichert. Dabei kann es zu einer Übermittlung in die USA kommen. Microsoft ist unter
          dem EU-US Data Privacy Framework zertifiziert (Art. 45 DSGVO).
        </p>
        <p>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit es um einen Vertrag oder dessen
          Anbahnung geht, im Übrigen Art. 6 Abs. 1 lit. f DSGVO. Für die Speicherdauer gilt das
          unter Abschnitt 03 Gesagte.{" "}
          <Extern href="https://privacy.microsoft.com/de-de/privacystatement">
            Datenschutzerklärung von Microsoft
          </Extern>
        </p>
      </Abschnitt>

      <Abschnitt nummer="05" titel="Kundenstimmen">
        <p>
          Auf der Startseite zeigen wir ausgewählte Bewertungen unserer Kundinnen und Kunden mit
          ihrem Namen und einem Foto ihres Fahrzeugs. Diese Inhalte sind fest auf unserer Website
          hinterlegt, es werden dafür keine Daten von Dritten geladen. Rechtsgrundlage ist die
          Einwilligung der jeweiligen Person (Art. 6 Abs. 1 lit. a DSGVO). Sie kann jederzeit mit
          Wirkung für die Zukunft widerrufen werden, wir entfernen die Stimme dann umgehend.
        </p>
        <p>
          Wenn Sie auf „Bewertung schreiben“ oder „Alle Bewertungen auf Google“ klicken, öffnet
          sich eine Seite der Google Ireland Limited, Gordon House, Barrow Street, Dublin 4,
          Irland. Dort gilt die{" "}
          <Extern href="https://policies.google.com/privacy?hl=de">
            Datenschutzerklärung von Google
          </Extern>
          .
        </p>
      </Abschnitt>

      <Abschnitt nummer="06" titel="Instagram und andere externe Links">
        <p>
          Auf unserer Website verlinken wir auf unser Instagram-Profil. Es handelt sich um einen
          einfachen Link, kein eingebettetes Plugin. Beim Besuch unserer Website werden deshalb
          keine Daten an Instagram übertragen. Erst wenn Sie den Link anklicken, gelangen Sie zu
          Instagram, einem Dienst der Meta Platforms Ireland Limited, Merrion Road, Dublin 4,
          Irland. Dort gilt die{" "}
          <Extern href="https://privacycenter.instagram.com/policy">
            Datenschutzerklärung von Instagram
          </Extern>
          . Dasselbe gilt für Links zu mobile.de und anderen externen Seiten.
        </p>
      </Abschnitt>

      <Abschnitt nummer="07" titel="Speicherung im Browser">
        <p>
          Schriften werden von unserem eigenen Server geladen, nicht von Google Fonts. Wenn Sie das
          Minispiel im Footer spielen, speichert Ihr Browser Ihren besten Punktestand lokal
          (localStorage). Dieser Wert verlässt Ihr Gerät nicht und lässt sich über die
          Browsereinstellungen jederzeit löschen.
        </p>
      </Abschnitt>

      <Abschnitt nummer="08" titel="Ihre Rechte">
        <p>Sie haben uns gegenüber folgende Rechte hinsichtlich Ihrer personenbezogenen Daten:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Auskunft (Art. 15 DSGVO)</li>
          <li>Berichtigung (Art. 16 DSGVO)</li>
          <li>Löschung (Art. 17 DSGVO)</li>
          <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
          <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        </ul>
        <Unterabschnitt titel="Widerruf Ihrer Einwilligung">
          <p>
            Haben Sie in eine Verarbeitung eingewilligt, können Sie diese Einwilligung jederzeit
            mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3 DSGVO). Eine formlose Nachricht
            an{" "}
            <a href={`mailto:${EMAIL}`} className={LINK_KLASSE}>
              {EMAIL}
            </a>{" "}
            genügt. Die Rechtmäßigkeit der bis dahin erfolgten Verarbeitung bleibt unberührt.
          </p>
        </Unterabschnitt>
        <Unterabschnitt titel="Widerspruchsrecht">
          <p>
            Verarbeiten wir Daten auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1
            lit. f DSGVO), können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben,
            jederzeit widersprechen (Art. 21 DSGVO). Wir verarbeiten die Daten dann nicht mehr, es
            sei denn, wir können zwingende schutzwürdige Gründe nachweisen, die Ihre Interessen
            überwiegen, oder die Verarbeitung dient der Geltendmachung, Ausübung oder Verteidigung
            von Rechtsansprüchen.
          </p>
        </Unterabschnitt>
        <Unterabschnitt titel="Beschwerderecht bei der Aufsichtsbehörde">
          <p>
            Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren
            (Art. 77 DSGVO). Für uns zuständig ist:
          </p>
          <div className="bg-crema border border-linea rounded-2xl p-4 mt-2">
            <p className="text-nero" style={{ fontWeight: 600 }}>
              Der Landesbeauftragte für den Datenschutz und die Informationsfreiheit
              Baden-Württemberg
            </p>
            <p>Lautenschlagerstraße 20</p>
            <p>70173 Stuttgart</p>
            <Extern href="https://www.baden-wuerttemberg.datenschutz.de">
              www.baden-wuerttemberg.datenschutz.de
            </Extern>
          </div>
        </Unterabschnitt>
      </Abschnitt>

      <Abschnitt nummer="09" titel="SSL-/TLS-Verschlüsselung">
        <p>
          Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Eine verschlüsselte
          Verbindung erkennen Sie an „https://“ in der Adresszeile Ihres Browsers. Daten, die Sie
          über das Formular senden, können dann nicht von Dritten mitgelesen werden.
        </p>
      </Abschnitt>
    </Rechtsseite>
  );
}
