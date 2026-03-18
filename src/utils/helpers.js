/**
 * Returns the number of whole days between today and a date string.
 * Negative = already expired.
 */
export function daysUntil(dateStr) {
  return Math.round((new Date(dateStr) - new Date()) / 86_400_000)
}

/** Returns 'green' | 'amber' | 'red' based on days remaining. */
export function certStatusColor(days) {
  if (days < 0)   return 'red'
  if (days <= 60) return 'amber'
  return 'green'
}

/** Returns 'Expired' | 'Expiring' | 'Valid' */
export function certStatusLabel(days) {
  if (days < 0)   return 'Expired'
  if (days <= 60) return 'Expiring'
  return 'Valid'
}

/** Formats today's date as "18 MAR 2025" */
export function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  }).toUpperCase()
}

/** Generates the next sequential worker ID given the current workers array */
export function nextWorkerId(workers) {
  return 'W-' + String(workers.length + 1).padStart(4, '0')
}

/** Returns a stable overtime value for a worker (seeded by wage to be deterministic) */
export function stableOT(wage) {
  return Math.floor(((wage * 7) % 3000) + 500)
}
