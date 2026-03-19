// ── Invoice status types ──────────────────────────────────────────────
// draft | sent | paid | overdue

export const SEED_INVOICES = [
  {
    id: 'inv001',
    number: 'INV-2025-001',
    factoryId: 'f001',
    factoryName: 'Khaled Textiles Ltd.',
    issueDate: '2025-01-15',
    dueDate:   '2025-01-30',
    period:    'January 2025',
    status:    'paid',
    taxRate:   0,
    notes:     'Thank you for your business. Payment received via bKash.',
    paidDate:  '2025-01-28',
    items: [
      { description: 'ComplyRMG Professional — Monthly Subscription', qty: 1, unitPrice: 12999 },
    ],
  },
  {
    id: 'inv002',
    number: 'INV-2025-002',
    factoryId: 'f003',
    factoryName: 'Rongdhonu Apparels',
    issueDate: '2025-01-28',
    dueDate:   '2025-02-12',
    period:    'February 2025',
    status:    'paid',
    taxRate:   0,
    notes:     '',
    paidDate:  '2025-02-10',
    items: [
      { description: 'ComplyRMG Professional — Monthly Subscription', qty: 1, unitPrice: 12999 },
    ],
  },
  {
    id: 'inv003',
    number: 'INV-2025-003',
    factoryId: 'f005',
    factoryName: 'Shilpa Sweaters Ltd.',
    issueDate: '2025-02-01',
    dueDate:   '2025-02-15',
    period:    'February 2025',
    status:    'paid',
    taxRate:   0,
    notes:     '',
    paidDate:  '2025-02-14',
    items: [
      { description: 'ComplyRMG Professional — Monthly Subscription', qty: 1, unitPrice: 12999 },
    ],
  },
  {
    id: 'inv004',
    number: 'INV-2025-004',
    factoryId: 'f001',
    factoryName: 'Khaled Textiles Ltd.',
    issueDate: '2025-02-15',
    dueDate:   '2025-03-01',
    period:    'March 2025',
    status:    'paid',
    taxRate:   0,
    notes:     '',
    paidDate:  '2025-02-28',
    items: [
      { description: 'ComplyRMG Professional — Monthly Subscription', qty: 1, unitPrice: 12999 },
    ],
  },
  {
    id: 'inv005',
    number: 'INV-2025-005',
    factoryId: 'f002',
    factoryName: 'Nadia Garments Ltd.',
    issueDate: '2025-03-02',
    dueDate:   '2025-03-17',
    period:    'March 2025 (Trial Conversion)',
    status:    'sent',
    taxRate:   0,
    notes:     'Trial period ended. Please pay to continue full access.',
    paidDate:  null,
    items: [
      { description: 'ComplyRMG Starter — Monthly Subscription', qty: 1, unitPrice: 4999 },
      { description: 'Onboarding & Setup Fee (one-time)', qty: 1, unitPrice: 2000 },
    ],
  },
  {
    id: 'inv006',
    number: 'INV-2025-006',
    factoryId: 'f003',
    factoryName: 'Rongdhonu Apparels',
    issueDate: '2025-03-01',
    dueDate:   '2025-03-15',
    period:    'March 2025',
    status:    'overdue',
    taxRate:   0,
    notes:     'Payment overdue. Please settle immediately to avoid service suspension.',
    paidDate:  null,
    items: [
      { description: 'ComplyRMG Professional — Monthly Subscription', qty: 1, unitPrice: 12999 },
    ],
  },
  {
    id: 'inv007',
    number: 'INV-2025-007',
    factoryId: 'f005',
    factoryName: 'Shilpa Sweaters Ltd.',
    issueDate: '2025-03-15',
    dueDate:   '2025-03-30',
    period:    'March 2025',
    status:    'draft',
    taxRate:   0,
    notes:     '',
    paidDate:  null,
    items: [
      { description: 'ComplyRMG Professional — Monthly Subscription', qty: 1, unitPrice: 12999 },
    ],
  },
]

/** Generate the next invoice number */
export function nextInvoiceNumber(invoices) {
  const year = new Date().getFullYear()
  const nums = invoices
    .map(i => parseInt(i.number.split('-')[2] || '0'))
    .filter(n => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return `INV-${year}-${String(max + 1).padStart(3, '0')}`
}

/** Calculate invoice total */
export function invoiceTotal(invoice) {
  const subtotal = (invoice.items || []).reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const tax      = Math.round(subtotal * (invoice.taxRate || 0) / 100)
  return { subtotal, tax, total: subtotal + tax }
}
