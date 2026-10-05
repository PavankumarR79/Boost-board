import {db} from '@/lib/db';
export const dynamic='force-dynamic';
export async function GET(){
 const {data}=await db.from('hero_bids').select('amount,created_at,heroes(name)').eq('status','live').order('created_at',{ascending:false}).limit(8);
 return Response.json((data||[]).map(b=>({name:b.heroes?.name||'a hero',amount:b.amount,at:b.created_at})));
}