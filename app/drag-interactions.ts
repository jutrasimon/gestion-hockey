"use client";
import {MouseSensor,TouchSensor,KeyboardSensor,useSensor,useSensors,type DragStartEvent,type KeyboardCoordinateGetter} from '@dnd-kit/core';

export const TOUCH_HOLD_MS=450;
export function useDragSensors(coordinateGetter?:KeyboardCoordinateGetter){
 return useSensors(
  useSensor(MouseSensor,{activationConstraint:{distance:6}}),
  useSensor(TouchSensor,{activationConstraint:{delay:TOUCH_HOLD_MS,tolerance:8}}),
  useSensor(KeyboardSensor,coordinateGetter?{coordinateGetter}:{})
 );
}
export function confirmGrab(event:DragStartEvent){
 if(event.activatorEvent.type.startsWith('touch')&&typeof navigator!=='undefined'&&typeof navigator.vibrate==='function'){
  try{navigator.vibrate(20)}catch{/* Haptics are optional on unsupported devices. */}
 }
}
