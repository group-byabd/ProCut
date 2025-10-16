// Reveal on scroll
function revealOnScroll(){
  const els = document.querySelectorAll('.fade-in');
  const threshold = 80;
  const y = window.scrollY + window.innerHeight - threshold;
  els.forEach(el => {
    const top = el.getBoundingClientRect().top + window.scrollY;
    if(top < y) el.classList.add('show');
  });
}
document.addEventListener('scroll', revealOnScroll);
document.addEventListener('DOMContentLoaded', revealOnScroll);

// Page transition (loader cinématique léger)
const overlay = (() => {
  const el = document.createElement('div');
  el.className = 'page-transition';
  document.body.appendChild(el);
  return el;
})();

function transitionTo(url){
  overlay.classList.add('active');
  setTimeout(() => { window.location.href = url; }, 250);
}

// Theme toggle
function setTheme(mode){
  const root = document.documentElement;
  if(mode === 'light'){ root.classList.add('light'); localStorage.setItem('theme','light'); }
  else { root.classList.remove('light'); localStorage.setItem('theme','dark'); }
}
(function initTheme(){
  const pref = localStorage.getItem('theme');
  if(pref === 'light') document.documentElement.classList.add('light');
})();

// Expose toggle for button
window.toggleTheme = () => {
  const isLight = document.documentElement.classList.contains('light');
  setTheme(isLight ? 'dark' : 'light');
};

// Nav active handling (adds active underline when navigating via transition)
(function markActive(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path) a.classList.add('active');
  });
})();

// Payment routing + hydrate payment page
function goToPayment(plan){
  transitionTo("payment.html?plan=" + plan);
}
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  const label = document.getElementById('selected-plan');
  const price = document.getElementById('plan-price');
  const summary = document.getElementById('plan-summary');
  if(label){
    let text='Sélectionnez une formule', range='', points='';
    switch(plan){
      case 'premium':
        text='EasyOs Premium'; range='40–60€';
        points='Création, dev, multitâche avancé. Confort maximal + sécurité renforcée.';
        break;
      case 'professional':
        text='EasyOs Professional'; range='60–80€';
        points='Équipes, PME, outils pro, administration simple, support prioritaire.';
        break;
      case 'famille':
        text='EasyOs Famille'; range='20–35€';
        points='Maison, profils multiples, contrôle parental et simplicité.';
        break;
    }
    label.textContent = text;
    if(price) price.textContent = range;
    if(summary) summary.textContent = points;
  }
});

// Enhance all internal links with transition
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if(!a) return;
  const href = a.getAttribute('href');
  if(!href || href.startsWith('http') || href.startsWith('#')) return;
  e.preventDefault();
  transitionTo(href);
});