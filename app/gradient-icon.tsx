"use client";
import {useId} from 'react';
import type {Icon,IconProps} from '@phosphor-icons/react';

/** Shared treatment for the game's Phosphor icon kit. */
export function GradientIcon({icon:Glyph,weight='fill',className='',...props}:IconProps&{icon:Icon}){
 const id=`game-icon-${useId().replace(/:/g,'')}`;
 return <Glyph {...props} weight={weight} className={`game-gradient-icon ${className}`} color={`url(#${id})`}>
  <defs><linearGradient id={id} x1="0" y1="1" x2="1" y2="0"><stop offset="0%" className="icon-gradient-start"/><stop offset="55%" className="icon-gradient-middle"/><stop offset="100%" className="icon-gradient-end"/></linearGradient></defs>
 </Glyph>;
}
