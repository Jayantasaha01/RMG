import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import { nextInvoiceNumber, invoiceTotal } from '../data/invoiceData'
import { generateInvoicePDF } from '../../utils/pdfExport'
import { EMAIL_TEMPLATES, WA_TEMPLATES } from '../../utils/notificationTemplates'
import Modal from '../../components/ui/Modal'
import Badge from '../../components/ui/Badge'
import StatCard from '../../components/ui/StatCard'

const STATUS_COLOR = { paid: 'green', sent: 'blue', draft: 'neutral', overdue: 'red' }

const LINE_ITEM_TEMPLATES = [
  { description: 'ComplyRMG Starter — Monthly Subscription',       unitPrice: 4999  },
  { description: 'ComplyRMG Professional — Monthly Subscription',  unitPrice: 12999 },
  { description: 'ComplyRMG Enterprise — Monthly Subscription',    unitPrice: 29999 },
  { description: 'Onboarding & Setup Fee (one-time)',               unitPrice: 2000  },
  { description: 'Audit Prep Consultation (per session)',           unitPrice: 5000  },
  { description: 'Custom Audit Template Development',               unitPrice: 8000  },
  { description: 'BSCI Pre-Audit Mock Review',                      unitPrice: 15000 },
  { description: 'WhatsApp Notification Module (add-on)',           unitPrice: 1500  },
]

export default function Invoices() {
  const { state, dispatch } = useAdmin()
  const { toast }           = useToast()

  const [filter,    setFilter]    = useState('all')
  const [search,    setSearch]    = useState('')
  const [createOpen,setCreateOpen]= useState(false)
  const [viewInv,   setViewInv]   = useState(null)  // invoice being previewed

  // Create form state
  const blankItem = () => ({ id: Date.now(), description: '', qty: 1, unitPrice: 0 })
  const [form, setForm] = useState({
    factoryId: state.factories[0]?.id || '',
    period: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    taxRate: 0,
    notes: '',
    items: [blankItem()],
  })

  function fieldSet(k) { return e => setForm(p => ({ ...p, [k]: e.target.value })) }

  function addItem()  { setForm(p => ({ ...p, items: [...p.items, blankItem()] })) }
  function removeItem(id) { setForm(p => ({ ...p, items: p.items.filter(i => i.id !== id) })) }
  function updateItem(id, k, v) {
    setForm(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [k]: k === 'qty' || k === 'unitPrice' ? Number(v) : v } : i) }))
  }
  function applyTemplate(id, tpl) {
    updateItem(id, 'description', tpl.description)
    updateItem(id, 'unitPrice', tpl.unitPrice)
  }

  const formTotal = form.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const factory   = state.factories.find(f => f.id === form.factoryId)

  function handleCreate() {
    if (!form.factoryId || !form.dueDate) { toast('Select a factory and due date', 'amber'); return }
    if (form.items.some(i => !i.description)) { toast('All line items need a description', 'amber'); return }
    const inv = {
      id:          `inv${Date.now()}`,
      number:      nextInvoiceNumber(state.invoices),
      factoryId:   form.factoryId,
      factoryName: factory?.name || '',
      issueDate:   form.issueDate,
      dueDate:     form.dueDate,
      period:      form.period,
      status:      'draft',
      taxRate:     Number(form.taxRate),
      notes:       form.notes,
      paidDate:    null,
      items:       form.items.map(({ id, ...rest }) => rest),
    }
    dispatch({ type: 'ADD_INVOICE', payload: inv })
    setCreateOpen(false)
    setForm({ factoryId: state.factories[0]?.id || '', period: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '', taxRate: 0, notes: '', items: [blankItem()] })
    toast(`${inv.number} created as draft`, 'green')
  }

  const [emailPreview, setEmailPreview] = useState(null)

  function handleSend(inv) {
    const factory = state.factories.find(f => f.id === inv.factoryId)
    const template = EMAIL_TEMPLATES.invoice_sent(inv, factory)
    setEmailPreview({ inv, factory, template })
  }

  function confirmSend() {
    dispatch({ type: 'SEND_INVOICE', payload: emailPreview.inv.id })
    toast(`${emailPreview.inv.number} sent to ${emailPreview.factory?.email || emailPreview.inv.factoryName}`, 'green')
    // Also log WA message
    const wa = WA_TEMPLATES.invoice_sent(
      emailPreview.factory?.name || emailPreview.inv.factoryName,
      emailPreview.inv.number,
      `৳${invoiceTotal(emailPreview.inv).total.toLocaleString()}`,
      emailPreview.inv.dueDate
    )
    console.log('[WhatsApp would send]:', wa)
    setEmailPreview(null)
  }

  function handlePaid(inv) {
    dispatch({ type: 'MARK_INVOICE_PAID', payload: inv.id })
    toast(`${inv.number} marked as paid ✓`, 'green')
  }

  function handleDelete(inv) {
    if (!window.confirm(`Delete ${inv.number}? This cannot be undone.`)) return
    dispatch({ type: 'DELETE_INVOICE', payload: inv.id })
    toast(`${inv.number} deleted`, 'amber')
  }

  function handlePDF(inv) {
    const factory = state.factories.find(f => f.id === inv.factoryId)
    generateInvoicePDF(inv, factory)
    toast(`${inv.number} PDF downloaded`, 'green')
  }

  // Filtered + searched list
  const displayed = state.invoices.filter(inv => {
    if (filter !== 'all' && inv.status !== filter) return false
    const q = search.toLowerCase()
    if (q && !inv.number.toLowerCase().includes(q) && !inv.factoryName.toLowerCase().includes(q)) return false
    return true
  })

  // KPIs
  const paid     = state.invoices.filter(i => i.status === 'paid')
  const sent     = state.invoices.filter(i => i.status === 'sent')
  const overdue  = state.invoices.filter(i => i.status === 'overdue')
  const totalPaid = paid.reduce((s, inv) => s + invoiceTotal(inv).total, 0)
  const totalOut  = [...sent, ...overdue].reduce((s, inv) => s + invoiceTotal(inv).total, 0)

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">Invoices</div>
          <div className="page-subtitle">CREATE · SEND · TRACK · EXPORT PDF</div>
        </div>
        <button className="btn btn-primary" onClick={() => setCreateOpen(true)}>
          <PlusIcon /> New Invoice
        </button>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-label">Total Collected</div>
          <div className="kpi-val" style={{ color: 'var(--green)' }}>৳{(totalPaid / 1000).toFixed(0)}K</div>
          <div className="kpi-sub">{paid.length} paid invoices</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Outstanding</div>
          <div className="kpi-val" style={{ color: 'var(--amber)' }}>৳{(totalOut / 1000).toFixed(0)}K</div>
          <div className="kpi-sub">{sent.length} sent · {overdue.length} overdue</div>
          {overdue.length > 0 && <div className="kpi-delta down">{overdue.length} overdue</div>}
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Total Invoices</div>
          <div className="kpi-val" style={{ color: 'var(--text)' }}>{state.invoices.length}</div>
          <div className="kpi-sub">{state.invoices.filter(i => i.status === 'draft').length} drafts</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Overdue</div>
          <div className="kpi-val" style={{ color: overdue.length ? 'var(--red)' : 'var(--green)' }}>{overdue.length}</div>
          <div className="kpi-sub">{overdue.length ? 'Require follow-up' : 'All clear'}</div>
        </div>
      </div>

      {/* Filter + search */}
      <div className="card">
        <div className="toolbar">
          <input
            className="search-input flex-1"
            placeholder="Search by invoice number or factory name…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          {['all','draft','sent','paid','overdue'].map(s => (
            <button
              key={s}
              className={`admin-tab${filter === s ? ' active' : ''}`}
              style={{ padding: '5px 12px', marginBottom: 0, border: '0.5px solid var(--border)', borderRadius: 6, fontSize: 11 }}
              onClick={() => setFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Invoice','Factory','Period','Issue Date','Due Date','Amount','Status','Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {displayed.map(inv => {
                const { total } = invoiceTotal(inv)
                return (
                  <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => setViewInv(inv)}>
                    <td className="td-id" style={{ color: 'var(--green)', fontWeight: 500 }}>{inv.number}</td>
                    <td className="td-name">{inv.factoryName}</td>
                    <td style={{ fontSize: 11, color: 'var(--text3)' }}>{inv.period}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>{inv.issueDate}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: inv.status === 'overdue' ? 'var(--red)' : 'var(--text3)' }}>{inv.dueDate}</td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontWeight: 500, color: 'var(--text)' }}>৳{total.toLocaleString()}</td>
                    <td><Badge color={STATUS_COLOR[inv.status] || 'neutral'}>{inv.status}</Badge></td>
                    <td onClick={e => e.stopPropagation()}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        {inv.status === 'draft' && (
                          <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 10 }} onClick={() => handleSend(inv)}>Send</button>
                        )}
                        {(inv.status === 'sent' || inv.status === 'overdue') && (
                          <button className="btn btn-primary" style={{ padding: '2px 8px', fontSize: 10 }} onClick={() => handlePaid(inv)}>Mark Paid</button>
                        )}
                        <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 10 }} onClick={() => handlePDF(inv)}>↓ PDF</button>
                        <button className="btn btn-ghost" style={{ padding: '2px 8px', fontSize: 10, color: 'var(--red)' }} onClick={() => handleDelete(inv)}>✕</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {displayed.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 32, color: 'var(--text3)', fontSize: 12 }}>No invoices match this filter</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice preview panel */}
      {viewInv && (
        <InvoicePreview
          invoice={viewInv}
          factory={state.factories.find(f => f.id === viewInv.factoryId)}
          onClose={() => setViewInv(null)}
          onSend={() => { handleSend(viewInv); setViewInv(null) }}
          onPaid={() => { handlePaid(viewInv); setViewInv(null) }}
          onPDF={() => handlePDF(viewInv)}
          onDelete={() => { handleDelete(viewInv); setViewInv(null) }}
        />
      )}

      {/* Email preview modal — shows before actually sending */}
      {emailPreview && (
        <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) setEmailPreview(null) }}>
          <div className="modal-box" style={{ width: 620, maxWidth: '95vw' }}>
            <div className="modal-header">
              <span className="modal-title">Preview Email — {emailPreview.inv.number}</span>
              <button className="modal-close" onClick={() => setEmailPreview(null)}>×</button>
            </div>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, fontSize: 12 }}>
              <div><span style={{ color: 'var(--text3)' }}>To: </span><span style={{ color: 'var(--text)', fontFamily: 'IBM Plex Mono' }}>{emailPreview.factory?.email || 'factory@example.com'}</span></div>
              <div><span style={{ color: 'var(--text3)' }}>Subject: </span><span style={{ color: 'var(--text)' }}>{emailPreview.template.subject}</span></div>
            </div>
            <div style={{ maxHeight: '60vh', overflow: 'auto', background: '#f5f5f5' }}>
              <iframe
                srcDoc={emailPreview.template.html}
                title="Email preview"
                style={{ width: '100%', height: 500, border: 'none', display: 'block' }}
              />
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text3)' }}>
                <span>📱 WhatsApp notification will also be sent</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-ghost" onClick={() => setEmailPreview(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={confirmSend}>Send Invoice ✓</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Invoice"
        wide
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setCreateOpen(false)}>Cancel</button>
            <button className="btn btn-ghost" style={{ color: 'var(--text2)' }} onClick={handleCreate}>Save as Draft</button>
            <button className="btn btn-primary" onClick={() => { handleCreate(); }}>Create Invoice</button>
          </>
        }
      >
        {/* Factory + period */}
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Factory *</label>
            <select className="form-input" value={form.factoryId} onChange={fieldSet('factoryId')}>
              {state.factories.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Billing Period</label>
            <input className="form-input" placeholder="e.g. March 2025" value={form.period} onChange={fieldSet('period')} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Issue Date</label>
            <input className="form-input" type="date" value={form.issueDate} onChange={fieldSet('issueDate')} />
          </div>
          <div className="form-group">
            <label className="form-label">Due Date *</label>
            <input className="form-input" type="date" value={form.dueDate} onChange={fieldSet('dueDate')} />
          </div>
        </div>

        {/* Line items */}
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', marginBottom: 12 }}>
          <div style={{ padding: '8px 12px', background: 'var(--bg3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Line Items</span>
          </div>

          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px 90px 28px', gap: 6, padding: '6px 12px', borderBottom: '1px solid var(--border)' }}>
            {['Description', 'Qty', 'Unit Price (৳)', 'Total', ''].map(h => (
              <div key={h} style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', textTransform: 'uppercase' }}>{h}</div>
            ))}
          </div>

          {form.items.map(item => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1fr 60px 90px 90px 28px', gap: 6, padding: '8px 12px', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
              <div>
                <input
                  className="form-input"
                  style={{ marginBottom: 4 }}
                  placeholder="Description"
                  value={item.description}
                  onChange={e => updateItem(item.id, 'description', e.target.value)}
                />
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {LINE_ITEM_TEMPLATES.slice(0, 4).map(tpl => (
                    <button key={tpl.description} onClick={() => applyTemplate(item.id, tpl)}
                      style={{ fontSize: 9, padding: '1px 6px', border: '1px solid var(--border)', borderRadius: 4, background: 'transparent', color: 'var(--text3)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      {tpl.description.split('—')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>
              <input
                className="form-input"
                type="number" min="1"
                value={item.qty}
                onChange={e => updateItem(item.id, 'qty', e.target.value)}
              />
              <input
                className="form-input"
                type="number" min="0"
                value={item.unitPrice}
                onChange={e => updateItem(item.id, 'unitPrice', e.target.value)}
              />
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 12, color: 'var(--green)', textAlign: 'right' }}>
                ৳{(item.qty * item.unitPrice).toLocaleString()}
              </div>
              <button onClick={() => removeItem(item.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ×
              </button>
            </div>
          ))}

          {/* Add item + total */}
          <div style={{ padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button className="btn btn-ghost" style={{ padding: '4px 10px', fontSize: 11 }} onClick={addItem}>
              + Add Line Item
            </button>
            <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
              Total: <span style={{ color: 'var(--green)' }}>৳{formTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea className="form-input note-area" placeholder="Payment instructions, reminders…" value={form.notes} onChange={fieldSet('notes')} />
        </div>
      </Modal>
    </div>
  )
}

// ── Invoice Preview Drawer ─────────────────────────────────────────────
function InvoicePreview({ invoice, factory, onClose, onSend, onPaid, onPDF, onDelete }) {
  const { total, subtotal } = invoiceTotal(invoice)

  return (
    <>
      <div className="panel-overlay" onClick={onClose} />
      <div className="factory-panel">
        <div className="panel-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'Space Grotesk' }}>{invoice.number}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 3 }}>{invoice.factoryName}</div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', fontSize: 20 }}>×</button>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            <Badge color={STATUS_COLOR[invoice.status] || 'neutral'}>{invoice.status}</Badge>
            {invoice.status === 'draft'   && <button className="btn btn-primary" style={{ padding: '3px 10px', fontSize: 11 }} onClick={onSend}>Send to Factory</button>}
            {invoice.status !== 'paid' && invoice.status !== 'draft' && <button className="btn btn-primary" style={{ padding: '3px 10px', fontSize: 11 }} onClick={onPaid}>Mark as Paid</button>}
            <button className="btn btn-ghost" style={{ padding: '3px 10px', fontSize: 11 }} onClick={onPDF}>↓ Download PDF</button>
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Invoice Details</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[['Issue Date', invoice.issueDate], ['Due Date', invoice.dueDate], ['Period', invoice.period], ['Paid Date', invoice.paidDate || '—']].map(([l, v]) => (
              <div key={l}><div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div><div style={{ fontSize: 12, color: 'var(--text)', fontFamily: 'IBM Plex Mono' }}>{v}</div></div>
            ))}
          </div>
        </div>

        <div className="panel-section">
          <div className="panel-section-title">Line Items</div>
          {invoice.items.map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: i < invoice.items.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--text)' }}>{item.description}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Qty: {item.qty} × ৳{item.unitPrice.toLocaleString()}</div>
              </div>
              <div style={{ fontFamily: 'IBM Plex Mono', fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>
                ৳{(item.qty * item.unitPrice).toLocaleString()}
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '2px solid var(--border)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text)' }}>Total Due</span>
            <span style={{ fontFamily: 'IBM Plex Mono', fontSize: 16, fontWeight: 600, color: 'var(--green)' }}>৳{total.toLocaleString()}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="panel-section">
            <div className="panel-section-title">Notes</div>
            <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{invoice.notes}</div>
          </div>
        )}

        <div className="panel-section">
          <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', color: 'var(--red)' }} onClick={onDelete}>
            Delete Invoice
          </button>
        </div>
      </div>
    </>
  )
}

const PlusIcon = () => <svg viewBox="0 0 14 14" fill="none" width="12" height="12"><path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
