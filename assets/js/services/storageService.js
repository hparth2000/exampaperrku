window.ExamApp = window.ExamApp || {};

window.ExamApp.storageService = (function () {
  const STORAGE_KEY = "exam_paper_admin_state_v1";

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function load() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch (error) {
      console.error("Failed to parse saved state:", error);
      return null;
    }
  }

  function clear() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    save,
    load,
    clear
  };
})();