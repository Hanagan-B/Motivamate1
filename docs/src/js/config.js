
(() => {
  
  const usp = new URLSearchParams(location.search);
  const qsApi = usp.get("api");
  if (qsApi) {
    localStorage.setItem("API_BASE", qsApi);
  }

  
  const lsApi = localStorage.getItem("API_BASE");

  
  const auto = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "http://localhost:8080"
    : "https://motivamate-production.up.railway.app"; 

  
  window.APP_CONFIG = {
    API_BASE: qsApi || lsApi || auto
  };
})();
