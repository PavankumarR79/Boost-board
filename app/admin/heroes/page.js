import {db} from '@/lib/db';import {isAdmin} from '@/lib/auth';import {revalidatePath} from 'next/cache';import {LANGS,TIERS} from '@/lib/util';
export const dynamic='force-dynamic';
async function add(fd){'use server';if(!(await isAdmin()))return;
 const name=String(fd.get('name')||'').trim().slice(0,60),tier=fd.get('tier'),lang=fd.get('lang');
 if(name.length<2||!TIERS.includes(tier)||!LANGS.includes(lang))return;
 const {error}=await db.from('heroes').insert({name,tier,lang});if(error)console.error('ADD HERO ERROR:',error.message);
 revalidatePath('/admin/heroes')}
async function toggle(fd){'use server';if(!(await isAdmin()))return;
 await db.from('heroes').update({active:fd.get('a')==='1'}).eq('id',fd.get('id'));revalidatePath('/admin/heroes');revalidatePath('/heroes')}
export default async function A(){
 if(!(await isAdmin()))return<div className="w"><h1>Not authorised</h1></div>;
 const {data}=await db.from('heroes').select('*').order('lang').order('tier').order('name');
 return<div className="w"><h1>Heroes</h1><p className="m"><a href="/admin/lineup">Set weekly lineup →</a></p>
 <form action={add} className="card"><input name="name" placeholder="Name (text only)" required/>
  <select name="lang">{LANGS.map(l=><option key={l}>{l}</option>)}</select>
  <select name="tier">{TIERS.map(t=><option key={t}>{t}</option>)}</select><button className="go">Add</button></form>
 {(data||[]).map(h=><div key={h.id} className="card"><b>{h.name}</b> · {h.lang} · {h.tier} · {h.active?'visible':'REMOVED'}
  <form action={toggle}><input type="hidden" name="id" value={h.id}/><button name="a" value={h.active?'0':'1'}>{h.active?'Remove now (takedown)':'Restore'}</button></form></div>)}</div>}