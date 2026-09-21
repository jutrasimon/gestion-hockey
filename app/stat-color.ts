export const statColor=(value:number)=>value<=5?'var(--palette-stat-low,#e57373)':value<=10?'var(--palette-stat-mid,#d6ab46)':'var(--palette-stat-high,#57b887)';
export const effectColor=(value:number)=>value<0?'var(--palette-stat-low,#e57373)':value>0?'var(--palette-stat-high,#57b887)':'var(--muted-foreground)';
