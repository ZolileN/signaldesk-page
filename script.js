// Animated signal particle canvas
(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const N = 60;
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  for(let i=0;i<N;i++){
    particles.push({
      x: Math.random()*window.innerWidth,
      y: Math.random()*window.innerHeight,
      vx: (Math.random()-.5)*.3,
      vy: (Math.random()-.5)*.3,
      r: Math.random()*1.8+.4,
      gold: Math.random()>.5
    });
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = p.gold ? '#8D7240' : '#6A5730';
      ctx.fill();
    });
    particles.forEach((a,i)=>{
      particles.slice(i+1).forEach(b=>{
        const dx=a.x-b.x, dy=a.y-b.y, d=Math.sqrt(dx*dx+dy*dy);
        if(d<120){
          ctx.beginPath();
          ctx.strokeStyle = a.gold ? `rgba(141,114,64,${.15*(1-d/120)})` : `rgba(106,87,48,${.12*(1-d/120)})`;
          ctx.lineWidth=.5;
          ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      });
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
},{threshold:.12});
reveals.forEach(r=>io.observe(r));

// Set current year
const yearEl = document.getElementById('currentYear');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Pricing tabs
function switchPricing(panel, btn){
  document.querySelectorAll('.pricing-panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ptab').forEach(b=>{ b.classList.remove('active-gold','active-accent'); });
  const target = document.getElementById('panel-'+panel);
  if(target) target.classList.add('active');
  if(btn) btn.classList.add(panel==='pro'?'active-gold':'active-accent');
  if(window.posthog) posthog.capture('pricing_tab_switched', { tab: panel });
}

// PostHog event tracking
(function(){
  // Nav buttons
  var navCta = document.querySelector('.nav-cta');
  if(navCta){
    var navSignin = navCta.querySelector('.btn-ghost');
    var navTrial = navCta.querySelector('.btn-gold');
    if(navSignin) navSignin.addEventListener('click', function(){
      if(window.posthog) posthog.capture('nav_signin_clicked');
    });
    if(navTrial) navTrial.addEventListener('click', function(){
      if(window.posthog) posthog.capture('nav_trial_clicked');
    });
  }

  // Hero CTA buttons
  var heroCtas = document.querySelector('.hero-ctas');
  if(heroCtas){
    heroCtas.querySelectorAll('button').forEach(function(btn){
      btn.addEventListener('click', function(){
        if(window.posthog) posthog.capture('hero_cta_clicked', { button_text: btn.textContent.trim() });
      });
    });
  }

  // Platform card CTA buttons
  var proCard = document.querySelector('.platform-card.pro');
  if(proCard){
    var proBtn = proCard.querySelector('button');
    if(proBtn) proBtn.addEventListener('click', function(){
      if(window.posthog) posthog.capture('platform_cta_clicked', { platform: 'pro', button_text: proBtn.textContent.trim() });
    });
  }
  var creatorCard = document.querySelector('.platform-card.creator');
  if(creatorCard){
    var creatorBtn = creatorCard.querySelector('button');
    if(creatorBtn) creatorBtn.addEventListener('click', function(){
      if(window.posthog) posthog.capture('platform_cta_clicked', { platform: 'creator', button_text: creatorBtn.textContent.trim() });
    });
  }

  // Pricing plan buttons
  var pricingPanels = document.querySelectorAll('.pricing-panel');
  pricingPanels.forEach(function(panel){
    var panelId = panel.id === 'panel-pro' ? 'pro' : 'creator';
    panel.querySelectorAll('.price-card button').forEach(function(btn){
      btn.addEventListener('click', function(){
        var planEl = btn.closest('.price-card').querySelector('.price-plan');
        var plan = planEl ? planEl.textContent.trim() : '';
        if(window.posthog) posthog.capture('pricing_plan_selected', {
          platform: panelId,
          plan: plan,
          button_text: btn.textContent.trim()
        });
      });
    });
  });

  // Bottom CTA section buttons
  var ctaDouble = document.querySelector('.cta-double');
  if(ctaDouble){
    var ctaProBtn = ctaDouble.querySelector('.cta-pro button');
    var ctaCreBtn = ctaDouble.querySelector('.cta-cre button');
    if(ctaProBtn) ctaProBtn.addEventListener('click', function(){
      if(window.posthog) posthog.capture('cta_section_clicked', { platform: 'pro', button_text: ctaProBtn.textContent.trim() });
    });
    if(ctaCreBtn) ctaCreBtn.addEventListener('click', function(){
      if(window.posthog) posthog.capture('cta_section_clicked', { platform: 'creator', button_text: ctaCreBtn.textContent.trim() });
    });
  }

  // Waitlist form submission
  var subForm = document.querySelector('.sub-form');
  if(subForm){
    subForm.addEventListener('submit', function(){
      if(window.posthog) posthog.capture('waitlist_form_submitted');
    });
  }
})();
