# Senior Maths Competition 2026 — browser OMR marker

A static, client-side marker for the QR-coded Senior Maths Competition 2026 answer sheets.

## Privacy model

The application has no upload endpoint. Scanned PDFs/images, rosters and answer keys are read with browser APIs and processed in the browser tab. The repository intentionally does **not** contain the 2026 answer key; load the private JSON key or paste the 25 answers when marking.

The page loads four third-party JavaScript libraries from public CDNs: PDF.js, jsQR, SheetJS and OpenCV.js. These libraries provide PDF rendering, QR decoding, Excel export and image processing respectively.

## Workflow

1. Open the marker in Chrome or Edge.
2. Paste the 25-letter answer key or load the private answer-key JSON file.
3. Optionally load a CSV/XLSX roster with Candidate ID, Name, Year and School columns.
4. Drop in a multi-page PDF (or image files) containing scanned OMR sheets.
5. Click **Mark papers**.
6. Resolve anything shown under **Review flagged responses**.
7. Export the Excel workbook or CSV.

## Scanning recommendations

- A4 at actual size / 100%.
- About 300 dpi.
- Greyscale or colour.
- One answer sheet per PDF page.
- Keep all four black registration squares visible.

## Supported QR format

`SMC2026|FORM=A|CANDIDATE=001|OMR=1.0`

Candidate IDs 001–140 are expected.

## Marking logic

The marker uses the four registration squares to perspective-correct each page, then measures ink density inside the known A–E bubble positions. Light, multiple or ambiguous marks are flagged for manual review rather than silently guessed.

Default score settings are 25 starting marks, +4 correct, -1 incorrect and 0 blank.