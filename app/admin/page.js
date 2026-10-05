import {db} from '@/lib/db';import {revalidatePath} from 'next/cache';import {isAdmin} from '@/lib/auth';
export const dynamic='force-dynamic';
async function setStatus(fd){'use server';
 if(!(await isAdmin()))return;
 const s=fd.get('s');if(!['live','hidden'].includes(s))return;
 await db.from('bids').update({status:s}).eq('id',fd.get('id'));revalidatePath('/admin');revalidatePath('/')}
export default async function Admin(){
 if(!(await isAdmin()))return<div className="w"><h1>Not authorised</h1></div>;
 const {data}=await db.from('bids').select('*').order('created_at',{ascending:false}).limit(100);
 const live=(data||[]).filter(b=>b.status==='live').reduce((s,b)=>s+b.amount,0);
 return<div className="w"><h1>Admin</h1><p className="m">Live total shown: ₹{live}. Hiding a bid does not refund it: refund in the Razorpay dashboard.</p>
 {(data||[]).map(b=><div className="card" key={b.id}><b>{b.name}</b> · {b.cat} · ₹{b.amount} · {b.status}<br/><a href={b.url} rel="noopener nofollow">{b.url}</a>
  <div className="m">{b.payment_id||'unpaid'} · {new Date(b.created_at).toLocaleString('en-IN')}</div>
  <form action={setStatus}><input type="hidden" name="id" value={b.id}/>
   <button name="s" value={b.status==='live'?'hidden':'live'}>{b.status==='live'?'Hide':'Make live'}</button></form></div>)}</div>}
