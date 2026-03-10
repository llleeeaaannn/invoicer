# Invoicer

A minimal, front-end-only invoice and quote generator. Fill in your details, add line items, and download a PDF — no account, no server, no data leaves your device.

## Features

- Generate **invoices** or **quotes** as downloadable PDFs
- Live A4 preview updates as you type
- Dynamic line items with auto-calculated totals (€)
- Auto-incrementing invoice numbers
- Seller info and payment details saved locally in the browser
- PO number support
- Optional payment details per invoice
- Clean, modern PDF output

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

## Usage

1. Click **⚙ Settings** to enter your business name, address, and payment details — these are saved in your browser and persist across sessions
2. Fill in the invoice fields and add line items
3. Toggle between **Invoice** and **Quote** as needed
4. Click **Download PDF** to save the file
5. Click **New Invoice** to start a fresh invoice — the number auto-increments

## Tech Stack

- [React](https://react.dev) + [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [html2canvas](https://html2canvas.hertzen.com) + [jsPDF](https://github.com/parallax/jsPDF)
