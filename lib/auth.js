import {headers} from 'next/headers';import crypto from 'crypto';
const eq=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&crypto.timingSafeEqual(x,y)};
// Second, independent admin check inside the page and the server action (does not rely on the proxy alone).
export async function isAdmin(){
 const h=(await headers()).get('authorization')||'';
 if(!process.env.ADMIN_PASS||process.env.ADMIN_PASS.length<16||!h.startsWith('Basic '))return false;
 const [u,...p]=Buffer.from(h.slice(6),'base64').toString().split(':');
 return eq(u,process.env.ADMIN_USER||'')&&eq(p.join(':'),process.env.ADMIN_PASS);
}
