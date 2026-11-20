import assert from 'node:assert/strict';import {newGame,playQuarter,defaultDecisions,netWorth,validateState} from '../src/engine.js';
const strategies=['baseline','high-price','aggressive-marketing','cost-cutting','invest-in-quality'];const results=[];let quartersAudited=0;
for(const strategy of strategies){let wins=0,cash=0;
for(let seed=1;seed<=500;seed++){let s=newGame(seed*1299721+strategies.indexOf(strategy));while(s.status==='active'){
 const d=defaultDecisions();if(strategy==='high-price'){d.price=119;d.marketing=0;d.research=0;}
 if(strategy==='aggressive-marketing'){d.price=49;d.marketing=32000;}
 if(strategy==='cost-cutting'){d.price=79;d.marketing=0;d.research=0;d.culture='cuts';}
 if(strategy==='invest-in-quality'){d.price=59;d.research=22000;d.culture='training';}
 const equity=netWorth(s),beforeCash=s.cash,beforeDebt=s.debt,beforePlant=s.plant;s=playQuarter(s,d);const r=s.lastReport,e=r.expenses;
 assert.ok(validateState(s));assert.equal(r.revenue,r.price*r.units);
 assert.equal(r.operatingIncome,r.revenue-e.cogs-e.payroll-e.overhead-e.marketing-e.research-e.people-e.incident-e.launchCost-e.depreciation);
 assert.equal(r.pretax,r.operatingIncome-e.interest);assert.equal(r.netIncome,r.pretax-e.tax);
 assert.equal(r.operationsCash,r.netIncome+e.depreciation);assert.equal(s.cash,beforeCash+r.operationsCash-e.capitalExpenditure+e.financing);
 assert.equal(s.debt,beforeDebt+e.financing);assert.equal(s.plant,beforePlant+e.capitalExpenditure-e.depreciation);
 assert.equal(netWorth(s)-equity,r.netIncome);assert.ok(r.units<=s.capacity);quartersAudited++;
 }wins+=Number(s.status==='won');cash+=s.cash;}
 results.push({strategy,games:500,winPercent:Math.round(wins/5),averageFinalCash:Math.round(cash/500)});
}
console.log(JSON.stringify({syntheticGames:2500,quartersAudited,results},null,2));
