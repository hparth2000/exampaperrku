window.ExamApp = window.ExamApp || {};

window.ExamApp.paperRenderer = (function () {
  const helpers = window.ExamApp.helpers;

  const fontMap = {
    century: '"Century Schoolbook", "Century", "Times New Roman", serif',
    times: '"Times New Roman", Times, serif',
    georgia: 'Georgia, serif',
    arial: 'Arial, Helvetica, sans-serif',
    calibri: 'Calibri, Arial, sans-serif'
  };

  function resolveWeight(itemBold, defaultBold, globalBold) {
    if (typeof itemBold === "boolean") {
      return itemBold ? 700 : 400;
    }
    if (defaultBold) return 700;
    return globalBold ? 700 : 400;
  }

  function renderTextItem(item, fallbackSize, defaultBold, globalBold) {
    const size = item && item.size ? item.size : fallbackSize;
    const weight = resolveWeight(item ? item.bold : undefined, defaultBold, globalBold);
    const text = helpers.nl2br(item ? item.text : "");
    return `<span style="font-size:${size}px;font-weight:${weight};">${text}</span>`;
  }

  function renderSimpleRows(items, paper) {
    return items.map(function (item, index) {
      return `
        <tr>
          <td class="paper-blank"></td>
          <td class="paper-q-num">${index + 1}</td>
          <td colspan="2">${renderTextItem(item, paper.questionSize, false, paper.paperTextBold)}</td>
          <td class="paper-blank"></td>
        </tr>
      `;
    }).join("");
  }

  function renderMcqRows(items, paper) {
    return items.map(function (item, index) {
      const optionsHtml = item.options.map(function (option, optionIndex) {
        return `
          <tr>
            <td class="paper-blank"></td>
            <td class="paper-blank"></td>
            <td class="paper-q-opt">${String.fromCharCode(97 + optionIndex)}</td>
            <td>${renderTextItem(option, paper.optionSize, false, paper.paperTextBold)}</td>
            <td class="paper-blank"></td>
          </tr>
        `;
      }).join("");

      return `
        <tr>
          <td class="paper-blank"></td>
          <td class="paper-q-num">${index + 1}</td>
          <td colspan="2">${renderTextItem(item.question, paper.questionSize, false, paper.paperTextBold)}</td>
          <td class="paper-blank"></td>
        </tr>
        ${optionsHtml}
      `;
    }).join("");
  }

  function renderSection(section, rowsHtml, paper) {
    return `
      <tr>
        <td class="paper-q-label">${helpers.escapeHtml(section.label)}</td>
        <td colspan="3" style="font-size:${paper.sectionTitleSize}px;font-weight:${paper.sectionTitleBold ? 700 : (paper.paperTextBold ? 700 : 400)};">
          ${helpers.escapeHtml(section.title)}
        </td>
        <td class="paper-q-marks">${helpers.escapeHtml(section.marks)}</td>
      </tr>
      ${rowsHtml}
    `;
  }

  function render(state) {
    const paper = state.paper;
    const family = fontMap[paper.fontFamily] || fontMap.century;
    const globalWeight = paper.paperTextBold ? 700 : 400;

    return `
      <div class="paper-page" style="font-family:${family};font-size:${paper.baseSize}px;font-weight:${globalWeight};">
        <div class="paper-title">
          <div style="font-size:${paper.titleSize}px;font-weight:${paper.titleBold ? 700 : globalWeight};">
            ${helpers.escapeHtml(paper.university)}
          </div>
          <div style="font-size:${paper.titleSize}px;font-weight:${paper.titleBold ? 700 : globalWeight};">
            ${helpers.escapeHtml(paper.examName)}
          </div>
          <div style="font-size:${paper.titleSize}px;font-weight:${paper.titleBold ? 700 : globalWeight};">
            ${helpers.escapeHtml(paper.semester)}
          </div>
        </div>

        <div class="paper-meta" style="font-size:${paper.metaSize}px;font-weight:${paper.metaBold ? 700 : globalWeight};">
          <div>
            <div>Course Name: ${helpers.escapeHtml(paper.courseName)}</div>
            <div>Course Code: ${helpers.escapeHtml(paper.courseCode)}</div>
            <div>Total Marks: ${helpers.escapeHtml(paper.totalMarks)}</div>
            <div>Date: ${helpers.escapeHtml(paper.examDate)}</div>
          </div>

          <div class="paper-meta-right">
            <div>Duration: ${helpers.escapeHtml(paper.duration)}</div>
            <div>Time: ${helpers.escapeHtml(paper.examTime)}</div>
          </div>
        </div>

        <div class="paper-instructions-title" style="font-size:${paper.instructionTitleSize}px;font-weight:${paper.instructionsBold ? 700 : globalWeight};">
          Instructions for students:
        </div>

        <ol class="paper-instructions-list" style="font-size:${paper.instructionSize}px;font-weight:${paper.instructionsBold ? 700 : globalWeight};">
          ${state.instructions.map(function (item) {
            return `<li>${renderTextItem(item, paper.instructionSize, paper.instructionsBold, paper.paperTextBold)}</li>`;
          }).join("")}
        </ol>

        <table class="paper-table">
          <colgroup>
            <col style="width:54px">
            <col style="width:56px">
            <col style="width:40px">
            <col>
            <col style="width:58px">
          </colgroup>

          ${renderSection(state.sections.mcq, renderMcqRows(state.sections.mcq.items, paper), paper)}
          ${renderSection(state.sections.short, renderSimpleRows(state.sections.short.items, paper), paper)}
          ${renderSection(state.sections.brief, renderSimpleRows(state.sections.brief.items, paper), paper)}
          ${renderSection(state.sections.detail, renderSimpleRows(state.sections.detail.items, paper), paper)}
        </table>

        <div class="paper-footer-stars" style="font-size:${paper.footerSize}px;font-weight:${globalWeight};">
          ${helpers.escapeHtml(paper.footerStars)}
        </div>
      </div>
    `;
  }

  return {
    render
  };
})();