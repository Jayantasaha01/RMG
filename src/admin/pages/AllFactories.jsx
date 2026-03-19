import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { useToast } from '../../hooks/useToast'
import FactoryPanel from '../components/FactoryPanel'
import Modal from '../../components/ui/Modal'
import { PLANS } from '../data/adminSeedData'

export default function AllFactories() {
  const { state, dispatch } = useAdmin()
  const { toast }           = useToast()

  const [search,    setSearch]    = useState('')
  const [planFlt,   setPlanFlt]   = useState('')
  const [statusFlt, setStatusFlt] = useState('')
  const [selected,  setSelected]  = useState(null)
  const [addOpen,   setAddOpen]   = useState(false)
  const [form, setForm] = useState({
    name: '', location: '', contact: '', email: '', phone: '',
    workerCount: '', plan: 'starter', status: 'trial',
  })

  const field = k => ({ value: form[k], onChange: e => setForm(p => ({ ...p, [k]: e.target.value })) })

  function handleAdd() {
    if (!form.name.trim() || !form.email.trim()) { toast('Name and email are required', 'amber'); return }
    const trialEnd = new Date(Date.now() + 60 * 86400000).toISOString().split('T')[0]
    dispatch({
      type: 'ADD_FACTORY',
      payload: {
        id: `f${Date.now()}`,
        name: form.name.trim(),
        location: form.location,
        contact: form.contact,
        email: form.email.trim(),
        phone: form.phone,
        workerCount: parseInt(form.workerCount) || 0,
        plan: form.plan,
        status: form.status,
        trialEnd: form.status === 'trial' ? trialEnd : null,
        joinedDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        onboarding: { account: true, workers: false, certs: false, checklist: false, wages: false, training: false },
        bsciScore: 0,
        mrr: form.status === 'active' ? PLANS[form.plan].price : 0,
        buyers: [],
        notes: '',
      },
    })
    setAddOpen(false)
    setForm({ name: '', location: '', contact: '', email: '', phone: '', workerCount: '', plan: 'starter', status: 'trial' })
    toast(`${form.name} onboarded successfully`, 'green')
  }

  const filtered = state.factories.filter(f => {
    const q = search.toLowerCase()
    if (q && !f.name.toLowerCase().includes(q) && !f.location.toLowerCase().includes(q) && !f.contact.toLowerCase().includes(q)) return false
    if (planFlt   && f.plan   !== planFlt)   return false
    if (statusFlt && f.status !== statusFlt) return false
    return true
  })

  const totalMRR = filtered.reduce((s, f) => s + (f.mrr || 0), 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">All Factories</div>
          <div className="page-subtitle">
            {filtered.length} factories · ৳{totalMRR.toLocaleString()} MRR from filtered results
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setAddOpen(true)}>
          <PlusIcon /> Onboard Factory
        </button>
      </div>

      <div className="card">
        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="search-input flex-1"
            placeholder="Search factory name, location, contact…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select className="search-input" style={{ maxWidth: 160 }} value={planFlt} onChange={e => setPlanFlt(e.target.value)}>
            <option value="">All Plans</option>
            <option value="starter">Starter</option>
            <option value="professional">Professional</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <select className="search-input" style={{ maxWidth: 160 }} value={statusFlt} onChange={e => setStatusFlt(e.target.value)}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="trial">Trial</option>
            <option value="pending">Pending</option>
            <option value="churned">Churned</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Factory','Contact','Location','Plan','MRR','Workers','Onboarding','BSCI','Status','Joined'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const steps = Object.values(f.onboarding)
                const done  = steps.filter(Boolean).length
                const pct   = Math.round((done / steps.length) * 100)
                return (
                  <tr key={f.id} className="factory-row" onClick={() => setSelected(f)}>
                    <td className="td-name">{f.name}</td>
                    <td style={{ fontSize: 11, color: 'var(--text2)' }}>
                      <div>{f.contact}</div>
                      <div style={{ color: 'var(--text3)', marginTop: 1 }}>{f.email}</div>
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--text3)' }}>{f.location}</td>
                    <td><span className={`plan-badge ${f.plan}`}>{f.plan}</span></td>
                    <td style={{ fontFamily: 'IBM Plex Mono', color: f.mrr > 0 ? 'var(--green)' : 'var(--text3)', fontSize: 12 }}>
                      {f.mrr > 0 ? `৳${f.mrr.toLocaleString()}` : '—'}
                    </td>
                    <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11 }}>{f.workerCount}</td>
                    <td style={{ minWidth: 100 }}>
                      <div className="prog-wrap">
                        <div className="prog-bar">
                          <div className="prog-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : pct > 50 ? 'var(--amber)' : 'var(--red)' }} />
                        </div>
                        <span style={{ fontSize: 10, fontFamily: 'IBM Plex Mono', color: 'var(--text3)', width: 28 }}>{pct}%</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 12, fontFamily: 'IBM Plex Mono', color: f.bsciScore >= 70 ? 'var(--green)' : f.bsciScore >= 40 ? 'var(--amber)' : 'var(--red)' }}>
                        {f.bsciScore}%
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <span className={`status-dot ${f.status}`} />
                        <span style={{ fontSize: 11, textTransform: 'capitalize', color: 'var(--text2)' }}>{f.status}</span>
                      </span>
                    </td>
                    <td style={{ fontSize: 11, fontFamily: 'IBM Plex Mono', color: 'var(--text3)' }}>{f.joinedDate}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard factory modal */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Onboard New Factory"
        wide
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAdd}>Onboard Factory</button>
          </>
        }
      >
        <div style={{ fontSize: 12, color: 'var(--text3)', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', marginBottom: 16 }}>
          An onboarding email will be sent automatically. The factory's compliance officer gets login instructions and a walkthrough checklist.
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Factory Name *</label>
            <input className="form-input" placeholder="Sunshine Apparels Ltd." {...field('name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Location</label>
            <input className="form-input" placeholder="Gazipur, Dhaka" {...field('location')} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Contact Name</label>
            <input className="form-input" placeholder="Compliance Officer / Owner" {...field('contact')} />
          </div>
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="admin@factory.com" {...field('email')} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Phone / WhatsApp</label>
            <input className="form-input" placeholder="+880 1711 XXXXXX" {...field('phone')} />
          </div>
          <div className="form-group">
            <label className="form-label">Approx. Worker Count</label>
            <input className="form-input" type="number" placeholder="250" {...field('workerCount')} />
          </div>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Plan</label>
            <select className="form-input" {...field('plan')}>
              <option value="starter">Starter — ৳4,999/mo</option>
              <option value="professional">Professional — ৳12,999/mo</option>
              <option value="enterprise">Enterprise — ৳29,999/mo</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Initial Status</label>
            <select className="form-input" {...field('status')}>
              <option value="trial">Trial (60 days free)</option>
              <option value="active">Active (paying)</option>
              <option value="pending">Pending (not started)</option>
            </select>
          </div>
        </div>
      </Modal>

      {selected && <FactoryPanel factory={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}

const PlusIcon = () => (
  <svg viewBox="0 0 14 14" fill="none" width="12" height="12">
    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
