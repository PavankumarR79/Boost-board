import crypto from 'crypto';import {db} from '@/lib/db';
export function ipHash(req){
 const ip=req.headers.get('x-real-ip')||(req.headers.get('x-forwarded-for')||'').split(',')[0].trim()||'unknown';
 return crypto.createHash('sha256').update(ip+(process.env.IP_SALT||'')).digest('hex').slice(0,32);
}
export async function guard(req,amount){
 const ip=ipHash(req),ago=m=>new Date(Date.now()-m*60000).toISOString();
 const {count}=await db.from('rate_hits').select('id',{count:'exact',head:true}).eq('ip',ip).gte('at',ago(1));
 if((count||0)>=5)return {error:'Too many attempts. Wait a minute.',status:429};
 await db.from('rate_hits').insert({ip});
 const day=ago(1440);
 const [a,b]=await Promise.all([
  db.from('hero_bids').select('amount').eq('ip_hash',ip).gte('created_at',day).eq('status','live'),
  db.from('bids').select('amount').eq('ip_hash',ip).gte('created_at',day).eq('status','live')]);
 const spent=[...(a.data||[]),...(b.data||[])].reduce((s,x)=>s+x.amount,0);
 if(spent+amount>2000)return {error:'Daily limit reached (₹2,000). Try again tomorrow.',status:429};
 return {ip};
}