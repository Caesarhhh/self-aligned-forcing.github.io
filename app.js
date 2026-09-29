'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const icons = {
 play: '<path d="m6 3 10 7-10 7Z"/>', pause: '<path d="M6 3v14M14 3v14"/>',
 reset: '<path d="M3 8a7 7 0 1 1 1 7M3 3v5h5"/>',
 film: '<rect x="2" y="3" width="16" height="14" rx="2"/><path d="M6 3v14M14 3v14M2 7h4m-4 6h4m8-6h4m-4 6h4"/>',
 paper: '<path d="M5 2h7l4 4v12H5Z M12 2v5h4M8 11h5m-5 3h5"/>',
 code: '<path d="m7 5-5 5 5 5m6-10 5 5-5 5M11 3l-2 14"/>',
 model: '<path d="m10 2 8 4v8l-8 4-8-4V6Zm0 8 8-4M10 10 2 6m8 4v8"/>'
};
const svg = name => `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Escape all prompt text; only explicitly marked motion spans become bold.
function renderPrompt(prompt) {
 const text=prompt.text;
 const mark=phrases=>{const spans=[];for(const phrase of phrases||[]){if(!phrase)continue;let start=0;while((start=text.indexOf(phrase,start))!==-1){spans.push([start,start+phrase.length]);start+=phrase.length;}}return spans;};
 const bold=mark(prompt.emphasis),underline=mark(prompt.underline);
 const boundaries=[...new Set([0,text.length,...bold.flat(),...underline.flat()])].sort((a,b)=>a-b);
 let html='';
 for(let i=0;i<boundaries.length-1;i++){
  const start=boundaries[i],end=boundaries[i+1];let fragment=escapeHTML(text.slice(start,end));
  if(underline.some(([a,b])=>a<=start&&b>=end))fragment='<u>'+fragment+'</u>';
  if(bold.some(([a,b])=>a<=start&&b>=end))fragment='<strong>'+fragment+'</strong>';
  html+=fragment;
 }
 return html;
}
const displayDuration = section => section === 'long' ? 100 : 60;
const formatTime = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const content = window.SDF_CONTENT;
$('#authors').innerHTML = content.authors.map(a => `${a.url ? `<a href="${escapeHTML(a.url)}" target="_blank" rel="noopener">` : '<span>'}${escapeHTML(a.name)}${a.affiliation ? `<sup>${escapeHTML(a.affiliation)}</sup>` : ''}${a.url ? '</a>' : '</span>'}`).join('');
$('#affiliations').textContent = content.affiliations;
$('#tldr-text').textContent = content.tldr;
$('#citation').textContent = content.bibtex;
$('#paper-links').innerHTML = Object.entries(content.links).map(([label, url]) => {
 const inner = `${svg({Paper:'paper',Code:'code',Models:'model'}[label] || 'paper')}${escapeHTML(label)}${url ? '' : `<small>${label === 'Code' ? 'Coming soon' : 'Soon'}</small>`}`;
 return url ? `<a class="paper-link available" href="${escapeHTML(url)}" target="_blank" rel="noopener">${inner}</a>` : `<span class="paper-link unavailable" aria-label="${label}, coming soon">${inner}</span>`;
}).join('') + `<a class="paper-link" href="#bibtex">${svg('paper')}BibTeX</a>`;

const groups = [];
let active = null;
const resident = [];
const speed = {long:2,interactive:1};
function activate(group) {
 if (active && active !== group) active.pause();
 active = group;
 const old = resident.indexOf(group);
 if (old >= 0) resident.splice(old, 1);
 resident.push(group);
 while (resident.length > 2) resident.shift().unload();
}
function renderGroup(config, section, parent) {
 const article = document.createElement('article');
 article.className = 'comparison'; article.id = config.id;
 article.setAttribute('aria-labelledby', `${config.id}-heading`);
 article.innerHTML = `<div class="group-heading"><div class="group-title"><h3 id="${config.id}-heading">${escapeHTML(config.title)}</h3></div><span class="duration-tag">${displayDuration(section)} s · ${config.videos.length} methods</span></div>
 <div class="video-grid ${config.videos.length === 3 ? 'three' : ''}" style="--columns:${config.videos.length}">${config.videos.map(v => `<figure class="video-cell ${v.ours ? 'ours' : ''}"><figcaption class="method-caption"><span class="video-label">${escapeHTML(v.label)}</span><strong class="method-fps">FPS: ${escapeHTML(v.fps ?? 'XXX')}</strong><span class="method-fps-note">${escapeHTML(v.fpsNote || '')}</span></figcaption><div class="video-stage"><div class="placeholder">${svg('film')}<span>${v.src ? 'Ready to load' : 'Video coming soon'}</span><small>${displayDuration(section)} s video</small></div><video controls muted playsinline preload="none" ${v.poster ? `data-poster="${escapeHTML(v.poster)}"` : ''} aria-label="${escapeHTML(v.label)} — ${escapeHTML(config.title)}"></video><button class="solo-play" aria-label="Load and play ${escapeHTML(v.label)}" ${v.src ? '' : 'hidden'}>${svg('play')}</button></div></figure>`).join('')}</div>
 <div class="controls" role="group" aria-label="Synchronized controls for ${escapeHTML(config.title)}"><button class="control-button play" aria-label="Play all videos in this group">${svg('play')}<span>Play</span></button><button class="control-button pause" aria-label="Pause all videos in this group">${svg('pause')}Pause</button><button class="control-button restart" aria-label="Restart all videos from the beginning">${svg('reset')}Restart</button><input class="seek" type="range" min="0" max="${config.duration}" step="0.05" value="0" aria-label="Seek all videos in this group"><span class="time">0:00 / ${formatTime(displayDuration(section))}</span></div>
 <p class="status" role="status">${config.videos.every(v => !v.src) ? 'Videos coming soon · controls preview the timeline.' : 'Play to load this comparison.'}</p>
 ${config.prompts.length > 1 ? `<div class="prompt-tabs" role="group" aria-label="Prompt segments">${config.prompts.map((p,i) => `<button class="prompt-tab" data-index="${i}" aria-pressed="${i===0}" aria-label="Prompt ${i+1}, ${p.start} to ${p.end} seconds">P${i+1}<span>${formatTime(Math.round(p.start))}–${formatTime(Math.round(p.end))}</span></button>`).join('')}</div>` : ''}
 <div class="prompt-panel"><span class="prompt-label">PROMPT${config.prompts.length > 1 ? ' 01' : ''}</span><div class="prompt-content"><p class="prompt-text" id="${config.id}-prompt"></p>${section === 'long' ? `<button class="prompt-toggle" aria-expanded="false" aria-controls="${config.id}-prompt" hidden>Read full prompt</button>` : ''}</div>${section === 'long' ? '' : '<span class="prompt-clock"></span>'}</div>
 ${config.prompts.length > 1 ? `<details class="all-prompts"><summary>View all 6 prompts</summary><ol>${config.prompts.map(p => `<li><time>${formatTime(Math.round(p.start))}–${formatTime(Math.round(p.end))}</time>${renderPrompt(p)}</li>`).join('')}</ol></details>` : ''}`;
 parent.append(article);
 const group = new Comparison(config, section, article);
 groups.push(group);
 return group;
}
class Comparison {
 constructor(config, section, el) {
  this.config=config; this.section=section; this.el=el; this.videos=$$('video',el);
  this.time=0; this.rate=speed[section]; this.playing=false; this.desired=false;
  this.loaded=false; this.token=0; this.frame=0; this.controller=null; this.pendingSeek=false; this.independent=false;
  this.placeholder=config.videos.every(v=>!v.src);
  this.partial=!this.placeholder && config.videos.some(v=>!v.src);
  this.status=$('.status',el); this.seekInput=$('.seek',el);
  const promptToggle=$('.prompt-toggle',el);
  if(promptToggle){
   const promptContent=$('.prompt-content',el),promptText=$('.prompt-text',el);
   promptToggle.addEventListener('click',()=>{
    const expanded=promptContent.classList.toggle('expanded');
    promptToggle.setAttribute('aria-expanded',String(expanded));
    promptToggle.textContent=expanded?'Show less':'Read full prompt';
   });
   new ResizeObserver(()=>{
    if(!promptContent.classList.contains('expanded'))promptToggle.hidden=promptText.scrollHeight<=promptText.clientHeight+2;
   }).observe(promptText);
  }
  $('.play',el).addEventListener('click',()=>this.start());
  $('.pause',el).addEventListener('click',()=>this.pause());
  $('.restart',el).addEventListener('click',()=>this.seekTo(0,true));
  this.seekInput.addEventListener('input',e=>this.seekTo(Number(e.target.value),this.desired));
  $$('.prompt-tab',el).forEach(b=>b.addEventListener('click',()=>{this.selectedPrompt=Number(b.dataset.index);this.update();}));
  $$('.solo-play',el).forEach((b,i)=>b.addEventListener('click',()=>this.playSolo(i)));
  this.videos.forEach((v,i)=>{
   const nativeInteraction=()=>{if(!this.independent){this.pause();this.independent=true;}this.soloIndex=i;};
   v.addEventListener('pointerdown',nativeInteraction);
   v.addEventListener('keydown',e=>{if([' ','Enter','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))nativeInteraction();});
   v.addEventListener('loadeddata',()=>{$$('.solo-play',el)[i].hidden=true;});
   v.addEventListener('play',()=>{$$('.solo-play',el)[i].hidden=true;if(this.independent){activate(this);this.soloIndex=i;this.message(`Independent playback · prompt follows ${this.config.videos[i].label}. Use Play to synchronize the group.`);}});
   v.addEventListener('timeupdate',()=>{if(this.independent&&this.soloIndex===i){this.time=Math.min(v.currentTime,this.config.duration);this.update();}});
   v.addEventListener('error',()=>{if(this.loaded){this.pause();this.message('A video could not load. Check the media file, then press Play to retry.',true);this.loaded=false;}});
   v.addEventListener('ended',()=>{if(this.desired)this.complete();});
   v.addEventListener('waiting',()=>{if(this.playing&&this.desired)this.buffer();});
  });
  this.update();
 }
 message(text,error=false){this.status.textContent=text;this.status.classList.toggle('error',error);}
 async ready(video,signal){
  if(video.readyState>=3&&!video.seeking)return;
  await new Promise((resolve,reject)=>{
   const cleanup=()=>{clearTimeout(timer);['canplay','seeked','loadeddata','progress'].forEach(e=>video.removeEventListener(e,check));video.removeEventListener('error',fail);signal.removeEventListener('abort',abort);};
   const check=()=>{if(video.readyState>=3&&!video.seeking){cleanup();resolve();}};
   const fail=()=>{cleanup();reject(new Error('Media failed'));};
   const abort=()=>{cleanup();reject(new DOMException('Cancelled','AbortError'));};
   const timer=setTimeout(()=>{cleanup();reject(new Error('Media timeout'));},25000);
   ['canplay','seeked','loadeddata','progress'].forEach(e=>video.addEventListener(e,check));video.addEventListener('error',fail);signal.addEventListener('abort',abort,{once:true});
   if(signal.aborted)abort();else check();
  });
 }
 async playSolo(index){
  activate(this);
  if(!this.independent){this.pause();this.independent=true;}
  const video=this.videos[index], source=this.config.videos[index].src;
  if(!source)return;
  this.soloIndex=index;
  this.videos.forEach(v=>v.controls=true);
  if(!video.paused){video.pause();return;}
  if(!video.hasAttribute('src')){video.src=source;video.preload='auto';video.load();}
  video.playbackRate=this.rate;
  const token=this.token;
  try{await video.play();if(token!==this.token&&!this.desired)video.pause();}
  catch(e){if(e.name!=='AbortError')this.message('Unable to play this video. Check the file and try again.',true);}
 }
 async start(){
  this.selectedPrompt=null;
  if(this.playing)return;
  activate(this);
  if(this.independent){this.pause();this.independent=false;}
  this.videos.forEach(v=>v.controls=true);
  if(this.partial){this.message('This comparison is incomplete. Add every method’s video to enable synchronized playback.',true);return;}
  this.controller?.abort(); this.controller=new AbortController();
  const signal=this.controller.signal,token=++this.token;
  this.desired=true;
  if(this.time>=this.config.duration-.05)this.time=0;
  if(this.placeholder){this.playing=true;this.message('Previewing timing only · videos coming soon.');this.last=performance.now();this.update();this.tick();return;}
  this.message('Loading this comparison…');
  try{
   if(!this.loaded){
    this.loaded=true;
    this.videos.forEach((v,i)=>{if(!v.hasAttribute('src')||v.error){v.src=this.config.videos[i].src;v.preload='auto';v.muted=true;v.load();}});
   }
   await Promise.all(this.videos.map(v=>this.ready(v,signal)));
   if(token!==this.token||!this.desired)return;
   const shortest=Math.min(...this.videos.map(v=>v.duration));
   if(Number.isFinite(shortest)&&shortest+0.3<this.config.duration)throw new Error('Video duration is shorter than the configured comparison.');
   this.videos.forEach(v=>{v.playbackRate=this.rate;if(Math.abs(v.currentTime-this.time)>.04)v.currentTime=this.time;});
   await Promise.all(this.videos.map(v=>this.ready(v,signal)));
   if(token!==this.token||!this.desired)return;
   await Promise.all(this.videos.map(v=>v.play()));
   if(token!==this.token||!this.desired){if(!this.desired)this.videos.forEach(v=>v.pause());return;}
   this.playing=true;this.message(`Playing together · ${this.rate}×`);this.update();this.tick();
  }catch(e){
   if(e.name==='AbortError'||token!==this.token)return;
   this.pause();this.loaded=false;
   this.message(e.message.includes('duration')?e.message:'Unable to play this comparison. Check the media files and press Play to retry.',true);
  }
 }
 pause(){
  this.desired=false;this.playing=false;this.token++;this.controller?.abort();
  cancelAnimationFrame(this.frame);this.videos.forEach(v=>v.pause());
  this.message(this.placeholder?'Videos coming soon · controls preview the timeline.':'Paused · use Play to synchronize the group.');
  this.update();
 }
 buffer(){
  if(!this.playing)return;
  this.playing=false;cancelAnimationFrame(this.frame);
  this.videos.forEach(v=>v.pause());
  this.message('Buffering · waiting for all methods.');
  this.start();
 }
 seekTo(time,resume=false){
  this.selectedPrompt=null;
  this.pause();this.time=Math.max(0,Math.min(time,this.config.duration));this.pendingSeek=true;
  this.videos.forEach(v=>{if(v.readyState>=1)v.currentTime=this.time;});
  this.update();if(resume)this.start();
 }
 tick(){
  cancelAnimationFrame(this.frame);
  if(!this.playing)return;
  const now=performance.now();
  if(this.placeholder){this.time+=(now-this.last)/1000*this.rate;this.last=now;}
  else{
   this.time=this.videos[0].currentTime;
   for(const v of this.videos.slice(1))if(Math.abs(v.currentTime-this.time)>.18){v.currentTime=this.time;this.buffer();return;}
  }
  if(this.time>=this.config.duration){this.complete();return;}
  this.update();this.frame=requestAnimationFrame(()=>this.tick());
 }
 complete(){
  if(!this.desired)return;
  this.time=this.config.duration;this.pause();this.update();
  this.onComplete?.();
 }
 update(){
  this.seekInput.value=this.time;
  $('.time',this.el).textContent=`${formatTime(this.time>=this.config.duration-.05?displayDuration(this.section):this.time)} / ${formatTime(displayDuration(this.section))}`;
  $('.play',this.el).disabled=this.playing;
  const index=this.selectedPrompt ?? Math.max(0,this.config.prompts.findLastIndex(p=>this.time>=p.start));
  const prompt=this.config.prompts[index];
  if(this.promptIndex!==index){
   this.promptIndex=index;
   $('.prompt-text',this.el).innerHTML=renderPrompt(prompt);
   $('.prompt-label',this.el).textContent=`PROMPT${this.config.prompts.length>1?' '+String(index+1).padStart(2,'0'):''}`;
   const clock=$('.prompt-clock',this.el);
   if(clock)clock.textContent=`${formatTime(prompt.start)}–${formatTime(prompt.end)}`;
   $$('.prompt-tab',this.el).forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
  }
 }
 setRate(rate){this.rate=rate;this.videos.forEach(v=>v.playbackRate=rate);if(this.playing&&!this.placeholder)this.message(`Playing together · ${rate}×`);}
 unload(){this.pause();this.videos.forEach(v=>{v.removeAttribute('src');v.preload='none';v.load();});this.loaded=false;$$('.solo-play',this.el).forEach((b,i)=>b.hidden=!this.config.videos[i].src);}
}
for(const section of ['long','interactive']){
 const parent=$(`#${section}-groups`);
 for(const family of [...new Set(content[section].map(c=>c.family))]){
  const configs=content[section].filter(c=>c.family===family);
  const carousel=document.createElement('div');carousel.className='example-carousel';
  carousel.setAttribute('role','region');carousel.setAttribute('aria-roledescription','carousel');
  carousel.setAttribute('aria-label',`${section} ${family} examples`);
  carousel.innerHTML=`<div class="carousel-heading"><h3 class="family-heading">${family} generation</h3></div><div class="carousel-stage"><button class="example-prev carousel-arrow" aria-label="Previous ${family} example"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6"/></svg></button><div class="example-track" tabindex="0" aria-label="${family} examples; scroll horizontally or use arrow keys"></div><button class="example-next carousel-arrow" aria-label="Next ${family} example"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6"/></svg></button></div><div class="carousel-dots" role="group" aria-label="Choose ${family} example">${configs.map((c,i)=>`<button class="carousel-dot" data-index="${i}" aria-label="Show ${c.title}" aria-pressed="${i===0}"><span></span></button>`).join('')}</div>`;
  parent.append(carousel);
  const track=$('.example-track',carousel);
  const familyGroups=configs.map(c=>renderGroup(c,section,track));
  const cards=$$('.comparison',track);let current=0,pending=null,advanceTimer=null;
  function cancelAdvance(){clearTimeout(advanceTimer);advanceTimer=null;}
  function updateNavigation(){
   const left=track.getBoundingClientRect().left;
   let nearest=0,distance=Infinity;
   cards.forEach((card,i)=>{const d=Math.abs(card.getBoundingClientRect().left-left);if(d<distance){distance=d;nearest=i;}});
   if(nearest!==current)familyGroups.filter((g,i)=>i!==nearest).forEach(g=>g.pause());
   current=nearest;
   $$('.carousel-dot',carousel).forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
   if(pending&&current===pending.index&&distance<3){
    const job=pending;pending=null;
    const rect=track.getBoundingClientRect();
    if(!document.hidden&&active===job.origin&&rect.bottom>0&&rect.top<innerHeight){
     familyGroups[job.index].seekTo(0,true);
    }
   }
  }
  function show(index,autoplay=familyGroups.some(g=>g.desired)){
   cancelAdvance();
   index=(index+cards.length)%cards.length;
   pending=autoplay?{index,origin:active}:null;
   familyGroups.forEach(g=>g.pause());
   const left=cards[index].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft;
   track.scrollTo({left,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
   updateNavigation();
  }
  familyGroups.forEach((g,i)=>g.onComplete=()=>{
   cancelAdvance();
   const token=g.token;
   advanceTimer=setTimeout(()=>{
    advanceTimer=null;
    const rect=track.getBoundingClientRect();
    if(current===i&&active===g&&g.token===token&&!document.hidden&&rect.bottom>0&&rect.top<innerHeight){
     show(i+1,true);
    }
   },1000);
  });
  $$('.carousel-dot',carousel).forEach(dot=>dot.addEventListener('click',()=>show(Number(dot.dataset.index))));
  $('.example-prev',carousel).addEventListener('click',()=>show(current-1));
  $('.example-next',carousel).addEventListener('click',()=>show(current+1));
  track.addEventListener('keydown',e=>{if(e.target!==track)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1));}});
  track.addEventListener('pointerdown',()=>{pending=null;cancelAdvance();});
  track.addEventListener('wheel',()=>{pending=null;cancelAdvance();},{passive:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){pending=null;cancelAdvance();}});
  track.addEventListener('scroll',updateNavigation,{passive:true});
  updateNavigation();
 }
}
$$('.speed-control').forEach(control=>control.addEventListener('click',e=>{
 const button=e.target.closest('button[data-rate]');if(!button)return;
 const section=control.dataset.section;speed[section]=Number(button.dataset.rate);
 $$('button',control).forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 groups.filter(g=>g.section===section).forEach(g=>g.setRate(speed[section]));
}));
// No video URL is attached on first render. Posters only load near the viewport.
const observer=new IntersectionObserver(entries=>{
 for(const entry of entries){
  const group=groups.find(g=>g.el===entry.target);
  if(entry.isIntersecting){group.videos.forEach(v=>{if(v.dataset.poster&&!v.poster)v.poster=v.dataset.poster;});}
  else if(group.desired||group.videos.some(v=>!v.paused))group.pause();
 }
},{rootMargin:'160px 0px',threshold:0});
groups.forEach(g=>observer.observe(g.el));
document.addEventListener('visibilitychange',()=>{if(document.hidden)groups.forEach(g=>{if(g.desired||g.videos.some(v=>!v.paused))g.pause();});});
$('#copy-bibtex').addEventListener('click',async()=>{
 const button=$('#copy-bibtex');
 try{await navigator.clipboard.writeText(content.bibtex);button.textContent='Copied';}
 catch{const selection=window.getSelection(),range=document.createRange();range.selectNodeContents($('#citation'));selection.removeAllRanges();selection.addRange(range);button.textContent='Selected — copy with ⌘/Ctrl+C';}
 setTimeout(()=>button.textContent='Copy BibTeX',2500);
});
