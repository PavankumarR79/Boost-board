import {NextResponse} from 'next/server';
export const config={matcher:['/admin/:path*']};
const same=(a,b)=>{if(a.length!==b.length)return false;let r=0;for(let i=0;i<a.length;i++)r|=a.charCodeAt(i)^b.charCodeAt(i);return r===0};
export function proxy(req){
 const h=req.headers.get('authorization')||'';
 if(process.env.ADMIN_PASS&&process.env.ADMIN_PASS.length>=16&&h.startsWith('Basic ')){
  const [u,...p]=atob(h.slice(6)).split(':');
  if(same(u,process.env.ADMIN_USER||'')&&same(p.join(':'),process.env.ADMIN_PASS))return NextResponse.next();
 }
 return new NextResponse('Auth required',{status:401,headers:{'WWW-Authenticate':'Basic realm="admin"'}});
}
