// ── Seed workers ──────────────────────────────────────────────────────
export const SEED_WORKERS = [
  { id: 'W-0001', name: 'Rahima Khatun',    dept: 'Sewing',    grade: '4', wage: 16500, status: 'Active',    joined: '2019-03-12', nid: 'verified',  attachments: [] },
  { id: 'W-0045', name: 'Fatema Begum',     dept: 'Sewing',    grade: '7', wage: 12300, status: 'Active',    joined: '2022-08-01', nid: 'verified',  attachments: [] },
  { id: 'W-0078', name: 'Roksana Akter',   dept: 'Finishing', grade: '6', wage: 13800, status: 'Active',    joined: '2021-05-20', nid: 'verified',  attachments: [] },
  { id: 'W-0102', name: 'Mosammat Asma',   dept: 'Cutting',   grade: '5', wage: 14200, status: 'Active',    joined: '2020-11-15', nid: 'pending',   attachments: [] },
  { id: 'W-0156', name: 'Shirin Sultana',  dept: 'Quality',   grade: '3', wage: 22000, status: 'Active',    joined: '2018-07-04', nid: 'verified',  attachments: [] },
  { id: 'W-0203', name: 'Abdul Karim',     dept: 'Store',     grade: '6', wage: 13500, status: 'Active',    joined: '2021-02-28', nid: 'verified',  attachments: [] },
  { id: 'W-0241', name: 'Nargis Parvin',   dept: 'Sewing',    grade: '7', wage: 12100, status: 'Maternity', joined: '2023-01-10', nid: 'verified',  attachments: [] },
  { id: 'W-0289', name: 'Md. Hasan Ali',   dept: 'Finishing', grade: '5', wage: 14800, status: 'Active',    joined: '2020-06-18', nid: 'verified',  attachments: [] },
  { id: 'W-0318', name: 'Roksana Begum',   dept: 'Sewing',    grade: '7', wage: 12000, status: 'Active',    joined: '2024-01-15', nid: 'pending',   attachments: [] },
  { id: 'W-0342', name: 'Champa Akter',    dept: 'Quality',   grade: '4', wage: 16000, status: 'On Leave',  joined: '2019-09-22', nid: 'verified',  attachments: [] },
]

// ── Seed certifications ────────────────────────────────────────────────
export const SEED_CERTS = [
  { id: 'c1', name: 'WRAP Certification',    type: 'Social Compliance', issuer: 'WRAP',             certno: 'BD-2024-WR881', issued: '2024-09-14', expiry: '2026-09-14', attachments: [] },
  { id: 'c2', name: 'BSCI Audit',           type: 'Social Compliance', issuer: 'Bureau Veritas',   certno: 'BV-2023-4421',  issued: '2023-05-03', expiry: '2025-05-03', attachments: [] },
  { id: 'c3', name: 'Fire Safety Certificate', type: 'Safety',         issuer: 'Dhaka Fire Service', certno: 'DFS-2024-1122', issued: '2024-04-22', expiry: '2025-04-22', attachments: [] },
  { id: 'c4', name: 'Boiler Inspection',    type: 'Technical',         issuer: 'DIFE',              certno: 'DIFE-2025-330', issued: '2025-01-10', expiry: '2026-01-10', attachments: [] },
  { id: 'c5', name: 'Drinking Water Test',  type: 'Health',            issuer: 'BUET Lab',          certno: 'BL-2024-WQ99',  issued: '2024-11-28', expiry: '2025-11-28', attachments: [] },
]

// ── Seed incidents ─────────────────────────────────────────────────────
export const SEED_INCIDENTS = [
  {
    id: 'i1', type: 'Minor Injury',      date: '2025-03-01',
    location: 'Sewing Floor A, Line 7',
    desc: 'Worker caught finger in sewing machine. Minor laceration, first aid applied.',
    action: 'Machine guard inspected and repositioned. Worker re-trained on safety protocol.',
    resolved: false, attachments: [],
  },
  {
    id: 'i2', type: 'Near Miss',         date: '2025-02-14',
    location: 'Finishing Section',
    desc: 'Fabric bale fell from shelf during movement. No injury sustained.',
    action: 'Storage shelving height limit imposed. Safety tape added to floor zone.',
    resolved: true, attachments: [],
  },
  {
    id: 'i3', type: 'Medical Treatment', date: '2025-01-22',
    location: 'Cutting Floor',
    desc: 'Worker sustained a minor cut from cutting blade. Received medical treatment at factory clinic.',
    action: 'PPE (cut-resistant gloves) requirement enforced for all cutting section workers.',
    resolved: true, attachments: [],
  },
  {
    id: 'i4', type: 'Fire Incident',     date: '2024-12-05',
    location: 'Generator Room',
    desc: 'Small electrical fire in generator room, extinguished immediately with fire extinguisher.',
    action: 'Electrical inspection completed. New fire extinguisher installed. All staff retrained.',
    resolved: true, attachments: [],
  },
  {
    id: 'i5', type: 'Near Miss',         date: '2024-11-18',
    location: 'Main Stairwell',
    desc: 'Wet floor caused near-slip incident. Maintenance crew alerted.',
    action: 'Non-slip mats installed on all stairwells. Wet floor signs procured.',
    resolved: true, attachments: [],
  },
]

// ── Overtime lookup (stable per session) ──────────────────────────────
const OT_BASE = { 'W-0001':2800,'W-0045':1200,'W-0078':2100,'W-0102':1800,'W-0156':3200,'W-0203':1500,'W-0241':0,'W-0289':2400,'W-0318':900,'W-0342':0 }
export function getOT(workerId) { return OT_BASE[workerId] ?? 1200 }
