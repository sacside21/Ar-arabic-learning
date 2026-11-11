"use strict";
const animals=[
{id:"lion",en:"Lion",sw:"Simba",ar:"أَسَدٌ",plain:"أسد",emoji:"🦁",say:"asadun"},
{id:"elephant",en:"Elephant",sw:"Tembo",ar:"فِيلٌ",plain:"فيل",emoji:"🐘",say:"fiilun"},
{id:"giraffe",en:"Giraffe",sw:"Twiga",ar:"زَرَافَةٌ",plain:"زرافة",emoji:"🦒",say:"zaraafatun"},
{id:"camel",en:"Camel",sw:"Ngamia",ar:"جَمَلٌ",plain:"جمل",emoji:"🐪",say:"jamalun"},
{id:"rabbit",en:"Rabbit",sw:"Sungura",ar:"أَرْنَبٌ",plain:"أرنب",emoji:"🐇",say:"arnabun"},
{id:"zebra",en:"Zebra",sw:"Pundamilia",ar:"حِمَارٌ وَحْشِيٌّ",plain:"حمار وحشي",emoji:"🦓",say:"himaarun wahshiyyun"},
{id:"monkey",en:"Monkey",sw:"Tumbili",ar:"قِرْدٌ",plain:"قرد",emoji:"🐒",say:"qirdun"},
{id:"cow",en:"Cow",sw:"Ng’ombe",ar:"بَقَرَةٌ",plain:"بقرة",emoji:"🐄",say:"baqaratun"},
{id:"horse",en:"Horse",sw:"Farasi",ar:"حِصَانٌ",plain:"حصان",emoji:"🐎",say:"hisaanun"},
{id:"goat",en:"Goat",sw:"Mbuzi",ar:"مَاعِزٌ",plain:"ماعز",emoji:"🐐",say:"maaizun"}
];
let selected=animals[0],qIndex=0,score=0,answered=false,completed=false;
const order=[1,3,0,4,2,5,6,7,8,9];
const $=s=>document.querySelector(s);
const audioFiles={
 lion:"./audio/01_asad.mp3",
 elephant:"./audio/02_fil.mp3",
 giraffe:"./audio/03_zarafa.mp3",
 camel:"./audio/04_jamal.mp3",
 rabbit:"./audio/05_arnab.mp3",
 zebra:"./audio/06_himar_wahshi.mp3",
 monkey:"./audio/07_qird.mp3",
 cow:"./audio/08_baqara.mp3",
 horse:"./audio/09_hisan.mp3",
 goat:"./audio/10_maiz.mp3"
};
let currentAudio=null;
function speak(word){
 const animal=animals.find(a=>a.ar===word)||selected;
 const audioUrl=audioFiles[animal.id];
 if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;}
 currentAudio=new Audio(audioUrl);
 $("#focus-pronunciation").textContent="Inacheza sauti: "+animal.say.toUpperCase();
 currentAudio.play().then(()=>{
  currentAudio.onended=()=>{$("#focus-pronunciation").textContent="Sikiliza tena na urudie: "+animal.say.toUpperCase();};
 }).catch(()=>{
  // Fallback: use the device's Arabic speech voice if the local recording is not yet available.
  if("speechSynthesis" in window){
   const utterance=new SpeechSynthesisUtterance(animal.ar);
   utterance.lang="ar";
   utterance.rate=0.82;
   speechSynthesis.cancel();
   speechSynthesis.speak(utterance);
   $("#focus-pronunciation").textContent="Sauti ya kifaa: "+animal.say.toUpperCase();
  }else{
   $("#focus-pronunciation").textContent="Sauti haipatikani. Hakikisha faili za audio zimewekwa kwenye folda ya audio.";
  }
 });
}
function focusWord(){
 $("#focus-icon").textContent=selected.emoji;$("#focus-ar").textContent=selected.ar;
 $("#focus-translations").textContent=selected.en+" · "+selected.sw;
 $("#focus-pronunciation").textContent="Pronunciation guide: "+selected.say;
}
function renderCards(){
 const grid=$("#animal-grid");
 grid.innerHTML=animals.map(a=>'<article class="animal-card '+(a.id===selected.id?"active":"")+'" data-id="'+a.id+'"><button class="card-select" type="button" aria-pressed="'+(a.id===selected.id)+'" aria-label="Learn '+a.en+'"><div class="animal-icon">'+a.emoji+'</div><div class="animal-ar" lang="ar" dir="rtl">'+a.ar+'</div><div class="animal-en">'+a.en+'</div><div class="animal-sw">'+a.sw+'</div></button><button class="speak-btn" type="button" data-word="'+a.ar+'">▶ Hear Arabic</button></article>').join("");
 grid.querySelectorAll(".card-select").forEach(b=>b.addEventListener("click",()=>{selected=animals.find(a=>a.id===b.closest("article").dataset.id);renderCards();focusWord()}));
 grid.querySelectorAll("[data-word]").forEach(b=>b.addEventListener("click",()=>speak(b.dataset.word)));
}
$("#focus-speak").addEventListener("click",()=>speak(selected.ar));
function updateScore(){
 $("#progress-label").textContent=score+" / 10 correct";
 $("#progress-bar").style.width=(score/10*100)+"%";
}
function renderQuiz(){
 const a=animals[order[qIndex]];
 const opts=[a,...animals.filter(x=>x.id!==a.id).slice(0,3)].sort((x,y)=>x.id.localeCompare(y.id));
 $("#quiz-animal").textContent=a.emoji;
 $("#quiz-question").textContent='What is "'+a.en.toLowerCase()+'" in Arabic?';
 $("#question-number").textContent="QUESTION "+(qIndex+1)+" OF 10";
 $("#quiz-options").hidden=false;
 $("#quiz-options").innerHTML=opts.map(x=>'<button class="quiz-option" type="button" data-id="'+x.id+'" lang="ar" dir="rtl">'+x.ar+"</button>").join("");
 $("#quiz-feedback").textContent="";
 $("#next-question").disabled=true;
 $("#next-question").textContent=qIndex===9?"Finish lesson":"Next question →";
 answered=false;
 $("#quiz-options").querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{
  if(answered)return;answered=true;const good=b.dataset.id===a.id;
  if(good){score++;b.classList.add("correct");$("#quiz-feedback").textContent="Correct! أحسنتَ — Umejibu vizuri!";}
  else{b.classList.add("wrong");$("#quiz-options [data-id='"+a.id+"']").classList.add("correct");$("#quiz-feedback").textContent="Not quite. Correct answer: "+a.ar+" ("+a.sw+").";}
  $("#quiz-options").querySelectorAll("button").forEach(x=>x.disabled=true);
  $("#next-question").disabled=false;updateScore();
 }));
}
function showResults(){
 completed=true;
 $("#question-number").textContent="LESSON COMPLETE";
 $("#quiz-animal").textContent=score>=8?"🏆":"📘";
 $("#quiz-question").textContent="You scored "+score+" out of 10";
 $("#quiz-options").hidden=true;
 const percent=score*10;
 let message=percent>=80?"Excellent work! ممتاز — you have mastered most of the animal words.":percent>=50?"Good effort! أحسنت — review the words you missed and try again.":"Keep practising! حاول مرة أخرى — listen to the words and repeat them.";
 $("#quiz-feedback").textContent=percent+"% • "+message;
 $("#next-question").textContent="Start again";
 $("#next-question").disabled=false;
}
$("#next-question").addEventListener("click",()=>{
 if(completed){qIndex=0;score=0;completed=false;updateScore();renderQuiz();return;}
 if(qIndex===9&&answered){showResults();return;}
 qIndex++;renderQuiz();
});
$("#reset-quiz").addEventListener("click",()=>{qIndex=0;score=0;completed=false;updateScore();renderQuiz()});
renderCards();focusWord();renderQuiz();updateScore();


const startAR=$("#start-ar"),stopAR=$("#stop-ar"),arBox=$("#ar-container"),arStatus=$("#ar-status");
if(startAR&&arBox){
 startAR.addEventListener("click",()=>{
  arBox.hidden=false;startAR.hidden=true;stopAR.hidden=false;
  arStatus.textContent="Kamera inaanza. Ruhusu ruhusa ya kamera na elekeza kwenye alama ya Hiro.";
  const scene=arBox.querySelector("a-scene");
  if(scene&&scene.hasLoaded){scene.play();}
 });
 stopAR.addEventListener("click",()=>{
  const scene=arBox.querySelector("a-scene");
  if(scene){const video=scene.querySelector("video");if(video&&video.srcObject)video.srcObject.getTracks().forEach(t=>t.stop());}
  arBox.hidden=true;startAR.hidden=false;stopAR.hidden=true;
  arStatus.textContent="Kamera imefungwa. Bonyeza Anza AR camera kujaribu tena.";
 });
}
