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
 lion:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=a855793f55e2435aa8bf66c9b4c29a72.mp3",
 elephant:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=03f2c659f3874bd1a473ea6b163cab48.mp3",
 giraffe:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=9e0d68682df448c29aa94336ef782268.mp3",
 camel:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=2ab840fb9b68488cbe2623d08b24fce0.mp3",
 rabbit:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=27fc955d3bd64af6b1a6b81ccfb956b3.mp3",
 zebra:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=504561a1382a47b09fafa3b4019d8b30.mp3",
 monkey:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=bc23dd895900466e8b6aeae404b7e625.mp3",
 cow:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=80ab799f84ac44da9f113da28b81b0b4.mp3",
 horse:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=cbfbacbbe86c46caafabe1e7815f049a.mp3",
 goat:"https://resource2.heygen.ai/text_to_speech/b9ccc4a328b44d16a8d7f98c0a6a6f10/24c7556125674f17bc2c4904074827e5/id=3ddb67c260f44eadb9069c83d1d4a529.mp3"
};
let currentAudio=null;
function speak(word){
 const animal=animals.find(a=>a.ar===word)||selected;
 const audioUrl=audioFiles[animal.id];
 if(!audioUrl){$("#focus-pronunciation").textContent="Sauti haijapatikana.";return;}
 if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;}
 currentAudio=new Audio(audioUrl);
 $("#focus-pronunciation").textContent="Mwalimu Bilal anatamka: "+animal.say.toUpperCase();
 currentAudio.play().then(()=>{
  currentAudio.onended=()=>{$("#focus-pronunciation").textContent="Sikiliza tena na urudie: "+animal.say.toUpperCase();};
 }).catch(()=>{
  $("#focus-pronunciation").textContent="Sauti haikuweza kuchezwa. Angalia intaneti kisha jaribu tena.";
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
