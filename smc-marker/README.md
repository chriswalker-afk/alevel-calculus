# Senior Maths Competition browser OMR marker

A static, client-side marker and certificate generator for QR-coded Senior Maths Competition answer sheets.

## Reusable competition settings

The competition name and edition year are editable at the top of the page. They are used for:

- page headings and export filenames;
- QR year checks;
- results-sheet metadata;
- certificate titles and certificate filenames.

The setting is stored in the browser so a new edition does not require editing the source code.

The default edition remains 2026 for the existing answer sheets, but the QR reader accepts the generic format:

`SMCYYYY|FORM=A|CANDIDATE=001|OMR=1.0`

For example, a 2027 sheet can use `SMC2027|FORM=A|CANDIDATE=001|OMR=1.0`.

## Privacy model

The application has no upload endpoint. Scanned PDFs/images, rosters, answer keys and imported results sheets are read with browser APIs and processed in the browser tab.

The repository intentionally does **not** contain a private answer key. Load the JSON answer key or paste the 25 answers when marking.

The page uses public browser libraries for PDF rendering, QR decoding and Excel import/export. Bubble detection and page alignment use the marker's own browser JavaScript; OpenCV is not required.

## Marking workflow

1. Set the competition name and edition year.
2. Paste the 25-letter answer key or load the private answer-key JSON file.
3. Optionally load a CSV/XLSX roster with Candidate ID, Name, Year and School columns.
4. Drop in a multi-page PDF or image files containing scanned OMR sheets.
5. Click **Mark papers**.
6. Resolve anything shown under **Review flagged responses**.
7. Export the Excel workbook or CSV.

The exported Results sheet includes the competition name, competition year and maximum score so it can later be reloaded by the certificate generator.

## Certificate workflow

Certificates can be generated either from the currently marked results or by loading a previously exported Results Excel/CSV file.

The five blank SVG templates are:

- Participation
- Silver
- Gold
- Best in Year
- Best in School

The generator fills the templates locally with student name, year group, school, score, competition name, edition year, date and signatory.

Silver and Gold thresholds can use an absolute score or percentage. Best in Year and Best in School are calculated from the available completed results; tied top scores are included.

## Scanning recommendations

- A4 at actual size / 100%.
- About 300 dpi.
- Greyscale or colour.
- One answer sheet per PDF page.
- Keep all four black registration squares visible.

## Marking logic

The marker uses the four registration squares to perspective-correct each page, then measures ink density inside the known A-E bubble positions. Light, multiple or ambiguous marks are flagged for manual review rather than silently guessed.

Default score settings are 25 starting marks, +4 correct, -1 incorrect and 0 blank.

## Rollback snapshot

The site state immediately before the premium certificate redesign and reusable-edition changes was preserved on branch:

`smc-marker-v0.3-backup-2026-10-01`
