import { forwardRef } from 'react'
import { COMPANIES } from '../data/companies.js'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [year, month, day] = dateStr.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${parseInt(day)} ${months[parseInt(month) - 1]} ${year}`
}

const InvoicePreview = forwardRef(function InvoicePreview({ invoice }, ref) {
  const company = COMPANIES[invoice.seller] || COMPANIES.botaco
  const isInvoice = invoice.docType === 'invoice'
  const total = invoice.lineItems.reduce((sum, item) => sum + (item.total || 0), 0)
  const numStr = String(invoice.number).padStart(3, '0')
  const docLabel = isInvoice ? 'Invoice' : 'Quote'

  const hasBillTo = invoice.billToName || invoice.billToAddress
  const hasDetails = invoice.date || invoice.dueDate || invoice.poNumber

  return (
    <div
      ref={ref}
      className="a4-preview bg-white text-gray-900"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif" }}
    >
      {/* Top accent bar */}
      <div className="h-1.5 bg-gray-900 w-full" />

      {/* Header */}
      <div className="px-12 pt-10 pb-8 flex justify-between items-start">
        <div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">{company.name}</div>
          {company.address && (
            <div className="text-xs text-gray-500 whitespace-pre-line mt-1 leading-relaxed">
              {company.address}
            </div>
          )}
        </div>
        <div className="text-right text-xs text-gray-500 space-y-0.5 mt-0.5">
          {company.phone && <div>{company.phone}</div>}
          {company.email && <div>{company.email}</div>}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-12 border-t border-gray-100" />

      {/* Document type + meta row */}
      <div className="px-12 pt-8 pb-6 flex justify-between items-start">
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {docLabel}
          </div>
          <div className="text-4xl font-bold text-gray-900 tracking-tight">
            #{numStr}
          </div>
        </div>

        {/* Details box */}
        {hasDetails && (
          <div className="border border-gray-200 rounded-lg overflow-hidden text-sm">
            {invoice.date && (
              <div className="flex">
                <div className="bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide w-28">
                  Date
                </div>
                <div className="px-4 py-2.5 text-gray-800">{formatDate(invoice.date)}</div>
              </div>
            )}
            {isInvoice && invoice.dueDate && (
              <div className="flex border-t border-gray-100">
                <div className="bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide w-28">
                  Due date
                </div>
                <div className="px-4 py-2.5 text-gray-800">{formatDate(invoice.dueDate)}</div>
              </div>
            )}
            {invoice.poNumber && (
              <div className="flex border-t border-gray-100">
                <div className="bg-gray-50 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide w-28">
                  PO number
                </div>
                <div className="px-4 py-2.5 text-gray-800">{invoice.poNumber}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bill to box */}
      {hasBillTo && (
        <div className="px-12 pb-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
              Bill to
            </div>
            <div className="px-4 py-3">
              {invoice.billToName && (
                <div className="font-semibold text-gray-900 text-sm">{invoice.billToName}</div>
              )}
              {invoice.billToAddress && (
                <div className="text-xs text-gray-500 whitespace-pre-line mt-0.5 leading-relaxed">
                  {invoice.billToAddress}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Line items */}
      <div className="px-12 pb-6">
        <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-semibold text-xs text-gray-400 uppercase tracking-wide">
                Description
              </th>
              <th className="text-right px-4 py-3 font-semibold text-xs text-gray-400 uppercase tracking-wide w-16">
                Qty
              </th>
              <th className="text-right px-4 py-3 font-semibold text-xs text-gray-400 uppercase tracking-wide w-28">
                Unit price
              </th>
              <th className="text-right px-4 py-3 font-semibold text-xs text-gray-400 uppercase tracking-wide w-28">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item, index) =>
              item.description || item.quantity || item.unitPrice ? (
                <tr key={index} className="border-t border-gray-100">
                  <td className="px-4 py-3 text-gray-800">
                    <div>{item.description}</div>
                    {item.notes && (
                      <div className="text-xs text-gray-400 mt-0.5">{item.notes}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-500">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-500">
                    {item.unitPrice !== '' ? `€${parseFloat(item.unitPrice || 0).toFixed(2)}` : ''}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    €{(item.total || 0).toFixed(2)}
                  </td>
                </tr>
              ) : null
            )}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="px-12 pb-8 flex justify-end">
        <div className="border border-gray-200 rounded-lg overflow-hidden min-w-56">
          <div className="flex justify-between bg-gray-900 px-5 py-3">
            <span className="text-xs font-semibold text-gray-300 uppercase tracking-widest">
              Total
            </span>
            <span className="text-xl font-bold text-white">€{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Payment details + Notes */}
      {(invoice.notes || invoice.paymentDetails) && (
        <div className="px-12 pb-10 space-y-4">
          {invoice.notes && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                Notes
              </div>
              <div className="px-4 py-3 text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                {invoice.notes}
              </div>
            </div>
          )}
          {invoice.paymentDetails && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-200">
                Payment details
              </div>
              <div className="px-4 py-3 text-xs text-gray-600 whitespace-pre-line leading-relaxed">
                {invoice.paymentDetails}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
})

export default InvoicePreview
