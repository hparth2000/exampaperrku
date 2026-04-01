window.ExamApp = window.ExamApp || {};

(function () {
  const helpers = window.ExamApp.helpers;
  const defaultState = window.ExamApp.defaultState;
  const storageService = window.ExamApp.storageService;
  const adminRenderer = window.ExamApp.adminRenderer;
  const paperRenderer = window.ExamApp.paperRenderer;

  const app = window.ExamApp;

  app.state = storageService.load() || defaultState.create();

  function saveState() {
    storageService.save(app.state);
  }

  function renderAdmin() {
    const adminPanel = document.getElementById("adminPanel");
    adminPanel.innerHTML = adminRenderer.render(app.state);
  }

  function renderPaper() {
    const preview = document.getElementById("paperPreview");
    preview.innerHTML = paperRenderer.render(app.state);
  }

  function renderAll() {
    renderAdmin();
    renderPaper();
    saveState();
  }

  function setPaper(field, value) {
    const numericFields = [
      "baseSize",
      "titleSize",
      "metaSize",
      "instructionTitleSize",
      "instructionSize",
      "sectionTitleSize",
      "questionSize",
      "optionSize",
      "footerSize"
    ];

    app.state.paper[field] = numericFields.includes(field)
      ? helpers.toNumberOrEmpty(value)
      : value;

    renderPaper();
    saveState();
  }

  function setPaperBool(field, checked) {
    app.state.paper[field] = !!checked;
    renderPaper();
    saveState();
  }

  function setSectionMeta(sectionKey, field, value) {
    app.state.sections[sectionKey][field] = value;
    renderPaper();
    saveState();
  }

  function addInstruction() {
    app.state.instructions.push(defaultState.makeText("New instruction"));
    renderAll();
  }

  function removeInstruction(index) {
    app.state.instructions.splice(index, 1);
    renderAll();
  }

  function moveInstruction(index, direction) {
    helpers.moveItem(app.state.instructions, index, index + direction);
    renderAll();
  }

  function setInstructionField(index, field, value) {
    if (field === "size") {
      app.state.instructions[index][field] = helpers.toNumberOrEmpty(value);
    } else {
      app.state.instructions[index][field] = field === "bold" ? !!value : value;
    }

    renderPaper();
    saveState();
  }

  function addSimpleQuestion(sectionKey) {
    app.state.sections[sectionKey].items.push(defaultState.makeText("New question"));
    renderAll();
  }

  function removeSimpleQuestion(sectionKey, index) {
    app.state.sections[sectionKey].items.splice(index, 1);
    renderAll();
  }

  function moveSimpleQuestion(sectionKey, index, direction) {
    helpers.moveItem(app.state.sections[sectionKey].items, index, index + direction);
    renderAll();
  }

  function setSimpleQuestionField(sectionKey, index, field, value) {
    if (field === "size") {
      app.state.sections[sectionKey].items[index][field] = helpers.toNumberOrEmpty(value);
    } else {
      app.state.sections[sectionKey].items[index][field] = field === "bold" ? !!value : value;
    }

    renderPaper();
    saveState();
  }

  function addMcq() {
    app.state.sections.mcq.items.push({
      question: defaultState.makeText("New MCQ question"),
      options: [
        defaultState.makeText("Option A"),
        defaultState.makeText("Option B"),
        defaultState.makeText("Option C"),
        defaultState.makeText("Option D")
      ]
    });

    renderAll();
  }

  function removeMcq(index) {
    app.state.sections.mcq.items.splice(index, 1);
    renderAll();
  }

  function moveMcq(index, direction) {
    helpers.moveItem(app.state.sections.mcq.items, index, index + direction);
    renderAll();
  }

  function setMcqQuestionField(index, field, value) {
    if (field === "size") {
      app.state.sections.mcq.items[index].question[field] = helpers.toNumberOrEmpty(value);
    } else {
      app.state.sections.mcq.items[index].question[field] = field === "bold" ? !!value : value;
    }

    renderPaper();
    saveState();
  }

  function addMcqOption(index) {
    app.state.sections.mcq.items[index].options.push(defaultState.makeText("New option"));
    renderAll();
  }

  function removeMcqOption(index, optionIndex) {
    app.state.sections.mcq.items[index].options.splice(optionIndex, 1);
    renderAll();
  }

  function moveMcqOption(index, optionIndex, direction) {
    helpers.moveItem(
      app.state.sections.mcq.items[index].options,
      optionIndex,
      optionIndex + direction
    );
    renderAll();
  }

  function setMcqOptionField(index, optionIndex, field, value) {
    if (field === "size") {
      app.state.sections.mcq.items[index].options[optionIndex][field] = helpers.toNumberOrEmpty(value);
    } else {
      app.state.sections.mcq.items[index].options[optionIndex][field] = field === "bold" ? !!value : value;
    }

    renderPaper();
    saveState();
  }

  function saveNow() {
    saveState();
    alert("Saved successfully.");
  }

  function loadSaved() {
    const saved = storageService.load();
    if (!saved) {
      alert("No saved data found.");
      return;
    }

    app.state = saved;
    renderAll();
    alert("Loaded saved data.");
  }

  function resetState() {
    if (!confirm("Reset all data?")) return;
    app.state = defaultState.create();
    storageService.save(app.state);
    renderAll();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(app.state, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "exam-paper-data.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJsonFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(reader.result);
        app.state = parsed;
        renderAll();
        alert("JSON imported successfully.");
      } catch (error) {
        console.error(error);
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  }

  function bindTopButtons() {
    document.getElementById("btnSave").addEventListener("click", saveNow);
    document.getElementById("btnLoad").addEventListener("click", loadSaved);
    document.getElementById("btnExportJson").addEventListener("click", exportJson);

    document.getElementById("btnImportJson").addEventListener("click", function () {
      document.getElementById("jsonInput").click();
    });

    document.getElementById("btnReset").addEventListener("click", resetState);
    document.getElementById("btnPrint").addEventListener("click", function () {
      window.print();
    });

    document.getElementById("jsonInput").addEventListener("change", function (event) {
      const file = event.target.files[0];
      importJsonFile(file);
      event.target.value = "";
    });
  }

  app.actions = {
    setPaper,
    setPaperBool,
    setSectionMeta,

    addInstruction,
    removeInstruction,
    moveInstruction,
    setInstructionField,

    addSimpleQuestion,
    removeSimpleQuestion,
    moveSimpleQuestion,
    setSimpleQuestionField,

    addMcq,
    removeMcq,
    moveMcq,
    setMcqQuestionField,

    addMcqOption,
    removeMcqOption,
    moveMcqOption,
    setMcqOptionField
  };

  app.renderAll = renderAll;

  document.addEventListener("DOMContentLoaded", function () {
    bindTopButtons();
    renderAll();
  });
})();