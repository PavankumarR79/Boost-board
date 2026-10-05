import {db} from '@/lib/db';import {isAdmin} from '@/lib/auth';import {revalidatePath} from 'next/cache';import {LANGS,TIERS,SEASON} from '@/lib/util';
export const dynamic='force-dynamic';
async function save(fd){'use server';if(!(await isAdmin()))return;
 const season=Math.floor(+fd.get('season')),lang=fd.get('lang'),tier=fd.get('tier');
 if(!LANGS.includes(lang)||!TIERS.includes(tier)||!(season>=SEASON()))return;
 const ids=fd.getAll('hero').map(Number).filter(Boolean);
 if(ids.length>4)return;
 const {data:all}=await db.from('heroes').select('id,active').eq('lang',lang).eq('tier',tier);
 const pool=(all||[]).map(h=>h.id),okSet=new Set((all||[]).filter(h=>h.active).map(h=>h.id));
 if(pool.length)await db.from('weekly_lineup').delete().eq('season',season).in('hero_id',pool);
 const rows=ids.filter(i=>okSet.has(i)).map(hero_id=>({season,hero_id}));
 if(rows.length)await db.from('weekly_lineup').insert(rows);
 revalidatePath('/admin/lineup');revalidatePath('/heroes')}
export default async function L({searchParams}){
 if(!(await isAdmin()))return<div className="w"><h1>Not authorised</h1></div>;
 const sp=await searchParams,next=sp.w==='next',season=SEASON()+(next?1:0);
 const {data:hs}=await db.from('heroes').select('id,name,lang,tier').eq('active',true).order('name');
 const {data:lu}=await db.from('weekly_lineup').select('hero_id').eq('season',season);
 const on=new Set((lu||[]).map(x=>x.hero_id));
 return<div className="w"><h1>Lineup</h1>
  <div className="tabs"><a href="/admin/lineup" className={next?'':'on'}>This week</a><a href="/admin/lineup?w=next" className={next?'on':''}>Next week</a></div>
  <p className="m">Pick up to 4 heroes for each language and tier. Saving replaces that box's picks.</p>
  {LANGS.flatMap(lang=>TIERS.map(tier=>{const items=(hs||[]).filter(h=>h.lang===lang&&h.tier===tier);return(
   <form key={lang+tier} action={save} className="card">
    <b>{lang} · {tier}</b> <span className="m">({items.filter(h=>on.has(h.id)).length}/4 picked)</span>
    <input type="hidden" name="season" value={season}/><input type="hidden" name="lang" value={lang}/><input type="hidden" name="tier" value={tier}/>
    {items.length?items.map(h=><label key={h.id}><input type="checkbox" name="hero" value={h.id} defaultChecked={on.has(h.id)} style={{width:'auto'}}/> {h.name}</label>):<p className="m">No heroes added yet.</p>}
    {items.length>0&&<button className="go">Save</button>}
   </form>)}))}
 </div>}