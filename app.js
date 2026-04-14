/* =====================================================
   MA VEILLE — Application principale
   ===================================================== */

'use strict';

// =====================================================
// DONNÉES DE DÉMONSTRATION
// Ces données seront remplacées par Supabase (Module 1)
// =====================================================
const MOCK_DATA = [
  {
    id: 1,
    url: 'https://css-tricks.com/a-complete-guide-to-flexbox/',
    title: 'A Complete Guide to Flexbox',
    category: 'article',
    notes: 'La référence absolue pour Flexbox. Idéal pour revoir les alignements et le comportement des axes principal et transversal.',
    image: 'https://css-tricks.com/wp-content/uploads/2022/02/css-flexbox-poster.png',
    date: '2026-04-10',
  },
  {
    id: 2,
    url: 'https://developer.mozilla.org/fr/docs/Web/CSS/CSS_grid_layout',
    title: 'CSS Grid Layout — MDN Web Docs',
    category: 'article',
    notes: 'Documentation officielle de CSS Grid. Bien plus puissant que Flexbox pour les mises en page à deux dimensions.',
    image: '',
    date: '2026-04-08',
  },
  {
    id: 3,
    url: 'https://github.com/supabase/supabase',
    title: 'Supabase — The Open Source Firebase Alternative',
    category: 'outil',
    notes: 'Backend as a service avec PostgreSQL, Auth, Storage et Realtime. On l\'utilise dans ce projet pour persister les liens.',
    image: 'https://repository-images.githubusercontent.com/221999344/6a115600-7c3e-11eb-9b25-7b2c64b00d40',
    date: '2026-04-05',
  },
  {
    id: 4,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'JavaScript Async/Await — Full Tutorial',
    category: 'vidéo',
    notes: 'Excellente explication des promesses et de async/await avec des exemples concrets d\'appels API.',
    image: '',
    date: '2026-04-03',
  },
  {
    id: 5,
    url: 'https://vitejs.dev/',
    title: 'Vite — Next Generation Frontend Tooling',
    category: 'outil',
    notes: 'Build tool ultra-rapide grâce aux ES modules natifs. Remplace avantageusement Webpack pour les nouveaux projets.',
    image: 'https://vitejs.dev/og-image-announcing-vite6.png',
    date: '2026-03-28',
  },
];

// =====================================================
// SUPABASE — À compléter lors du Module Supabase
// =====================================================
// Quand vous serez prêt·e à connecter la base de données :
//   1. Créez un projet sur https://supabase.com
//   2. Copiez SUPABASE_URL et SUPABASE_ANON_KEY dans votre .env
//   3. Remplacez les stubs ci-dessous par de vrais appels Supabase
//
// Exemple de table SQL à créer dans Supabase :
//   CREATE TABLE links (
//     id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//     url        text NOT NULL,
//     title      text NOT NULL,
//     category   text DEFAULT 'autre',
//     notes      text,
//     image      text,
//     date       date DEFAULT now()
//   );

/**
 * Récupère tous les liens sauvegardés.
 *
 * TODO (Module Supabase) : remplacer par
 *   const { data, error } = await supabase.from('links').select('*').order('date', { ascending: false });
 *   if (error) throw error;
 *   return data;
 */
async function fetchLinks() {
  // Simule un léger délai réseau (à supprimer quand Supabase sera connecté)
  await new Promise(r => setTimeout(r, 0));
  return [...localLinks];
}

/**
 * Insère un nouveau lien en base de données.
 * @param {{ url, title, category, notes, image, date }} data
 *
 * TODO (Module Supabase) : remplacer par
 *   const { data: inserted, error } = await supabase.from('links').insert([linkData]).select().single();
 *   if (error) throw error;
 *   return inserted;
 */
async function insertLink(data) {
  const newLink = { ...data, id: Date.now() };
  localLinks.unshift(newLink);
  return newLink;
}

/**
 * Supprime un lien par son identifiant.
 * @param {number} id
 *
 * TODO (Module Supabase) : remplacer par
 *   const { error } = await supabase.from('links').delete().eq('id', id);
 *   if (error) throw error;
 */
async function deleteLink(id) {
  localLinks = localLinks.filter(link => link.id !== id);
}

// =====================================================
// ÉTAT LOCAL DE L'APPLICATION
// =====================================================

/** Copie de travail des données (initialisée depuis MOCK_DATA) */
let localLinks = [...MOCK_DATA];

/** Catégorie active dans les filtres */
let activeCategory = 'tous';

/** Terme de recherche en cours */
let searchQuery = '';

// =====================================================
// RENDU DES CARTES
// =====================================================

/**
 * Extrait le nom de domaine depuis une URL.
 * @param {string} url
 * @returns {string}
 */
function getDomain(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

/**
 * Formate une date ISO (YYYY-MM-DD) en date lisible en français.
 * @param {string} dateStr
 * @returns {string}
 */
function formatDate(dateStr) {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

/**
 * Filtre les liens selon la catégorie active et la recherche.
 * @param {Array} links
 * @returns {Array}
 */
function filterLinks(links) {
  return links.filter(link => {
    const matchCategory = activeCategory === 'tous' || link.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchSearch =
      !q ||
      link.title.toLowerCase().includes(q) ||
      (link.notes && link.notes.toLowerCase().includes(q)) ||
      getDomain(link.url).toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });
}

/**
 * Crée l'élément DOM d'une carte.
 * @param {Object} link
 * @param {number} index — utilisé pour la couleur de fallback
 * @returns {HTMLElement}
 */
function createCardElement(link, index) {
  const colorClass = `card--color-${index % 5}`;

  const article = document.createElement('article');
  article.className = `card ${colorClass}`;
  article.dataset.id = link.id;

  // --- Vignette ---
  const thumb = document.createElement('div');
  thumb.className = 'card__thumb';

  if (link.image) {
    const img = document.createElement('img');
    img.src = link.image;
    img.alt = link.title;
    img.loading = 'lazy';
    // Si l'image ne charge pas, on affiche le fallback coloré
    img.onerror = () => {
      img.remove();
      thumb.innerHTML = `<div class="card__thumb-fallback">🔗</div>`;
    };
    thumb.appendChild(img);
  } else {
    const emojis = ['📄', '🛠️', '▶️', '📎', '🔗'];
    const emojiMap = { article: '📄', outil: '🛠️', 'vidéo': '▶️', autre: '📎' };
    const emoji = emojiMap[link.category] || emojis[index % emojis.length];
    thumb.innerHTML = `<div class="card__thumb-fallback">${emoji}</div>`;
  }

  // --- Corps ---
  const body = document.createElement('div');
  body.className = 'card__body';

  const domain = document.createElement('p');
  domain.className = 'card__domain';
  domain.textContent = getDomain(link.url);

  const titleEl = document.createElement('h2');
  titleEl.className = 'card__title';
  titleEl.innerHTML = `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.title)}</a>`;

  const badge = document.createElement('span');
  badge.className = `card__badge card__badge--${link.category}`;
  badge.textContent = link.category.charAt(0).toUpperCase() + link.category.slice(1);

  const notes = document.createElement('p');
  notes.className = 'card__notes';
  notes.textContent = link.notes || '';

  const footer = document.createElement('div');
  footer.className = 'card__footer';

  const date = document.createElement('time');
  date.className = 'card__date';
  date.dateTime = link.date;
  date.textContent = formatDate(link.date);

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'card__delete';
  deleteBtn.setAttribute('aria-label', 'Supprimer cette ressource');
  deleteBtn.dataset.id = link.id;
  deleteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
      <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.713Z" clip-rule="evenodd" />
    </svg>`;

  footer.append(date, deleteBtn);
  body.append(domain, titleEl, badge);
  if (link.notes) body.append(notes);
  body.append(footer);

  article.append(thumb, body);
  return article;
}

/**
 * Rafraîchit la grille complète selon l'état courant.
 */
async function renderGrid() {
  const grid = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');

  const all = await fetchLinks();
  const filtered = filterLinks(all);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.hidden = false;
    resultsCount.textContent = '';
  } else {
    emptyState.hidden = true;
    const total = all.length;
    resultsCount.textContent =
      filtered.length === total
        ? `${total} ressource${total > 1 ? 's' : ''}`
        : `${filtered.length} résultat${filtered.length > 1 ? 's' : ''} sur ${total}`;

    filtered.forEach((link, i) => {
      grid.appendChild(createCardElement(link, i));
    });
  }
}

// =====================================================
// FILTRES & RECHERCHE
// =====================================================

function initFilters() {
  document.getElementById('filters').addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;

    document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('filter-pill--active'));
    pill.classList.add('filter-pill--active');

    activeCategory = pill.dataset.category;
    renderGrid();
  });
}

function initSearch() {
  const input = document.getElementById('searchInput');
  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = input.value.trim();
      renderGrid();
    }, 200);
  });
}

// =====================================================
// SUPPRESSION D'UNE CARTE
// =====================================================

function initDeleteHandler() {
  document.getElementById('cardsGrid').addEventListener('click', async e => {
    const btn = e.target.closest('.card__delete');
    if (!btn) return;

    const id = Number(btn.dataset.id);
    if (!confirm('Supprimer cette ressource ?')) return;

    try {
      await deleteLink(id);
      await renderGrid();
      showToast('Ressource supprimée.');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la suppression.', true);
    }
  });
}

// =====================================================
// MODAL
// =====================================================

function openModal() {
  document.getElementById('modalBackdrop').hidden = false;
  document.body.style.overflow = 'hidden';
  document.getElementById('inputUrl').focus();
}

function closeModal() {
  document.getElementById('modalBackdrop').hidden = true;
  document.body.style.overflow = '';
  resetForm();
}

function resetForm() {
  document.getElementById('addForm').reset();
  document.getElementById('imagePreviewGroup').hidden = true;
  document.getElementById('inputImage').value = '';
  document.getElementById('inputUrl').classList.remove('error');
}

function initModal() {
  document.getElementById('openModalBtn').addEventListener('click', openModal);
  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);

  // Fermeture en cliquant sur le fond
  document.getElementById('modalBackdrop').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // Fermeture avec Échap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !document.getElementById('modalBackdrop').hidden) {
      closeModal();
    }
  });
}

// =====================================================
// RÉCUPÉRATION AUTOMATIQUE VIA MICROLINK
// =====================================================

/**
 * Appelle l'API Microlink pour récupérer titre, description et image d'une URL.
 * Microlink est gratuit sans clé pour un usage limité.
 * @param {string} url
 */
async function fetchLinkInfo(url) {
  const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}`;
  const response = await fetch(apiUrl);
  if (!response.ok) throw new Error(`Microlink a répondu avec ${response.status}`);
  const json = await response.json();
  if (json.status !== 'success') throw new Error('Microlink n\'a pas pu analyser cette URL.');
  return json.data;
}

function initFetchInfo() {
  document.getElementById('fetchInfoBtn').addEventListener('click', async () => {
    const urlInput = document.getElementById('inputUrl');
    const url = urlInput.value.trim();

    if (!url) {
      urlInput.classList.add('error');
      urlInput.focus();
      showToast('Veuillez entrer une URL avant de récupérer les infos.', true);
      return;
    }

    urlInput.classList.remove('error');

    // Afficher le spinner
    document.getElementById('fetchBtnText').hidden = true;
    document.getElementById('fetchBtnLoader').hidden = false;
    document.getElementById('fetchInfoBtn').disabled = true;

    try {
      const data = await fetchLinkInfo(url);

      // Préremplir le titre
      if (data.title) {
        document.getElementById('inputTitle').value = data.title;
      }

      // Préremplir la description dans les notes (si vide)
      if (data.description && !document.getElementById('inputNotes').value) {
        document.getElementById('inputNotes').value = data.description;
      }

      // Afficher l'aperçu image
      if (data.image && data.image.url) {
        document.getElementById('inputImage').value = data.image.url;
        document.getElementById('imagePreview').src = data.image.url;
        document.getElementById('imagePreviewGroup').hidden = false;
      }

      showToast('Infos récupérées avec succès !');
    } catch (err) {
      console.warn('Microlink :', err.message);
      showToast('Impossible de récupérer les infos. Remplissez manuellement.', true);
    } finally {
      document.getElementById('fetchBtnText').hidden = false;
      document.getElementById('fetchBtnLoader').hidden = true;
      document.getElementById('fetchInfoBtn').disabled = false;
    }
  });
}

// =====================================================
// SOUMISSION DU FORMULAIRE
// =====================================================

function initFormSubmit() {
  document.getElementById('addForm').addEventListener('submit', async e => {
    e.preventDefault();

    const url      = document.getElementById('inputUrl').value.trim();
    const title    = document.getElementById('inputTitle').value.trim();
    const category = document.getElementById('inputCategory').value;
    const notes    = document.getElementById('inputNotes').value.trim();
    const image    = document.getElementById('inputImage').value;

    // Validation minimale
    if (!url || !title) {
      if (!url) document.getElementById('inputUrl').classList.add('error');
      if (!title) document.getElementById('inputTitle').classList.add('error');
      showToast('URL et Titre sont obligatoires.', true);
      return;
    }

    const newLink = {
      url,
      title,
      category,
      notes,
      image,
      date: new Date().toISOString().split('T')[0],
    };

    try {
      await insertLink(newLink);
      closeModal();
      await renderGrid();
      showToast('Ressource ajoutée !');
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de l\'ajout.', true);
    }
  });

  // Retirer l'état d'erreur à la saisie
  ['inputUrl', 'inputTitle'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(id).classList.remove('error');
    });
  });
}

// =====================================================
// UTILITAIRE — Toast de notification
// =====================================================

/**
 * Affiche un message toast temporaire.
 * @param {string} message
 * @param {boolean} [isError=false]
 */
function showToast(message, isError = false) {
  // Supprimer un toast existant
  document.querySelectorAll('.toast').forEach(t => t.remove());

  const toast = document.createElement('div');
  toast.className = `toast${isError ? ' toast--error' : ''}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// =====================================================
// UTILITAIRE — Échappement HTML (sécurité XSS)
// =====================================================

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// =====================================================
// INITIALISATION
// =====================================================

function init() {
  initModal();
  initFilters();
  initSearch();
  initDeleteHandler();
  initFetchInfo();
  initFormSubmit();
  renderGrid();
}

document.addEventListener('DOMContentLoaded', init);
