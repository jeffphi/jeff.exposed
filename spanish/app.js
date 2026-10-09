// ---------------------------------------------------------------
// Data sources
//
// Reads live from the shared Google Sheet (sharing set to "Anyone
// with the link" -> Viewer), one CSV export URL per tab. Adding or
// editing lessons/vocab/notes is just editing the Sheet -- no
// redeploy needed. The gid in each URL identifies the tab; see
// spanish/data/*.csv in this repo for the original seed data and
// expected column headers.
// ---------------------------------------------------------------
const SHEET_ID = "1liINDgj2SFugjX7zb-NyaWOhEFPaVeAxlR_CQiKxo4k";
const sheetCsvUrl = (gid) =>
  `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`;

const DATA_SOURCES = {
  lessons: sheetCsvUrl(0),
  vocab: sheetCsvUrl(2027140045),
  notes: sheetCsvUrl(1549873774),
};

// Regular present-tense conjugation patterns. Hard-coded rather than in the
// Sheet -- this is fixed grammar, not content the group adds to week to week.
const VERB_GROUPS = [
  {
    group: "-AR verbs",
    example: "desear",
    meaning: "to want, to wish",
    stem: "dese",
    forms: [
      { pronoun: "yo", ending: "o" },
      { pronoun: "tú (informal)", ending: "as" },
      { pronoun: "usted (formal)", ending: "a" },
      { pronoun: "él / ella", ending: "a" },
      { pronoun: "nosotros / nosotras", ending: "amos" },
      { pronoun: "vosotros / vosotras", ending: "áis" },
      { pronoun: "ustedes", ending: "an" },
      { pronoun: "ellos / ellas", ending: "an" },
    ],
  },
  {
    group: "-ER verbs",
    example: "vender",
    meaning: "to sell",
    stem: "vend",
    forms: [
      { pronoun: "yo", ending: "o" },
      { pronoun: "tú (informal)", ending: "es" },
      { pronoun: "usted (formal)", ending: "e" },
      { pronoun: "él / ella", ending: "e" },
      { pronoun: "nosotros / nosotras", ending: "emos" },
      { pronoun: "vosotros / vosotras", ending: "éis" },
      { pronoun: "ustedes", ending: "en" },
      { pronoun: "ellos / ellas", ending: "en" },
    ],
  },
  {
    group: "-IR verbs",
    example: "vivir",
    meaning: "to live",
    stem: "viv",
    forms: [
      { pronoun: "yo", ending: "o" },
      { pronoun: "tú (informal)", ending: "es" },
      { pronoun: "usted (formal)", ending: "e" },
      { pronoun: "él / ella", ending: "e" },
      { pronoun: "nosotros / nosotras", ending: "imos" },
      { pronoun: "vosotros / vosotras", ending: "ís" },
      { pronoun: "ustedes", ending: "en" },
      { pronoun: "ellos / ellas", ending: "en" },
    ],
  },
];

const KNOWN_KEY = "spanish-study:known-cards";

// ---------------------------------------------------------------
// CSV parsing (handles quoted fields, embedded commas/newlines)
// ---------------------------------------------------------------
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c === "\r") {
      // skip, \n handles the line break
    } else {
      field += c;
    }
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => !(r.length === 1 && r[0] === ""));
}

function csvToObjects(text) {
  const rows = parseCSV(text);
  if (!rows.length) return [];
  const headers = rows.shift().map((h) => h.trim());
  return rows.map((r) =>
    Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()]))
  );
}

async function loadCSV(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return csvToObjects(await res.text());
}

// ---------------------------------------------------------------
// Known-card tracking (per-browser, localStorage)
// ---------------------------------------------------------------
function loadKnown() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KNOWN_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

function saveKnown(set) {
  try {
    localStorage.setItem(KNOWN_KEY, JSON.stringify([...set]));
  } catch {
    // localStorage unavailable (private browsing, etc) -- fail silently
  }
}

function cardId(card) {
  return `${card.lesson_id}:${card.spanish}`;
}

// ---------------------------------------------------------------
// App state
// ---------------------------------------------------------------
const state = {
  view: "flashcards",
  lessons: [],
  vocab: [],
  notes: [],
  known: loadKnown(),
  filterLesson: "all",
  filterTags: new Set(), // empty = all tags
  hideKnown: false,
  deck: [],
  index: 0,
  flipped: false,
};

const el = {
  status: document.getElementById("status"),
  filters: document.getElementById("filters"),
  view: document.getElementById("view"),
};

// ---------------------------------------------------------------
// Data loading
// ---------------------------------------------------------------
async function init() {
  el.status.textContent = "Loading lesson data...";
  try {
    const [lessons, vocab, notes] = await Promise.all([
      loadCSV(DATA_SOURCES.lessons),
      loadCSV(DATA_SOURCES.vocab),
      loadCSV(DATA_SOURCES.notes),
    ]);
    state.lessons = lessons;
    state.vocab = vocab;
    state.notes = notes;
    state.filterTags = new Set(allTags());
    el.status.textContent = "";
  } catch (err) {
    el.status.textContent = `Couldn't load lesson data: ${err.message}`;
    console.error(err);
    return;
  }

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  renderFilters();
  renderView();
}

function switchView(view) {
  state.view = view;
  document
    .querySelectorAll(".tab")
    .forEach((btn) => btn.classList.toggle("active", btn.dataset.view === view));
  renderFilters();
  renderView();
}

// ---------------------------------------------------------------
// Filters
// ---------------------------------------------------------------
function allTags() {
  const tags = new Set();
  state.vocab.forEach((v) => v.tags && tags.add(v.tags));
  return [...tags].sort();
}

function renderFilters() {
  el.filters.innerHTML = "";
  el.filters.classList.toggle("hidden", state.view !== "flashcards");
  if (state.view !== "flashcards") return;

  const lessonLabel = document.createElement("label");
  lessonLabel.textContent = "Lesson:";
  el.filters.appendChild(lessonLabel);

  const lessonSelect = document.createElement("select");
  const allOpt = document.createElement("option");
  allOpt.value = "all";
  allOpt.textContent = "All lessons";
  lessonSelect.appendChild(allOpt);
  state.lessons.forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l.lesson_id;
    opt.textContent = l.title ? `${l.lesson_id}. ${l.title}` : `Lesson ${l.lesson_id}`;
    lessonSelect.appendChild(opt);
  });
  lessonSelect.value = state.filterLesson;
  lessonSelect.addEventListener("change", () => {
    state.filterLesson = lessonSelect.value;
    buildDeck();
    renderView();
  });
  el.filters.appendChild(lessonSelect);

  const categoryLabel = document.createElement("label");
  categoryLabel.textContent = "Categories:";
  el.filters.appendChild(categoryLabel);

  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.className = "tag-toggle";
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => {
    state.filterTags = new Set(allTags());
    buildDeck();
    renderFilters();
    renderView();
  });
  el.filters.appendChild(allBtn);

  const noneBtn = document.createElement("button");
  noneBtn.type = "button";
  noneBtn.className = "tag-toggle";
  noneBtn.textContent = "None";
  noneBtn.addEventListener("click", () => {
    state.filterTags = new Set();
    buildDeck();
    renderFilters();
    renderView();
  });
  el.filters.appendChild(noneBtn);

  allTags().forEach((tag) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-toggle" + (state.filterTags.has(tag) ? " active" : "");
    btn.textContent = tag;
    btn.addEventListener("click", () => {
      if (state.filterTags.has(tag)) state.filterTags.delete(tag);
      else state.filterTags.add(tag);
      buildDeck();
      renderFilters();
      renderView();
    });
    el.filters.appendChild(btn);
  });

  const hideKnownBtn = document.createElement("button");
  hideKnownBtn.type = "button";
  hideKnownBtn.className = "tag-toggle" + (state.hideKnown ? " active" : "");
  hideKnownBtn.textContent = state.hideKnown ? "Hiding known" : "Hide known";
  hideKnownBtn.addEventListener("click", () => {
    state.hideKnown = !state.hideKnown;
    buildDeck();
    renderFilters();
    renderView();
  });
  el.filters.appendChild(hideKnownBtn);
}

function buildDeck() {
  let pool = state.vocab;
  if (state.filterLesson !== "all") {
    pool = pool.filter((v) => v.lesson_id === state.filterLesson);
  }
  pool = pool.filter((v) => state.filterTags.has(v.tags));
  if (state.hideKnown) {
    pool = pool.filter((v) => !state.known.has(cardId(v)));
  }
  state.deck = shuffle([...pool]);
  state.index = 0;
  state.flipped = false;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ---------------------------------------------------------------
// Views
// ---------------------------------------------------------------
function renderView() {
  if (state.view === "flashcards") renderFlashcards();
  else if (state.view === "notes") renderNotes();
  else if (state.view === "lessons") renderLessons();
  else renderTranslate();
}

function renderFlashcards() {
  if (!state.deck.length && state.vocab.length) buildDeck();

  el.view.innerHTML = "";

  if (!state.deck.length) {
    el.view.innerHTML = `<div id="empty-state">No cards match the current filters.</div>`;
    return;
  }

  const card = state.deck[state.index];
  const wrap = document.createElement("div");
  wrap.id = "flashcard-wrap";

  const meta = document.createElement("div");
  meta.className = "flashcard-meta";
  meta.textContent = `Card ${state.index + 1} of ${state.deck.length} -- ${card.tags || "misc"}${
    state.known.has(cardId(card)) ? " -- known" : ""
  }`;
  wrap.appendChild(meta);

  const face = document.createElement("div");
  face.className = "flashcard";
  face.textContent = state.flipped ? card.english : card.spanish;
  face.addEventListener("click", () => {
    state.flipped = !state.flipped;
    renderFlashcards();
  });
  wrap.appendChild(face);

  const controls = document.createElement("div");
  controls.className = "controls";

  const prevBtn = makeBtn("← Prev", () => nav(-1));
  const flipBtn = makeBtn("Flip", () => {
    state.flipped = !state.flipped;
    renderFlashcards();
  });
  const nextBtn = makeBtn("Next →", () => nav(1));
  const knowBtn = makeBtn(
    state.known.has(cardId(card)) ? "✓ Known" : "Mark known",
    () => {
      const id = cardId(card);
      if (state.known.has(id)) state.known.delete(id);
      else state.known.add(id);
      saveKnown(state.known);
      renderFlashcards();
    }
  );
  knowBtn.classList.add("know");

  [prevBtn, flipBtn, nextBtn, knowBtn].forEach((b) => controls.appendChild(b));
  wrap.appendChild(controls);

  el.view.appendChild(wrap);
}

function makeBtn(label, onClick) {
  const b = document.createElement("button");
  b.className = "action";
  b.type = "button";
  b.textContent = label;
  b.addEventListener("click", onClick);
  return b;
}

function nav(delta) {
  if (!state.deck.length) return;
  state.index = (state.index + delta + state.deck.length) % state.deck.length;
  state.flipped = false;
  renderFlashcards();
}

function renderNotes() {
  el.view.innerHTML = "";
  const notes = state.notes;

  if (!notes.length) {
    el.view.innerHTML = `<div id="empty-state">No notes yet.</div>`;
    return;
  }

  notes.forEach((n) => {
    const lesson = state.lessons.find((l) => l.lesson_id === n.lesson_id);
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <span class="note-lesson-tag">${
        lesson ? `Lesson ${lesson.lesson_id}: ${lesson.title}` : `Lesson ${n.lesson_id}`
      }</span>
      <h3></h3>
      <p></p>
    `;
    card.querySelector("h3").textContent = n.title;
    card.querySelector("p").textContent = n.body;
    el.view.appendChild(card);
  });
}

function verbReferenceHTML() {
  const cards = VERB_GROUPS.map(
    (g) => `
    <div class="verb-card">
      <h3>${g.group}</h3>
      <div class="verb-example">${g.example} <span class="verb-meaning">(${g.meaning})</span></div>
      <table class="verb-table">
        ${g.forms
          .map(
            (f) =>
              `<tr><td>${f.pronoun}</td><td>${g.stem}<strong>${f.ending}</strong></td></tr>`
          )
          .join("")}
      </table>
    </div>`
  ).join("");

  return `
    <section class="lesson verb-reference">
      <h2>Regular Verb Conjugations (Present Tense)</h2>
      <p class="lesson-summary">The three patterns every regular verb follows, shown with the standard example verbs. The bolded part is the ending that changes; the rest is the stem.</p>
      <div class="verb-grid">${cards}</div>
      <p class="translate-note">Usted/ustedes share their verb form with él-ella/ellos-ellas -- same ending, different pronoun. Vosotros/vosotras forms are used in Spain -- many Latin American-focused classes skip them.</p>
    </section>
  `;
}

function renderLessons() {
  el.view.innerHTML = "";
  if (!state.lessons.length) {
    el.view.innerHTML = `<div id="empty-state">No lessons yet.</div>`;
    return;
  }

  el.view.insertAdjacentHTML("beforeend", verbReferenceHTML());

  state.lessons.forEach((lesson) => {
    const section = document.createElement("section");
    section.className = "lesson";

    const heading = document.createElement("h2");
    heading.textContent = `Lesson ${lesson.lesson_id}: ${lesson.title}`;
    section.appendChild(heading);

    if (lesson.date) {
      const date = document.createElement("div");
      date.className = "lesson-meta";
      date.textContent = lesson.date;
      section.appendChild(date);
    }

    if (lesson.summary) {
      const text = document.createElement("p");
      text.className = "lesson-summary";
      text.textContent = lesson.summary;
      section.appendChild(text);
    }

    state.notes
      .filter((n) => n.lesson_id === lesson.lesson_id)
      .forEach((n) => {
        const card = document.createElement("div");
        card.className = "note-card";
        const h3 = document.createElement("h3");
        h3.textContent = n.title;
        const p = document.createElement("p");
        p.textContent = n.body;
        card.append(h3, p);
        section.appendChild(card);
      });

    const groups = new Map();
    state.vocab
      .filter((v) => v.lesson_id === lesson.lesson_id)
      .forEach((v) => {
        const key = v.tags || "misc";
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(v);
      });

    groups.forEach((cards, tag) => {
      const details = document.createElement("details");
      details.className = "vocab-group";
      details.open = tag !== "alphabet";

      const label = document.createElement("summary");
      label.textContent = `${tag} (${cards.length})`;
      details.appendChild(label);

      const table = document.createElement("table");
      table.className = "vocab-table";
      cards.forEach((c) => {
        const tr = document.createElement("tr");
        const spanish = document.createElement("td");
        spanish.textContent = c.spanish;
        const english = document.createElement("td");
        english.textContent = c.english;
        tr.append(spanish, english);
        table.appendChild(tr);
      });
      details.appendChild(table);
      section.appendChild(details);
    });

    el.view.appendChild(section);
  });
}

// ---------------------------------------------------------------
// Translate (free lookup via MyMemory, no API key)
// ---------------------------------------------------------------
function renderTranslate() {
  el.view.innerHTML = `
    <div id="translate-tool">
      <div class="translate-direction">
        <span id="lang-from">English</span>
        <button type="button" class="action" id="swap-langs" aria-label="Swap languages">⇄</button>
        <span id="lang-to">Spanish</span>
      </div>
      <textarea id="translate-input" rows="4" placeholder="Type text to translate... (Cmd/Ctrl+Enter to translate)"></textarea>
      <div class="controls">
        <button type="button" class="action know" id="translate-btn">Translate</button>
      </div>
      <div id="translate-output" class="translate-output" aria-live="polite"></div>
      <p class="translate-note">Free lookup via MyMemory -- quick and good for single words/phrases, not a substitute for a human.</p>
    </div>
  `;

  let direction = "en-es";

  const langFrom = document.getElementById("lang-from");
  const langTo = document.getElementById("lang-to");
  const input = document.getElementById("translate-input");
  const output = document.getElementById("translate-output");
  const translateBtn = document.getElementById("translate-btn");
  const swapBtn = document.getElementById("swap-langs");

  async function doTranslate() {
    const text = input.value.trim();
    if (!text) return;
    output.textContent = "Translating...";
    const langpair = direction === "en-es" ? "en|es" : "es|en";
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`
      );
      const data = await res.json();
      const translated = data?.responseData?.translatedText;
      if (!translated || /MYMEMORY WARNING/i.test(translated)) {
        throw new Error("Translation limit reached for today -- try again tomorrow.");
      }
      output.textContent = translated;
    } catch (err) {
      output.textContent = `Couldn't translate: ${err.message}`;
    }
  }

  translateBtn.addEventListener("click", doTranslate);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      doTranslate();
    }
  });

  swapBtn.addEventListener("click", () => {
    direction = direction === "en-es" ? "es-en" : "en-es";
    langFrom.textContent = direction === "en-es" ? "English" : "Spanish";
    langTo.textContent = direction === "en-es" ? "Spanish" : "English";
    const prevOutput = output.textContent;
    if (prevOutput && !/^(Translating|Couldn't)/.test(prevOutput)) {
      input.value = prevOutput;
    }
    output.textContent = "";
  });
}

// Keyboard shortcuts for flashcard view
document.addEventListener("keydown", (e) => {
  if (state.view !== "flashcards") return;
  if (e.key === " ") {
    e.preventDefault();
    state.flipped = !state.flipped;
    renderFlashcards();
  } else if (e.key === "ArrowRight") {
    nav(1);
  } else if (e.key === "ArrowLeft") {
    nav(-1);
  }
});

init();
