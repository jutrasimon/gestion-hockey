"use client";
import {createContext,useContext,useEffect,useState,type ReactNode} from 'react';
import {Star} from 'lucide-react';
import {roster} from './league';
const Favorites=createContext<{ids:string[];toggle:(id:string)=>void}>({ids:[],toggle:()=>{}});
export function FavoritesProvider({children}:{children:ReactNode}){const [ids,setIds]=useState<string[]>([]);const [ready,setReady]=useState(false);useEffect(()=>{try{const saved=JSON.parse(localStorage.getItem('hockey-favorites')||'[]');if(Array.isArray(saved))setIds(saved.filter((id:unknown)=>typeof id==='string'&&roster.some(p=>p.id===id)))}catch{}setReady(true)},[]);useEffect(()=>{if(ready)try{localStorage.setItem('hockey-favorites',JSON.stringify(ids))}catch{}},[ids,ready]);return <Favorites.Provider value={{ids,toggle:id=>setIds(old=>old.includes(id)?old.filter(x=>x!==id):[...old,id])}}>{children}</Favorites.Provider>}
export const useFavorites=()=>useContext(Favorites);
export function FavoriteButton({id,name}:{id:string;name:string}){const {ids,toggle}=useFavorites();const saved=ids.includes(id);return <button className={`favorite-button ${saved?'is-favorite':''}`} aria-pressed={saved} aria-label={`${saved?'Retirer':'Ajouter'} ${name} ${saved?'des':'aux'} favoris`} onClick={()=>toggle(id)}><Star size={19} fill={saved?'currentColor':'none'}/></button>}
