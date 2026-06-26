
import {state} from './state.js';
import {play} from './player.js';

export function render(){
const el=document.getElementById("songs");
let data=state.songs.filter(x=>
(state.filter==='all'||x.tag===state.filter) &&
x.title.toLowerCase().includes(state.search.toLowerCase())
);
let pages=Math.ceil(data.length/state.perPage);
let start=(state.page-1)*state.perPage;
data=data.slice(start,start+state.perPage);

el.innerHTML=data.map(s=>`
<div class='song' data-id='${s.id}'>
<img loading='lazy' src='${s.cover}'>
${s.title} | ${s.artist}
</div>`).join('');

document.querySelectorAll(".song").forEach((x,i)=>{
x.onclick=()=>play(data[i])
});

document.getElementById("pagination").innerHTML=Array.from({length:pages},(_,i)=>`<button class='p'>${i+1}</button>`).join("");
document.querySelectorAll(".p").forEach((b,i)=>b.onclick=()=>{state.page=i+1;render();});
}
