export const CATS=['Startups','Creators','D2C brands','Local business','Freelancers'];
export const BLOCK=/\b(bet|betting|casino|rummy|satta|matka|loan|ludo|teen\s?patti|double\s?your|adult|porn)\b/i;
const DAY=864e5,IST=19800000;
export const SEASON=(t=Date.now())=>Math.floor((Math.floor((t+IST)/DAY)+3)/7);
export const endMs=()=>((SEASON()+1)*7-3)*DAY-IST;
export const keyOf=u=>{const x=new URL(u);return x.hostname.replace(/^www\./,'')+x.pathname.replace(/\/$/,'')};
export const LANGS=['Telugu','Kannada','Hindi','Tamil'];
export const TIERS=['Rising','Established','Legends'];