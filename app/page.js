import {db} from '@/lib/db';import {CATS,LANGS,SEASON} from '@/lib/util';import Bid from '@/components/Bid';import Live from '@/components/Live';
export const dynamic='force-dynamic';
const inr=n=>'₹'+n.toLocaleString('en-IN'),MAIN=['All','Heroes','Creators','Startups','Freelancers'],MORE=['Local business','D2C brands'],CHIPS=[...MAIN,...MORE];
const GOLD={background:'linear-gradient(135deg,#ffe066,#ff9a3c)',color:'#2a1200',borderColor:'#fff'};
const GRID={display:'grid',gridTemplateColumns:'1fr 1fr',gap:10};
export default async function Home({searchParams}){
 const sp=await searchParams;const c=CHIPS.includes(sp.c)?sp.c:'All';
 const showMore=sp.more==='1'||MORE.includes(c);
 const s=SEASON();
 const [{data:hs},{data:hb},{data:lb}]=await Promise.all([
  db.from('heroes').select('id,name,lang,tier').eq('active',true),
  db.from('hero_bids').select('hero_id,amount').eq('season',s).eq('status','live'),
  db.from('bids').select('name,url,key,amount,cat').eq('season',s).eq('status','live').limit(5000)]);
 const ht={};(hb||[]).forEach(b=>{ht[b.hero_id]=(ht[b.hero_id]||0)+b.amount});
 const heroes=(hs||[]).map(h=>({...h,total:ht[h.id]||0})).filter(h=>h.total>0).sort((a,b)=>b.total-a.total);
 const lt={},top={};LANGS.forEach(l=>{lt[l]=0});
 heroes.forEach(h=>{lt[h.lang]+=h.total;if(!top[h.lang])top[h.lang]=h});
 const best=Math.max(...LANGS.map(l=>lt[l]));
 const lead=best>0?LANGS.find(l=>lt[l]===best):null;
 const lm={};(lb||[]).forEach(b=>{const k=b.cat+'|'+b.key;const r=lm[k]=lm[k]||{name:b.name,url:b.url,cat:b.cat,total:0};r.total+=b.amount});
 const heroRows=heroes.map(h=>({name:h.name,total:h.total,tag:h.lang+' · '+h.tier,href:'/heroes?lang='+h.lang+'&tier='+h.tier,ext:false}));
 const linkRows=Object.values(lm).sort((a,b)=>b.total-a.total).map(l=>({name:l.name,total:l.total,tag:l.cat,href:l.url,ext:true,cat:l.cat}));
 const byCat={};CATS.forEach(k=>{byCat[k]=linkRows.filter(r=>r.cat===k)});
 let rows=c==='All'?[...heroRows,...linkRows]:c==='Heroes'?heroRows:byCat[c]||[];
 rows=rows.slice().sort((a,b)=>b.total-a.total).slice(0,10);
 const formCat=CATS.includes(c)?c:CATS[0];
 const leader=(byCat[formCat]||[])[0]?.total||0;
 const pool=heroes.reduce((a,h)=>a+h.total,0)+linkRows.reduce((a,l)=>a+l.total,0);
 const champs=[{label:'Heroes',t:heroRows[0]},...CATS.map(k=>({label:k,t:(byCat[k]||[])[0]}))];
 const chip=x=>'/?c='+encodeURIComponent(x);
 const title=c==='All'?'Current champions 👑':c==='Heroes'?'Language Wars ⚔️':'Top in '+c+' 👑';
 const podium=c==='All'||c==='Heroes'?[]:(byCat[c]||[]).slice(0,3);
 return (
  <div className="w">
   <Live/>
   <h1>{process.env.SITE_NAME||'Boost Board'} 🔥</h1>
   <p className="m">Bid to be #1. Weekly boards reset every Monday (IST). Pool this week: {inr(pool)}</p>

   <div className="tabs">
    {MAIN.map(x=><a key={x} href={chip(x)} className={x===c?'on':''}>{x}</a>)}
    <a href={chip(c)+(showMore?'':'&more=1')} className={MORE.includes(c)?'on':''}>More {showMore?'▴':'▾'}</a>
   </div>
   {showMore&&<div className="tabs">{MORE.map(x=><a key={x} href={chip(x)} className={x===c?'on':''}>{x}</a>)}</div>}

   <h3>{title}</h3>
   {c==='All'&&<div style={GRID}>
    {champs.map(k=>(
     <a key={k.label} href={chip(k.label)} className="card" style={{textDecoration:'none',margin:0}}>
      <div className="m">{k.label}</div>
      <div className="nm" style={{fontSize:18}}>{k.t?k.t.name:'No bids yet'}</div>
      <div className="m">{k.t?inr(k.t.total):'Be the first'}</div>
     </a>))}
   </div>}
   {c==='Heroes'&&<div style={GRID}>
    {LANGS.map(l=>{const t=top[l],isL=l===lead;return(
     <a key={l} href={'/heroes?lang='+l} className="card" style={{textDecoration:'none',margin:0,...(isL?GOLD:{})}}>
      <div className="m" style={isL?{color:'#2a1200'}:{}}>{isL?'👑 ':''}{l} · {inr(lt[l])}</div>
      <div className="nm" style={{fontSize:18}}>{t?t.name:'No boosts yet'}</div>
      <div className="m" style={isL?{color:'#2a1200'}:{}}>{t?'Top hero · '+inr(t.total):'Be the first'}</div>
      <div className="bar"><i style={{width:Math.max(4,lt[l]/(best||1)*100)+'%'}}/></div>
     </a>)})}
   </div>}
   {c!=='All'&&c!=='Heroes'&&(podium.length?
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:10}}>
     {podium.map((r,i)=>(
      <a key={r.name+i} href={r.href} target="_blank" rel="noopener nofollow sponsored ugc" className="card" style={{textDecoration:'none',margin:0,...(i===0?GOLD:{})}}>
       <div className="rk" style={{textAlign:'left'}}>{['🥇','🥈','🥉'][i]}</div>
       <div className="nm">{r.name}</div>
       <div className="tot">{inr(r.total)}</div>
      </a>))}
    </div>
    :<p className="card m">No bids in {c} yet this week. Be the first to take #1.</p>)}

   <h3 style={{marginTop:22}}>Full ranking · {c}</h3>
   {!rows.length&&<p className="card m">Nothing here yet this week. Be the first.</p>}
   {rows.map((r,i)=>(
    <div key={r.tag+r.name+i} className={'row'+(i?'':' f')}>
     <div className="rk">{['🥇','🥈','🥉'][i]||i+1}</div>
     <div><div className="nm"><a href={r.href} {...(r.ext?{target:'_blank',rel:'noopener nofollow sponsored ugc'}:{})}>{r.name}</a></div><div className="m">{r.tag}</div></div>
     <div className="tot">{inr(r.total)}</div>
    </div>
   ))}

   <div className="card" style={{marginTop:22}}>
    <h3 style={{marginTop:0}}>Feature your brand</h3>
    <p className="m">Get your startup, channel or business listed in {formCat}. The highest total holds the top spot until the weekly reset.</p>
    <Bid cats={CATS} cat={formCat} leader={leader}/>
   </div>

   <p className="m">Hero boards are unofficial fan boards, not affiliated with or endorsed by anyone listed. 18+ only. <a href="/legal/terms">Terms</a> · <a href="/legal/privacy">Privacy</a> · <a href="/legal/refund">Refunds</a> · <a href="/legal/takedown">Takedown</a></p>
  </div>
 );
}