import Razorpay from 'razorpay';import {db} from '@/lib/db';import {CATS,BLOCK,SEASON,keyOf} from '@/lib/util';
const hits=new Map();
export async function POST(req){
 const ip=(req.headers.get('x-forwarded-for')||'x').split(',')[0],now=Date.now();
 const h=(hits.get(ip)||[]).filter(t=>now-t<6e4);if(h.length>=5)return Response.json({error:'Too many attempts. Wait a minute.'},{status:429});
 hits.set(ip,[...h,now]);
 let b;try{b=await req.json()}catch{return Response.json({error:'Bad request'},{status:400})}
 const name=String(b.name||'').trim().slice(0,40),url=String(b.url||'').trim(),cat=b.cat,amount=Math.floor(+b.amount);
 if(name.length<2)return Response.json({error:'Enter a name (2+ characters).'},{status:400});
 let key;try{const u=new URL(url);if(u.protocol!=='https:')throw 0;key=keyOf(url)}catch{return Response.json({error:'Enter a valid https:// link.'},{status:400})}
 if(!CATS.includes(cat))return Response.json({error:'Invalid category.'},{status:400});
 if(BLOCK.test(name+' '+url))return Response.json({error:'This type of link is not allowed.'},{status:400});
 const {count}=await db.from('bids').select('id',{count:'exact',head:true}).eq('season',SEASON()).eq('key',key).eq('status','live');
 const min=count?10:49;
 if(!(amount>=min&&amount<=100000))return Response.json({error:`Amount must be ₹${min} to ₹1,00,000.`},{status:400});
 const rz=new Razorpay({key_id:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET});
 const o=await rz.orders.create({amount:amount*100,currency:'INR',receipt:'su_'+now});
 const {error}=await db.from('bids').insert({season:SEASON(),cat,name,url,key,amount,order_id:o.id});
 if(error)return Response.json({error:'Could not save bid.'},{status:500});
 return Response.json({orderId:o.id,amount:o.amount,keyId:process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID});
}
