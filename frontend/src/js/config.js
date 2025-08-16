// src/js/config.js
(() => {
  // 1) override via query string (?api=https://meu-backend.com)
  const usp = new URLSearchParams(location.search);
  const qsApi = usp.get("api");
  if (qsApi) {
    localStorage.setItem("API_BASE", qsApi);
  }

  // 2) override via localStorage
  const lsApi = localStorage.getItem("API_BASE");

  // 3) auto: dev (localhost/127.0.0.1) vs produção (github pages)
  const auto = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://SEU-BACKEND-PUBLICO.exemplo.com"; // <-- troque pela URL do backend hospedado (https)

  window.APP_CONFIG = {
    API_BASE: lsApi || auto
  };
})();
