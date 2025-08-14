(() => {
  const API_BASE = "http://localhost:8080";
  // TODO: quando tiver login, pegar do localStorage/JWT. Por hora, fixo:
  const USER_ID = 1;

  const $ = (sel) => document.querySelector(sel);
  const els = {
    xp:      () => $("#xpDisplay"),
    input:   () => $("#taskInput"),
    add:     () => $("#btnAdd"),
    list:    () => $("#taskList"),
    empty:   () => $("#taskEmpty"),
    loading: () => $("#taskLoading"),
    statTotal: () => $("#statTotal"),
    statDone:  () => $("#statDone"),
    statOpen:  () => $("#statOpen"),
  };

  // HTTP helpers
  const http = {
    async get(url) {
      const r = await fetch(url);
      if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
      return r.json();
    },
    async post(url, body) {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : null
      });
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
    user:     () => http.get(`${API_BASE}/api/users/${USER_ID}`),
    tasks:    () => http.get(`${API_BASE}/api/tasks/user/${USER_ID}`),
    addTask:  (title) => http.post(`${API_BASE}/api/tasks/add`, { title, userId: USER_ID }),
    complete: (id) => http.post(`${API_BASE}/api/tasks/complete/${id}`),
    remove:   (id) => http.del(`${API_BASE}/api/tasks/${id}`),
  };

  // Render
  function renderXP(user) {
    els.xp().textContent = `XP: ${user?.xp ?? 0}`;
  }

  function renderSummary(tasks) {
    const total = tasks.length;
    const done = tasks.filter(t => t.completed).length;
    const open = total - done;
    if (els.statTotal()) els.statTotal().textContent = total;
    if (els.statDone()) els.statDone().textContent  = done;
    if (els.statOpen()) els.statOpen().textContent  = open;
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
      title.textContent = t.text;

      const actions = document.createElement("div");
      actions.className = "actions";

      if (!t.completed) {
        const bDone = document.createElement("button");
        bDone.className = "btn";
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

  // Ações
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
    // eventos
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
