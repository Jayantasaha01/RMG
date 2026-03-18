// Each item: { text, tag, checked, evidence: [] }
// evidence is populated at runtime via the attachment engine

export const BSCI_CHECKLIST = [
  { section: 'A. Management Systems', items: [
    { text: 'Management Representative appointed via Office Order',         tag: 'HR',    checked: true  },
    { text: 'Code of Conduct displayed in local language (Bangla)',         tag: 'COC',   checked: true  },
    { text: 'Grievance mechanism documented and operational',               tag: 'HR',    checked: true  },
    { text: 'Internal audit conducted and documented',                      tag: 'AUDIT', checked: false },
    { text: 'Corrective Action Plan (CAP) from last audit addressed',       tag: 'AUDIT', checked: false },
  ]},
  { section: 'B. Workers Rights & Employment', items: [
    { text: 'Appointment letters provided to all workers',                  tag: 'HR',    checked: true  },
    { text: 'NID verification completed for all workers',                   tag: 'NID',   checked: false },
    { text: 'Maternity personal files maintained (3 months pay + letter)',  tag: 'HR',    checked: true  },
    { text: 'No child labor confirmed (NID + birth cert checks)',           tag: 'CL',    checked: true  },
    { text: 'Employment contracts signed and filed',                        tag: 'HR',    checked: true  },
    { text: 'Termination procedure documented',                             tag: 'HR',    checked: false },
  ]},
  { section: 'C. Wages & Working Hours', items: [
    { text: 'Minimum wage policy posted (Grade 7 = ৳12,500)',               tag: 'WAGE',  checked: true  },
    { text: 'Wage registers current and accurate',                          tag: 'WAGE',  checked: true  },
    { text: 'Overtime records maintained separately',                       tag: 'OT',    checked: true  },
    { text: 'All workers at or above minimum wage',                         tag: 'WAGE',  checked: false },
    { text: 'Overtime compensation at legal rate (1.5x)',                   tag: 'OT',    checked: true  },
  ]},
  { section: 'D. Health & Safety', items: [
    { text: 'Fire extinguisher inspection cards current',                   tag: 'FIRE',  checked: true  },
    { text: 'Fire drill conducted and recorded (twice yearly)',             tag: 'FIRE',  checked: false },
    { text: 'Accident register maintained with current entries',            tag: 'H&S',   checked: true  },
    { text: 'Risk assessment conducted for all sections',                   tag: 'H&S',   checked: false },
    { text: 'Factory clinic operational with doctor and nurse',             tag: 'HEALTH', checked: true },
    { text: 'Personal protective equipment provided and documented',        tag: 'PPE',   checked: false },
    { text: 'Temperature, noise, air quality test reports current',         tag: 'ENV',   checked: false },
  ]},
  { section: 'E. Environment', items: [
    { text: 'Environment policy documented and displayed',                  tag: 'ENV',   checked: true  },
    { text: 'Waste management procedure in place',                          tag: 'WASTE', checked: false },
    { text: 'Drinking water test report current',                           tag: 'HEALTH', checked: true },
    { text: 'Effluent discharge records maintained',                        tag: 'ENV',   checked: false },
  ]},
]

export const WRAP_CHECKLIST = [
  { section: 'Principle 1: Compliance with Laws', items: [
    { text: 'Factory complies with all local and national labour laws',    tag: 'LAW',   checked: true  },
    { text: 'Factory licence and all required permits current',            tag: 'PERMIT', checked: true },
    { text: 'Legal working age requirements met (18+ verified)',           tag: 'AGE',   checked: true  },
  ]},
  { section: 'Principle 2: Freedom of Association', items: [
    { text: 'Workers have right to organise and bargain collectively',     tag: 'FOA',   checked: true  },
    { text: 'Participation Committee (PC) formed and meeting regularly',   tag: 'PC',    checked: false },
    { text: 'PC meeting minutes documented',                               tag: 'PC',    checked: false },
  ]},
  { section: 'Principle 3: Prohibition of Forced Labour', items: [
    { text: 'No withholding of identity documents',                        tag: 'DOCS',  checked: true  },
    { text: 'Workers free to resign with notice',                          tag: 'HR',    checked: true  },
    { text: 'No bonded labour contracts in place',                         tag: 'HR',    checked: true  },
  ]},
  { section: 'Principle 7: Safe & Healthy Workplace', items: [
    { text: 'Safety committee established and active',                     tag: 'H&S',   checked: true  },
    { text: 'All machinery guards in place',                               tag: 'MACHINE', checked: false },
    { text: 'Emergency exit routes marked and clear',                      tag: 'FIRE',  checked: true  },
    { text: 'First aid kits stocked at all sections',                      tag: 'FA',    checked: false },
    { text: 'Worker health records maintained',                            tag: 'HEALTH', checked: true },
  ]},
]
