export default function LineItems({ items, onChange }) {
  function updateItem(index, field, value) {
    const updated = items.map((item, i) => {
      if (i !== index) return item
      const newItem = { ...item, [field]: value }
      if (field === 'quantity' || field === 'unitPrice') {
        const qty = parseFloat(field === 'quantity' ? value : item.quantity) || 0
        const price = parseFloat(field === 'unitPrice' ? value : item.unitPrice) || 0
        newItem.total = qty * price
      }
      return newItem
    })
    onChange(updated)
  }

  function addItem() {
    onChange([...items, { description: '', quantity: '', unitPrice: '', total: 0, notes: '' }])
  }

  function removeItem(index) {
    onChange(items.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3">
      <div className="hidden sm:grid grid-cols-12 gap-2 text-xs font-medium text-gray-500 uppercase tracking-wide px-1">
        <div className="col-span-5">Description</div>
        <div className="col-span-2 text-right">Qty</div>
        <div className="col-span-2 text-right">Unit €</div>
        <div className="col-span-2 text-right">Total</div>
        <div className="col-span-1"></div>
      </div>

      {items.map((item, index) => (
        <div key={index} className="space-y-1">
          <div className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              value={item.description}
              onChange={(e) => updateItem(index, 'description', e.target.value)}
              placeholder="Description"
              className="col-span-5 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => updateItem(index, 'quantity', e.target.value)}
              placeholder="1"
              min="0"
              className="col-span-2 border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <input
              type="number"
              value={item.unitPrice}
              onChange={(e) => updateItem(index, 'unitPrice', e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="col-span-2 border border-gray-300 rounded px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-1 focus:ring-gray-400"
            />
            <div className="col-span-2 text-sm text-right font-medium text-gray-700 pr-1">
              €{(item.total || 0).toFixed(2)}
            </div>
            <button
              onClick={() => removeItem(index)}
              className="col-span-1 text-gray-400 hover:text-red-500 text-lg leading-none flex items-center justify-center"
              title="Remove item"
            >
              ×
            </button>
          </div>
          <input
            type="text"
            value={item.notes}
            onChange={(e) => updateItem(index, 'notes', e.target.value)}
            placeholder="Item notes (optional)"
            className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 bg-gray-50"
          />
        </div>
      ))}

      <button
        onClick={addItem}
        className="text-sm text-blue-600 hover:text-blue-800 font-medium mt-1"
      >
        + Add line item
      </button>
    </div>
  )
}
