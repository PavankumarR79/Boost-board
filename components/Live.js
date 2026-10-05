'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {createClient} from '@supabase/supabase-js';
const ago=t=>{const s=Math.max(0,(Date.now()-new Date(t))/1000);return s<60?'just now':s<3600?Math.floor(s/60)+'m ago':Math.floor(s/3600)+'h ago'};
export default function Live(){
 const r=useRouter();const [n,setN]=useState(0),[feed,setFeed]=useState([]),last=useRef(null);
 useEffect(()=>{
  let ch,sb;
  try{
   sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
   ch=sb.channel('online',{config:{presence:{key:crypto.randomUUID()}}});
   ch.on('presence',{event:'sync'},()=>setN(Object.keys(ch.presenceState()).length))
     .subscribe(async s=>{if(s==='SUBSCRIBED')await ch.track({on:1})});
  }catch(e){}
  return()=>{try{sb&&ch&&sb.removeChannel(ch)}catch(e){}};
 },[]);
 useEffect(()=>{
  let stop=false;
  async function pull(){
   try{
    const d=await (await fetch('/api/feed',{cache:'no-store'})).json();
    if(stop)return;setFeed(d);
    const key=d[0]?d[0].at+d[0].amount:null;
    if(last.current!==null&&key!==last.current)r.refresh();
    last.current=key;
   }catch(e){}
  }
  pull();const id=setInterval(pull,5000);
  return()=>{stop=true;clearInterval(id)};
 },[r]);
 return(
  <div>
   <div className="pills"><span className="pill">🟢 {Math.max(n,1)} online now</span></div>
   {feed.length>0&&<div className="card" aria-live="polite">
    <div className="m" style={{marginBottom:6}}>⚡ Live boosts</div>
    {feed.slice(0,3).map((f,i)=><div key={i} className="m">A fan boosted <b>{f.name}</b> by ₹{f.amount} · {ago(f.at)}</div>)}
   </div>}
  </div>);
}