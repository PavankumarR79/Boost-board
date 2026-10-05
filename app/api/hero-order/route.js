import Razorpay from 'razorpay';import {db} from '@/lib/db';import {SEASON} from '@/lib/util';import {guard} from '@/lib/guard';
export async function POST(req){
 let b;try{b=await req.json()}catch{return Response.json({error:'Bad request'},{status:400})}
 const amount=Math.floor(+b.amount),heroId=Math.floor(+b.heroId);
 if(b.consent!==true)return Response.json({error:'Please confirm you are 18+ and accept the terms.'},{status:400});
 if(!(amount>=10&&amount<=500))return Response.json({error:'Amount must be ₹10 to ₹500 per payment.'},{status:400});
 const g=await guard(req,amount);if(g.error)return Response.json({error:g.error},{status:g.status});
 const {data:hero}=await db.from('heroes').select('id,name').eq('id',heroId).eq('active',true).maybeSingle();
 if(!hero)return Response.json({error:'Unknown entry.'},{status:400});
 const {data:feat}=await db.from('weekly_lineup').select('hero_id').eq('season',SEASON()).eq('hero_id',hero.id).maybeSingle();
 if(!feat)return Response.json({error:'This hero is not featured this week.'},{status:400});
 const rz=new Razorpay({key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
 let o;try{o=await rz.orders.create({amount:amount*100,currency:'INR',receipt:'hb_'+Date.now()})}catch{return Response.json({error:'Payment service unavailable. Try again shortly.'},{status:502})}
 const {error}=await db.from('hero_bids').insert({season:SEASON(),hero_id:hero.id,amount,order_id:o.id,consent_at:new Date().toISOString(),ip_hash:g.ip});
 if(error)return Response.json({error:'Could not save.'},{status:500});
 return Response.json({orderId:o.id,amount:o.amount,keyId:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID});
}