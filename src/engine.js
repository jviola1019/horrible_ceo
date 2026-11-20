import { PRODUCTS, SEGMENTS, INITIAL_RIVALS, EVENTS, CULTURES } from './data.js';
export const GAME_VERSION = 1;
export const MAX_QUARTERS = 12;
export const fmtMoney = n => (n < 0 ? '−' : '') + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
export const clamp = (n, a=0, b=100) => Math.max(a,Math.min(b,n));
export const newGame = (seed=Date.now()) => ({
  version:GAME_VERSION,seed: (seed>>>0)||1, rng: (seed>>>0)||1,quarter:1,maxQuarters:MAX_QUARTERS,
  cash:180000,debt:40000,plant:120000,capacity:4200,staff:12,morale:63,trust:49,reputation:45,
  productId:'fork',quality:46,novelty:76,history:[],feed:[],rivals:structuredClone(INITIAL_RIVALS),
  achievements:[],status:'active',endReason:'',lastReport:null
});
export const defaultDecisions = () => ({price:49,marketing:8000,research:10000,culture:'normal',factory:false,launch:'',finance:'none'});
export function productById(id){return PRODUCTS.find(p=>p.id===id)||PRODUCTS[0];}
function nextRng(x) { let y=x|0; y^=y<<13;y^=y>>>17;y^=y<<5;return y>>>0||1; }
function randomFrom(seed){const rng=nextRng(seed);return {rng,value:rng/4294967296};}
function score(firm,seg){return -.8 + firm.quality*seg.quality*.026 + firm.novelty*seg.novelty*.022 + firm.practical*seg.practical*.021 + firm.trust*.013 + firm.reputation*.010 - firm.price*seg.price*.034 + Math.log1p(firm.marketing/6000)*.30;}
export function marketForecast(state,decision,marketEvent=1){
  const p=productById(decision.launch||state.productId);
  const quality=decision.launch ? p.quality : state.quality;
  const novelty=decision.launch ? p.novelty : state.novelty;
  const culture=CULTURES[decision.culture]||CULTURES.normal;
  const firm={price:decision.price,quality:clamp(quality+culture.quality+decision.research/4500+(state.morale-60)*.12),novelty,practical:p.practical,trust:state.trust,reputation:state.reputation,marketing:decision.marketing};
  const rivals=state.rivals.map(r=>({...r}));
  let demand=0, addressable=0;const segmentResults=[];
  for(const seg of SEGMENTS){
    const competitors=[firm,...rivals];
    const utilities=competitors.map(c=>score(c,seg));
    const weights=utilities.map(x=>Math.exp(Math.max(-20,Math.min(20,x))));
    const outside=Math.exp(1.8);
    const total=weights.reduce((a,b)=>a+b, outside);
    const shares=weights.map(w=>w/total);
    const baseTraffic=seg.population *(.50 + .025*Math.sin(state.quarter*.9)) * marketEvent;
    const units=Math.round(baseTraffic*shares[0]);
    segmentResults.push({id:seg.id,name:seg.name,volume:Math.round(baseTraffic),units,share:shares[0],rivalShares:shares.slice(1)});
    demand+=units;addressable+=Math.round(baseTraffic);
  }
  return {demand,units:Math.min(state.capacity+(decision.factory?2300:0),demand),capacity:state.capacity+(decision.factory?2300:0),segmentResults,addressable,firm};
}
export function evaluate(state,decision,event=null){
  if(state.status!=='active')throw new Error('The game is already over.');
  validateDecision(decision);
  const c=CULTURES[decision.culture];
  const p=productById(decision.launch||state.productId);
  const upgrade=decision.factory?48000:0;
  const productLaunch=decision.launch&&decision.launch!==state.productId?31000:0;
  const financing=decision.finance==='borrow'?50000:decision.finance==='repay'?-25000:0;
  const financeDelta=decision.finance==='repay'?-Math.min(25000,state.debt):financing;
  if(decision.finance==='borrow'&&state.debt+50000>300000)throw new Error('The bank refuses additional borrowing above $300,000.');
  const eventFactor=event?.demand??1;
  const m=marketForecast(state,decision,eventFactor);
  const unitCost = p.unitCost + Math.round(Math.max(0,m.firm.quality-45)*.055);
  const revenue=Math.round(m.units*decision.price);
  const cogs=m.units*unitCost;
  const payroll=state.staff*3400-c.salarySavings;
  const overhead=19000+Math.max(0, state.capacity-4200)*1.0;
  const marketing=decision.marketing;
  const research=decision.research;
  const people=c.cost;
  const incident=event?.cost||0;
  const depreciation=Math.round((state.plant+upgrade)*.025);
  const interest=Math.round((state.debt+Math.max(0,financeDelta))*.09/4);
  const operatingIncome=revenue-cogs-payroll-overhead-marketing-research-people-incident-productLaunch-depreciation;
  const pretax=operatingIncome-interest;
  const tax=Math.max(0,Math.round(pretax*.22));
  const netIncome=pretax-tax;
  const operationsCash=netIncome+depreciation;
  const cash=state.cash + operationsCash -upgrade+financeDelta;
  const debt=state.debt+financeDelta;
  const plant=Math.max(0,state.plant+upgrade-depreciation);
  const morale=clamp(state.morale+c.morale+(event?.morale||0)+(netIncome>0?1:-2));
  const trust=clamp(state.trust+c.trust+(event?.trust||0)+(m.firm.quality>70?1:0) - (decision.price>=99?4:decision.price>=79?2:0));
  const reputation=clamp(state.reputation+c.rep+(event?.rep||0)+(netIncome>0?1:0)+(decision.marketing>=32000?2:0));
  let quality=Math.round(clamp(m.firm.quality + (event?.quality||0) - (decision.research===0?4:1)));
  let novelty=clamp(m.firm.novelty-3+(decision.marketing>=18000?1:0));
  const next={...state,cash,debt,plant,capacity:m.capacity,morale,trust,reputation,quality,novelty,productId:p.id};
  const netWorth=cash+plant-debt;
  const expenses={cogs,payroll,overhead,marketing,research,people,incident,depreciation,interest,tax,capitalExpenditure:upgrade,launchCost:productLaunch,financing:financeDelta};
  const record={quarter:state.quarter,product:p.name,price:decision.price,units:m.units,demand:m.demand,revenue,expenses,operatingIncome,pretax,netIncome,operationsCash,cash,debt,plant,netWorth,margin:revenue?netIncome/revenue:0,market:m.segmentResults,morale,trust,reputation,quality,novelty,event:event||null,decisions:{...decision}};
  return {next,record,market:m};
}
export function validateDecision(d){
  if(!d||!Number.isInteger(d.price)||d.price<29||d.price>119||d.price%5!==4)throw new Error('Price must be $29–$119 in $5 increments.');
  if(![0,8000,18000,32000].includes(d.marketing))throw new Error('Invalid marketing allocation.');
  if(![0,10000,22000,38000].includes(d.research))throw new Error('Invalid R&D allocation.');
  if(!CULTURES[d.culture])throw new Error('Invalid people policy.');
  if(typeof d.factory!=='boolean')throw new Error('Invalid factory decision.');
  if(d.launch&& !PRODUCTS.some(p=>p.id===d.launch))throw new Error('Product not in catalog.');
  if(!['none','borrow','repay'].includes(d.finance))throw new Error('Invalid financing choice.');
}
export function forecast(state,decision){return evaluate(state,decision,null);}
function advanceRivals(rivals,seed,quarter,playerDecision){
 let rng=seed;const stories=[];const updated=rivals.map((r,i)=>{let x=randomFrom(rng);rng=x.rng;const move=Math.floor(x.value*5);const p={...r};
  if(move===0){p.price=clamp(p.price-5,25,125);stories.push(playerDecision.price<p.price?`${p.name} cut prices in response to your pricing.`:`${p.name} cut prices by $5.`);}
  if(move===1){p.price=clamp(p.price+5,25,125);stories.push(`${p.name} raised prices by $5.`);}
  if(move===2){p.quality=clamp(p.quality+5);stories.push(`${p.name} improved product quality.`);}
  if(move===3){p.marketing+=playerDecision.marketing>p.marketing?10000:6000;stories.push(playerDecision.marketing>r.marketing?`${p.name} responded to your advertising campaign.`:`${p.name} launched a major ad campaign.`);}
  if(move===4){p.novelty=clamp(p.novelty+4);stories.push(`${p.name} unveiled a questionable innovation.`);}
  p.marketing=Math.max(4000,Math.round(p.marketing*.94));p.novelty=clamp(p.novelty-1);
  return p;
 });return {rivals:updated,rng,stories};
}
export function playQuarter(state,decision){
 if(state.status!=='active')throw new Error('Game finished. Start a new company.');
 const a=randomFrom(state.rng);
 const event=EVENTS[Math.floor(a.value*EVENTS.length)];
 const {next,record}=evaluate(state,decision,event);
 const b=advanceRivals(next.rivals,a.rng,state.quarter,decision);
 next.rivals=b.rivals;next.rng=b.rng;next.history=[...state.history,record];
 next.lastReport={...record,rivalNews:b.stories};
 next.feed=[{quarter:state.quarter,title:event.title,text:event.text,tone:event.tone},...b.stories.map(t=>({quarter:state.quarter,title:'Competitor alert',text:t,tone:'neutral'})),...state.feed].slice(0,38);
 next.quarter=state.quarter+1;
 const achievements=new Set(state.achievements);
 if(record.netIncome>0)achievements.add('firstprofit');
 if(next.history.reduce((s,h)=>s+h.revenue,0)>=1000000)achievements.add('million');
 if(next.morale>=85)achievements.add('culture');
 if(next.quality>=85)achievements.add('quality');
 if(next.cash>=500000)achievements.add('cash');
 if(next.quarter>MAX_QUARTERS)achievements.add('survivor');
 next.achievements=[...achievements];
 if(next.cash<0){next.status='failed';next.endReason='INSOLVENT: You ran out of cash. The office plants have been repossessed.';}
 else if(next.trust<8||next.reputation<8){next.status='failed';next.endReason='BOARD REVOLT: Shareholders would like a CEO with fewer lawsuits.';}
 else if(next.quarter>MAX_QUARTERS){next.status='won';next.endReason='THREE YEARS COMPLETED: Against all available evidence, the company survived.';}
 return next;
}
export function netWorth(state){return state.cash+state.plant-state.debt;}
export function validateState(state){
 const goodNum=(v,min=-1e10,max=1e10)=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
 const bounded=(v)=>Number.isInteger(v)&&goodNum(v,0,100);
 const brief=(v,max=2000)=>typeof v==='string'&&v.length<=max;
 if(!state||typeof state!=='object'||state.version!==GAME_VERSION||!Number.isInteger(state.quarter)||state.quarter<1||state.quarter>MAX_QUARTERS+1)return false;
 if(!Number.isInteger(state.seed)||state.seed<1||!Number.isInteger(state.rng)||state.rng<1)return false;
 if(!goodNum(state.cash)||!goodNum(state.debt,0,300000)||!goodNum(state.plant,0)||!goodNum(state.capacity,4200,50000)||!goodNum(state.staff,1,40))return false;
 if(![state.morale,state.trust,state.reputation,state.quality,state.novelty].every(bounded))return false;
 if(!PRODUCTS.some(p=>p.id===state.productId)||!['active','failed','won'].includes(state.status)||!brief(state.endReason))return false;
 if(!Array.isArray(state.history)||state.history.length>MAX_QUARTERS||state.history.length!==state.quarter-1||!Array.isArray(state.rivals)||state.rivals.length!==3||!Array.isArray(state.feed)||state.feed.length>40||!Array.isArray(state.achievements)||state.achievements.length>6)return false;
 if(state.status==='active'&&state.quarter>MAX_QUARTERS)return false;
 if(!state.rivals.every((r,i)=>{const orig=INITIAL_RIVALS[i];return r&&r.id===orig.id&&r.name===orig.name&&r.ticker===orig.ticker&&r.icon===orig.icon&&r.color===orig.color&&r.style===orig.style&&goodNum(r.price,25,125)&&[r.quality,r.novelty,r.practical,r.trust,r.reputation].every(bounded)&&goodNum(r.marketing,0,500000)&&goodNum(r.cash,0,1e9);}))return false;
 if(!state.achievements.every(a=>['firstprofit','million','culture','quality','cash','survivor'].includes(a)))return false;
 if(!state.feed.every(e=>e&&Number.isInteger(e.quarter)&&e.quarter>=1&&e.quarter<=MAX_QUARTERS&&brief(e.title)&&brief(e.text)&&['neutral','good','bad'].includes(e.tone)))return false;
 const expenses=['cogs','payroll','overhead','marketing','research','people','incident','depreciation','interest','tax','capitalExpenditure','launchCost','financing'];
 const validReport=h=>h&&Number.isInteger(h.quarter)&&h.quarter>=1&&h.quarter<=MAX_QUARTERS&&brief(h.product,150)&&Number.isInteger(h.price)&&goodNum(h.units,0,1e6)&&goodNum(h.demand,0,1e6)&&['revenue','operatingIncome','pretax','netIncome','operationsCash','cash','debt','plant','netWorth','margin','morale','trust','reputation','quality','novelty'].every(key=>goodNum(h[key]))&&h.expenses&&expenses.every(key=>goodNum(h.expenses[key]))&&Array.isArray(h.market)&&h.market.length===3&&h.market.every(m=>m&&brief(m.name,100)&&goodNum(m.volume,0,1e7)&&goodNum(m.units,0,1e7)&&goodNum(m.share,0,1)&&Array.isArray(m.rivalShares)&&m.rivalShares.length===3&&m.rivalShares.every(x=>goodNum(x,0,1)))&&(!h.event||(brief(h.event.title)&&brief(h.event.text)))&&(!h.rivalNews||(Array.isArray(h.rivalNews)&&h.rivalNews.length<=3&&h.rivalNews.every(x=>brief(x,300))));
 if(!state.history.every(validReport))return false;
 if(state.lastReport&&!validReport(state.lastReport))return false;
 return true;
}
