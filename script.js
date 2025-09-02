// ---------- DOM Elements ----------
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startButton = document.getElementById("start-btn");
const questionText = document.getElementById("question-text");
const answersContainer = document.getElementById("answers-container");
const currentQuestionSpan = document.getElementById("current-question");
const totalQuestionsSpan = document.getElementById("total-questions");
const scoreSpan = document.getElementById("score");
const finalScoreSpan = document.getElementById("final-score");
const maxScoreSpan = document.getElementById("max-score");
const resultMessage = document.getElementById("result-message");
const restartButton = document.getElementById("restart-btn");
const progressBar = document.getElementById("progress");

// ---------- Quiz Data ----------
const quizQuestions = [
  {
    question: "What is Verah's Favorite color?",
    answers: [
      { text: "Yellow", correct: false },
      { text: "Green", correct: false },
      { text: "Blue", correct: true },
      { text: "Violet", correct: false }
    ]
  },
  {
    question: "What is Verah's Star sign?",
    answers: [
      { text: "Aquarius", correct: false },
      { text: "Scorpio", correct: true },
      { text: "Aries", correct: false },
      { text: "Virgo", correct: false }
    ]
  },
  {
    question: "Who was Verah's favorite childhood superhero?",
    answers: [
      { text: "Spiderman", correct: false },
      { text: "Ironman", correct: false },
      { text: "Green Lantern", correct: false },
      { text: "Batman", correct: true }
    ]
  },
  {
    question: "What extracurricular did Verah do the longest?",
    answers: [
      { text: "Volleyball", correct: false },
      { text: "Ballet", correct: false },
      { text: "Wushu", correct: true },
      { text: "Urban Dance", correct: false }
    ]
  },
  {
    question: "How many medals have Verah won in total?",
    answers: [
      { text: "13", correct: false },
      { text: "19", correct: false },
      { text: "21", correct: true },
      { text: "17", correct: false }
    ]
  },
  {
    question: "What time was Verah born?",
    answers: [
      { text: "12:30pm", correct: false },
      { text: "4:00am", correct: false },
      { text: "11:40am", correct: true },
      { text: "8:20pm", correct: false }
    ]
  }
];

// ---------- State ----------
let currentQuestionIndex = 0;
let score = 0;
let answersDisabled = false;

totalQuestionsSpan.textContent = quizQuestions.length;
maxScoreSpan.textContent = quizQuestions.length;

// ---------- Screen helpers ----------
function showStartScreen() {
  startScreen.classList.add("screen-active");
  quizScreen.classList.remove("screen-active");
  resultScreen.classList.remove("screen-active");
}

function showQuizScreen() {
  startScreen.classList.remove("screen-active");
  quizScreen.classList.add("screen-active");
  resultScreen.classList.remove("screen-active");
}

function showResultScreen() {
  startScreen.classList.remove("screen-active");
  quizScreen.classList.remove("screen-active");
  resultScreen.classList.add("screen-active");
}

// ---------- Quiz Flow ----------
function startQuiz() {
  // reset state
  currentQuestionIndex = 0;
  score = 0;
  answersDisabled = false;

  // reset UI
  scoreSpan.textContent = "0";
  currentQuestionSpan.textContent = "1";
  setProgress(0);

  showQuizScreen();
  renderQuestion();
}

function renderQuestion() {
  const q = quizQuestions[currentQuestionIndex];
  questionText.textContent = q.question;

  // Clear previous answers
  answersContainer.innerHTML = "";

  q.answers.forEach(({ text, correct }) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = text;
    btn.dataset.correct = String(!!correct);

    btn.addEventListener("click", () => handleAnswerClick(btn));
    answersContainer.appendChild(btn);
  });

  // Update heads-up info
  currentQuestionSpan.textContent = String(currentQuestionIndex + 1);
  setProgress((currentQuestionIndex / quizQuestions.length) * 100);
  answersDisabled = false;
}

function handleAnswerClick(buttonEl) {
  if (answersDisabled) return;
  answersDisabled = true;

  const isCorrect = buttonEl.dataset.correct === "true";
  if (isCorrect) {
    score += 1;
    scoreSpan.textContent = String(score);
    buttonEl.classList.add("correct");
  } else {
    buttonEl.classList.add("incorrect");
  }

  // Reveal the correct answer
  Array.from(answersContainer.children).forEach((btn) => {
    if (btn.dataset.correct === "true") {
      btn.classList.add("correct");
    }
    // Lock all choices
    btn.disabled = true;
  });

  // Advance after a short pause
  setTimeout(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      currentQuestionIndex = nextIndex;
      renderQuestion();
    } else {
      // Finish
      setProgress(100);
      showResults();
    }
  }, 800);
}

function setProgress(percent) {
  progressBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
}

function showResults() {
  finalScoreSpan.textContent = String(score);

  // Friendly message based on performance
  const total = quizQuestions.length;
  const pct = (score / total) * 100;

  let msg = "Nice try!";
  if (pct === 100) msg = "Perfect! You know Verah by heart. 💯";
  else if (pct >= 80) msg = "Awesome job! Almost perfect. 🌟";
  else if (pct >= 60) msg = "Good work! You know Verah pretty well. 🙂";
  else msg = "Keep trying—you’ll get to know Verah even better! 💪";

  resultMessage.textContent = msg;

  showResultScreen();
}

function restartQuiz() {
  // Go back to the start screen to let the user begin again
  showStartScreen();
}

// ---------- Events ----------
startButton.addEventListener("click", startQuiz);
restartButton.addEventListener("click", restartQuiz);

// Ensure initial view is the start screen
showStartScreen();
