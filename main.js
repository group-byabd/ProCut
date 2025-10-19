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
      case 'easycut':
        text = 'EasyCut (Monteurs)';
        range = '120€/an ou 10€/mois';
        points = 'Montez vos vidéos comme vous le souhaitez ! Un logiciel de montage sans limite !';
        break;

      case 'artcut':
        text = 'ArtCut (Designeurs)';
        range = '90€/an ou 8,50€/mois';
        points = 'Créez et designiez sans limite tout ce qui vous passe par la tête !';
        break;

      case 'pixcut':
        text = 'PixCut (Photographes)';
        range = '75€/an ou 7,50€/mois';
        points = 'Retouchez vos photos pour qu’elles deviennent irréalistes !';
        break;

      case 'saxcut':
        text = 'SaxCut (Musiciens)';
        range = '115€/an ou 10€/mois';
        points = 'Créez et faites écouter vos plus belles prods à vos amis ou vos auditeurs !';
        break;
      case 'procutia':
        text = 'ProCutIA (Intelligence Artificielle)';
        range = '250€/an ou 25€/mois';
        points = 'Notre IA pensé pour vos besoins et créez ce que vous ne pensez jamais réalité !';
        break;
    
      case 'packcut':
        text = 'PackCut (Pour tous)';
        range = '325€/an ou 30€/mois';
        points = 'Tous vos logiciels dans un seul pack !';
        break;
      case 'educationcut':
        text = 'EducationCut (Education)';
        range = '299,90€/an ou 25€/mois';
        points = 'Tout votre pack a prix réduit !';
        break;

      default:
        // rien de spécial, on garde le texte par défaut
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
// Interaction utilisateur : détecter clic, scroll, touche
// Détection d'interaction utilisateur (clic, scroll, touche)
let userInteracted = false;
window.addEventListener("click", () => userInteracted = true);
window.addEventListener("keydown", () => userInteracted = true);
window.addEventListener("scroll", () => userInteracted = true);

// Fonction modulaire pour gérer chaque vidéo + switch
function setupVideoSound(videoId, toggleId, cardId) {
  const video = document.getElementById(videoId);
  const toggle = document.getElementById(toggleId);
  const card = document.getElementById(cardId);

  if (video && card) {
    card.addEventListener("mouseenter", () => {
      if (userInteracted && toggle?.checked) {
        try {
          video.muted = false;
          video.volume = 1;
          video.load(); // recharge la source si nécessaire
          video.play(); // relance la lecture si bloquée
        } catch (e) {
          console.warn("Impossible d’activer le son :", e);
        }
      }
    });

    card.addEventListener("mouseleave", () => {
      video.muted = true;
    });
  }

  if (video && toggle) {
    toggle.addEventListener("change", (e) => {
      if (e.target.checked) {
        try {
          video.muted = false;
          video.volume = 1;
          video.load();
          video.play();
        } catch (err) {
          console.warn("Impossible d’activer le son via le switch :", err);
        }
      } else {
        video.muted = true;
      }
    });
  }
}

// Initialiser chaque bloc vidéo individuellement
setupVideoSound("visionVideo1", "enableSoundToggle1", "vision-card1");
setupVideoSound("visionVideo2", "enableSoundToggle2", "vision-card2");
// Ne pas intercepter les liens dans les formulaires
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a || a.closest('form')) return; // ← cette ligne protège les formulaires
  const href = a.getAttribute('href');
  if (!href || href.startsWith('http') || href.startsWith('#')) return;
  e.preventDefault();
  transitionTo(href);
});

