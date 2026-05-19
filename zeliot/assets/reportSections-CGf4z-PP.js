const R={claude:{name:"Claude",color:"#A78BFA",short:"Cla"},openai:{name:"ChatGPT",color:"#22c55e",short:"Cha"},gemini:{name:"Gemini",color:"#38BDF8",short:"Gem"},perplexity:{name:"Perplexity",color:"#06b6d4",short:"Ppl"}};function i(d){return(d||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function L(d){return isNaN(d)?0:Math.round(d)}function F(d){return d>=70?"success":d>=40?"warning":"danger"}function K(d){return d<=1?"var(--success)":d<=3?"var(--info)":d<=5?"var(--warning)":"var(--danger)"}function st(d){const c=(d?.contentGaps||[]).filter(n=>n?.schemaVersion===2);if(!c.length)return"";const u={},A={critical:0,high:0,medium:0,low:0};c.forEach(n=>{u[n.type]=(u[n.type]||0)+1,A[n.severityLabel]!=null&&A[n.severityLabel]++});const o=[...c].sort((n,t)=>(t.severityScore||0)-(n.severityScore||0)).slice(0,10),m=Object.entries(u).sort((n,t)=>t[1]-n[1]).map(([n,t])=>`<span class="badge">${i(n)} · ${t}</span>`).join(" "),g=Object.entries(A).filter(([,n])=>n>0).map(([n,t])=>`<span class="badge badge-${n==="critical"?"danger":n==="high"?"warning":n==="medium"?"info":"muted"}">${i(n)} · ${t}</span>`).join(" "),v=o.map((n,t)=>`
    <tr>
      <td>${t+1}</td>
      <td class="mono">${i(n.type)}</td>
      <td class="right" style="font-weight:700">${n.severityScore}</td>
      <td>${i(n.severityLabel)}</td>
      <td title="${i(n.query||"")}">${i((n.query||"").slice(0,90))}${(n.query||"").length>90?"…":""}</td>
      <td>${i(n.model||"—")}</td>
      <td class="small">${i((n.auditTrail?.rationale||"").slice(0,140))}</td>
    </tr>`).join("");return`
    <section class="report-section">
      <div class="section-header">
        <span class="section-title">Content Gaps (classifier output)</span>
        <span class="section-subtitle">${c.length} actionable · ${g||""}</span>
      </div>
      <div style="margin-bottom:10px">${m}</div>
      <table class="report-table">
        <thead><tr><th>#</th><th>Type</th><th class="right">Score</th><th>Label</th><th>Query</th><th>Model</th><th>Rationale</th></tr></thead>
        <tbody>${v}</tbody>
      </table>
    </section>`}function at(d){const c=Array.isArray(d?.results)?d.results:[];if(!c.length)return"";const u=c.slice(0,200).map((o,m)=>{const g=(d.llms||[]).map(n=>{const t=o.analyses?.[n];if(!t||t._error)return'<td class="small muted">—</td>';const $=t.mentioned?"✓":"·",l=t.rank!=null?`#${t.rank}`:"—",e=t.sentiment||"—";return`<td class="small">${$} ${l} · ${i(e)}</td>`}).join(""),v=[...new Set(Object.values(o.analyses||{}).flatMap(n=>(n?.cited_sources||[]).map(t=>t?.domain).filter(Boolean)))].slice(0,3).join(", ");return`<tr>
      <td>${m+1}</td>
      <td class="small mono">${i(o.qid||"")}</td>
      <td title="${i(o.query||"")}">${i((o.query||"").slice(0,100))}${(o.query||"").length>100?"…":""}</td>
      <td class="small">${i(o.persona||"")}</td>
      <td class="small">${i(o.stage||"")}</td>
      ${g}
      <td class="small muted">${i(v||"—")}</td>
    </tr>`}).join(""),A=(d.llms||[]).map(o=>`<th class="small">${i(R[o]?.name||o)}</th>`).join("");return`
    <section class="report-section">
      <div class="section-header">
        <span class="section-title">Raw Data Appendix</span>
        <span class="section-subtitle">Per-query per-model snapshot · ${c.length} queries ${c.length>200?"(showing first 200)":""}</span>
      </div>
      <div style="overflow-x:auto">
        <table class="report-table">
          <thead><tr>
            <th>#</th><th>QID</th><th>Query</th><th class="small">Persona</th><th class="small">Stage</th>
            ${A}
            <th class="small">Top cited domains</th>
          </tr></thead>
          <tbody>${u}</tbody>
        </table>
      </div>
    </section>`}function nt(d){const{company:c,scanDate:u,queryCount:A,llmCount:o,llms:m,visibility:g,sentiment:v,perLlmVis:n,scores:t,verifiability:$,fiveMetrics:l,personaBk:e,stageBk:r,compMentions:x}=d,s=v.positive+v.neutral+v.negative||1,a=L(v.positive/s*100),y=L(v.neutral/s*100),f=L(v.negative/s*100);let h="";g>=80?h=`Strong AI visibility at ${g}% — ${c} is well-positioned across AI platforms.`:g>=50?h=`Moderate visibility at ${g}% — room to improve AI presence for ${c}.`:h=`Critical visibility gap at ${g}% — ${c} needs urgent AI presence optimization.`;const k=w=>w==null?"var(--muted)":w>=50?"var(--success)":w>=25?"var(--warning)":"var(--danger)",C=w=>w==null?"var(--muted)":w>=75?"var(--success)":w>=50?"var(--warning)":"var(--danger)",S=(w,B="")=>w==null?"—":`${w}${B}`,b=t||{},p=$||{},j=b.overall??null,z=b.mention??g??null,I=b.position??null,E=b.sentiment??null,T=b.accuracy??null,P=b.shareOfVoice??l?.shareOfVoice?.value??null,q=p.avgCitationsPerQuery??null,D=p.uniqueDomains??null,N=p.truthfulnessRate??(p.hallucinationRate!=null?100-p.hallucinationRate:null),_=p.consistencyRate??null,U=[{label:"Overall",val:S(j),color:k(j),sub:"mention × 0.35 + position × 0.40 + sentiment × 0.25"},{label:"Mention %",val:S(z,"%"),color:k(z),sub:"% of (q × LLM) analyses naming "+c},{label:"Position",val:S(I),color:k(I),sub:"avg score when ranked · rank 1 = 100"},{label:"Sentiment",val:S(E),color:k(E),sub:`${a}% pos · ${y}% neu · ${f}% neg`},{label:"Accuracy",val:S(T),color:k(T),sub:"Stage 2 Haiku 1-10 × 10"},{label:"Share of Voice",val:S(P,"%"),color:k(P),sub:c+" ÷ total vendor mentions"},{label:"Avg citations / Q",val:S(q),color:"var(--accent)",sub:"pooled across models × N"},{label:"Unique domains",val:S(D),color:"var(--accent)",sub:"distinct hostnames cited"},{label:"Truthfulness %",val:S(N,"%"),color:C(N),sub:p.vendorsChecked!=null?`${p.vendorsChecked-(p.unsupportedClaims||0)}/${p.vendorsChecked} vendors backed`:"vendor names backed by source content"},{label:"Consistency %",val:_==null?"—":S(_,"%"),color:C(_),sub:_==null?"Quick scans have no comparison":`across ${p.consistencyAnalysesCounted||0} N≥2 analyses`}].map(w=>`
    <div class="stat-card">
      <div class="stat-value" style="color:${w.color}">${w.val}</div>
      <div class="stat-label">${i(w.label)}</div>
      <div class="stat-sub">${i(w.sub)}</div>
    </div>`).join(""),Y=(m||[]).map(w=>{const B=R[w]||{name:w,color:"#888"},M=n[w]||0;return`<div class="bar-item">
      <span class="bar-label" style="color:${B.color}">${i(B.name)}</span>
      <div class="bar-track"><div class="bar-fill ${F(M)}" style="width:${Math.max(M,2)}%"><span class="bar-fill-text">${M}%</span></div></div>
    </div>`}).join(""),O=[];p.analysesCounted!=null&&O.push(`${p.analysesCounted} analyses`),q!=null&&O.push(`avg ${q} citations per answer`),D!=null&&O.push(`${D} unique domains`);const J=O.length?`<div class="stat-sub" style="margin-top:12px;text-align:left">${O.join(" · ")}.${N!=null&&p.vendorsChecked>0?` <strong style="color:${C(N)}">${N}%</strong> of competitor names backed by a matching cited source (${p.vendorsChecked-(p.unsupportedClaims||0)}/${p.vendorsChecked} vendors verified).`:""}${_!=null?` <strong style="color:${C(_)}">${_}%</strong> response consistency across ${p.consistencyAnalysesCounted||0} N≥2 analyses.`:""}</div>`:"",G=(w,B)=>(w||[]).map(M=>{const V=M.rate??0,W=B?B(V):"var(--accent)";return`<div class="seg-row">
      <span class="seg-label">${i(M.label||M.id)}</span>
      <div class="seg-track"><div class="seg-fill" style="width:${Math.max(V,2)}%;background:${W}"><span class="seg-fill-text">${V}%</span></div></div>
      <span class="seg-value" style="color:${W}">${V}% · ${M.count||0} Qs</span>
    </div>`}).join(""),Q=w=>w>=70?"var(--success)":w>=40?"var(--warning)":"var(--danger)",X=(m||[]).map(w=>({label:R[w]?.name||w,rate:n?.[w]??0,count:A})),Z=`
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin-top:24px">
      <div><div class="card-title">By Persona</div>${G(e,Q)||'<div class="stat-sub">No persona data.</div>'}</div>
      <div><div class="card-title">By Stage</div>${G(r,Q)||'<div class="stat-sub">No stage data.</div>'}</div>
      <div><div class="card-title">By Model</div>${G(X,Q)}</div>
    </div>`,H=(x||[]).slice(0,10).map((w,B)=>`<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:0.85rem">
      <span><span style="color:var(--muted);margin-right:6px">${B+1}.</span>${i(w.name||"—")}</span>
      <span style="color:var(--muted);font-variant-numeric:tabular-nums">${w.count||0}×</span>
    </div>`).join(""),tt=H?`
    <div style="margin-top:24px">
      <div class="card-title">Top Competitors</div>
      ${H}
    </div>`:"";return`
    <div class="hero">
      <div class="hero-badge">AI Perception Audit Report</div>
      <div class="hero-title">${i(c)} AI Visibility</div>
      <div class="hero-accent">${h}</div>
      <div class="hero-meta">
        <div class="hero-meta-item"><span class="hero-meta-dot"></span> ${i(u)}</div>
        <div class="hero-meta-item"><span class="hero-meta-dot"></span> ${A} Queries Analyzed</div>
        <div class="hero-meta-item"><span class="hero-meta-dot"></span> ${o} AI Platforms</div>
      </div>
      <div class="stat-grid" style="margin-top:24px">${U}</div>
      ${J}
      <div class="card-title" style="margin-top:20px">Per-Platform Visibility</div>
      <div class="bar-chart">${Y}</div>
      ${Z}
      ${tt}
    </div>`}function it(d){const{company:c,llms:u,results:A,sentiment:o}=d,m=(c||"").toLowerCase(),g=o.positive+o.neutral+o.negative||1,v=L(o.positive/g*100),n=L(o.neutral/g*100),t=L(o.negative/g*100),$={},l={};(A||[]).forEach(s=>{const a=s._cluster||s.cw||s.lifecycle||"General";(u||[]).forEach(y=>{const f=s.analyses?.[y];!f||f._error||($[a]||($[a]={}),l[a]||(l[a]={positive:0,neutral:0,negative:0,total:0}),l[a].total++,f.sentiment&&(l[a][f.sentiment]=(l[a][f.sentiment]||0)+1),(f.vendors_mentioned||[]).forEach(h=>{$[a][h.name]=($[a][h.name]||0)+1}))})});const e=Object.entries($).map(([s,a])=>{const y=Object.entries(a).sort((j,z)=>z[1]-j[1]),f=y[0]||["—",0],h=Object.entries(a).find(([j])=>j.toLowerCase().includes(m))?.[1]||0,k=f[0].toLowerCase().includes(m),C=y.reduce((j,[,z])=>j+z,0),S=l[s]||{positive:0,total:1},b=L(S.positive/S.total*100);let p="Attack";return k?p="Defend":h>0&&h>=f[1]*.6?p="Compete":C<=2&&(p="Ignore"),{theme:s,owner:f[0],ownerCount:f[1],companyCount:h,ownerIsCompany:k,totalMentions:C,sentPct:b,strategy:p,total:S.total}}).sort((s,a)=>a.total-s.total),r=e.map(s=>{s.sentPct>=70||s.sentPct>=40;const a=s.ownerIsCompany?`<span class="badge badge-success">${i(c)} (${s.ownerCount}x)</span>`:`<span class="badge badge-danger">${i(s.owner)} (${s.ownerCount}x)</span>`,y=s.strategy==="Defend"?"var(--success)":s.strategy==="Compete"?"var(--info)":s.strategy==="Attack"?"var(--warning)":"var(--text-muted)",f=`<span style="font-size:0.7rem;font-weight:700;padding:2px 8px;border-radius:4px;background:${y}15;color:${y};text-transform:uppercase;letter-spacing:0.03em">${s.strategy}</span>`;return`<tr>
      <td style="font-weight:600;text-transform:capitalize">${i(s.theme.replace(/_/g," "))}</td>
      <td class="center">${a}</td>
      <td class="center" style="font-weight:700;color:${s.companyCount>0?"var(--accent)":"var(--text-muted)"}">${s.companyCount}x</td>
      <td class="center">${s.totalMentions}</td>
      <td class="center">${f}</td>
    </tr>`}).join(""),x=`<div style="display:flex;height:28px;border-radius:6px;overflow:hidden;margin:12px 0">
    ${v>0?`<div style="flex:${v};background:var(--success);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff">${v}%</div>`:""}
    ${n>0?`<div style="flex:${n};background:var(--warning);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff">${n}%</div>`:""}
    ${t>0?`<div style="flex:${t};background:var(--danger);display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;color:#fff">${t}%</div>`:""}
  </div>
  <div style="display:flex;gap:16px;font-size:0.78rem;color:var(--text-secondary)">
    <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--success);margin-right:4px"></span>Positive ${v}%</span>
    <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--warning);margin-right:4px"></span>Neutral ${n}%</span>
    <span><span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--danger);margin-right:4px"></span>Negative ${t}%</span>
  </div>`;return`
    <div class="section">
      <div class="section-header">
        <span class="section-number">2</span>
        <span class="section-title">AI Perception</span>
        <div class="section-subtitle">How AI perceives ${i(c)} — sentiment when mentioned and who owns each narrative theme</div>
      </div>
      <div class="card">
        <div class="card-title">Overall Sentiment When ${i(c)} Is Mentioned</div>
        ${x}
      </div>
      ${e.length>0?`
        <div class="card">
          <div class="card-title">Narrative Ownership by Theme</div>
          <div class="section-subtitle" style="margin-bottom:12px;font-size:0.78rem">
            <strong>Sentiment</strong> = how AI describes ${i(c)} in that theme. <strong>Owner</strong> = which vendor AI mentions most. High sentiment + low ownership = AI likes you but doesn't talk about you enough.
          </div>
          <table class="data-table">
            <thead><tr>
              <th>Theme</th><th class="center">Owner</th><th class="center">${i(c)}</th><th class="center">Weight</th><th class="center">Action</th>
            </tr></thead>
            <tbody>${r}</tbody>
          </table>
        </div>
      `:""}
    </div>`}function ot(d){const{llms:c,results:u,perLlmVis:A,perLlmRank:o,sentPerLlm:m,company:g}=d,v=(c||[]).map(t=>{const $=R[t]||{name:t,color:"#888"},l=A[t]||0,e=o[t]||0,r=m[t]||{positive:0,neutral:0,negative:0},x=r.positive+r.neutral+r.negative||1,s=L(r.positive/x*100);let a=0,y=0;return(u||[]).forEach(f=>{const h=f.analyses?.[t];h&&!h._error&&(y++,h.mentioned&&a++)}),`<tr>
      <td style="font-weight:700;color:${$.color}">${i($.name)}</td>
      <td class="center"><span class="badge badge-${F(l)}">${l}%</span></td>
      <td class="center" style="font-weight:700;color:${K(e)}">${e>0?"#"+e.toFixed(1):"—"}</td>
      <td class="center">${s}%</td>
      <td class="center" style="font-weight:700">${a}/${y}</td>
    </tr>`}).join(""),n=(c||[]).map(t=>{const $=R[t]||{name:t,color:"#888"},l=A[t]||0;let e=0,r=0;(u||[]).forEach(s=>{const a=s.analyses?.[t];a&&!a._error&&(r++,a.mentioned&&e++)});const x=d.perLlmRank[t]||0;return`<div class="plat-card" style="border-top:3px solid ${$.color}">
      <div class="plat-name" style="color:${$.color}">${i($.name)}</div>
      <div class="plat-score" style="color:${l>=70?"var(--success)":l>=40?"var(--warning)":"var(--danger)"}">${l}%</div>
      <div class="plat-detail">${e}/${r} queries cited${x>0?` · Avg rank #${x.toFixed(1)}`:""}</div>
    </div>`}).join("");return`
    <div class="section">
      <div class="section-header">
        <span class="section-number">3</span>
        <span class="section-title">Platform Scorecard</span>
        <div class="section-subtitle">How ${i(g)} performs on each AI platform</div>
      </div>
      <div class="plat-grid">${n}</div>
      <div class="card" style="margin-top:16px">
        <div class="card-title">Platform Comparison</div>
        <table class="data-table">
          <thead><tr>
            <th>Platform</th><th class="center">Visibility</th><th class="center">Avg Rank</th><th class="center">Positive %</th><th class="center">Cited</th>
          </tr></thead>
          <tbody>${v}</tbody>
        </table>
      </div>
    </div>`}function lt(d){const{compMentions:c,llms:u,results:A,company:o,shareOfVoice:m}=d,g=(o||"").toLowerCase(),v={};(A||[]).forEach(l=>{(u||[]).forEach(e=>{const r=l.analyses?.[e];!r||r._error||(r.vendors_mentioned||[]).forEach(x=>{v[x.name]||(v[x.name]={}),v[x.name][e]=(v[x.name][e]||0)+1})})});const t=(c||[]).slice(0,10).map(l=>{const e=l.name.toLowerCase().includes(g),r=v[l.name]||{},x=(u||[]).map(a=>{const y=r[a]||0,f=R[a]||{color:"#888"};return`<td class="center" style="font-weight:700;${y>0?"color:"+f.color:"color:var(--text-muted)"}">${y||"—"}</td>`}).join(""),s=(u||[]).map(a=>{const y=r[a]||0,f=R[a]||{color:"#888"};return y>0?`<div class="stacked-seg" style="flex:${y};background:${f.color}">${y}</div>`:""}).join("");return`<tr class="${e?"highlight":""}">
      <td style="${e?"font-weight:800":""}">${i(l.name)}</td>
      ${x}
      <td class="center" style="font-weight:800">${l.m}</td>
      <td style="width:25%"><div class="stacked-bar">${s}</div></td>
    </tr>`}).join(""),$=(u||[]).map(l=>{const e=R[l]||{name:l};return`<th class="center" style="color:${e.color}">${i(e.name)}</th>`}).join("");return`
    <div class="section">
      <div class="section-header">
        <span class="section-number">4</span>
        <span class="section-title">AI Visibility Leaderboard</span>
        <div class="section-subtitle">Who owns the AI conversation — total citations across all platforms${m?` · ${i(o)} share of voice: ${L(m)}%`:""}</div>
      </div>
      <div class="card">
        <table class="data-table">
          <thead><tr>
            <th>Vendor</th>${$}<th class="center">Total</th><th>Distribution</th>
          </tr></thead>
          <tbody>${t}</tbody>
        </table>
      </div>
    </div>`}function rt(d){const{results:c,llms:u,company:A}=d,o=(u||[]).map(r=>{const x=R[r]||{name:r,color:"#888"};return`<th class="center" style="min-width:80px"><span style="color:${x.color};font-weight:700">${i(x.name)}</span></th>`}).join("");let m=0,g=0,v=0;const n=(c||[]).map((r,x)=>{let s=0;const a=(u||[]).map(h=>{const k=r.analyses?.[h];if(!k||k._error)return'<td class="center" style="color:var(--text-muted)">—</td>';if(k.mentioned){s++;const C=k.rank?`#${k.rank}`:"✓",S=k.sentiment==="positive"?"P":k.sentiment==="negative"?"N":"A",b=k.sentiment==="positive"?"var(--success)":k.sentiment==="negative"?"var(--danger)":"var(--warning)";return`<td class="center"><span style="color:${k.rank<=1?"var(--success)":k.rank<=3?"var(--info)":k.rank<=5?"var(--warning)":"var(--danger)"};font-weight:700">${C}</span> <span style="font-size:0.7rem;color:${b};font-weight:600">${S}</span></td>`}return'<td class="center"><span style="color:var(--danger);font-weight:700">✗</span></td>'}).join(""),y=(u||[]).length;let f;return s===y?(f='<span class="badge badge-success" style="font-size:0.7rem">● Strong</span>',m++):s>0?(f='<span class="badge badge-warning" style="font-size:0.7rem">⚠ Weak</span>',g++):(f='<span class="badge badge-danger" style="font-size:0.7rem">✗ Lost</span>',v++),`<tr>
      <td style="font-size:0.78rem;max-width:320px">${i(r.query)}</td>
      ${a}
      <td class="center">${f}</td>
    </tr>`}).join(""),t=(c||[]).length,$=t?Math.round(m/t*100):0,l=t?Math.round(g/t*100):0,e=t?Math.round(v/t*100):0;return`
    <div class="section">
      <div style="display:flex;align-items:center;gap:10px;padding-bottom:16px;border-bottom:2px solid var(--bg-tertiary);margin-bottom:20px">
        <span class="section-number">5</span>
        <span class="section-title">Query Summary</span>
      </div>
      <div class="section-subtitle" style="margin-bottom:16px">How ${i(A)} appears across ${t} queries on each AI platform. ✓ = mentioned, ✗ = absent, rank shown when available. Sentiment: P = Positive, N = Negative, A = Neutral/Absent.</div>

      <div style="display:flex;gap:16px;margin-bottom:20px;flex-wrap:wrap">
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:10px;height:10px;border-radius:50%;background:var(--success);display:inline-block"></span>
          <span style="font-size:0.82rem;font-weight:600">Strong: ${m}</span>
          <span style="font-size:0.75rem;color:var(--text-muted)">(${$}%)</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:10px;height:10px;border-radius:50%;background:var(--warning);display:inline-block"></span>
          <span style="font-size:0.82rem;font-weight:600">Weak: ${g}</span>
          <span style="font-size:0.75rem;color:var(--text-muted)">(${l}%)</span>
        </div>
        <div style="display:flex;align-items:center;gap:6px">
          <span style="width:10px;height:10px;border-radius:50%;background:var(--danger);display:inline-block"></span>
          <span style="font-size:0.82rem;font-weight:600">Lost: ${v}</span>
          <span style="font-size:0.75rem;color:var(--text-muted)">(${e}%)</span>
        </div>
      </div>

      <div class="card" style="overflow-x:auto">
        <table class="data-table">
          <thead><tr>
            <th>Query</th>
            ${o}
            <th class="center">Status</th>
          </tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
    </div>`}function ct(d){const{results:c,llms:u,company:A}=d,o={};let m=0;(c||[]).forEach(l=>{(u||[]).forEach(e=>{const r=l.analyses?.[e],x=R[e]||{name:e};(r?.cited_sources||r?.sources_cited||[]).forEach(a=>{if(!a)return;const y=typeof a=="string"?a:typeof a.url=="string"?a.url:"";if(!y||y==="training_knowledge")return;m++;const h=(typeof a=="object"&&typeof a.domain=="string"?a.domain:"")||y.replace(/^https?:\/\/(www\.)?/,"").replace(/\/.*/,"");o[h]||(o[h]={domain:h,count:0,urls:new Set,types:new Set,llms:new Set,snippets:[]}),o[h].count++,o[h].urls.add(y),typeof a=="object"&&a.type&&o[h].types.add(a.type),o[h].llms.add(x.name);const k=typeof a=="object"?a.excerpt||a.context||a.snippet:null;k&&o[h].snippets.length<3&&o[h].snippets.push(k)})})});const g=Object.values(o).sort((l,e)=>e.count-l.count);if(g.length===0)return`
      <div class="section">
        <div class="section-header">
          <span class="section-number">6</span>
          <span class="section-title">Source Intelligence</span>
          <div class="section-subtitle">No source citations were captured in this scan. Re-run with updated prompts to capture sources.</div>
        </div>
      </div>`;const v=g[0]?.count||1,n=g.slice(0,15).map((l,e)=>{const r=L(l.count/v*100),x=[...l.types].map(a=>`<span class="badge badge-muted" style="font-size:0.55rem;margin-right:2px">${i(a)}</span>`).join(""),s=[...l.llms].map(a=>{const y=Object.entries(R).find(([,h])=>h.name===a);return`<span style="font-size:0.65rem;font-weight:700;color:${y?y[1].color:"#888"}">${i(a)}</span>`}).join(", ");return`<tr>
      <td style="font-weight:700;font-size:0.82rem">${e+1}. ${i(l.domain)}</td>
      <td style="width:30%"><div class="bar-track" style="height:20px"><div class="bar-fill accent" style="width:${r}%"><span class="bar-fill-text">${l.count}</span></div></div></td>
      <td style="font-size:0.75rem">${x}</td>
      <td style="font-size:0.75rem">${s}</td>
    </tr>`}).join(""),t={};g.forEach(l=>{[...l.types].forEach(e=>{t[e]=(t[e]||0)+l.count})});const $=Object.entries(t).sort((l,e)=>e[1]-l[1]).map(([l,e])=>`<div class="seg-row">
      <span class="seg-label">${i(l)}</span>
      <div class="seg-track"><div class="seg-fill" style="width:${L(e/m*100)}%;background:var(--info)"><span class="seg-fill-text">${e}</span></div></div>
      <span class="seg-value" style="color:var(--info)">${L(e/m*100)}%</span>
    </div>`).join("");return`
    <div class="section">
      <div class="section-header">
        <span class="section-number">6</span>
        <span class="section-title">Source Intelligence</span>
        <div class="section-subtitle">Which websites and publications are shaping AI perception — ${m} source citations across ${g.length} domains</div>
      </div>
      <div class="callout" style="margin-bottom:16px">
        <div class="callout-title">Why This Matters</div>
        <div class="callout-text">These are the websites AI platforms reference when answering buyer queries about ${i(A)} and competitors. To shift AI perception, create and optimize content on these domains.</div>
      </div>
      <div class="card">
        <div class="card-title">Most Cited Domains</div>
        <table class="data-table">
          <thead><tr><th>Domain</th><th>Citations</th><th>Type</th><th>Platforms</th></tr></thead>
          <tbody>${n}</tbody>
        </table>
      </div>
      ${$?`<div class="card"><div class="card-title">Source Type Breakdown</div>${$}</div>`:""}
    </div>`}function dt(d){const{personaBk:c,stageBk:u,clmStageBk:A}=d;function o(m,g,v){return m.map(n=>{const t=n[v]||0,$=t>=70?"var(--success)":t>=40?"var(--warning)":"var(--danger)";return`<div class="seg-row">
        <span class="seg-label">${i(n[g])}</span>
        <div class="seg-track"><div class="seg-fill" style="width:${Math.max(t,2)}%;background:${$}"><span class="seg-fill-text">${t}%</span></div></div>
        <span class="seg-value" style="color:${$}">${t}%</span>
      </div>`}).join("")}return`
    <div class="section">
      <div class="section-header">
        <span class="section-number">7</span>
        <span class="section-title">Segment Breakdown</span>
        <div class="section-subtitle">Visibility by persona, buying stage, and CLM lifecycle</div>
      </div>
      <div class="card">
        <div class="card-title">By Buyer Persona</div>
        ${o(c||[],"persona","rate")}
      </div>
      <div class="card">
        <div class="card-title">By Buying Stage</div>
        ${o(u||[],"stage","rate")}
      </div>
      <div class="card">
        <div class="card-title">By CLM Lifecycle</div>
        ${o(A||[],"label","rate")}
      </div>
    </div>`}function pt(d){const{results:c,llms:u,company:A,clmStageBk:o,sentiment:m,visibility:g,avgRank:v,perLlmVis:n,fiveMetrics:t,scores:$,verifiability:l}=d,e=(A||"").toLowerCase(),r=(m?.positive||0)+(m?.neutral||0)+(m?.negative||0)||1,x={positive:L((m?.positive||0)/r*100),neutral:L((m?.neutral||0)/r*100),negative:L((m?.negative||0)/r*100),total:r};let s,a;if(t?.narrative&&(t.narrative.preSigPct!=null||t.narrative.postSigPct!=null||t.narrative.fullStackPct!=null)){let C=0;(c||[]).forEach(S=>{(u||[]).forEach(b=>{const p=S.analyses?.[b];p&&!p._error&&p.mentioned&&C++})}),s={preSig:L(t.narrative.preSigPct||0),postSig:L(t.narrative.postSigPct||0),fullStack:L(t.narrative.fullStackPct||0),total:C,dominant:null,biasDetected:!1},a="fiveMetrics.narrative (scanEngine.classifyNarrative)"}else{const C=["pre-signature","pre-deal","evaluation","authoring","drafting","negotiation","redlining","intake","request"],S=["post-signature","obligation","compliance","renewal","performance","spend","implementation","adoption"],b={"pre-signature":0,"post-signature":0,"full-stack":0,total:0};(c||[]).forEach(j=>{(u||[]).forEach(z=>{const I=j.analyses?.[z];if(!I||I._error||!I.mentioned)return;const E=(I.rawText||I.summary||I.narrative||"").toLowerCase(),T=C.some(q=>E.includes(q)),P=S.some(q=>E.includes(q));b.total++,T&&P?b["full-stack"]++:T?b["pre-signature"]++:P?b["post-signature"]++:b["full-stack"]++})});const p=b.total||1;s={preSig:L(b["pre-signature"]/p*100),postSig:L(b["post-signature"]/p*100),fullStack:L(b["full-stack"]/p*100),total:b.total,dominant:null,biasDetected:!1},a="legacy keyword-match fallback"}s.postSig>s.preSig&&s.postSig>s.fullStack?(s.dominant="post-signature",s.biasDetected=s.postSig>40):s.fullStack>=s.preSig?s.dominant="full-stack":s.dominant="pre-signature",s.source=a;const y={};let f=0,h=0;(u||[]).forEach(C=>{let S=0,b=0;(c||[]).forEach(p=>{const j=p.analyses?.[C];if(!j||j._error)return;b++;const z=j.citations||[],I=j.sources||[],E=j.cited_sources||j.sources_cited||[];(z.some(P=>(P||"").toLowerCase().includes(e))||I.some(P=>(P||"").toLowerCase().includes(e))||E.some(P=>((P?.url||"")+" "+(P?.domain||"")+" "+(P?.title||"")+" "+(P?.excerpt||P?.context||P?.snippet||"")).toLowerCase().includes(e)))&&S++}),y[C]={cited:S,total:b,rate:b>0?L(S/b*100):0},f+=S,h+=b});const k=[];return(c||[]).forEach(C=>{(u||[]).forEach(S=>{const b=C.analyses?.[S];b?.content_gaps&&b.content_gaps.forEach(p=>{p&&p.length>5&&!k.some(j=>j.gap.toLowerCase().includes(p.toLowerCase().substring(0,30)))&&k.push({query:C.query,gap:p,lifecycle:C.lifecycle||"full-stack",persona:C.persona||"Unknown",scanId:C.scanId})})})}),{sentiment:x,lifecycleBias:s,citations:{perLlm:y,total:f,totalResponses:h,overallRate:h>0?L(f/h*100):0},visibility:{overall:g,perLlm:n,avgRank:v},lifecycleVisibility:(o||[]).map(C=>({id:C.id,label:C.label,rate:C.rate,count:C.count})),contentGaps:k,scores:$||null,verifiability:l||null,fiveMetrics:t||null}}function vt(d){const{competitorInsights:c,benchmark:u,company:A,visibility:o,avgRank:m}=d,g=[];(d.results||[]).forEach(e=>{(d.llms||[]).forEach(r=>{const x=e.analyses?.[r];x?.content_gaps&&x.content_gaps.forEach(s=>{s&&s.length>5&&g.push({query:e.query,gap:s})})})});const v=[];g.forEach(e=>{v.some(r=>r.gap.toLowerCase().includes(e.gap.toLowerCase().substring(0,30)))||v.push(e)});const n=v.slice(0,8).map((e,r)=>`
    <div class="action-item" style="border-left:3px solid var(--warning)">
      <div class="action-num" style="background:var(--warning)">${r+1}</div>
      <div style="flex:1">
        <div style="font-size:0.82rem;font-weight:600;margin-bottom:2px">${i(e.gap)}</div>
        <div style="font-size:0.72rem;color:var(--text-muted)">Query: ${i(e.query)}</div>
      </div>
    </div>`).join(""),t=c?(c.topActions||[]).map(([e,r],x)=>`
    <div class="action-item">
      <div class="action-num">${x+1}</div>
      <div class="action-text">${i(e)}</div>
      <div class="action-severity badge badge-${r>=3?"danger":r>=2?"warning":"info"}">${r}x</div>
    </div>`).join(""):"",$=c?(c.losing||[]).map(e=>`
    <div class="action-item" style="border-left:3px solid var(--danger)">
      <div style="flex:1">
        <div style="font-size:0.82rem;font-weight:600;margin-bottom:2px">${i(e.query)}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">
          <span class="badge badge-accent">${i(e.persona||"")}</span>
          ${e.zeliotAbsent?'<span class="badge badge-danger" style="margin-left:4px">Absent</span>':""}
          vs ${e.winners.map(r=>`<strong>${i(r)}</strong>`).join(", ")}
        </div>
      </div>
    </div>`).join(""):"",l=u&&u.count>0?`<div class="callout-stat"><div class="callout-stat-value" style="color:${u.hitRate>=70?"var(--success)":u.hitRate>=40?"var(--warning)":"var(--danger)"}">${u.hitRate}%</div><div class="callout-stat-label">Benchmark Hit Rate</div></div>`:"";return`
    <div class="section">
      <div class="section-header">
        <span class="section-number">8</span>
        <span class="section-title">Key Takeaways & Actions</span>
        <div class="section-subtitle">What to fix next based on gap and competitive analysis</div>
      </div>
      ${n.length>0?`<div class="card"><div class="card-title">Content Gaps Identified</div>${n}</div>`:""}
      ${t.length>0?`<div class="card"><div class="card-title">Recommended Actions</div>${t}</div>`:""}
      ${$.length>0?`<div class="card"><div class="card-title">Competitive Losses</div>${$}</div>`:""}
      <div class="callout">
        <div class="callout-title">Bottom Line</div>
        <div class="callout-text">${i(A)} has ${o}% overall AI visibility with an average rank of #${m.toFixed(1)} across ${d.llmCount} AI platforms. ${o>=70?"The foundation is solid — focus on closing remaining gaps and defending strong positions.":o>=40?"Moderate presence detected — prioritize closing content gaps and improving underperforming platforms.":"Critical gaps in AI visibility — immediate action needed to establish presence across AI platforms."}</div>
        <div class="callout-stats">
          <div class="callout-stat"><div class="callout-stat-value" style="color:${o>=70?"var(--success)":"var(--warning)"}">${o}%</div><div class="callout-stat-label">Visibility</div></div>
          <div class="callout-stat"><div class="callout-stat-value" style="color:${K(m)}">#${m.toFixed(1)}</div><div class="callout-stat-label">Avg Rank</div></div>
          ${l}
          <div class="callout-stat"><div class="callout-stat-value text-info">${d.llmCount}</div><div class="callout-stat-label">Platforms</div></div>
        </div>
      </div>
    </div>`}export{st as a,nt as b,it as c,ot as d,lt as e,rt as f,ct as g,dt as h,vt as i,at as j,pt as k};
