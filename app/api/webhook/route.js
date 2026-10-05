import crypto from 'crypto';import {db} from '@/lib/db';
export async function POST(req){
 const raw=await req.text(),sig=req.headers.get('x-razorpay-signature')||'';
 const exp=crypto.createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET||'').update(raw).digest('hex');
 const a=Buffer.from(sig),b=Buffer.from(exp);
 if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return new Response('bad signature',{status:401});
 let ev;try{ev=JSON.parse(raw)}catch{return new Response('bad json',{status:400})}
 if(ev.event!=='payment.captured'&&ev.event!=='order.paid')return new Response('ignored');
 const p=ev.payload?.payment?.entity;
 if(!p?.order_id||p.currency!=='INR'||p.status!=='captured')return new Response('ignored');
 for(const t of ['hero_bids','bids']){
  const {data:row,error}=await db.from(t).select('id,amount,status').eq('order_id',p.order_id).maybeSingle();
  if(error)return new Response('db error',{status:500});
  if(!row)continue;
  if(row.status==='pending'){
   if(row.amount*100!==p.amount){console.error('AMOUNT MISMATCH',p.order_id);break}
   const {error:e2}=await db.from(t).update({status:'live',payment_id:p.id}).eq('id',row.id).eq('status','pending');
   if(e2)return new Response('db error',{status:500});
  }
  break;
 }
 return new Response('ok');
}