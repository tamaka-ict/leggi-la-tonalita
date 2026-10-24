'use strict';
const $=id=>document.getElementById(id);
const keys=[
[0,'','Do','La'],[1,'#','Sol','Mi'],[2,'#','Re','Si'],[3,'#','La','Fa♯'],[4,'#','Mi','Do♯'],[5,'#','Si','Sol♯'],[6,'#','Fa♯','Re♯'],[7,'#','Do♯','La♯'],
[1,'b','Fa','Re'],[2,'b','Si♭','Sol'],[3,'b','Mi♭','Do'],[4,'b','La♭','Fa'],[5,'b','Re♭','Si♭'],[6,'b','Sol♭','Mi♭'],[7,'b','Do♭','La♭']
].map(([n,s,major,minor])=>({n,s,major,minor}));
// Diatonic staff reference: position 0 is C0, diatonic steps increase with pitch.
// In treble clef the bottom line is E4; in bass clef G2; C clefs anchor C4.
const clefs={g2:{kind:'g',line:2,bottom:30},g1:{kind:'g',line:1,bottom:32},f4:{kind:'f',line:4,bottom:18},f3:{kind:'f',line:3,bottom:20},c1:{kind:'c',line:1,bottom:28},c2:{kind:'c',line:2,bottom:26},c3:{kind:'c',line:3,bottom:24},c4:{kind:'c',line:4,bottom:22},c5:{kind:'c',line:5,bottom:20}};
const orderSharps=[3,0,4,1,5,2,6],orderFlats=[6,2,5,1,4,0,3]; // F C G D A E B and B E A D G C F
let progress={correct:0,total:0,streak:0},qIndex=0,current=null,answered=false,selectedKey=keys[0],lastKey=null;
try{const saved=JSON.parse(localStorage.getItem('tonality-progress-v1'));if(saved&&['correct','total','streak'].every(x=>Number.isInteger(saved[x])&&saved[x]>=0))progress=saved;}catch{}
try{const conf=JSON.parse(localStorage.getItem('tonality-settings-v1'));for(const id of ['clef','mode','level'])if(conf&&conf[id]&&Array.from($(id).options).some(o=>o.value===conf[id]))$(id).value=conf[id];}catch{}
function save(){try{localStorage.setItem('tonality-progress-v1',JSON.stringify(progress));localStorage.setItem('tonality-settings-v1',JSON.stringify(Object.fromEntries(['clef','mode','level'].map(k=>[k,$(k).value]))));}catch{}}
function stats(){$('score').textContent=`${progress.correct}/${progress.total}`;$('accuracy').textContent=progress.total?Math.round(progress.correct/progress.total*100)+'%':'—';$('streak').textContent=progress.streak;}
function svgNode(tag,attrs,text){let el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(let [k,v] of Object.entries(attrs||{}))el.setAttribute(k,v);if(text!==undefined)el.textContent=text;return el;}
function renderStaff(id,key){const svg=$(id),clef=clefs[$('clef').value];svg.replaceChildren();for(let i=0;i<5;i++)svg.append(svgNode('line',{x1:24,x2:338,y1:83+i*17,y2:83+i*17,stroke:'#4c6074','stroke-width':1.4}));
const cy=151-(clef.line-1)*17;
// The clefs are drawn with SVG shapes instead of relying on installed music fonts.
const group=svgNode('g',{stroke:'#17324f',fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
if(clef.kind==='g'){
// A stylized treble clef with a clear circular anchor on the G line.
group.append(svgNode('path',{d:`M 67 ${cy+36} C 38 ${cy+22}, 38 ${cy-4}, 58 ${cy-15} C 79 ${cy-28}, 82 ${cy+1}, 62 ${cy+9} C 45 ${cy+16}, 40 ${cy-3}, 50 ${cy-21} C 63 ${cy-43}, 72 ${cy-64}, 61 ${cy-75} C 45 ${cy-68}, 47 ${cy-44}, 58 ${cy-18} L 69 ${cy+39} C 72 ${cy+57}, 54 ${cy+66}, 43 ${cy+51}`,'stroke-width':3.4}));
}else if(clef.kind==='f'){
group.append(svgNode('path',{d:`M 42 ${cy+23} C 83 ${cy+9}, 83 ${cy-34}, 58 ${cy-31} C 41 ${cy-31}, 43 ${cy-8}, 57 ${cy-16}`,'stroke-width':5}));group.append(svgNode('circle',{cx:54,cy:cy-19,r:4,fill:'#17324f',stroke:'none'}));for(let dy of [-8,8])group.append(svgNode('circle',{cx:86,cy:cy+dy,r:3.5,fill:'#17324f',stroke:'none'}));
}else{
// C-clef center is placed on its selected line.
group.append(svgNode('path',{d:`M 54 ${cy-33} L 54 ${cy+33} M 64 ${cy-33} L 64 ${cy+33} M 70 ${cy-33} C 87 ${cy-21}, 87 ${cy-9}, 68 ${cy} C 87 ${cy+9}, 87 ${cy+21}, 70 ${cy+33}`,'stroke-width':4}));group.append(svgNode('circle',{cx:68,cy:cy,r:3.5,fill:'#17324f',stroke:'none'}));
}svg.append(group);
const reference=30;const sharpOffsets=[8,5,9,6,3,7,4],flatOffsets=[4,7,3,6,2,5,1];let notes=key.s==='#'?orderSharps:orderFlats,offsets=key.s==='#'?sharpOffsets:flatOffsets;
for(let i=0;i<key.n;i++){
const letter=notes[i],x=123+27*i,preferred=reference+offsets[i];let choices=[];for(let oct=1;oct<=6;oct++){let pitch=oct*7+letter,diff=pitch-clef.bottom;if(diff>=-2&&diff<=11)choices.push({pitch,delta:Math.abs(pitch-preferred)});}if(!choices.length)for(let oct=1;oct<=6;oct++)choices.push({pitch:oct*7+letter,delta:Math.abs((oct*7+letter)-clef.bottom-4)});
choices.sort((a,b)=>a.delta-b.delta);const y=151-(choices[0].pitch-clef.bottom)*8.5;
// Ledger lines for unusual clefs where the conventional octave lies outside the staff.
for(let yy=66;yy>=y-1;yy-=17)svg.append(svgNode('line',{x1:x-12,x2:x+17,y1:yy,y2:yy,stroke:'#526578','stroke-width':1.1}));
for(let yy=168;yy<=y+1;yy+=17)svg.append(svgNode('line',{x1:x-12,x2:x+17,y1:yy,y2:yy,stroke:'#526578','stroke-width':1.1}));
if(key.s==='#'){svg.append(svgNode('path',{d:`M ${x+5} ${y-22} L ${x+5} ${y+19} M ${x+14} ${y-26} L ${x+14} ${y+15} M ${x} ${y-6} L ${x+19} ${y-10} M ${x} ${y+5} L ${x+19} ${y+1}`,fill:'none',stroke:'#172f47','stroke-width':3.1}));}
else{svg.append(svgNode('path',{d:`M ${x+7} ${y-28} L ${x+7} ${y+12} C ${x+23} ${y+8}, ${x+23} ${y-12}, ${x+11} ${y-9} C ${x+4} ${y-9}, ${x+5} ${y-2}, ${x+7} ${y+3}`,fill:'none',stroke:'#172f47','stroke-width':3.5}));}
}
const text=key.n===0?'Nessuna alterazione':key.n+' '+(key.s==='#'?'diesis':key.n===1?'bemolle':'bemolli');svg.append(svgNode('text',{x:182,y:193,'text-anchor':'middle',fill:'#658096','font-size':12},text));
}
function pool(){return keys.filter(k=>k.n<=Number($('level').value));}
function shuffle(arr){for(let i=arr.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr;}
function newQuestion(forced){const available=pool();let k=forced||available[Math.floor(Math.random()*available.length)];if(!forced&&available.length>1&&k===lastKey)k=available.filter(x=>x!==lastKey)[Math.floor(Math.random()*(available.length-1))];lastKey=k;const mode=$('mode').value,kind=mode==='both'?(Math.random()<.5?'major':'minor'):mode;current={key:k,kind,correct:k[kind]};answered=false;qIndex++;$('number').textContent='ESERCIZIO '+qIndex;$('question').textContent='Qual è la tonalità '+(kind==='major'?'maggiore':'minore')+'?';renderStaff('staff',k);$('feedback').classList.add('hide');$('next').classList.add('hide');const distractors=shuffle([...new Set(keys.filter(x=>x!==k).map(x=>x[kind]).filter(x=>x!==k[kind]))]).slice(0,3);const answers=shuffle([k[kind],...distractors]);$('answers').replaceChildren(...answers.map(value=>{const btn=document.createElement('button');btn.className='choice';btn.textContent=value;btn.onclick=()=>answer(value);return btn;}));}
function answer(value){if(answered)return;answered=true;const good=value===current.correct;progress.total++;if(good){progress.correct++;progress.streak++;}else progress.streak=0;stats();save();for(let b of $('answers').children){b.disabled=true;if(b.textContent===current.correct)b.classList.add('good');else if(b.textContent===value)b.classList.add('bad');}const k=current.key;const f=$('feedback');f.replaceChildren();let b=document.createElement('b');b.textContent=(good?'✓ Risposta esatta':'✕ Risposta da correggere')+': '+current.correct+' '+(current.kind==='major'?'maggiore':'minore');const p=document.createElement('div');p.textContent='Armatura: '+(k.n===0?'nessuna alterazione':k.n+' '+(k.s==='#'?'diesis':'bemolli'))+'. Maggiore: '+k.major+'; relativa minore: '+k.minor+'.';f.append(b,p);f.classList.remove('hide');$('next').classList.remove('hide');}
function study(){const k=selectedKey;$('studyTitle').textContent=k.major+' maggiore / '+k.minor+' minore';renderStaff('studyStaff',k);$('studyDescription').textContent=k.n?'Alterazioni in armatura: '+(k.s==='#'?['Fa','Do','Sol','Re','La','Mi','Si']:['Si','Mi','La','Re','Sol','Do','Fa']).slice(0,k.n).map(x=>x+(k.s==='#'?'♯':'♭')).join(' · '):'Nessuna alterazione in armatura.';for(let row of $('table').children)row.classList.toggle('selected',Number(row.dataset.index)===keys.indexOf(k));}
function buildTable(){for(let [i,k] of keys.entries()){let row=document.createElement('button');row.className='tablerow';row.dataset.index=i;for(let txt of [k.n===0?'Nessuna':k.n+' '+(k.s==='#'?'♯':'♭'),k.major,k.minor]){let span=document.createElement('span');span.textContent=txt;row.append(span);}row.onclick=()=>{selectedKey=k;study();};$('table').append(row);}}
function tab(learn){$('practice').classList.toggle('hide',learn);$('learn').classList.toggle('hide',!learn);$('practiceTab').classList.toggle('active',!learn);$('learnTab').classList.toggle('active',learn);}
$('practiceTab').onclick=()=>tab(false);$('learnTab').onclick=()=>tab(true);$('next').onclick=()=>newQuestion();$('reset').onclick=()=>{progress={correct:0,total:0,streak:0};qIndex=0;stats();save();newQuestion();};$('studyPractice').onclick=()=>{tab(false);newQuestion(selectedKey);};$('clef').onchange=()=>{if(current)renderStaff('staff',current.key);study();save();};for(let id of ['mode','level'])$(id).onchange=()=>{save();newQuestion();};buildTable();study();stats();newQuestion();if('serviceWorker' in navigator&&location.protocol==='https:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
