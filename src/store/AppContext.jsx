import { createContext, useContext, useReducer } from 'react'
import { SEED_WORKERS, SEED_CERTS, SEED_INCIDENTS } from '../data/seedData'
import { BSCI_CHECKLIST, WRAP_CHECKLIST } from '../data/checklists'

// ── Initial state ────────────────────────────────────────────────────
const initialState = {
  factory:   { name: 'Khaled Textiles Ltd.', workers: 342 },
  workers:   SEED_WORKERS,
  certs:     SEED_CERTS,
  incidents: SEED_INCIDENTS,
  checklists: {
    bsci: BSCI_CHECKLIST.map(s => ({ ...s, items: s.items.map(i => ({ ...i, evidence: [] })) })),
    wrap: WRAP_CHECKLIST.map(s => ({ ...s, items: s.items.map(i => ({ ...i, evidence: [] })) })),
  },
}

// ── Reducer ──────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {

    case 'ADD_WORKER':
      return { ...state, workers: [...state.workers, action.payload] }

    case 'UPDATE_WORKER':
      return {
        ...state,
        workers: state.workers.map(w => w.id === action.payload.id ? { ...w, ...action.payload } : w),
      }

    case 'ATTACH_WORKER_FILES': {
      const { workerId, files } = action.payload
      return {
        ...state,
        workers: state.workers.map(w =>
          w.id === workerId
            ? { ...w, attachments: [...(w.attachments || []), ...files] }
            : w
        ),
      }
    }

    case 'ADD_CERT':
      return { ...state, certs: [...state.certs, action.payload] }

    case 'ATTACH_CERT_FILES': {
      const { certId, files } = action.payload
      return {
        ...state,
        certs: state.certs.map(c =>
          c.id === certId
            ? { ...c, attachments: [...(c.attachments || []), ...files] }
            : c
        ),
      }
    }

    case 'ADD_INCIDENT':
      return { ...state, incidents: [action.payload, ...state.incidents] }

    case 'RESOLVE_INCIDENT':
      return {
        ...state,
        incidents: state.incidents.map(i =>
          i.id === action.payload ? { ...i, resolved: true } : i
        ),
      }

    case 'TOGGLE_CHECKLIST_ITEM': {
      const { listKey, sectionIdx, itemIdx } = action.payload
      const list = state.checklists[listKey].map((sec, si) =>
        si !== sectionIdx ? sec : {
          ...sec,
          items: sec.items.map((item, ii) =>
            ii !== itemIdx ? item : { ...item, checked: !item.checked }
          ),
        }
      )
      return { ...state, checklists: { ...state.checklists, [listKey]: list } }
    }

    case 'ATTACH_CHECKLIST_EVIDENCE': {
      const { listKey, sectionIdx, itemIdx, files } = action.payload
      const list = state.checklists[listKey].map((sec, si) =>
        si !== sectionIdx ? sec : {
          ...sec,
          items: sec.items.map((item, ii) =>
            ii !== itemIdx ? item : { ...item, evidence: [...(item.evidence || []), ...files] }
          ),
        }
      )
      return { ...state, checklists: { ...state.checklists, [listKey]: list } }
    }

    default:
      return state
  }
}

// ── Context ──────────────────────────────────────────────────────────
const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
