/* Leggi la tonalità v2 — scale con Web Audio e spartito sincronizzato.
 * Il suono è sintetizzato localmente: nessun file audio, server o API esterna.
 */
'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const app = window.TonalityApp;
  const xmlns = 'http://www.w3.org/2000/svg';
  const letters = ['Do','Re','Mi','Fa','Sol','La','Si'];
  const semitones = [0,2,4,5,7,9,11];
  const clefs = {
    g2:{kind:'g',line:2,bottom:30},g1:{kind:'g',line:1,bottom:32},
    f4:{kind:'f',line:4,bottom:18},f3:{kind:'f',line:3,bottom:20},
    c1:{kind:'c',line:1,bottom:28},c2:{kind:'c',line:2,bottom:26},
    c3:{kind:'c',line:3,bottom:24},c4:{kind:'c',line:4,bottom:22},c5:{kind:'c',line:5,bottom:20}
  };
  const sharpLetters=[3,0,4,1,5,2,6],flatLetters=[6,2,5,1,4,0,3];
  const sharpOffsets=[8,5,9,6,3,7,4],flatOffsets=[4,7,3,6,2,5,1];
  const intervals={major:[0,2,4,5,7,9,11,12],natural:[0,2,3,5,7,8,10,12],harmonic:[0,2,3,5,7,8,11,12],melodic:[0,2,3,5,7,9,11,12]};
  let studyKey=app.getStudyKey(), notes=[],noteGraphics=[], position=-1;
  let ctx=null,playing=null,pausedAt=null,raf=0,isolatedVoices=[];
  let state='stopped';
  const viewWidth=1180, top=79, bottom=147, staffLine=17;
  const noteGap=55;
  const n=(tag,attrs={},value) => {
    const e=document.createElementNS(xmlns,tag);
    for(const [k,v] of Object.entries(attrs))e.setAttribute(k,String(v));
    if(value!==undefined)e.textContent=String(value);
    return e;
  };
  const mod=(a,b)=>(a%b+b)%b;
  const nameWithAcc=(letter,alter)=>letters[letter]+(alter===2?'𝄪':alter===1?'♯':alter===-1?'♭':alter===-2?'𝄫':'');
  function parseName(name){
    const idx=letters.findIndex(l=>name.startsWith(l)&& (name===l || name.slice(l.length)==='♯'||name.slice(l.length)==='♭'));
    if(idx<0)throw Error('Tonica non riconosciuta: '+name);
    return {letter:idx,alter:name.endsWith('♯')?1:name.endsWith('♭')?-1:0};
  }
  function sigAlterations(key){
    const a=[0,0,0,0,0,0,0];
    const order=key.s==='#'?sharpLetters:flatLetters;
    for(let i=0;i<key.n;i++)a[order[i]]=key.s==='#'?1:-1;
    return a;
  }
  function selectedType(){return $('scaleType').value;}
  function variant(){return $('minorVariant').value;}
  function makeScale(key,kind,minorKind,clefName){
    const tonic=parseName(key[kind]);
    const c=clefs[clefName];
    const octaves=[2,3,4,5].map(o=>({o,diff:o*7+tonic.letter-c.bottom}));
    // The tonic is near the bottom of the staff, leaving room for the octave.
    const octave=octaves.sort((a,b)=>Math.abs(a.diff-1)-Math.abs(b.diff-1))[0].o;
    const tonicMidi=(octave+1)*12+semitones[tonic.letter]+tonic.alter;
    const major=kind==='major';
    const ascending=major?intervals.major:intervals[minorKind];
    const descending=major?intervals.major:minorKind==='harmonic'?intervals.harmonic:intervals.natural;
    const degrees=[0,1,2,3,4,5,6,7,6,5,4,3,2,1,0];
    const sig=sigAlterations(key);
    return degrees.map((degree,i)=>{
      const absolute=octave*7+tonic.letter+degree;
      const letter=mod(absolute,7),noteOctave=Math.floor(absolute/7);
      const natural=(noteOctave+1)*12+semitones[letter];
      const interval=i<=7?ascending[degree]:descending[degree];
      const midi=tonicMidi+interval;
      const alter=midi-natural;
      // An accidental is needed only if different from the key signature;
      // there is a bar line at the octave, before the descending notes.
      const accidental=alter!==sig[letter]?alter:null;
      return {degree,letter,octave:noteOctave,diatonic:absolute,midi,alter,accidental,
        label:nameWithAcc(letter,alter)+noteOctave,letterName:nameWithAcc(letter,alter),x:0,y:0};
    });
  }
  function svgClef(svg,clef){
    const cy=bottom-(clef.line-1)*staffLine;
    const g=n('g',{stroke:'#193954',fill:'none','stroke-linecap':'round','stroke-linejoin':'round'});
    if(clef.kind==='g')g.append(n('path',{d:`M 77 ${cy+36} C 48 ${cy+22}, 48 ${cy-4}, 68 ${cy-15} C 89 ${cy-28}, 92 ${cy+1}, 72 ${cy+9} C 55 ${cy+16}, 50 ${cy-3}, 60 ${cy-21} C 73 ${cy-43}, 82 ${cy-64}, 71 ${cy-75} C 55 ${cy-68}, 57 ${cy-44}, 68 ${cy-18} L 79 ${cy+39} C 82 ${cy+57}, 64 ${cy+66}, 53 ${cy+51}`,'stroke-width':3.2}));
    else if(clef.kind==='f'){
      g.append(n('path',{d:`M 48 ${cy+23} C 89 ${cy+9}, 89 ${cy-34}, 64 ${cy-31} C 47 ${cy-31}, 49 ${cy-8}, 63 ${cy-16}`,'stroke-width':5}));
      g.append(n('circle',{cx:60,cy:cy-19,r:4,fill:'#193954',stroke:'none'}));
      for(const dy of [-8,8])g.append(n('circle',{cx:92,cy:cy+dy,r:3.4,fill:'#193954',stroke:'none'}));
    }else{
      g.append(n('path',{d:`M 60 ${cy-33} L 60 ${cy+33} M 70 ${cy-33} L 70 ${cy+33} M 76 ${cy-33} C 93 ${cy-21}, 93 ${cy-9}, 74 ${cy} C 93 ${cy+9}, 93 ${cy+21}, 76 ${cy+33}`,'stroke-width':4}));
      g.append(n('circle',{cx:74,cy,r:3.5,fill:'#193954',stroke:'none'}));
    }
    svg.append(g);
  }
  function ledger(svg,x,y){
    if(y<top-1){for(let yy=top-staffLine;yy>=y-1;yy-=staffLine)svg.append(n('line',{x1:x-14,x2:x+14,y1:yy,y2:yy,stroke:'#536a7d','stroke-width':1.3}));}
    if(y>bottom+1){for(let yy=bottom+staffLine;yy<=y+1;yy+=staffLine)svg.append(n('line',{x1:x-14,x2:x+14,y1:yy,y2:yy,stroke:'#536a7d','stroke-width':1.3}));}
  }
  function drawSignature(svg,key,clef){
    const order=key.s==='#'?sharpLetters:flatLetters;
    const offsets=key.s==='#'?sharpOffsets:flatOffsets;
    const xStart=118;
    const prefReference=30;
    for(let i=0;i<key.n;i++){
      const x=xStart+i*24,preferred=prefReference+offsets[i],letter=order[i];
      const candidates=[];
      for(let oct=1;oct<=6;oct++){
        const pitch=oct*7+letter,diff=pitch-clef.bottom;
        if(diff>=-2&&diff<=11)candidates.push({pitch,score:Math.abs(pitch-preferred)});
      }
      if(!candidates.length)continue;
      const pitch=candidates.sort((a,b)=>a.score-b.score)[0].pitch;
      const y=bottom-(pitch-clef.bottom)*staffLine/2;
      ledger(svg,x+7,y);
      if(key.s==='#')svg.append(n('path',{d:`M ${x+5} ${y-20} v39 M ${x+13} ${y-23} v39 M ${x} ${y-6} l18 -4 M ${x} ${y+5} l18 -4`,fill:'none',stroke:'#193954','stroke-width':2.8}));
      else svg.append(n('path',{d:`M ${x+5} ${y-27} v39 C ${x+21} ${y+8},${x+21} ${y-12},${x+9} ${y-9} C ${x+3} ${y-9},${x+3} ${y-2},${x+5} ${y+3}`,fill:'none',stroke:'#193954','stroke-width':3.2}));
    }
    return xStart+key.n*24+35;
  }
  function accidental(svg,x,y,alter){
    const xa=x-29;
    if(alter===0){
      svg.append(n('path',{d:`M ${xa+5} ${y-22} v36 l12 -6 v-35 M ${xa+5} ${y-1} l12 -6`,stroke:'#193954','stroke-width':2.3,fill:'none'}));
    }else if(alter===1){
      svg.append(n('path',{d:`M ${xa+5} ${y-19} v33 M ${xa+13} ${y-22} v33 M ${xa+1} ${y-5} l18 -4 M ${xa+1} ${y+4} l18 -4`,stroke:'#193954','stroke-width':2.5,fill:'none'}));
    }else if(alter===-1){
      svg.append(n('text',{x:xa+2,y:y+12,fill:'#193954','font-size':39,'font-family':'Georgia,serif'},'♭'));
    }else if(alter===2){
      svg.append(n('text',{x:xa+3,y:y+7,fill:'#193954','font-size':24,'font-family':'system-ui,serif'},'×'));
    }else if(alter===-2){
      svg.append(n('text',{x:xa-5,y:y+8,fill:'#193954','font-size':23,'font-family':'Georgia,serif'},'♭♭'));
    }
  }
  function renderScale(){
    stop(true);
    studyKey=app.getStudyKey();
    const key=studyKey,clef=clefs[app.getClef()],kind=selectedType(),minorKind=variant();
    $('minorOption').classList.toggle('hide',kind==='major');
    $('scaleTitle').textContent='Scala di '+key[kind]+' '+(kind==='major'?'maggiore':'minore')+(kind==='minor'?' '+({natural:'naturale',harmonic:'armonica',melodic:'melodica'}[minorKind]):'');
    notes=makeScale(key,kind,minorKind,app.getClef());
    const svg=$('scaleStaff');svg.replaceChildren();noteGraphics=[];
    const startX=140+key.n*24+36;
    const lastX=startX+noteGap*(notes.length-1);
    const width=Math.max(viewWidth,lastX+66);
    svg.setAttribute('viewBox',`0 0 ${width} 228`);svg.style.width=width+'px';
    // Light timeline above the notes; completed segment grows with the cursor.
    svg.append(n('line',{x1:startX,x2:lastX,y1:25,y2:25,stroke:'#dce7ef','stroke-width':10,'stroke-linecap':'round'}));
    const filled=n('line',{id:'scaleDone',x1:startX,x2:startX,y1:25,y2:25,stroke:'#2188b7','stroke-width':10,'stroke-linecap':'round'});svg.append(filled);
    for(let i=0;i<5;i++)svg.append(n('line',{x1:24,x2:width-17,y1:top+i*staffLine,y2:top+i*staffLine,stroke:'#8297aa','stroke-width':1.35}));
    svgClef(svg,clef);drawSignature(svg,key,clef);
    notes.forEach((note,i)=>{
      const x=startX+i*noteGap,y=bottom-(note.diatonic-clef.bottom)*staffLine/2;
      note.x=x;note.y=y;
      if(i===8)svg.append(n('line',{x1:x-noteGap/2,y1:top-4,x2:x-noteGap/2,y2:bottom+4,stroke:'#7b90a4','stroke-width':1.5}));
      ledger(svg,x,y);
      if(note.accidental!==null)accidental(svg,x,y,note.accidental);
      const dot=n('circle',{cx:x,cy:y,r:16,fill:'#f4c756',opacity:0});svg.append(dot);
      const head=n('ellipse',{cx:x,cy:y,rx:9.5,ry:6.6,transform:`rotate(-20 ${x} ${y})`,fill:'#1a3855'});svg.append(head);
      const stemStart=x+(y<=top+staffLine*2?-9:9),stemEnd=y+(y<=top+staffLine*2?32:-32);
      svg.append(n('line',{x1:stemStart,y1:y,x2:stemStart,y2:stemEnd,stroke:'#1a3855','stroke-width':1.6}));
      const label=n('text',{x,y:208,fill:'#526d83','text-anchor':'middle','font-size':13,'font-weight':550},note.letterName);svg.append(label);
      const hit=n('rect',{x:x-20,y:Math.max(43,y-30),width:40,height:Math.min(160,Math.max(80,y+40)),fill:'transparent',role:'button',tabindex:'0','aria-label':'Ascolta '+note.label});
      const playThis=()=>singleNote(i);
      hit.addEventListener('click',playThis);
      hit.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();playThis();}});
      svg.append(hit);
      noteGraphics.push({dot,head,label});
    });
    const cursor=n('line',{id:'scaleCursor',x1:startX,y1:39,x2:startX,y2:196,stroke:'#f28a18','stroke-width':3,'stroke-linecap':'round',opacity:0});svg.append(cursor);
    const point=n('circle',{id:'scalePointer',cx:startX,cy:25,r:7,fill:'#e98216',opacity:0});svg.append(point);
    const count=notes.length;
    $('scaleSummary').textContent=`${count} note: salita di un'ottava e discesa. Le note scritte e l'audio cambiano insieme.`;
    if(kind==='minor'&&minorKind==='melodic')$('scaleSummary').textContent+=' Nella scala minore melodica la discesa è naturale.';
    $('scaleScrolly').scrollLeft=0;
    updateCursor(0,-1);
    $('scaleStatus').textContent='Pronta per l’ascolto';
    $('scaleProgressTrack').setAttribute('aria-valuenow','0');
  }
  function updateCursor(fraction,index){
    const first=notes[0],last=notes[notes.length-1];if(!first||!last)return;
    const x=first.x+(last.x-first.x)*Math.max(0,Math.min(1,fraction));
    $('scaleDone').setAttribute('x2',String(x));
    for(const e of ['scaleCursor','scalePointer']){
      const el=$(e);el.setAttribute(e==='scaleCursor'?'x1':'cx',String(x));
      if(e==='scaleCursor')el.setAttribute('x2',String(x));
      el.setAttribute('opacity',index<0?'0':'1');
    }
    noteGraphics.forEach((g,i)=>{
      const active=i===index;
      g.dot.setAttribute('opacity',active?'0.72':'0');
      g.head.setAttribute('fill',active?'#d87312':'#1a3855');
      g.label.setAttribute('fill',active?'#a4500d':'#526d83');
      g.label.setAttribute('font-weight',active?'800':'550');
    });
    $('scaleProgress').style.width=Math.round(fraction*100)+'%';
    $('scaleProgressTrack').setAttribute('aria-valuenow',String(Math.round(fraction*100)));
    if(index>=0&&notes[index]){
      $('scaleCurrent').textContent=notes[index].label+' · '+(notes[index].degree===0?'I / VIII':String(notes[index].degree+1)+'° grado');
      if(index!==position){
        const w=$('scaleScrolly'),note=notes[index],target=note.x-w.clientWidth/2;
        w.scrollLeft=Math.max(0,target);
      }
    }else $('scaleCurrent').textContent='—';
    position=index;
  }
  function context(){
    if(ctx)return ctx;
    const Audio=window.AudioContext||window.webkitAudioContext;
    if(!Audio)throw Error('Il browser non supporta la riproduzione audio Web Audio.');
    ctx=new Audio();return ctx;
  }
  function voice(context,midi,start,duration){
    const frequency=440*Math.pow(2,(midi-69)/12);
    const o=context.createOscillator(),g=context.createGain();
    o.type=$('timbre').value==='pure'?'sine':'triangle';
    o.frequency.setValueAtTime(frequency,start);
    // Attack/release prevent clicks; light envelope simulates a soft musical instrument.
    const len=Math.max(0.12,duration);
    g.gain.setValueAtTime(0.0001,start);
    g.gain.linearRampToValueAtTime($('timbre').value==='pure'?0.20:0.15,start+0.020);
    g.gain.exponentialRampToValueAtTime(0.0001,start+len);
    o.connect(g);g.connect(context.destination);
    o.start(start);o.stop(start+len+0.018);
    o.onended=()=>{try{o.disconnect();g.disconnect();}catch{}};
    return o;
  }
  function silence(voices){
    for(const o of voices){try{o.stop(ctx?ctx.currentTime:0);}catch{}}
  }
  function stop(quiet=false){
    cancelAnimationFrame(raf);raf=0;
    if(playing)silence(playing.voices);
    playing=null;pausedAt=null;
    silence(isolatedVoices);isolatedVoices=[];
    state='stopped';$('playScale').textContent='▶ Ascolta la scala';
    $('pauseScale').disabled=true;$('pauseScale').textContent='⏸ Pausa';
    if(!quiet){updateCursor(0,-1);$('scaleStatus').textContent='Riproduzione interrotta';}
  }
  function schedulePlayback(a,beat,from=0){
    const begin=a.currentTime+0.075-from*beat;
    const voices=notes.slice(from).map((note,i)=>voice(a,note.midi,begin+(i+from)*beat,beat*0.91));
    playing={voices,begin,beat,length:notes.length};pausedAt=null;
    state='playing';position=-1;
    $('playScale').textContent='↻ Riascolta';$('pauseScale').textContent='⏸ Pausa';$('pauseScale').disabled=false;
    $('scaleStatus').textContent='In riproduzione';
    cancelAnimationFrame(raf);tick();
  }
  async function startPlayback(){
    stop(true);
    try{
      const a=context();await a.resume();
      if(!notes.length)renderScale();
      schedulePlayback(a,60/Number($('tempo').value));
    }catch(err){stop();$('scaleStatus').textContent='Audio non disponibile: '+err.message;}
  }
  function tick(){
    if(!playing||state!=='playing'||!ctx)return;
    const p=playing,elapsed=ctx.currentTime-p.begin;
    const frac=Math.max(0,Math.min(1,elapsed/(p.beat*p.length)));
    const i=Math.max(0,Math.min(notes.length-1,Math.floor(Math.max(0,elapsed)/p.beat)));
    updateCursor(frac,elapsed<0?-1:i);
    if(elapsed>=p.beat*p.length){
      updateCursor(1,notes.length-1);playing=null;state='done';
      $('pauseScale').disabled=true;$('playScale').textContent='▶ Riascolta la scala';
      $('scaleStatus').textContent='Ascolto completato';return;
    }
    raf=requestAnimationFrame(tick);
  }
  function togglePause(){
    if(state==='playing'&&playing){
      // Stopping scheduled oscillators avoids AudioContext.suspend quirks on mobile browsers.
      const p=playing,elapsed=ctx.currentTime-p.begin;
      pausedAt={beat:p.beat,index:Math.min(notes.length-1,Math.max(0,Math.floor(Math.max(0,elapsed)/p.beat)))};
      silence(p.voices);playing=null;cancelAnimationFrame(raf);raf=0;
      state='paused';$('pauseScale').textContent='▶ Riprendi';$('scaleStatus').textContent='In pausa';
    }else if(state==='paused'&&pausedAt){
      const paused=pausedAt;
      // Resume from the beginning of the currently highlighted note.
      schedulePlayback(ctx,paused.beat,paused.index);
    }
  }
  async function singleNote(index){
    stop(true);
    try{
      const a=context();await a.resume();
      isolatedVoices=[voice(a,notes[index].midi,a.currentTime+0.015,0.65)];
      updateCursor(index/(notes.length-1),index);
      $('scaleStatus').textContent='Nota singola: '+notes[index].label;
    }catch(err){$('scaleStatus').textContent='Audio non disponibile: '+err.message;}
  }
  function saveSettings(){
    try{localStorage.setItem('tonality-scale-v2',JSON.stringify({type:selectedType(),variant:variant(),tempo:$('tempo').value,timbre:$('timbre').value}));}catch{}
  }
  function setKeySelect(k){$('studyKeySelect').value=String(app.keys.indexOf(k));}
  function onStudyChange(e){studyKey=e.detail.key;setKeySelect(studyKey);renderScale();}
  function fillKeys(){
    for(const [i,k] of app.keys.entries()){
      const label=k.major+' maggiore / '+k.minor+' minore';
      const option=document.createElement('option');option.value=String(i);option.textContent=label;
      $('studyKeySelect').append(option);
    }
    setKeySelect(studyKey);
    $('studyKeySelect').onchange=()=>{
      const idx=Number($('studyKeySelect').value);
      // Simulate existing study table selection, preserving the same source of truth.
      const row=$('table').children[idx];if(row)row.click();
    };
  }
  function init(){
    fillKeys();
    try{
      const v=JSON.parse(localStorage.getItem('tonality-scale-v2'));
      if(v){for(const id of ['type','variant','timbre']){
        const element=$({type:'scaleType',variant:'minorVariant',timbre:'timbre'}[id]);
        if(element&&Array.from(element.options).some(o=>o.value===v[id]))element.value=v[id];
      }
      if(Number(v.tempo)>=50&&Number(v.tempo)<=170)$('tempo').value=String(v.tempo);}
    }catch{}
    $('tempoValue').textContent=$('tempo').value+' BPM';
    $('scaleType').addEventListener('change',()=>{renderScale();saveSettings();});
    $('minorVariant').addEventListener('change',()=>{renderScale();saveSettings();});
    $('timbre').addEventListener('change',()=>{stop();saveSettings();});
    $('tempo').addEventListener('input',()=>{$('tempoValue').textContent=$('tempo').value+' BPM';saveSettings();});
    $('tempo').addEventListener('change',()=>{if(playing)stop();});
    $('playScale').addEventListener('click',startPlayback);
    $('pauseScale').addEventListener('click',togglePause);
    $('stopScale').addEventListener('click',()=>stop());
    window.addEventListener('tonality:study',onStudyChange);
    window.addEventListener('tonality:tab',e=>{if(!e.detail.learn)stop(true);});
    window.addEventListener('pagehide',()=>stop(true));
    document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state==='playing'&&!raf)tick();});
    renderScale();
  }
  init();
  // Expose only musical generation for repeatable automated tests, not user data.
  window.TonalityScaleTest={makeScale,parseName,sigAlterations,intervals};
})();
