// Fictional independent 5-on-5 observations. Not derived from the editable abilities.
const raw:Record<string,{minutes:number;goals:number;assists:number;shots:number;ixg:number;cf:number;ca:number;ff:number;fa:number;xgf:number;xga:number;off:number}>={
 roy:{minutes:252,goals:2,assists:3,shots:38,ixg:4.7,cf:204,ca:228,ff:150,fa:172,xgf:10.8,xga:12.9,off:49.8},
 gagnon:{minutes:336,goals:4,assists:8,shots:44,ixg:4.9,cf:310,ca:289,ff:231,fa:217,xgf:16.2,xga:14.5,off:49.6},
 sokolov:{minutes:354,goals:11,assists:10,shots:77,ixg:8.2,cf:358,ca:290,ff:279,fa:220,xgf:20.4,xga:14.9,off:48.9},
 fortin:{minutes:288,goals:3,assists:10,shots:32,ixg:3.8,cf:278,ca:245,ff:210,fa:188,xgf:15.6,xga:12.8,off:50.2},
 leclerc:{minutes:300,goals:6,assists:4,shots:49,ixg:6.6,cf:260,ca:277,ff:188,fa:207,xgf:13.8,xga:15.6,off:50.8},
 morin:{minutes:306,goals:4,assists:6,shots:39,ixg:4.2,cf:272,ca:270,ff:200,fa:205,xgf:13.4,xga:13.1,off:51.1}
};
export function metrics(id:string){const r=raw[id];return {...r,p60:(r.goals+r.assists)*60/r.minutes,ixg60:r.ixg*60/r.minutes,cfpct:100*r.cf/(r.cf+r.ca),ffpct:100*r.ff/(r.ff+r.fa),xgpct:100*r.xgf/(r.xgf+r.xga),xga60:r.xga*60/r.minutes,finishing:r.goals-r.ixg,rel:100*r.xgf/(r.xgf+r.xga)-r.off};}
