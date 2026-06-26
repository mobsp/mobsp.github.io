
import {state} from './state.js';
import {render} from './ui.js';

fetch('./data/music.json')
.then(r=>r.json())
.then(d=>{
state.songs=d;
render();
});

search.oninput=e=>{
state.search=e.target.value;
render();
}

document.querySelectorAll("[data-tag]").forEach(x=>{
x.onclick=()=>{
state.filter=x.dataset.tag;
render();
}
});

if("serviceWorker" in navigator){
navigator.serviceWorker.register("./sw.js");
}
