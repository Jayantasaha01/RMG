export const PLANS = {
  starter:      { label: 'Starter',      price: 4999,  maxWorkers: 200,  color: 'blue'  },
  professional: { label: 'Professional', price: 12999, maxWorkers: 800,  color: 'green' },
  enterprise:   { label: 'Enterprise',   price: 29999, maxWorkers: null, color: 'amber' },
}

export const SEED_FACTORIES = [
  { id:'f001', name:'Khaled Textiles Ltd.',  contact:'Mohammad Khaled', email:'khaled@khaledtextiles.com',  phone:'+880 1711-234567', address:'Gazipur Sadar, Dhaka',    plan:'professional', status:'active',    workers:342,  joinedDate:'2024-11-15', lastActive:'2025-03-18', bsciScore:78, certsUploaded:5, incidentsOpen:1, wageViolations:3, monthlyRevenue:12999, notes:'First paying customer. Exports to H&M and Zara.' },
  { id:'f002', name:'Rahim Garments & Co.',  contact:'Abdul Rahim',     email:'info@rahimgarments.bd',      phone:'+880 1812-345678', address:'Ashulia, Savar, Dhaka',   plan:'starter',      status:'trial',     workers:145,  joinedDate:'2025-02-20', lastActive:'2025-03-17', bsciScore:61, certsUploaded:2, incidentsOpen:0, wageViolations:1, monthlyRevenue:0,     notes:'60-day trial. Needs help with BSCI documentation.' },
  { id:'f003', name:'Surma Fabrics Ltd.',    contact:'Nurul Islam',     email:'nurul@surmafabrics.com',     phone:'+880 1919-456789', address:'Narayanganj, Dhaka',       plan:'starter',      status:'active',    workers:198,  joinedDate:'2025-01-08', lastActive:'2025-03-16', bsciScore:84, certsUploaded:4, incidentsOpen:0, wageViolations:0, monthlyRevenue:4999,  notes:'Very compliant. Potential upgrade to Professional.' },
  { id:'f004', name:'Delta Knit Industries', contact:'Farida Yasmin',   email:'farida@deltaknit.bd',        phone:'+880 1615-567890', address:'Mirpur DOHS, Dhaka',       plan:'enterprise',   status:'active',    workers:1240, joinedDate:'2024-12-01', lastActive:'2025-03-19', bsciScore:91, certsUploaded:9, incidentsOpen:2, wageViolations:0, monthlyRevenue:29999, notes:'Largest client. Multi-factory setup needed.' },
  { id:'f005', name:'Padma Apparels',        contact:'Kamal Hossain',   email:'kamal@padmaapparels.com',    phone:'+880 1723-678901', address:'Tongi, Gazipur',           plan:'starter',      status:'suspended', workers:88,   joinedDate:'2024-10-12', lastActive:'2025-01-30', bsciScore:42, certsUploaded:1, incidentsOpen:3, wageViolations:7, monthlyRevenue:0,     notes:'Suspended for non-payment. Follow up required.' },
]

export const SEED_ACTIVITY = [
  { id:'a1', factoryId:'f001', type:'cert_upload',  msg:'Khaled Textiles uploaded WRAP certificate',          time:'2 hours ago' },
  { id:'a2', factoryId:'f002', type:'factory_join', msg:'Rahim Garments started a 60-day trial',              time:'27 days ago' },
  { id:'a3', factoryId:'f003', type:'plan_upgrade', msg:'Surma Fabrics upgraded from Trial to Starter',       time:'2 months ago' },
  { id:'a4', factoryId:'f004', type:'incident',     msg:'Delta Knit logged a new incident (Near Miss)',        time:'1 day ago' },
  { id:'a5', factoryId:'f005', type:'suspension',   msg:'Padma Apparels suspended — payment overdue 47 days', time:'47 days ago' },
  { id:'a6', factoryId:'f001', type:'wage_alert',   msg:'Khaled Textiles: 3 wage violations flagged',         time:'Yesterday' },
  { id:'a7', factoryId:'f003', type:'checklist',    msg:'Surma Fabrics completed BSCI Section D checklist',   time:'3 days ago' },
  { id:'a8', factoryId:'f004', type:'cert_expiry',  msg:'Delta Knit: Fire Safety cert expires in 14 days',    time:'5 days ago' },
]
