export function sortRows<T extends {id:string}>(rows:T[],column:{value:(row:T)=>number|string;low?:boolean}):T[]{
  return [...rows].sort((a,b)=>{
    const x=column.value(a),y=column.value(b);
    const comparison=typeof x==='string'?x.localeCompare(String(y),'fr',{numeric:true}):Number(x)-Number(y);
    return (typeof x==='string'||column.low?comparison:-comparison)||a.id.localeCompare(b.id);
  });
}
