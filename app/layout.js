export const metadata={title:process.env.SITE_NAME||'Boost Board',description:"India's fan boost board"};
const css=`:root{--m:#e0d7ff;--card:rgba(255,255,255,.13);--l:rgba(255,255,255,.3)}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;color:#fff;font:700 16px/1.5 Nunito,system-ui,sans-serif;background:linear-gradient(160deg,#3a1c8f,#1b1464) fixed}
body:before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background:radial-gradient(circle at 12% 8%,rgba(255,79,163,.55),transparent 38%),radial-gradient(circle at 90% 18%,rgba(0,210,255,.45),transparent 36%),radial-gradient(circle at 50% 105%,rgba(255,210,63,.35),transparent 45%)}
.w{position:relative;z-index:1;max-width:720px;margin:0 auto;padding:22px 16px 70px}
h1{font:800 clamp(40px,11vw,68px)/1.05 'Baloo 2',Nunito,sans-serif;margin:6px 0 4px;text-shadow:0 4px 0 rgba(0,0,0,.25)}
h3{font-family:'Baloo 2',sans-serif;font-size:24px}
.m{color:var(--m);font-size:14px;font-weight:600}
a{color:inherit}
.pills{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}
.pill{background:var(--card);border:2px solid var(--l);border-radius:99px;padding:5px 14px;font-size:14px}
.tabs{display:flex;gap:8px;overflow-x:auto;padding:6px 2px 10px;margin:6px 0}
.tabs a{flex:none;text-decoration:none;background:var(--card);border:2px solid var(--l);padding:8px 18px;border-radius:99px;font-weight:800;transition:transform .15s}
.tabs a:hover{transform:translateY(-2px)}
.tabs a.on{background:linear-gradient(135deg,#ff4fa3,#ff8a3c);border-color:#fff;box-shadow:0 5px 0 rgba(0,0,0,.25)}
.row{display:grid;grid-template-columns:52px 1fr auto;gap:6px 12px;align-items:center;padding:14px 16px;margin-bottom:12px;background:var(--card);backdrop-filter:blur(8px);border:2px solid var(--l);border-radius:26px;transition:transform .15s}
.row:hover{transform:translateY(-3px) scale(1.01)}
.row.f{background:linear-gradient(135deg,#ffe066,#ff9a3c);color:#3a2300;border-color:#fff;box-shadow:0 12px 30px rgba(255,190,50,.45);animation:fl 3s ease-in-out infinite}
.row.f .card{background:rgba(58,35,0,.88);color:#fff}
.rk{font:800 28px 'Baloo 2',sans-serif;text-align:center}
.nm{font:800 20px 'Baloo 2',Nunito,sans-serif;line-height:1.2}
.tot{font:800 20px 'Baloo 2',sans-serif}
.bar{height:10px;border-radius:99px;background:rgba(255,255,255,.2);margin-top:6px;overflow:hidden}
.bar i{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#00e5ff,#7c4dff)}
.f .bar{background:rgba(0,0,0,.15)}.f .bar i{background:linear-gradient(90deg,#ff4fa3,#7c4dff)}
button,input,select{font:inherit}
input,select{width:100%;padding:12px 14px;margin:5px 0;border-radius:16px;border:2px solid var(--l);background:rgba(255,255,255,.16);color:#fff}
input::placeholder{color:#d9cffc}option{color:#222}
button{width:100%;padding:12px;margin:5px 0;border-radius:99px;border:2px solid var(--l);background:rgba(255,255,255,.16);color:#fff;font-weight:800;cursor:pointer}
button.go{border:0;background:linear-gradient(135deg,#ff4fa3,#ff8a3c);box-shadow:0 6px 0 rgba(0,0,0,.28);font-size:17px;transition:transform .1s}
button.go:hover{transform:translateY(-2px)}
button.go:active{transform:translateY(4px);box-shadow:0 2px 0 rgba(0,0,0,.28)}
button:disabled{opacity:.5;cursor:not-allowed}
.card{background:var(--card);backdrop-filter:blur(8px);border:2px solid var(--l);border-radius:22px;padding:16px;margin:12px 0}
.err{color:#ffb3c0}label{display:block;font-size:14px}
.bubs{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
.bubs i{position:absolute;bottom:-60px;border-radius:50%;background:rgba(255,255,255,.14);border:2px solid rgba(255,255,255,.25);animation:rise 14s linear infinite}
@keyframes rise{to{transform:translateY(-115vh)}}
@keyframes fl{50%{transform:translateY(-4px)}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}
.tabs a.on{background:linear-gradient(135deg,#ffd23f,#ff9a3c);color:#2a1200;border-color:#fff}
button.go{background:linear-gradient(135deg,#ffd23f,#ff9a3c);color:#2a1200}
.row.f{animation:none}
.row.f .m,.row.f .nm,.row.f .tot,.row.f .rk{color:#2a1200}
a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible{outline:3px solid #fff;outline-offset:2px}
.tabs a,button{min-height:44px}
.row{padding:16px}
h3{margin:26px 0 10px;font-size:20px}`;
export default function L({children}){return(
<html lang="en"><head>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@600;800&display=swap" rel="stylesheet"/>
</head><body><style dangerouslySetInnerHTML={{__html:css}}/>
<div className="bubs" aria-hidden="true">{[0,1,2,3,4,5,6,7].map(i=><i key={i} style={{left:(i*13+5)+'%',animationDelay:(i*1.7)+'s',width:20+(i%3)*18,height:20+(i%3)*18}}/>)}</div>
{children}</body></html>)}