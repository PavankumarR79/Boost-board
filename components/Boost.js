'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';
export default function Boost({heroes}){
 const r=useRouter();const [h,setH]=useState(heroes[0]?.id||''),[amt,setA]=useState(49),[adult,setAd]=useState(false),[terms,setT]=useState(false),[e,setE]=useState(''),[busy,setB]=useState(false);
 async function pay(){
  setE('');setB(true);
  try{
   const res=await fetch('/api/hero-order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({heroId:h,amount:+amt,adult,terms})});
   const d=await res.json();if(!res.ok)throw new Error(d.error||'Failed');
   await new Promise((ok,no)=>{if(window.Razorpay)return ok();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=ok;s.onerror=no;document.body.append(s)});
   new window.Razorpay({key:d.keyId,amount:d.amount,currency:'INR',order_id:d.orderId,name:'Fan boost',description:'Boost for '+d.hero,handler:()=>setTimeout(()=>r.refresh(),3500)}).open();
  }catch(x){setE(x.message)}setB(false)}
 return<div className="card"><b>Boost a hero this week</b>
  <select value={h} onChange={x=>setH(x.target.value)} aria-label="Hero">{heroes.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>
  <input type="number" min="10" max="5000" value={amt} onChange={x=>setA(x.target.value)} aria-label="Amount in rupees"/>
  <label className="m"><input type="checkbox" style={{width:'auto'}} checked={adult} onChange={x=>setAd(x.target.checked)}/> I am 18 or older</label><br/>
  <label className="m"><input type="checkbox" style={{width:'auto'}} checked={terms} onChange={x=>setT(x.target.checked)}/> I accept the <a href="/legal/terms">Terms</a>, <a href="/legal/refund">no-refund policy</a> and understand this is an unofficial fan poll, not paid to any actor.</label>
  <p className="err">{e}</p><button className="go" disabled={busy||!h} onClick={pay}>{busy?'Please wait…':'Pay ₹'+amt+' (UPI / cards)'}</button></div>}
