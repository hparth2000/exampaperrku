window.ExamApp = window.ExamApp || {};

window.ExamApp.adminRenderer = (function () {
  const helpers = window.ExamApp.helpers;

  function renderTextEditor(item, textAction, boldAction, sizeAction, label) {
    return `
      <div class="field">
        <label>${label}</label>
        <textarea oninput="${textAction}">${helpers.escapeHtml(item.text || "")}</textarea>
      </div>

      <div class="grid-2">
        <div class="field">
          <label>Font Size (blank = default)</label>
          <input type="number" min="8" max="48" value="${item.size ?? ""}" oninput="${sizeAction}">
        </div>

        <label class="check-row">
          <input type="checkbox" ${item.bold ? "checked" : ""} onchange="${boldAction}">
          Bold
        </label>
      </div>
    `;
  }

  function renderSectionMeta(sectionKey, section) {
    return `
      <div class="grid-3">
        <div class="field">
          <label>Label</label>
          <input value="${helpers.escapeHtml(section.label)}"
                 oninput="ExamApp.actions.setSectionMeta('${sectionKey}', 'label', this.value)">
        </div>

        <div class="field">
          <label>Title</label>
          <input value="${helpers.escapeHtml(section.title)}"
                 oninput="ExamApp.actions.setSectionMeta('${sectionKey}', 'title', this.value)">
        </div>

        <div class="field">
          <label>Marks</label>
          <input value="${helpers.escapeHtml(section.marks)}"
                 oninput="ExamApp.actions.setSectionMeta('${sectionKey}', 'marks', this.value)">
        </div>
      </div>
    `;
  }

  function renderSimpleSectionItems(sectionKey, items, heading) {
    return `
      <div class="section-card">
        <h2>${heading}</h2>
        ${renderSectionMeta(sectionKey, window.ExamApp.state.sections[sectionKey])}

        ${items.map(function (item, index) {
          return `
            <div class="item-box">
              <div class="item-head">
                <strong>${heading} ${index + 1}</strong>

                <div class="item-actions">
                  <button class="btn btn-secondary btn-sm" type="button"
                          onclick="ExamApp.actions.moveSimpleQuestion('${sectionKey}', ${index}, -1)">Up</button>

                  <button class="btn btn-secondary btn-sm" type="button"
                          onclick="ExamApp.actions.moveSimpleQuestion('${sectionKey}', ${index}, 1)">Down</button>

                  <button class="btn btn-danger btn-sm" type="button"
                          onclick="ExamApp.actions.removeSimpleQuestion('${sectionKey}', ${index})">Remove</button>
                </div>
              </div>

              ${renderTextEditor(
                item,
                `ExamApp.actions.setSimpleQuestionField('${sectionKey}', ${index}, 'text', this.value)`,
                `ExamApp.actions.setSimpleQuestionField('${sectionKey}', ${index}, 'bold', this.checked)`,
                `ExamApp.actions.setSimpleQuestionField('${sectionKey}', ${index}, 'size', this.value)`,
                "Question Text"
              )}
            </div>
          `;
        }).join("")}

        <div class="inline-actions">
          <button class="btn btn-primary" type="button"
                  onclick="ExamApp.actions.addSimpleQuestion('${sectionKey}')">+ Add Question</button>
        </div>
      </div>
    `;
  }

  function render(state) {
    const paper = state.paper;
    const mcq = state.sections.mcq;

    return `
      <div class="section-card">
        <h2>Paper Details</h2>

        <div class="field">
          <label>University</label>
          <input value="${helpers.escapeHtml(paper.university)}"
                 oninput="ExamApp.actions.setPaper('university', this.value)">
        </div>

        <div class="field">
          <label>Exam Name</label>
          <input value="${helpers.escapeHtml(paper.examName)}"
                 oninput="ExamApp.actions.setPaper('examName', this.value)">
        </div>

        <div class="field">
          <label>Semester</label>
          <input value="${helpers.escapeHtml(paper.semester)}"
                 oninput="ExamApp.actions.setPaper('semester', this.value)">
        </div>

        <div class="field">
          <label>Course Name</label>
          <input value="${helpers.escapeHtml(paper.courseName)}"
                 oninput="ExamApp.actions.setPaper('courseName', this.value)">
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Course Code</label>
            <input value="${helpers.escapeHtml(paper.courseCode)}"
                   oninput="ExamApp.actions.setPaper('courseCode', this.value)">
          </div>

          <div class="field">
            <label>Total Marks</label>
            <input value="${helpers.escapeHtml(paper.totalMarks)}"
                   oninput="ExamApp.actions.setPaper('totalMarks', this.value)">
          </div>
        </div>

        <div class="grid-2">
          <div class="field">
            <label>Date</label>
            <input value="${helpers.escapeHtml(paper.examDate)}"
                   oninput="ExamApp.actions.setPaper('examDate', this.value)">
          </div>

          <div class="field">
            <label>Duration</label>
            <input value="${helpers.escapeHtml(paper.duration)}"
                   oninput="ExamApp.actions.setPaper('duration', this.value)">
          </div>
        </div>

        <div class="field">
          <label>Time</label>
          <input value="${helpers.escapeHtml(paper.examTime)}"
                 oninput="ExamApp.actions.setPaper('examTime', this.value)">
        </div>

        <div class="field">
          <label>Footer Stars</label>
          <input value="${helpers.escapeHtml(paper.footerStars)}"
                 oninput="ExamApp.actions.setPaper('footerStars', this.value)">
        </div>
      </div>

      <div class="section-card">
        <h2>Paper Style</h2>

        <div class="grid-2">
          <div class="field">
            <label>Font Family</label>
            <select onchange="ExamApp.actions.setPaper('fontFamily', this.value)">
              <option value="century" ${paper.fontFamily === "century" ? "selected" : ""}>Century</option>
              <option value="times" ${paper.fontFamily === "times" ? "selected" : ""}>Times New Roman</option>
              <option value="georgia" ${paper.fontFamily === "georgia" ? "selected" : ""}>Georgia</option>
              <option value="arial" ${paper.fontFamily === "arial" ? "selected" : ""}>Arial</option>
              <option value="calibri" ${paper.fontFamily === "calibri" ? "selected" : ""}>Calibri</option>
            </select>
          </div>

          <div class="field">
            <label>Base Font Size</label>
            <input type="number" min="8" max="48" value="${paper.baseSize}"
                   oninput="ExamApp.actions.setPaper('baseSize', this.value)">
          </div>
        </div>

        <div class="grid-3">
          <div class="field">
            <label>Title Size</label>
            <input type="number" min="8" max="48" value="${paper.titleSize}"
                   oninput="ExamApp.actions.setPaper('titleSize', this.value)">
          </div>

          <div class="field">
            <label>Meta Size</label>
            <input type="number" min="8" max="48" value="${paper.metaSize}"
                   oninput="ExamApp.actions.setPaper('metaSize', this.value)">
          </div>

          <div class="field">
            <label>Footer Size</label>
            <input type="number" min="8" max="48" value="${paper.footerSize}"
                   oninput="ExamApp.actions.setPaper('footerSize', this.value)">
          </div>
        </div>

        <div class="grid-4">
          <div class="field">
            <label>Instruction Title</label>
            <input type="number" min="8" max="48" value="${paper.instructionTitleSize}"
                   oninput="ExamApp.actions.setPaper('instructionTitleSize', this.value)">
          </div>

          <div class="field">
            <label>Instruction</label>
            <input type="number" min="8" max="48" value="${paper.instructionSize}"
                   oninput="ExamApp.actions.setPaper('instructionSize', this.value)">
          </div>

          <div class="field">
            <label>Section Title</label>
            <input type="number" min="8" max="48" value="${paper.sectionTitleSize}"
                   oninput="ExamApp.actions.setPaper('sectionTitleSize', this.value)">
          </div>

          <div class="field">
            <label>Question</label>
            <input type="number" min="8" max="48" value="${paper.questionSize}"
                   oninput="ExamApp.actions.setPaper('questionSize', this.value)">
          </div>
        </div>

        <div class="field">
          <label>Option Size</label>
          <input type="number" min="8" max="48" value="${paper.optionSize}"
                 oninput="ExamApp.actions.setPaper('optionSize', this.value)">
        </div>

        <div class="grid-2">
          <label class="check-row">
            <input type="checkbox" ${paper.paperTextBold ? "checked" : ""}
                   onchange="ExamApp.actions.setPaperBool('paperTextBold', this.checked)">
            Global Paper Bold
          </label>

          <label class="check-row">
            <input type="checkbox" ${paper.titleBold ? "checked" : ""}
                   onchange="ExamApp.actions.setPaperBool('titleBold', this.checked)">
            Title Bold
          </label>
        </div>

        <div class="grid-2">
          <label class="check-row">
            <input type="checkbox" ${paper.metaBold ? "checked" : ""}
                   onchange="ExamApp.actions.setPaperBool('metaBold', this.checked)">
            Meta Bold
          </label>

          <label class="check-row">
            <input type="checkbox" ${paper.instructionsBold ? "checked" : ""}
                   onchange="ExamApp.actions.setPaperBool('instructionsBold', this.checked)">
            Instructions Bold
          </label>
        </div>

        <label class="check-row">
          <input type="checkbox" ${paper.sectionTitleBold ? "checked" : ""}
                 onchange="ExamApp.actions.setPaperBool('sectionTitleBold', this.checked)">
          Section Title Bold
        </label>

        <div class="helper-text">
          Century uses fallback stack: Century Schoolbook → Century → Times New Roman → serif
        </div>
      </div>

      <div class="section-card">
        <h2>Instructions</h2>

        ${state.instructions.map(function (item, index) {
          return `
            <div class="item-box">
              <div class="item-head">
                <strong>Instruction ${index + 1}</strong>

                <div class="item-actions">
                  <button class="btn btn-secondary btn-sm" type="button"
                          onclick="ExamApp.actions.moveInstruction(${index}, -1)">Up</button>

                  <button class="btn btn-secondary btn-sm" type="button"
                          onclick="ExamApp.actions.moveInstruction(${index}, 1)">Down</button>

                  <button class="btn btn-danger btn-sm" type="button"
                          onclick="ExamApp.actions.removeInstruction(${index})">Remove</button>
                </div>
              </div>

              ${renderTextEditor(
                item,
                `ExamApp.actions.setInstructionField(${index}, 'text', this.value)`,
                `ExamApp.actions.setInstructionField(${index}, 'bold', this.checked)`,
                `ExamApp.actions.setInstructionField(${index}, 'size', this.value)`,
                "Instruction Text"
              )}
            </div>
          `;
        }).join("")}

        <div class="inline-actions">
          <button class="btn btn-primary" type="button" onclick="ExamApp.actions.addInstruction()">+ Add Instruction</button>
        </div>
      </div>

      <div class="section-card">
        <h2>MCQ Section</h2>

        ${renderSectionMeta("mcq", mcq)}

        ${mcq.items.map(function (mcqItem, index) {
          return `
            <div class="item-box">
              <div class="item-head">
                <strong>MCQ ${index + 1}</strong>

                <div class="item-actions">
                  <button class="btn btn-secondary btn-sm" type="button"
                          onclick="ExamApp.actions.moveMcq(${index}, -1)">Up</button>

                  <button class="btn btn-secondary btn-sm" type="button"
                          onclick="ExamApp.actions.moveMcq(${index}, 1)">Down</button>

                  <button class="btn btn-danger btn-sm" type="button"
                          onclick="ExamApp.actions.removeMcq(${index})">Remove</button>
                </div>
              </div>

              ${renderTextEditor(
                mcqItem.question,
                `ExamApp.actions.setMcqQuestionField(${index}, 'text', this.value)`,
                `ExamApp.actions.setMcqQuestionField(${index}, 'bold', this.checked)`,
                `ExamApp.actions.setMcqQuestionField(${index}, 'size', this.value)`,
                "Question"
              )}

              ${mcqItem.options.map(function (option, optionIndex) {
                return `
                  <div class="option-box">
                    <div class="item-head">
                      <strong>Option ${String.fromCharCode(65 + optionIndex)}</strong>

                      <div class="item-actions">
                        <button class="btn btn-secondary btn-sm" type="button"
                                onclick="ExamApp.actions.moveMcqOption(${index}, ${optionIndex}, -1)">Up</button>

                        <button class="btn btn-secondary btn-sm" type="button"
                                onclick="ExamApp.actions.moveMcqOption(${index}, ${optionIndex}, 1)">Down</button>

                        <button class="btn btn-danger btn-sm" type="button"
                                onclick="ExamApp.actions.removeMcqOption(${index}, ${optionIndex})">Remove</button>
                      </div>
                    </div>

                    ${renderTextEditor(
                      option,
                      `ExamApp.actions.setMcqOptionField(${index}, ${optionIndex}, 'text', this.value)`,
                      `ExamApp.actions.setMcqOptionField(${index}, ${optionIndex}, 'bold', this.checked)`,
                      `ExamApp.actions.setMcqOptionField(${index}, ${optionIndex}, 'size', this.value)`,
                      "Option Text"
                    )}
                  </div>
                `;
              }).join("")}

              <div class="inline-actions">
                <button class="btn btn-warning" type="button"
                        onclick="ExamApp.actions.addMcqOption(${index})">+ Add Option</button>
              </div>
            </div>
          `;
        }).join("")}

        <div class="inline-actions">
          <button class="btn btn-primary" type="button" onclick="ExamApp.actions.addMcq()">+ Add MCQ</button>
        </div>
      </div>

      ${renderSimpleSectionItems("short", state.sections.short.items, "Short Question")}
      ${renderSimpleSectionItems("brief", state.sections.brief.items, "Brief Question")}
      ${renderSimpleSectionItems("detail", state.sections.detail.items, "Detail Question")}
    `;
  }

  return {
    render
  };
})();