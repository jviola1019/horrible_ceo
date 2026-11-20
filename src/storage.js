import { validateState, GAME_VERSION } from './engine.js';
const KEY='horrible-industries-save-v1';
export function saveGame(state){try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}}
export function loadGame(){try{const s=JSON.parse(localStorage.getItem(KEY));return validateState(s)?s:null;}catch{return null;}}
export function clearGame(){try{localStorage.removeItem(KEY);}catch{}}
export function download(filename,content,type='application/json'){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function exportGame(state){download(`terrible-company-Q${Math.min(state.quarter,12)}.json`,JSON.stringify({kind:'horrible-industries-save',version:GAME_VERSION,state},null,2));}
export async function importGame(file){if(!file||file.size>2_000_000)throw new Error('Save files must be smaller than 2 MB.');let data;try{data=JSON.parse(await file.text());}catch{throw new Error('This is not valid JSON.');}
  if(data?.kind!=='horrible-industries-save'||data.version!==GAME_VERSION||!validateState(data.state))throw new Error('This save file is invalid or incompatible.');return data.state;
}
