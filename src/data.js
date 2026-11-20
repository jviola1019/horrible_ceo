export const PRODUCTS = [
  {id:'fork',name:'Bluetooth Fork',tag:'Dinner, now with pairing issues.',description:'A stainless-steel fork that requires an app update before soup.',icon:'🍴',unitCost:18,quality:46,novelty:76,practical:18,accent:'#e4bd67'},
  {id:'rock',name:'AI-Powered Rock',tag:'Finally, a rock that listens.',description:'A polished stone sold with a proprietary charging cable.',icon:'🪨',unitCost:21,quality:42,novelty:91,practical:6,accent:'#c7a4ff'},
  {id:'air',name:'Artisanal Air',tag:'Now available in breathable.',description:'Locally sourced air in an unnecessarily premium aluminum can.',icon:'🌬️',unitCost:12,quality:55,novelty:67,practical:9,accent:'#8dc5e8'},
  {id:'umbrella',name:'Subscription Umbrella',tag:'Rain is now a premium feature.',description:'Stops working during precipitation unless your subscription is active.',icon:'☂️',unitCost:26,quality:53,novelty:76,practical:45,accent:'#f28ca4'},
  {id:'toaster',name:'Influencer Toaster',tag:'Your breakfast has a following.',description:'Posts a blurry picture of your toast to twelve social networks.',icon:'🍞',unitCost:27,quality:59,novelty:73,practical:47,accent:'#f0ab72'},
  {id:'socks',name:'Firmware Socks',tag:'Software you can step into.',description:'Smart socks that update automatically and occasionally stop walking.',icon:'🧦',unitCost:17,quality:61,novelty:62,practical:51,accent:'#86dbc4'},
  {id:'pillow',name:'Subscription Pillow',tag:'Sleep is a service.',description:'A pillow that gently reminds you to upgrade at 3 a.m.',icon:'🛏️',unitCost:23,quality:57,novelty:72,practical:38,accent:'#a4b8ff'},
  {id:'water',name:'Blockchain Water',tag:'Proof of hydration.',description:'Every sip comes with a cryptographically verifiable receipt.',icon:'💧',unitCost:14,quality:49,novelty:81,practical:25,accent:'#80c9ea'}
];
export const SEGMENTS = [
  {id:'practical',name:'Actual Adults',population:14700,price:1.55,quality:1.45,novelty:.3,practical:1.8,color:'#69bda4',description:'They insist that products should solve a problem.'},
  {id:'trend',name:'Hype Enthusiasts',population:13300,price:.7,quality:.82,novelty:1.8,practical:.25,color:'#f0b368',description:'Will buy anything described as disruptive.'},
  {id:'gadget',name:'Gadget Goblins',population:10800,price:.95,quality:.95,novelty:2.0,practical:.18,color:'#a69ad9',description:'Love firmware updates more than their families.'}
];
export const INITIAL_RIVALS = [
  {id:'proper',name:'ProperGoods',ticker:'PRPR',icon:'◩',price:61,quality:78,novelty:29,practical:92,trust:73,reputation:70,marketing:13500,cash:580000,color:'#78b9a8',style:'Reliable products. Horrible branding.'},
  {id:'hype',name:'HypeSphere',ticker:'HYPE',icon:'✳',price:69,quality:39,novelty:94,practical:20,trust:41,reputation:62,marketing:22500,cash:460000,color:'#c89fff',style:'A press release that sells electronics.'},
  {id:'cheap',name:'Bargain Planet',ticker:'BRGN',icon:'▧',price:29,quality:34,novelty:29,practical:67,trust:52,reputation:39,marketing:6500,cash:310000,color:'#f6ae78',style:'Cheap enough to be technically legal.'}
];
export const EVENTS = [
  {id:'influencer',title:'A very confused influencer loved it',text:'The review simply said “I do not understand this, but I need two.”',demand:1.15,rep:6,trust:0,morale:2,cost:0,tone:'good'},
  {id:'refund',title:'The Great Refundening',text:'A customer discovered that forks work without Bluetooth. Returns spiked.',demand:.87,rep:-5,trust:-7,morale:-1,cost:10000,tone:'bad'},
  {id:'goat',title:'Pallets delivered to a goat sanctuary',text:'Nobody knows who wrote “attention: regional sales director” on the crates.',demand:.94,rep:0,trust:0,morale:3,cost:7500,tone:'bad'},
  {id:'award',title:'Product wins an extremely specific award',text:'“Best Use of an App Where an App Was Not Needed.”',demand:1.10,rep:5,trust:2,morale:3,cost:0,tone:'good'},
  {id:'audit',title:'Accountants found a department called Vibes',text:'Nobody remembers hiring its 11 consultants.',demand:1,rep:-2,trust:-1,morale:-3,cost:11000,tone:'bad'},
  {id:'rival',title:'Competitor accidentally emails its price list',text:'The leaked spreadsheet reveals a less ambitious profit margin.',demand:1.08,rep:2,trust:0,morale:0,cost:0,tone:'good'},
  {id:'viral',title:'Social media declares it essential',text:'The product is trending among people who cannot explain its purpose.',demand:1.22,rep:6,trust:-2,morale:4,cost:0,tone:'good'},
  {id:'charger',title:'The chargers only work upside down',text:'Engineering insists this is a premium design direction.',demand:.90,rep:-4,trust:-5,morale:-2,cost:6500,tone:'bad'},
  {id:'boring',title:'An uneventful quarter, allegedly',text:'The entire executive team is uncomfortable with this lack of chaos.',demand:1,rep:0,trust:0,morale:0,cost:0,tone:'neutral'},
  {id:'tax',title:'Local authority finds your 400-page tax memo',text:'Your accountant claims that “innovation depreciation” is not a recognized category.',demand:1,rep:-1,trust:0,morale:-2,cost:8500,tone:'bad'},
  {id:'morale',title:'Intern fixes a major defect',text:'The fix was to unplug the decorative cloud.',demand:1.06,rep:2,trust:4,morale:5,quality:4,cost:0,tone:'good'},
  {id:'lawsuit',title:'The marketing slogan backfires',text:'A skeptical customer argues that the product cannot legally “change the future.”',demand:.92,rep:-3,trust:-4,morale:-1,cost:14000,tone:'bad'},
  {id:'celebrity',title:'A celebrity is photographed holding it',text:'The celebrity’s publicist says it was merely evidence in a dispute.',demand:1.12,rep:4,trust:0,morale:1,cost:0,tone:'good'},
  {id:'warehouse',title:'The warehouse accidentally invents efficiency',text:'Someone labeled the shelves. Economists are baffled.',demand:1.04,rep:1,trust:2,morale:3,cost:0,tone:'good'}
];
export const CULTURES = {
  normal:{label:'Stay professional-ish',cost:0,morale:-2,quality:0,trust:0,rep:0,salarySavings:0,description:'Nothing changes. Somehow this is a strategy.'},
  perks:{label:'Free snacks & actual benefits',cost:9000,morale:13,quality:0,trust:1,rep:1,salarySavings:0,description:'Culture costs money, but people notice.'},
  training:{label:'Train the engineers',cost:14000,morale:3,quality:9,trust:2,rep:0,salarySavings:0,description:'Make the products less fundamentally wrong.'},
  cuts:{label:'Aggressive cost reductions',cost:0,morale:-16,quality:-6,trust:-4,rep:-3,salarySavings:16000,description:'The CFO calls it efficiency. Everyone else calls it Tuesday.'}
};
export const BOARD_QUOTES = [
 '“We do not need customers to understand the product. We need them to renew.”',
 '“Have we tried making the logo significantly larger?”',
 '“Revenue is vanity. Profit is sanity. Whatever this is, is neither.”',
 '“The board would like to replace several words with the word synergy.”',
 '“Is there a way to be profitable without selling anything?”',
 '“Our competitive advantage is that nobody understands us.”'
];
export const ACHIEVEMENTS = [
 {id:'firstprofit',title:'Accidental Profit',description:'Report a profitable quarter.'},
 {id:'million',title:'A Terrible Million',description:'Generate $1,000,000 in cumulative revenue.'},
 {id:'culture',title:'Employee of the Month',description:'Reach 85 employee morale.'},
 {id:'quality',title:'Works as Advertised?',description:'Reach 85 product quality.'},
 {id:'cash',title:'Cash Hoarder',description:'Hold $500,000 in cash.'},
 {id:'survivor',title:'Still Legally Operating',description:'Finish all twelve quarters.'}
];
