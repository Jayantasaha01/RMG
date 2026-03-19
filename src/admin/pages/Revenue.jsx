import { useAdmin } from '../store/AdminContext'
import { PLANS } from '../data/adminSeedData'

const MONTHS = ['Oct','Nov','Dec','Jan','Feb','Mar']
const MRR_DATA = [17998, 17998, 47997, 47997, 47997, 47997]

export default function Revenue() {
  const { state } = useAdmin()

  const totalMRR  = state.factories.reduce((s,f)=>s+f.monthlyRevenue,0)
  const totalARR  = totalMRR * 12
  const paying    = state.factories.filter(f=>f.monthlyRevenue>0).length
  const churnRisk = state.factories.filter(f=>f.status==='suspended').length

  const planBreakdown = Object.entries(PLANS).map(([key,plan])=>{
    const factories = state.factories.filter(f=>f.plan===key && f.status==='active')
    return { key, label:plan.label, price:plan.price, count:factories.length, revenue:factories.length*plan.price }
  })

  const maxBar = Math.max(...MRR_DATA)

  return (
    <div>
      <div style={{marginBottom:20}}>
        <div style={{fontFamily:'Space Grotesk,sans-serif',fontSize:20,fontWeight:600,color:'var(--text)'}}>Revenue</div>
        <div style={{fontSize:12,color:'var(--text3)',marginTop:3,fontFamily:'IBM Plex Mono,monospace'}}>MRR · ARR · PLAN BREAKDOWN</div>
      </div>

      {/* Metrics */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:20}}>
        {[
          {label:'Monthly Recurring Revenue', val:`৳${totalMRR.toLocaleString()}`, color:'var(--green)'},
          {label:'Annual Recurring Revenue',   val:`৳${(totalARR/100000).toFixed(1)}L`, color:'var(--green)'},
          {label:'Paying Factories',           val:paying, color:'var(--blue)'},
          {label:'Churn Risk',                 val:churnRisk, color:churnRisk>0?'var(--red)':'var(--green)'},
        ].map(({label,val,color})=>(
          <div key={label} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:10,padding:'14px 16px'}}>
            <div style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.08em'}}>{label}</div>
            <div style={{fontSize:24,fontWeight:600,fontFamily:'IBM Plex Mono,monospace',color,marginTop:6}}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:16,marginBottom:16}}>
        {/* MRR bar chart */}
        <div className="card">
          <div className="card-header"><span className="card-title">MRR — Last 6 Months</span></div>
          <div style={{padding:'16px 20px'}}>
            <div style={{display:'flex',alignItems:'flex-end',gap:12,height:140}}>
              {MRR_DATA.map((v,i)=>(
                <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',color:'var(--green)',marginBottom:2}}>
                    {i===MRR_DATA.length-1?`৳${(v/1000).toFixed(0)}K`:''}
                  </div>
                  <div style={{width:'100%',background:'var(--green)',borderRadius:'4px 4px 0 0',height:`${(v/maxBar)*100}%`,minHeight:4,opacity:i===MRR_DATA.length-1?1:0.45,transition:'height 0.5s'}} />
                  <div style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',color:'var(--text3)'}}>{MONTHS[i]}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Plan breakdown */}
        <div className="card">
          <div className="card-header"><span className="card-title">Revenue by Plan</span></div>
          <div style={{padding:'14px 16px'}}>
            {planBreakdown.map(p=>(
              <div key={p.key} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
                  <div>
                    <span style={{fontSize:12,fontWeight:500,color:'var(--text)'}}>{p.label}</span>
                    <span style={{fontSize:11,color:'var(--text3)',marginLeft:6}}>{p.count} factory{p.count!==1?'s':''}</span>
                  </div>
                  <span style={{fontSize:12,fontFamily:'IBM Plex Mono,monospace',color:'var(--text)'}}>৳{p.revenue.toLocaleString()}</span>
                </div>
                <div style={{height:4,background:'var(--bg4)',borderRadius:2}}>
                  <div style={{width:totalMRR?`${(p.revenue/totalMRR)*100}%`:'0%',height:'100%',background:'var(--green)',borderRadius:2}} />
                </div>
              </div>
            ))}
            <div style={{paddingTop:12,borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between'}}>
              <span style={{fontSize:11,fontFamily:'IBM Plex Mono,monospace',color:'var(--text3)',textTransform:'uppercase'}}>Total MRR</span>
              <span style={{fontSize:14,fontWeight:600,fontFamily:'IBM Plex Mono,monospace',color:'var(--green)'}}>৳{totalMRR.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Per-factory table */}
      <div className="card">
        <div className="card-header"><span className="card-title">Revenue per Factory</span></div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>{['Factory','Plan','Status','MRR','ARR','Joined'].map(h=><th key={h}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {[...state.factories].sort((a,b)=>b.monthlyRevenue-a.monthlyRevenue).map(f=>(
                <tr key={f.id}>
                  <td className="td-name">{f.name}</td>
                  <td><span className="badge neutral">{PLANS[f.plan]?.label}</span></td>
                  <td>
                    <span style={{fontSize:10,fontFamily:'IBM Plex Mono,monospace',padding:'2px 7px',borderRadius:4,fontWeight:500,background:f.status==='active'?'var(--green-muted)':f.status==='trial'?'var(--amber-muted)':'var(--red-muted)',color:f.status==='active'?'var(--green)':f.status==='trial'?'var(--amber)':'var(--red)'}}>
                      {f.status}
                    </span>
                  </td>
                  <td style={{fontFamily:'IBM Plex Mono,monospace',color:f.monthlyRevenue>0?'var(--green)':'var(--text3)'}}>
                    {f.monthlyRevenue>0?`৳${f.monthlyRevenue.toLocaleString()}`:'Trial'}
                  </td>
                  <td style={{fontFamily:'IBM Plex Mono,monospace',color:'var(--text3)',fontSize:11}}>
                    {f.monthlyRevenue>0?`৳${(f.monthlyRevenue*12).toLocaleString()}`:'—'}
                  </td>
                  <td style={{fontFamily:'IBM Plex Mono,monospace',fontSize:11,color:'var(--text3)'}}>{f.joinedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
