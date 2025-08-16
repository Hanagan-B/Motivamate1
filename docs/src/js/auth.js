(() => {
  const API = window.APP_CONFIG?.API_BASE || "http://localhost:8080";
  const msg = document.getElementById("authMsg");

  function showMsg(text, ok = false) {
    if (!msg) return;
    msg.textContent = text;
    msg.hidden = false;
    msg.className = "msg " + (ok ? "ok" : "err");
  }

  // --- Cadastro ---
  const formReg = document.getElementById("formRegister");
  if (formReg) {
    formReg.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const password = document.getElementById("regPassword").value;

      showMsg("Enviando...");

      try {
        const r = await fetch(`${API}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password })
        });

        const text = await r.text();
        if (!r.ok) throw new Error(text || `Erro ${r.status}`);

        // esperado: { token: "..." }
        const data = JSON.parse(text);
        localStorage.setItem("token", data.token);
        showMsg("Cadastro realizado! Redirecionando...", true);

        setTimeout(() => (window.location.href = "dashboard.html"), 600);
      } catch (err) {
        showMsg(err.message || "Falha no cadastro");
      }
    });
  }

  // --- Login ---
  const formLog = document.getElementById("formLogin");
  if (formLog) {
    formLog.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("logEmail").value.trim();
      const password = document.getElementById("logPassword").value;

      showMsg("Entrando...");

      try {
        const r = await fetch(`${API}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password })
        });

        const text = await r.text();
        if (!r.ok) throw new Error(text || `Erro ${r.status}`);

        // esperado: { token: "...", name: "..." }
        const data = JSON.parse(text);
        localStorage.setItem("token", data.token);
        localStorage.setItem("name", data.name || "");
        showMsg("Login OK! Redirecionando...", true);

        setTimeout(() => (window.location.href = "dashboard.html"), 600);
      } catch (err) {
        showMsg(err.message || "Falha no login");
      }
    });
  }
})();
