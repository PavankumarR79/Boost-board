import {db} from '@/lib/db';import {SEASON,LANGS,TIERS} from '@/lib/util';import HeroBid from '@/components/HeroBid';import Live from '@/components/Live';
export const dynamic='force-dynamic';
const ICON={Rising:'⚡',Established:'🔥',Legends:'👑'},inr=n=>'₹'+n.toLocaleString('en-IN');
export default async function Heroes({searchParams}){
 const sp=await searchParams;
 const tier=TIERS.includes(sp.tier)?sp.tier:TIERS[0];
 const lang=LANGS.includes(sp.lang)?sp.lang:LANGS[0];
 const all=sp.view==='all';
 const {data:lu}=await db.from('weekly_lineup').select('hero_id').eq('season',SEASON());
 const feat=new Set((lu||[]).map(x=>x.hero_id));
 let hq=db.from('heroes').select('id,name').eq('tier',tier).eq('lang',lang).eq('active',true);
 if(!all)hq=feat.size?hq.in('id',[...feat]):null;
 const {data:hs,error:herr}=hq?await hq:{data:[],error:null};
 let q=db.from('hero_bids').select('hero_id,amount').eq('status','live');
 if(!all)q=q.eq('season',SEASON());
 const {data:bs}=await q;
 const tot={};let pool=0;
 (bs||[]).forEach(b=>{tot[b.hero_id]=(tot[b.hero_id]||0)+b.amount;pool+=b.amount});
 const list=(hs||[]).map(h=>({...h,total:tot[h.id]||0})).sort((a,b)=>b.total-a.total);
 const top=list[0]?.total||0;
 const href=(o)=>'/heroes?'+new URLSearchParams({tier,lang,...(all?{view:'all'}:{}),...o}).toString();
 return (
  <div className="w">
   <Live/>
   <h1>Claim #1 in {lang} {tier} {ICON[tier]}</h1>
   <p className="m">Each week features up to 4 heroes per language and tier. Highest total holds #1. Resets every Monday (IST).</p>
   <div className="pills"><span className="pill">💰 Pool: {inr(pool)}</span></div>
   {herr&&<p className="err">DB error: {herr.message}</p>}
   <div className="tabs">{LANGS.map(l=><a key={l} href={href({lang:l})} className={l===lang?'on':''}>{l}</a>)}</div>
   <div className="tabs">{TIERS.map(t=><a key={t} href={href({tier:t})} className={t===tier?'on':''}>{ICON[t]} {t}</a>)}</div>
   <div className="tabs">
    <a href={'/heroes?'+new URLSearchParams({tier,lang}).toString()} className={all?'':'on'}>This week</a>
    <a href={'/heroes?'+new URLSearchParams({tier,lang,view:'all'}).toString()} className={all?'on':''}>All-time</a>
   </div>
   {!list.length&&<p className="card m">{all?'No heroes added here yet.':'No lineup set for this box this week.'}</p>}
   {list.map((h,i)=>(
    <div key={h.id} className={'row'+(i?'':' f')}>
     <div className="rk">{['🥇','🥈','🥉'][i]||i+1}</div>
     <div><div className="nm">{i===0&&top>0?'👑 ':''}{h.name}</div><div className="bar"><i style={{width:(top?Math.max(4,h.total/top*100):4)+'%'}}/></div></div>
     <div className="tot">{inr(h.total)}</div>
     {feat.has(h.id)&&<HeroBid id={h.id} name={h.name} gap={i&&top?top-h.total+1:0}/>}
    </div>
   ))}
   <p className="m">Unofficial fan board. Not affiliated with, endorsed by, or connected to any person listed. Names are shown only to identify who fans are supporting. Money goes to the platform, not to anyone listed. Rankings reflect fan spending only, not any opinion of talent. 18+ only. <a href="/legal/terms">Terms</a> · <a href="/legal/privacy">Privacy</a> · <a href="/legal/refund">Refunds</a> · <a href="/legal/takedown">Takedown</a></p>
  </div>
 );
}