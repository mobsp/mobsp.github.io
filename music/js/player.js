
const audio=document.getElementById("audio");
export function play(song){
audio.src=song.url;
audio.play().catch(()=>alert("播放失敗"));
}
audio.addEventListener("error",()=>alert("音樂載入失敗"));
