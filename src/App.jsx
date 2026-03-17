import { useEffect, useRef, useState } from 'react'
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

function savedKey(inv) {
  return `${inv.seller}::${inv.number}`
}

export default function App() {
  const [lastNumber, setLastNumber] = useLocalStorage('invoicer-last-number', 1)
  const [savedInvoices, setSavedInvoices] = useLocalStorage('invoicer-saved', [])
  const [invoice, setInvoice] = useState(() => defaultInvoice(lastNumber))
  const [generating, setGenerating] = useState(false)
  const [showPrevious, setShowPrevious] = useState(false)
  const previewRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    if (!showPrevious) return
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPrevious(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPrevious])

  function handleNewInvoice() {
    const next = (parseInt(lastNumber) || 1) + 1
    setLastNumber(next)
    setInvoice(defaultInvoice(next))
  }

  function saveInvoice(inv) {
    const key = savedKey(inv)
    setSavedInvoices((prev) => {
      const filtered = prev.filter((s) => savedKey(s) !== key)
      return [{ ...inv, savedAt: new Date().toISOString() }, ...filtered]
    })
  }

  async function handleDownload() {
    if (!previewRef.current) return
    setGenerating(true)
    try {
      await generatePdf(previewRef.current, invoice.number, invoice.billToName, invoice.docType)
      saveInvoice(invoice)
    } finally {
      setGenerating(false)
    }
  }

  function handleLoadSaved(saved) {
    setInvoice(saved)
    setShowPrevious(false)
  }

  const sellerLabel = { botaco: 'Buteyko', pauline: 'Pauline' }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-end sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Previous invoices dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowPrevious((v) => !v)}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium border border-gray-300 rounded px-3 py-1.5 hover:border-gray-400 transition-colors"
            >
              Previous {savedInvoices.length > 0 && <span className="text-gray-400">({savedInvoices.length})</span>}
            </button>
            {showPrevious && (
              <div className="absolute right-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
                {savedInvoices.length === 0 ? (
                  <p className="text-sm text-gray-400 px-4 py-3">No saved invoices yet.</p>
                ) : (
                  <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                    {savedInvoices.map((s) => (
                      <li key={savedKey(s) + s.savedAt}>
                        <button
                          onClick={() => handleLoadSaved(s)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-medium text-gray-800">
                              {s.docType === 'quote' ? 'Quote' : 'Invoice'} #{s.number}
                              <span className="ml-1.5 text-xs text-gray-400">{sellerLabel[s.seller] ?? s.seller}</span>
                            </span>
                            <span className="text-xs text-gray-400 shrink-0">{s.date}</span>
                          </div>
                          {s.billToName && (
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{s.billToName}</p>
                          )}
                          {s.poNumber && (
                            <p className="text-xs text-gray-400 mt-0.5">PO: {s.poNumber}</p>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
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
