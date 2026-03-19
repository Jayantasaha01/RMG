import { createContext, useContext, useReducer } from 'react'
import { SEED_FACTORIES, PLANS, ONBOARDING_STEPS } from '../data/adminSeedData'
import { SEED_INVOICES } from '../data/invoiceData'

const initialState = {
  factories: SEED_FACTORIES,
  plans: PLANS,
  onboardingSteps: ONBOARDING_STEPS,
  invoices: SEED_INVOICES,
}

function adminReducer(state, action) {
  switch (action.type) {
    case 'ADD_FACTORY':
      return { ...state, factories: [action.payload, ...state.factories] }
    case 'UPDATE_FACTORY':
      return { ...state, factories: state.factories.map(f => f.id === action.payload.id ? { ...f, ...action.payload } : f) }
    case 'DELETE_FACTORY':
      return { ...state, factories: state.factories.filter(f => f.id !== action.payload) }
    case 'TOGGLE_ONBOARDING_STEP': {
      const { factoryId, stepId } = action.payload
      return { ...state, factories: state.factories.map(f => f.id !== factoryId ? f : { ...f, onboarding: { ...f.onboarding, [stepId]: !f.onboarding[stepId] } }) }
    }
    case 'UPGRADE_PLAN': {
      const { factoryId, plan } = action.payload
      return { ...state, factories: state.factories.map(f => f.id !== factoryId ? f : { ...f, plan, status: 'active', trialEnd: null, mrr: PLANS[plan].price }) }
    }
    case 'UPDATE_NOTES': {
      const { factoryId, notes } = action.payload
      return { ...state, factories: state.factories.map(f => f.id !== factoryId ? f : { ...f, notes }) }
    }
    // Invoice actions
    case 'ADD_INVOICE':
      return { ...state, invoices: [action.payload, ...state.invoices] }
    case 'UPDATE_INVOICE':
      return { ...state, invoices: state.invoices.map(inv => inv.id === action.payload.id ? { ...inv, ...action.payload } : inv) }
    case 'DELETE_INVOICE':
      return { ...state, invoices: state.invoices.filter(inv => inv.id !== action.payload) }
    case 'MARK_INVOICE_PAID':
      return { ...state, invoices: state.invoices.map(inv => inv.id === action.payload ? { ...inv, status: 'paid', paidDate: new Date().toISOString().split('T')[0] } : inv) }
    case 'SEND_INVOICE':
      return { ...state, invoices: state.invoices.map(inv => inv.id === action.payload && inv.status === 'draft' ? { ...inv, status: 'sent' } : inv) }
    default:
      return state
  }
}

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [state, dispatch] = useReducer(adminReducer, initialState)
  return <AdminContext.Provider value={{ state, dispatch }}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const ctx = useContext(AdminContext)
  if (!ctx) throw new Error('useAdmin must be used inside AdminProvider')
  return ctx
}
