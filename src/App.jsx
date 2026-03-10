import { useRef, useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import InvoiceForm from './components/InvoiceForm.jsx'
import InvoicePreview from './components/InvoicePreview.jsx'
import { generatePdf } from './utils/generatePdf.js'

function todayStr() {
  return new Date().toISOString().split('T')[0]
}

function plusDays(dateStr, days) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function defaultInvoice(number) {
  const today = todayStr()
  return {
    seller: 'botaco',
    docType: 'invoice',
    number: String(number).padStart(3, '0'),
    date: today,
    dueDate: plusDays(today, 30),
    billToName: '',
    billToAddress: '',
    poNumber: '',
    lineItems: [{ description: '', quantity: '', unitPrice: '', total: 0, notes: '' }],
    notes: '',
    paymentDetails: '',
  }
}

export default function App() {
  const [lastNumber, setLastNumber] = useLocalStorage('invoicer-last-number', 1)
  const [invoice, setInvoice] = useState(() => defaultInvoice(lastNumber))
  const [generating, setGenerating] = useState(false)
  const previewRef = useRef(null)

  function handleNewInvoice() {
    const next = (parseInt(lastNumber) || 1) + 1
    setLastNumber(next)
    setInvoice(defaultInvoice(next))
  }

  async function handleDownload() {
    if (!previewRef.current) return
    setGenerating(true)
    try {
      await generatePdf(previewRef.current, invoice.number, invoice.billToName, invoice.docType)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewInvoice}
            className="text-sm text-gray-600 hover:text-gray-900 font-medium border border-gray-300 rounded px-3 py-1.5 hover:border-gray-400 transition-colors"
          >
            New Invoice
          </button>
          <button
            onClick={handleDownload}
            disabled={generating}
            className="text-sm bg-gray-900 text-white font-medium rounded px-4 py-1.5 hover:bg-gray-700 transition-colors disabled:opacity-60"
          >
            {generating ? 'Generating…' : 'Download PDF'}
          </button>
        </div>
      </header>

      {/* Two-panel layout */}
      <div className="flex h-[calc(100vh-53px)]">
        {/* Left: Form */}
        <div className="w-96 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto p-6">
          <InvoiceForm invoice={invoice} onChange={setInvoice} />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8 flex justify-center">
          <div className="shadow-xl ring-1 ring-gray-200">
            <InvoicePreview ref={previewRef} invoice={invoice} />
          </div>
        </div>
      </div>
    </div>
  )
}
