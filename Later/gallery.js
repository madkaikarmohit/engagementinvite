(() => {
 const cards=[...document.querySelectorAll('.photo-card')],box=document.getElementById('lightbox'),img=box.querySelector('img'),count=box.querySelector('.lightbox-count');let current=0;
 function show(i){current=(i+cards.length)%cards.length;img.src=cards[current].dataset.full;img.alt=cards[current].querySelector('img').alt;count.textContent=`${current+1} / ${cards.length}`;box.classList.add('open');box.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}
 function close(){box.classList.remove('open');box.setAttribute('aria-hidden','true');document.body.style.overflow='';img.src='';}
 cards.forEach((card,i)=>card.addEventListener('click',()=>show(i)));box.querySelector('.close').addEventListener('click',close);box.querySelector('.prev').addEventListener('click',()=>show(current-1));box.querySelector('.next').addEventListener('click',()=>show(current+1));box.addEventListener('click',e=>{if(e.target===box)close();});document.addEventListener('keydown',e=>{if(!box.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(current-1);if(e.key==='ArrowRight')show(current+1);});
})();
