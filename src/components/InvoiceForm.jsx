import LineItems from './LineItems.jsx'

export default function InvoiceForm({ invoice, onChange }) {
  function update(field, value) {
    onChange({ ...invoice, [field]: value })
  }

  const isInvoice = invoice.docType === 'invoice'

  return (
    <div className="space-y-6">
      {/* Document type toggle */}
      <div className="flex rounded-lg border border-gray-300 overflow-hidden w-fit">
        <button
          onClick={() => update('docType', 'invoice')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            isInvoice ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Invoice
        </button>
        <button
          onClick={() => update('docType', 'quote')}
          className={`px-5 py-2 text-sm font-medium transition-colors ${
            !isInvoice ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          Quote
        </button>
      </div>

      {/* Document number and dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            {isInvoice ? 'Invoice' : 'Quote'} #
          </label>
          <input
            type="text"
            value={invoice.number}
            onChange={(e) => update('number', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Date
          </label>
          <input
            type="date"
            value={invoice.date}
            onChange={(e) => update('date', e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        {isInvoice && (
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Due date
            </label>
            <input
              type="date"
              value={invoice.dueDate}
              onChange={(e) => update('dueDate', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            PO Number <span className="normal-case text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            value={invoice.poNumber}
            onChange={(e) => update('poNumber', e.target.value)}
            placeholder="PO-12345"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Bill to */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Bill to</h3>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Name</label>
          <input
            type="text"
            value={invoice.billToName}
            onChange={(e) => update('billToName', e.target.value)}
            placeholder="Client name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
          <textarea
            value={invoice.billToAddress}
            onChange={(e) => update('billToAddress', e.target.value)}
            placeholder="Client address"
            rows={3}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
          />
        </div>
      </div>

      {/* Line items */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Line items</h3>
        <LineItems items={invoice.lineItems} onChange={(items) => update('lineItems', items)} />
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Notes
        </label>
        <textarea
          value={invoice.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Additional notes..."
          rows={3}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
        />
      </div>

      {/* Include payment details */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={invoice.includePaymentDetails}
          onChange={(e) => update('includePaymentDetails', e.target.checked)}
          className="w-4 h-4 accent-gray-700"
        />
        <span className="text-sm text-gray-700">Include payment details</span>
      </label>
    </div>
  )
}
