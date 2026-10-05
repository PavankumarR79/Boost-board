'use client';
import {useState} from 'react';import {useRouter} from 'next/navigation';
export default function Bid({cats,cat,leader}){
 const r=useRouter();const [o,setO]=useState(false),[e,setE]=useState(''),[busy,setB]=useState(false);
 const [f,setF]=useState({name:'',url:'https://',amount:49});
 const set=k=>v=>setF({...f,[k]:v.target.value});
 async function pay(){
  setE('');setB(true);
  try{
   const res=await fetch('/api/order',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...f,cat,amount:+f.amount})});
   const d=await res.json();if(!res.ok)throw new Error(d.error||'Failed');
   await new Promise((ok,no)=>{if(window.Razorpay)return ok();const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=ok;s.onerror=no;document.body.append(s)});
   new window.Razorpay({key:d.keyId,amount:d.amount,currency:'INR',order_id:d.orderId,name:'Boost Board',description:f.name,
    handler:()=>{setO(false);setTimeout(()=>r.refresh(),3500)}}).open();
  }catch(x){setE(x.message)}setB(false)}
 return<div>{!o?<button className="go" onClick={()=>{setO(true);setF({...f,amount:leader?leader+1:49})}}>Bid to take #1 in {cat}{leader?' (₹'+(leader+1)+')':''}</button>
 :<div className="card"><input placeholder="Brand or profile name" maxLength={40} value={f.name} onChange={set('name')}/>
  <input placeholder="https://your-link" value={f.url} onChange={set('url')}/>
  <input type="number" min="10" value={f.amount} onChange={set('amount')} aria-label="Amount in rupees"/>
  <p className="err">{e}</p><button className="go" disabled={busy} onClick={pay}>{busy?'Please wait…':'Pay ₹'+f.amount+' (UPI / cards)'}</button>
  <button onClick={()=>setO(false)}>Cancel</button></div>}</div>}
