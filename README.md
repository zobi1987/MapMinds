# MapMinds

MapMinds ist ein kooperatives Geografie-Quiz. Im ersten Minispiel „Lebenslinien“
werden Geburts- und Todesort einer berühmten Person auf einer Weltkarte gezeigt.
Zehn Runden, drei optionale Hinweise und eine Freitextantwort ergeben zusammen
bis zu 10.000 Punkte.

Die App startet auf Englisch und kann über den Flaggen-Schalter vollständig auf
Deutsch umgestellt werden. Die Auswahl bleibt lokal im Browser gespeichert;
Oberfläche, Hinweise, Biografien sowie Orts- und Ländernamen wechseln gemeinsam.

## Lokal starten

Voraussetzung ist Node.js 24 oder neuer.

```bash
npm install
npm run dev
```

Wichtige Prüfungen:

```bash
npm run validate:catalog
npm run audit:sources
npm test
npm run lint
npm run test:e2e
npm run test:pages
npm run build
```

Für den ersten E2E-Lauf muss Chromium einmal mit
`npx playwright install chromium` installiert werden.

## Katalog erweitern

Die kuratierten Einträge stehen kompakt in `src/data/people.ts`. Ein neuer
Eintrag benötigt:

- eine eindeutige Wikidata-ID und deutsche Namensvarianten,
- genaue Geburts- und Todesorte mit Jahr und Koordinaten,
- Tätigkeitsfeld, Epoche/Region und einen individuellen dritten Hinweis,
- Schwierigkeitsstufe, Kurztext und mindestens eine Quelle.

`npm run validate:catalog` prüft Schema, IDs, Namen, Koordinaten, Jahreslogik,
Quellen und die Verteilung der Schwierigkeitsstufen. Die Prüfung verlangt
mindestens 100 Personen; weitere Einträge können ohne Anpassung der Spiellogik
ergänzt werden.

Die englischen Inhaltsfassungen stehen in `src/data/peopleTranslations.en.ts`.
Jede neue Person benötigt dort denselben Slug als Schlüssel, damit alle
redaktionellen Inhalte in beiden Sprachen verfügbar sind.

`npm run audit:sources` gleicht bei bestehender Internetverbindung alle
Wikidata-IDs mit den kuratierten Namen ab.

Porträtangaben werden aus Wikidata und Wikimedia Commons als statische,
versionierte Datei erzeugt:

```bash
node scripts/fetch-portraits.mjs
```

Die App zeigt Urheber, Lizenz und Link zur Commons-Dateiseite direkt in der
Auflösung. Fehlt ein ausreichend beschriebener Commons-Datensatz, erscheint
bewusst ein Initialen-Platzhalter.

## Daten- und Bildquellen

- Personenmetadaten: verlinkte [Wikidata](https://www.wikidata.org/)-Einträge
  (strukturierte Daten unter CC0), redaktionell auf Deutsch geprüft.
- Weltkarte: `world-atlas` / Natural Earth.
- Porträts: einzelne Werke aus
  [Wikimedia Commons](https://commons.wikimedia.org/); die jeweilige Lizenz
  und Attribution steht am Bild.

Vor einer größeren Veröffentlichung sollten historische Grenzfälle,
Ortskoordinaten und Formulierungen zusätzlich in einem redaktionellen
Vier-Augen-Review geprüft werden.

## GitHub Pages

Der Workflow `.github/workflows/deploy-pages.yml` prüft Katalog, Tests und
Build und veröffentlicht anschließend `dist`. In GitHub unter
**Settings → Pages → Build and deployment** muss als Source **GitHub Actions**
gewählt werden. Vites relativer Base-Pfad funktioniert sowohl auf einer
Projektseite als auch auf einer Benutzerseite.

MapMinds setzt keine Cookies oder Analytics. Nur der Einführungsstatus und der
lokale Bestwert werden im Browser gespeichert.
