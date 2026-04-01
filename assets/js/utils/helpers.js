window.ExamApp = window.ExamApp || {};

window.ExamApp.helpers = (function () {
  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function nl2br(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function moveItem(array, fromIndex, toIndex) {
    if (!Array.isArray(array)) return;
    if (toIndex < 0 || toIndex >= array.length) return;
    const item = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, item);
  }

  function toNumberOrEmpty(value) {
    if (value === "" || value === null || value === undefined) return "";
    const num = Number(value);
    return Number.isNaN(num) ? "" : num;
  }

  return {
    escapeHtml,
    nl2br,
    clone,
    moveItem,
    toNumberOrEmpty
  };
})();