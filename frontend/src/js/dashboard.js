(() => {
  const API_BASE = "http://localhost:8080";
  // TODO: quando tiver login, pegar do localStorage/JWT. Por hora, fixo:
  const USER_ID = 1;

  const $ = (sel) => document.querySelector(sel);
  const els = {
    xp: () => $("#xpDisplay"),
    input: () => $("#taskInput"),
    add: () => $("#btnAdd"),
    list: () => $("#taskList"),
    empty: () => $("#taskEmpty"),
    loading: () => $("#taskLoading"),
    statTotal: () => $("#statTotal"),
    statDone: () => $("#statDone"),
    statOpen: () => $("#statOpen"),
  };

  // HTTP helpers
  const http = {
    async get(url) {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
      return r.json();
    },
    async post(url, body) {
      const opts = {
        method: "POST"
      };
      if (body !== undefined) {
        opts.headers = { "Content-Type": "application/json" };
        opts.body = JSON.stringify(body);
      }
      const r = await fetch(url, opts);
      if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
      return r.headers.get("content-length") === "0" ? null : r.json();
    },
    async del(url) {
      const r = await fetch(url, { method: "DELETE" });
      if (!r.ok && r.status !== 204) throw new Error(`${r.status} ${await r.text()}`);
    }
  };

  // API
  const api = {
    user: () => http.get(`${API_BASE}/api/users/${USER_ID}`),
    tasks: () => http.get(`${API_BASE}/api/tasks/user/${USER_ID}`),
    addTask: (title) => http.post(`${API_BASE}/api/tasks/add`, { title, userId: USER_ID }),
    complete: (id) => http.post(`${API_BASE}/api/tasks/complete/${id}`),
    remove: (id) => http.del(`${API_BASE}/api/tasks/${id}`),
  };

  // Render
  function renderXP(user) {
   const xpEl = els.xp();
  if (!xpEl) return; // evita quebrar renderização de tarefas
  xpEl.textContent = `XP: ${user?.xp ?? 0}`;
  }

  function renderSummary(tasks) {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const open = total - done;
    if (els.statTotal()) els.statTotal().textContent = total;
    if (els.statDone()) els.statDone().textContent = done;
    if (els.statOpen()) els.statOpen().textContent = open;
  }

  function renderTasks(tasks) {
    const list = els.list();
    const empty = els.empty();
    list.innerHTML = "";

    if (!tasks || tasks.length === 0) {
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    for (const t of tasks) {
      const li = document.createElement("li");
      li.className = "task-item";
      li.dataset.id = t.id;

      const title = document.createElement("span");
      title.className = "task-title" + (t.completed ? " completed" : "");
      title.textContent = t.title ?? t.text ?? `(sem título #${t.id ?? ''})`;

      const actions = document.createElement("div");
      actions.className = "actions";

      if (!t.completed) {
        const bDone = document.createElement("button");
        bDone.className = "btn complete";
        bDone.textContent = "Completar";
        bDone.addEventListener("click", async () => {
          await api.complete(t.id);
          await refresh();
        });
        actions.appendChild(bDone);
      }

      const bDel = document.createElement("button");
      bDel.className = "btn ghost";
      bDel.textContent = "Excluir";
      bDel.addEventListener("click", async () => {
        await api.remove(t.id);
        await refresh();
      });
      actions.appendChild(bDel);

      li.appendChild(title);
      li.appendChild(actions);
      list.appendChild(li);
    }
  }

  // Actions
  async function onAdd() {
    const input = els.input();
    const title = input.value.trim();
    if (!title) return;
    try {
      els.add().disabled = true;
      await api.addTask(title);
      input.value = "";
      await refresh();
    } catch (e) {
      console.error("AddTask error:", e);
      alert("Erro ao adicionar tarefa.");
    } finally {
      els.add().disabled = false;
    }
  }

  async function refresh() {
    try {
      if (els.loading()) els.loading().hidden = false;

      const [user, tasks] = await Promise.all([api.user(), api.tasks()]);
      renderXP(user);
      renderTasks(tasks);
      renderSummary(tasks);

    } catch (e) {
      console.error("Refresh error:", e);
    } finally {
      if (els.loading()) els.loading().hidden = true;
    }
  }

  // Init
  function init() {
    // events
    els.add().addEventListener("click", onAdd);
    els.input().addEventListener("keydown", (e) => {
      if (e.key === "Enter") onAdd();
    });

    // logout (placeholder)
    const logout = document.getElementById("logoutLink");
    if (logout) logout.addEventListener("click", (e) => {
      e.preventDefault();
      // Quando tiver login: localStorage.removeItem('auth');
      window.location.href = "index.html";
    });

    // primeira carga
    refresh();
  }

  document.addEventListener("DOMContentLoaded", init);
})();


(() => {
  // --- Pet reactions ---
  const SELECTORS = {
    petCard: '#pet-card',
    petImages: '#petImages',
    btnAdd: '#btnAdd',
    taskList: '#taskList',
  };

  
  const PET_IMAGES = [
    './src/images/Fox pink-Photoroom.png',
    './src/images/Fox pink-Photoroom-blink.gif',
    './src/images/Fox pink-Photoroom-blinking-smilling.gif',
    './src/images/Fox pink-Photoroom-smiling.gif',
  ];

  // --- State ---
  let petIndex = 0;

  // --- Utils ---
  const $ = (sel, root = document) => root.querySelector(sel);
  const petCard = $(SELECTORS.petCard);
  const petContainer = $(SELECTORS.petImages);

  function setPetImage(src) {
    if (!petContainer) return;
    petContainer.innerHTML = `<img src="${src}" alt="pet">`;
  }

  function nextPetImage() {
    if (!PET_IMAGES.length) return;
    petIndex = (petIndex + 1) % PET_IMAGES.length;
    setPetImage(PET_IMAGES[petIndex]);
  }

  function triggerPetState(stateClass, duration = 800) {
    if (!petCard) return;
    petCard.classList.add(stateClass);
    setTimeout(() => petCard.classList.remove(stateClass), duration);
  }

  // Exponha funções públicas para integrar com o resto do app
  window.onTaskAddedPetReact = function onTaskAddedPetReact() {
    nextPetImage();
    triggerPetState('happy');
  };

  window.onTaskCompletedPetReact = function onTaskCompletedPetReact() {
    nextPetImage();
    triggerPetState('celebrate');
  };

 
  const btnAdd = $(SELECTORS.btnAdd);
  if (btnAdd) {
    btnAdd.addEventListener('click', () => {
      
      window.onTaskAddedPetReact();
    });
  }

  const taskList = $(SELECTORS.taskList);
  if (taskList) {
    taskList.addEventListener('click', (e) => {
     
      if (e.target.matches('.complete, .complete *') || e.target.closest('.complete')) {
        window.onTaskCompletedPetReact();
      }
    });
  }

  
  if (PET_IMAGES.length && petContainer && !petContainer.querySelector('img')) {
    setPetImage(PET_IMAGES[0]);
  }
})();
