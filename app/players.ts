export const labels=['Maniement','Tir','Puissance','Rapidité','IQ hockey','Cœur'];
export const seed=[
{id:'roy',playStyle:'Direct',name:'Émilie Roy',num:28,age:19,pos:'AG',type:'Marqueur',trait:'Ambitieux',potential:'Élevé',salary:.85,years:2,league:1,team:1,height:'5 pi 11',weight:178,stats:[4,6,3,7,3,7],goals:3,assists:4,color:'pink',axes:[30,45]},
{id:'gagnon',playStyle:'Prudent',name:'Alexis Gagnon',num:14,age:27,pos:'C',type:'Polyvalent',trait:'Loyal',potential:'Faible',salary:3.2,years:1,league:6,team:4,height:'6 pi 1',weight:201,stats:[6,5,6,5,7,7],goals:6,assists:10,color:'lime',axes:[75,70]},
{id:'sokolov',playStyle:'Créatif',name:'Viktor Sokolov',num:91,age:31,pos:'AD',type:'Marqueur',trait:'Cupide',potential:'Très faible',salary:10.5,years:3,league:12,team:7,height:'6 pi 2',weight:210,stats:[10,12,8,7,10,6],goals:17,assists:15,color:'blue',axes:[20,25]},
{id:'fortin',playStyle:'Créatif',name:'Sarah Fortin',num:7,age:22,pos:'AG',type:'Fabricant de jeux',trait:'Loyal',potential:'Très élevé',salary:1.4,years:2,league:2,team:2,height:'5 pi 10',weight:182,stats:[7,4,3,8,6,5],goals:4,assists:14,color:'orange',axes:[35,80]},
{id:'leclerc',playStyle:'Direct',name:'Hugo Leclerc',num:44,age:25,pos:'C',type:'Attaquant de puissance',trait:'Ambitieux',potential:'Moyen',salary:2.8,years:3,league:4,team:1,height:'6 pi 4',weight:225,stats:[4,6,9,4,5,8],goals:8,assists:6,color:'purple',axes:[65,30]},
{id:'morin',playStyle:'Prudent',name:'Jules Morin',num:16,age:24,pos:'AD',type:'Polyvalent',trait:'Loyal',potential:'Modeste',salary:2.1,years:2,league:3,team:2,height:'6 pi 0',weight:195,stats:[5,5,5,6,6,7],goals:5,assists:8,color:'teal',axes:[80,65]}
];
export type Player=typeof seed[number];
export const initial=['roy','gagnon','sokolov','fortin','leclerc','morin'];
export const money=(n:number)=>new Intl.NumberFormat('fr-CA',{maximumFractionDigits:2}).format(n)+' M$';

export const playStyleMeaning="Créatif : tente des solutions inattendues. Prudent : privilégie les options sûres. Direct : va rapidement au but. Le style ne mesure pas le talent et ne donne pas de bonus automatique.";
