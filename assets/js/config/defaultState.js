window.ExamApp = window.ExamApp || {};

window.ExamApp.defaultState = (function () {
  function makeText(text) {
    return {
      text: text || "",
      bold: false,
      size: ""
    };
  }

  function create() {
    return {
      paper: {
        university: "RK UNIVERSITY",
        examName: "BVOC CIE 2",
        semester: "Semester - 2",
        courseName: "Object Oriented Programming - I",
        courseCode: "BIT214",
        totalMarks: "50",
        examDate: "23/03/2026",
        duration: "1.5 hrs.",
        examTime: "7:45 AM TO 9:15 AM",
        footerStars: "*************",

        fontFamily: "century",
        baseSize: 17,
        titleSize: 24,
        metaSize: 18,
        instructionTitleSize: 18,
        instructionSize: 18,
        sectionTitleSize: 18,
        questionSize: 17,
        optionSize: 17,
        footerSize: 18,

        paperTextBold: false,
        titleBold: true,
        metaBold: true,
        instructionsBold: true,
        sectionTitleBold: true
      },

      instructions: [
        makeText("Attempt all questions."),
        makeText("Make suitable assumptions wherever necessary."),
        makeText("Figures to the right indicate full marks."),
        makeText("Programmable calculators are not permitted.")
      ],

      sections: {
        mcq: {
          label: "Q.1",
          title: "Multiple Choice Questions.",
          marks: "5",
          items: [
            {
              question: makeText("What is a module in Python?"),
              options: [
                makeText("Function"),
                makeText("File containing Python code"),
                makeText("Variable"),
                makeText("Class")
              ]
            }
          ]
        },

        short: {
          label: "Q.2",
          title: "Write Short Answers : (Any 5 out of 7)",
          marks: "10",
          items: [
            makeText("What is a module in Python?"),
            makeText("What is a dictionary in Python?")
          ]
        },

        brief: {
          label: "Q.3",
          title: "Answer in brief : (Any 3 out of 4)",
          marks: "15",
          items: [
            makeText("Explain reading and writing JSON files in Python.")
          ]
        },

        detail: {
          label: "Q.4",
          title: "Answer in detail: (Any 2 out of 3)",
          marks: "20",
          items: [
            makeText("Explain relational operators in Java with examples.")
          ]
        }
      }
    };
  }

  return {
    makeText,
    create
  };
})();