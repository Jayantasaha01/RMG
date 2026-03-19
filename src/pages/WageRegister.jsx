import { useState, useMemo } from 'react'
import { useApp } from '../store/AppContext'
import { stableOT } from '../utils/helpers'
import { generateWageRegisterPDF } from '../utils/pdfExport'
import Badge from '../components/ui/Badge'
import { useToast } from '../hooks/useToast'

const MIN_WAGE = 12500
const MONTHS   = ['March 2025', 'February 2025', 'January 2025']

export default function WageRegister() {
  const { state }       = useApp()
  const { toast }       = useToast()
  const [month, setMonth]   = useState(MONTHS[0])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('')  // '' | 'violation' | 'ok'

  const rows = useMemo(() => state.workers.map(w => {
    const ot    = stableOT(w.wage)
    const total = w.wage + ot
    return { ...w, ot, total, violation: w.wage < MIN_WAGE }
  }), [state.workers])

  const filtered = rows.filter(w => {
    const q = search.toLowerCase()
    if (q && !w.name.toLowerCase().includes(q) && !w.id.includes(q)) return false
    if (filter === 'violation' && !w.violation) return false
    if (filter === 'ok'        &&  w.violation) return false
    return true
  })

  const violations  = rows.filter(r => r.violation).length
  const totalPayroll = rows.reduce((s, r) => s + r.total, 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div className="page-title">Wage Register</div>
          <div className="page-subtitle">MINIMUM WAGE COMPLIANCE · ৳12,500 GRADE-7 FLOOR</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="search-input" style={{ maxWidth: 180 }} value={month} onChange={e => setMonth(e.target.value)}>
            {MONTHS.map(m => <option key={m}>{m}</option>)}
          </select>
          <button className="btn btn-ghost" onClick={() => {
            generateWageRegisterPDF({ workers: rows, month, factory: 'Khaled Textiles Ltd.' })
            toast('Wage register PDF downloaded', 'green')
          }}>
            ↓ Export PDF
          </button>
        </div>
      </div>

      <div className="card">
        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderBottom: '1px solid var(--border)' }}>
          {[
            { label: 'Workers Paid',   val: rows.length, color: 'var(--green)' },
            { label: 'Total Payroll',  val: `৳${(totalPayroll / 100000).toFixed(1)}L`, color: 'var(--text)' },
            { label: 'Below Min Wage', val: violations,   color: violations ? 'var(--red)' : 'var(--green)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ padding: '14px 16px', textAlign: 'center', borderRight: '1px solid var(--border)' }}>
              <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'IBM Plex Mono', color }}>{val}</div>
              <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'IBM Plex Mono', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <input
            className="search-input flex-1"
            placeholder="Search workers…"
            value={search} onChange={e => setSearch(e.target.value)}
          />
          <select className="search-input" style={{ maxWidth: 200 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Workers</option>
            <option value="violation">Violations Only</option>
            <option value="ok">Compliant Only</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {['Worker ID','Name','Grade','Dept','Basic Wage','Overtime','Total','Min Wage','Status'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {filtered.map(w => (
                <tr key={w.id}>
                  <td className="td-id">{w.id}</td>
                  <td className="td-name">{w.name}</td>
                  <td>Grade {w.grade}</td>
                  <td>{w.dept}</td>
                  <td style={{ color: w.violation ? 'var(--red)' : 'var(--text2)', fontFamily: 'IBM Plex Mono' }}>
                    ৳{w.wage.toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'IBM Plex Mono', color: 'var(--text3)' }}>৳{w.ot.toLocaleString()}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontWeight: 500, color: 'var(--text)' }}>৳{w.total.toLocaleString()}</td>
                  <td style={{ fontFamily: 'IBM Plex Mono', fontSize: 11, color: 'var(--text3)' }}>৳{MIN_WAGE.toLocaleString()}</td>
                  <td><Badge color={w.violation ? 'red' : 'green'}>{w.violation ? 'VIOLATION' : 'OK'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
