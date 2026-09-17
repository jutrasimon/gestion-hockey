"use client";
import type {ReactElement,ReactNode} from 'react';
import {Tooltip,TooltipTrigger,TooltipContent} from '@/components/ui/tooltip';
export function Hint({text,children}:{text:ReactNode;children:ReactElement}){return <Tooltip><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent>{text}</TooltipContent></Tooltip>}
