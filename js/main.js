(function(){
  /* Hora de Mérida (UTC−6, sin horario de verano) */
  var TZ_OFFSET = -6;
  function meridaNow(){ var n=new Date(); return new Date(n.getTime()+n.getTimezoneOffset()*60000+TZ_OFFSET*3600000); }
  var START = Date.UTC(2026,10,17,15,30,0); // 17 nov 2026 09:30 en Mérida
  var END   = Date.UTC(2026,10,19,20,0,0);  // 19 nov 2026 14:00 en Mérida

  /* Nav: fondo al hacer scroll + menú móvil */
  var nav=document.getElementById('nav'), toggle=document.getElementById('navToggle');
  function onScroll(){ nav.classList.toggle('is-scrolled', window.scrollY>40); }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  toggle.addEventListener('click', function(){
    var open=nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('#navLinks a').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); });
  });

  /* Scrollspy */
  var links=[].slice.call(document.querySelectorAll('.nav__links a:not(.nav__cta)'));
  if('IntersectionObserver' in window){
    var spy=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          links.forEach(function(l){ l.classList.toggle('is-active', l.getAttribute('href')==='#'+e.target.id); });
        }
      });
    },{rootMargin:'-45% 0px -50% 0px'});
    ['evento','temas','programa','ponentes','sedes','comites'].forEach(function(id){ var el=document.getElementById(id); if(el) spy.observe(el); });

    /* Reveal al hacer scroll */
    var rev=new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('is-in'); rev.unobserve(e.target); } });
    },{threshold:.12});
    document.querySelectorAll('.reveal').forEach(function(el){ rev.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('is-in'); });
  }

  /* Cuenta regresiva */
  var cd=document.getElementById('countdown'), msg=document.getElementById('countdownMsg');
  function pad(n){ return (n<10?'0':'')+n; }
  function tick(){
    var now=Date.now(), diff=START-now;
    if(diff<=0){
      cd.classList.add('is-live');
      msg.textContent = now<END ? '● Las Jornadas están en curso' : 'Gracias por acompañarnos en la XVII edición';
      return false;
    }
    var s=Math.floor(diff/1000);
    cd.querySelector('[data-cd="d"]').textContent=Math.floor(s/86400);
    cd.querySelector('[data-cd="h"]').textContent=pad(Math.floor(s%86400/3600));
    cd.querySelector('[data-cd="m"]').textContent=pad(Math.floor(s%3600/60));
    cd.querySelector('[data-cd="s"]').textContent=pad(s%60);
    return true;
  }
  if(tick()){ var t=setInterval(function(){ if(!tick()) clearInterval(t); },1000); }

  /* Pestañas del programa (accesibles con teclado) */
  var tabs=[].slice.call(document.querySelectorAll('.tab'));
  function selectTab(tab, focus){
    tabs.forEach(function(t){
      var on=t===tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on?0:-1;
      document.getElementById(t.getAttribute('aria-controls')).hidden=!on;
    });
    if(focus) tab.focus();
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click', function(){ selectTab(t); });
    t.addEventListener('keydown', function(e){
      var k=e.key, j=null;
      if(k==='ArrowRight'||k==='ArrowDown') j=(i+1)%tabs.length;
      if(k==='ArrowLeft'||k==='ArrowUp') j=(i-1+tabs.length)%tabs.length;
      if(k==='Home') j=0; if(k==='End') j=tabs.length-1;
      if(j!==null){ e.preventDefault(); selectTab(tabs[j], true); }
    });
  });

  /* Durante el evento: abrir el día actual y resaltar la actividad en curso */
  function markLive(){
    var m=meridaNow();
    var today=m.getFullYear()+'-'+pad(m.getMonth()+1)+'-'+pad(m.getDate());
    var mins=m.getHours()*60+m.getMinutes();
    document.querySelectorAll('.slot.is-now').forEach(function(s){ s.classList.remove('is-now'); });
    tabs.forEach(function(t){
      var isToday=t.dataset.date===today;
      t.classList.toggle('is-today', isToday);
      if(!isToday) return;
      var panel=document.getElementById(t.getAttribute('aria-controls'));
      panel.querySelectorAll('.slot[data-start]').forEach(function(s){
        var a=s.dataset.start.split(':'), b=s.dataset.end.split(':');
        var st=+a[0]*60+ +a[1], en=+b[0]*60+ +b[1];
        if(mins>=st && mins<en && !s.classList.contains('slot--break')) s.classList.add('is-now');
      });
    });
  }
  markLive();
  var todayTab=document.querySelector('.tab.is-today'); if(todayTab) selectTab(todayTab);
  setInterval(markLive, 60000);

  /* Enlace a Google Calendar */
  var gcal='https://calendar.google.com/calendar/render?action=TEMPLATE'
    +'&text='+encodeURIComponent('XVII Jornadas Internacionales del Concreto Armado')
    +'&dates=20261117T150000Z/20261119T200000Z'
    +'&details='+encodeURIComponent('Obras de concreto: daños, resiliencia, sustentabilidad y economía circular. Modalidad híbrida, entrada gratuita. Sedes: Facultad de Ingeniería UADY (17 nov), Cinvestav Mérida (18 nov), Puerto de Altura de Progreso (19 nov). Actividades con cupo limitado en el Colegio de Ingenieros Civiles de Yucatán A.C.')
    +'&location='+encodeURIComponent('Mérida y Progreso, Yucatán, México');
  ['gcalHero','gcalProgram','gcalCta'].forEach(function(id){ var a=document.getElementById(id); if(a) a.href=gcal; });
})();
