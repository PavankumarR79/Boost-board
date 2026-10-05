'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';
export default function HeroBid({id,name,gap}){
 const r=useRouter();const [o,setO]=useState(false),[a,setA]=useState(50),[c,setC]=useState(false),[e,setE]=useState('');
 const quick=gap&&gap>=10&&gap<=500;
 const chips=[...new Set([10,50,100,500,...(quick?[gap]:[])])].sort((x,y)=>x-y);
 async function pay(){setE('');try{
  const res=await fetch('/api/hero-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({heroId:id,amount:a,consent:c})});
  const d=await res.json();if(!res.ok)throw new Error(d.error||'Failed');
  await new Promise((ok,no)=>{if(window.Razorpay)return ok();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=ok;s.onerror=no;document.body.append(s)});
  new window.Razorpay({key:d.keyId,amount:d.amount,currency:'INR',order_id:d.orderId,name:'Fan board',description:'Boost '+name,handler:()=>{setO(false);setTimeout(()=>r.refresh(),3500)}}).open();
 }catch(x){setE(x.message)}}
 if(!o)return(
  <div style={{gridColumn:'1/-1',display:'flex',gap:8}}>
   <button className="go" onClick={()=>{setA(50);setO(true)}}>Boost</button>
   {quick&&<button className="go" onClick={()=>{setA(gap);setO(true)}}>Take #1 · ₹{gap}</button>}
  </div>);
 return(
  <div style={{gridColumn:'1/-1'}}><div className="card">
   <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{chips.map(v=><button key={v} style={{width:'auto',padding:'8px 16px',...(a===v?{background:'#fff',color:'#3a1c8f'}:{})}} onClick={()=>setA(v)}>₹{v}</button>)}</div>
   <label><input type="checkbox" checked={c} onChange={x=>setC(x.target.checked)} style={{width:'auto'}}/> I am 18+, I accept the <a href="/legal/terms">Terms</a>, and I understand this is an unofficial fan board: my money goes to the platform, not to {name}.</label>
   <p className="err">{e}</p>
   <button className="go" disabled={!c} onClick={pay}>Pay ₹{a}</button>
   <button onClick={()=>setO(false)}>Cancel</button>
  </div></div>);
}