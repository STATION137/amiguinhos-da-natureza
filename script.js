// =====================================================
//  Amiguinhos da Natureza - Imagens PNG & Lógica
// =====================================================

// --- Banco de dados dos objetos flutuates ---
const ITEMS = {
  papel: {
    name: 'Papel',
    examples: [
      { img: 'assets/items/papel/jornal.png', fallback: '📰', name: 'Jornal' },
      { img: 'assets/items/papel/caixa.png', fallback: '📦', name: 'Caixa de papelão' },
      { img: 'assets/items/papel/folha.png', fallback: '📄', name: 'Folha sulfite' },
      { img: 'assets/items/papel/caderno.png', fallback: '📓', name: 'Caderno' }
    ]
  },
  plastico: {
    name: 'Plástico',
    examples: [
      { img: 'assets/items/plastico/garrafa.png', fallback: '🥤', name: 'Garrafa PET' },
      { img: 'assets/items/plastico/sacola.png', fallback: '🛍️', name: 'Sacola plástica' },
      { img: 'assets/items/plastico/frasco.png', fallback: '🧴', name: 'Frasco de detergente' },
      { img: 'assets/items/plastico/pote.png', fallback: '🍶', name: 'Pote de iogurte' }
    ]
  },
  metal: {
    name: 'Metal',
    examples: [
      { img: 'assets/items/metal/lata.png', fallback: '🥫', name: 'Lata de alumínio' },
      { img: 'assets/items/metal/engrenagem.png', fallback: '⚙️', name: 'Engrenagem' },
      { img: 'assets/items/metal/parafuso.png', fallback: '🔩', name: 'Parafuso' },
      { img: 'assets/items/metal/talher.png', fallback: '🥄', name: 'Talher de metal' }
    ]
  },
  vidro: {
    name: 'Vidro',
    examples: [
      { img: 'assets/items/vidro/garrafa-verde.png', fallback: '🍾', name: 'Garrafa de vinho' },
      { img: 'assets/items/vidro/pote.png', fallback: '🫙', name: 'Pote de vidro' },
      { img: 'assets/items/vidro/copo.png', fallback: '🥛', name: 'Copo de vidro' },
      { img: 'assets/items/vidro/garrafa-marrom.png', fallback: '🍶', name: 'Garrafa de licor' }
    ]
  }
};

// --- Variantes dos Personagens (selecionados randomicamente a cada atualização de pagina) ---
const DOLL_VARIANTS = {
  panoAzul: {
    frontEmpty:    'assets/doll-blue/front-empty.png',
    handsUp:       'assets/doll-blue/hands-up.png',
    turning:       'assets/doll-blue/turning.png',
    nodYes1:       'assets/doll-blue/nod-yes-1.png',
    nodYes2:       'assets/doll-blue/nod-yes-2.png',
    nodNo1:        'assets/doll-blue/nod-no-1.png',
    nodNo2:        'assets/doll-blue/nod-no-2.png'
  },
  panoVermelho: {
    frontEmpty:    'assets/doll-red/front-empty.png',
    handsUp:       'assets/doll-red/hands-up.png',
    turning:       'assets/doll-red/turning.png',
    nodYes1:       'assets/doll-red/nod-yes-1.png',
    nodYes2:       'assets/doll-red/nod-yes-2.png',
    nodNo1:        'assets/doll-red/nod-no-1.png',
    nodNo2:        'assets/doll-red/nod-no-2.png'
  },
  panoAmarelo: {
    frontEmpty:    'assets/doll-yellow/front-empty.png',
    handsUp:       'assets/doll-yellow/hands-up.png',
    turning:       'assets/doll-yellow/turning.png',
    nodYes1:       'assets/doll-yellow/nod-yes-1.png',
    nodYes2:       'assets/doll-yellow/nod-yes-2.png',
    nodNo1:        'assets/doll-yellow/nod-no-1.png',
    nodNo2:        'assets/doll-yellow/nod-no-2.png'
  },
  panoVerde: {
    frontEmpty:    'assets/doll-green/front-empty.png',
    handsUp:       'assets/doll-green/hands-up.png',
    turning:       'assets/doll-green/turning.png',
    nodYes1:       'assets/doll-green/nod-yes-1.png',
    nodYes2:       'assets/doll-green/nod-yes-2.png',
    nodNo1:        'assets/doll-green/nod-no-1.png',
    nodNo2:        'assets/doll-green/nod-no-2.png'
  }  
};

// 1. Cadastro dos personagens disponíveis
const dollKeys = ['panoAzul', 'panoVermelho', 'panoAmarelo', 'panoVerde'];

// 2. Sorteia um personagem aleatório da lista acima
const selectedDollKey = dollKeys[Math.floor(Math.random() * dollKeys.length)];

const IMAGES = {
  background: 'assets/background/room.jpeg',
  doll: DOLL_VARIANTS[selectedDollKey],
  layout: {
    frame: 'assets/layout/main-frame.png',
    hud: 'assets/layout/hud-panel.png',
    bubble: 'assets/layout/speech-bubble.png',
    correctToast: 'assets/layout/toast-correct.png',
    wrongToast: 'assets/layout/toast-wrong.png'
  },
  cards: {
    papel: { frame: 'assets/cards/card-papel.png'},
    plastico: { frame: 'assets/cards/card-plastico.png'},
    metal: { frame: 'assets/cards/card-metal.png'},
    vidro: { frame: 'assets/cards/card-vidro.png'}
  },
  selectedDollKey
};

// --- Cacheador de Imagens ---
const imgCache = {};
function preload(src) {
  if (!src) return;
  if (imgCache[src]) return imgCache[src];
  const img = new Image();
  img.src = src;
  imgCache[src] = img;
  img.onerror = () => { img.dataset.broken = 'true'; };
  return img;
}

// --- Referências de Elementos do DOM ---
const heldItemEl = document.getElementById('heldItem');
const heldImgEl = document.getElementById('heldImg');
const heldLabelEl = document.getElementById('heldLabel');
const dollImgEl = document.getElementById('dollImg');
const cardsArea = document.getElementById('cardsArea');
const scoreEl = document.getElementById('score');
const streakEl = document.getElementById('streak');
const toastWrapper = document.getElementById('toastWrapper');
const toastText = document.getElementById('toastText');
const speechBubble = document.getElementById('speechBubble');
const dollClick = document.getElementById('dollClick');
const painting = document.getElementById('painting');

const categories = ['papel', 'plastico', 'metal', 'vidro'];

// --- Estado do Jogo ---
let score = 0;
let streak = 0;
let currentItem = null;
let busy = false;
let bubbleTimeout = null;
let bubbleVisible = false;

// --- Exibição do Balão de Diálogo do Personagem ---
function showBubble() {
  bubbleVisible = true;
  speechBubble.classList.remove('show');
  void speechBubble.offsetWidth; // Força reflow do navegador
  speechBubble.classList.add('show');
  
  clearTimeout(bubbleTimeout);
  bubbleTimeout = setTimeout(hideBubble, 7000);
}

function hideBubble() {
  if (!bubbleVisible) return;
  bubbleVisible = false;
  speechBubble.classList.remove('show');
}

// Clique no boneco abre o balão
dollClick.addEventListener('click', (e) => {
  e.stopPropagation();
  showBubble();
});

// Clique no objeto flutuante exibe seu respectivo nome
heldItemEl.addEventListener('click', (e) => {
  e.stopPropagation();
  heldLabelEl.classList.toggle('show');
});

// Clique em qualquer área livre da página fecha os elementos flutuantes abertos
document.addEventListener('click', (e) => {
  if (bubbleVisible && !speechBubble.contains(e.target)) {
    hideBubble();
  }
  if (!heldItemEl.contains(e.target)) {
    heldLabelEl.classList.remove('show');
  }
});

// Criação Dinâmica de Cards
categories.forEach((cat) => {
  const cardContainer = document.createElement('div');
  cardContainer.className = 'card-container';
  cardContainer.dataset.cat = cat;

  const framePng = document.createElement('img');
  framePng.className = 'card-frame-png';
  framePng.src = IMAGES.cards[cat].frame;
  framePng.alt = ITEMS[cat].name;

  // Renderiza fallback caso as imagens principais falhem ou não sejam localizadas
  framePng.onerror = function() {
    this.style.display = 'none';
    cardContainer.innerHTML = createFallbackCard(cat);
  };

  cardContainer.appendChild(framePng);
  cardContainer.addEventListener('click', () => handleChoice(cat, cardContainer));
  cardsArea.appendChild(cardContainer);
});

// Sistema de segurança / Fallback estrutural do Card
function createFallbackCard(cat) {
  const colors = { papel: '#3b82f6', plastico: '#ef4444', metal: '#f59e0b', vidro: '#10b981' };
  const color = colors[cat];
  const name = ITEMS[cat].name.toUpperCase();
  
  return `
    <div style="background:rgba(255,255,255,0.95);border-radius:28px;border:4px solid ${color};height:100%;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 8px 24px rgba(6,78,59,0.08);backdrop-filter:blur(10px);">
      <div style="background:${color};color:#fff;text-align:center;padding:12px;font-family:'Fredoka',sans-serif;font-size:22px;font-weight:700;">${name}</div>
      <div style="flex:1;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,0.5);">
        <span style="font-size:70px;">${ITEMS[cat].examples[0].fallback}</span>
      </div>
    </div>
  `;
}

// --- Efeito Sutil de Paralaxe Tridimensional (Profundidade das Camadas) ---
function updateParallax(mx, my) {
  document.documentElement.style.setProperty('--mx', mx);
  document.documentElement.style.setProperty('--my', my);
}

painting.addEventListener('mousemove', (e) => {
  const r = painting.getBoundingClientRect();
  const mx = ((e.clientX - r.left) / r.width - 0.5) * 2;
  const my = ((e.clientY - r.top) / r.height - 0.5) * 2;
  updateParallax(mx, my);
});

painting.addEventListener('mouseleave', () => updateParallax(0, 0));

// Animações do Personagem
function setDoll(src, flash = true) {
  const cached = imgCache[src];
  if (cached && cached.dataset.broken !== 'true' && cached.complete && cached.naturalWidth > 0) {
    dollImgEl.src = cached.src;
  } else {
    dollImgEl.src = src;
  }
  
  if (flash) {
    dollImgEl.classList.remove('flash');
    void dollImgEl.offsetWidth;
    dollImgEl.classList.add('flash');
  }
}

function animateSuccess() {
  setDoll(IMAGES.doll.handsUp);
  setTimeout(() => setDoll(IMAGES.doll.turning), 180);
  setTimeout(() => setDoll(IMAGES.doll.frontEmpty), 360);
}

function animateFailure() {
  setDoll(IMAGES.doll.nodNo1);
  setTimeout(() => setDoll(IMAGES.doll.nodNo2), 160);
  setTimeout(() => setDoll(IMAGES.doll.nodNo1), 320);
  setTimeout(() => setDoll(IMAGES.doll.nodNo2), 480);
  setTimeout(() => setDoll(IMAGES.doll.frontEmpty), 640);
}

function animateHappy() {
  setDoll(IMAGES.doll.nodYes1);
  setTimeout(() => setDoll(IMAGES.doll.nodYes2), 150);
  setTimeout(() => setDoll(IMAGES.doll.nodYes1), 300);
  setTimeout(() => setDoll(IMAGES.doll.nodYes2), 450);
  setTimeout(() => setDoll(IMAGES.doll.frontEmpty), 600);
}

// --- Caixa de feedback (certo e errado) ---
function showToast(text, isCorrect) {
  toastText.textContent = text;
  toastWrapper.className = 'toast-wrapper show ' + (isCorrect ? 'correct-toast' : 'wrong-toast');
  setTimeout(() => toastWrapper.classList.remove('show'), 1200);
}

// --- Sistema de Áudio Seguro (Fallback Local) ---
const sounds = {
  correct: new Audio('assets/audio/correct.WAV'),
  wrong: new Audio('assets/audio/wrong.WAV')
};

function playSound(type) {
  const sound = sounds[type];
  if (!sound) return;
  try {
    sound.currentTime = 0; // Reinicia o áudio do começo caso já esteja tocando
    sound.play().catch(err => {
      // Evita o travamento do jogo se o navegador bloquear o autoplay
      console.warn("Áudio bloqueado temporariamente pela política do navegador:", err);
    });
  } catch (e) {
    console.error("Erro no fallback de som:", e);
  }
}

// --- Seleção e Entrega do Objeto ---
function pickRandomItem() {
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const list = ITEMS[cat].examples;
  return { cat, ...list[Math.floor(Math.random() * list.length)] };
}

function renderItem(item) {
  const existingFallback = heldItemEl.querySelector('.emoji-fallback');
  if (existingFallback) existingFallback.remove();

  heldImgEl.style.display = 'block';
  heldImgEl.src = item.img;
  heldLabelEl.textContent = item.name;
  
  // Oculta a etiqueta com o nome para que apareça apenas após o clique
  heldLabelEl.classList.remove('show');

  // Fallback de emoji se a imagem png falhar em carregar
  heldImgEl.onerror = function() {
    this.style.display = 'none';
    const span = document.createElement('span');
    span.className = 'emoji-fallback';
    span.style.cssText = 'font-size: 70px; text-align:center; line-height:1; display:block;';
    span.textContent = item.fallback;
    heldItemEl.appendChild(span);
  };

  heldItemEl.classList.remove('pop', 'shake-out');
  void heldItemEl.offsetWidth; // Force Reflow
  heldItemEl.classList.add('pop');
  currentItem = item;
}

function nextRound() {
  renderItem(pickRandomItem());
  busy = false;
}

// --- Validação das escolhas ---
function handleChoice(cat, element) {
  if (busy) return;
  busy = true;

  if (cat === currentItem.cat) {
    score += 10 + streak * 2;
    streak += 1;
    element.classList.add('correct');
    showToast('✓ EXCELENTE!', true);
	playSound('correct'); // Toca o som de acerto

    if (streak >= 3) {
      animateHappy();
    } else {
      animateSuccess();
    }

// Ativa a animação de saída configurada no CSS
    setTimeout(() => {
      heldItemEl.classList.remove('pop');
      heldItemEl.classList.add('shake-out');
    }, 200);

    setTimeout(() => element.classList.remove('correct'), 700);
  } else {
    score = Math.max(0, score - 5);
    streak = 0;
    element.classList.add('wrong');
    animateFailure();
	playSound('wrong'); // Toca o som de erro

    // Mostra o card correto piscando para ajudar na memorização
    const correctCard = document.querySelector(`.card-container[data-cat="${currentItem.cat}"]`);
    if (correctCard) {
      setTimeout(() => {
        correctCard.classList.add('correct');
        setTimeout(() => correctCard.classList.remove('correct'), 700);
      }, 300);
    }

    showToast(`× ERA ${ITEMS[currentItem.cat].name.toUpperCase()}!`, false);
    setTimeout(() => element.classList.remove('wrong'), 700);
  }

  scoreEl.textContent = score;
  streakEl.textContent = streak > 0 ? `🔥 ${streak}` : '✨ 0';
  
  setTimeout(nextRound, 1300);
}

// --- Pré-carregamento total de arquivos de mídia ---
function preloadAll() {
  preload(IMAGES.background);
  Object.values(IMAGES.layout).forEach(preload);
  Object.values(IMAGES.doll).forEach(preload);
  Object.values(IMAGES.cards).forEach(c => {
    preload(c.frame);
  });
  Object.values(ITEMS).forEach(cat => {
    cat.examples.forEach(ex => preload(ex.img));
  });
}

// --- Partida Inicial ---
preloadAll();
setDoll(IMAGES.doll.frontEmpty, false);
nextRound();
