const questions = window.TOEIC_QUESTIONS || [];
const stateKey = "toeic-375-to-550-practice-v1";

const state = JSON.parse(localStorage.getItem(stateKey) || "{}");
state.answered ||= {};
state.correct ||= {};
state.wrong ||= {};
state.starred ||= {};
state.streak ||= 0;

const els = {
  answeredCount: document.querySelector("#answeredCount"),
  accuracyRate: document.querySelector("#accuracyRate"),
  streakCount: document.querySelector("#streakCount"),
  reviewCount: document.querySelector("#reviewCount"),
  partFilter: document.querySelector("#partFilter"),
  focusFilter: document.querySelector("#focusFilter"),
  difficultyFilter: document.querySelector("#difficultyFilter"),
  shuffleToggle: document.querySelector("#shuffleToggle"),
  nextButton: document.querySelector("#nextButton"),
  resetButton: document.querySelector("#resetButton"),
  progressText: document.querySelector("#progressText"),
  progressBar: document.querySelector("#progressBar"),
  wrongList: document.querySelector("#wrongList"),
  partLabel: document.querySelector("#partLabel"),
  skillLabel: document.querySelector("#skillLabel"),
  difficultyLabel: document.querySelector("#difficultyLabel"),
  starButton: document.querySelector("#starButton"),
  questionNumber: document.querySelector("#questionNumber"),
  promptBox: document.querySelector("#promptBox"),
  questionText: document.querySelector("#questionText"),
  options: document.querySelector("#options"),
  actions: document.querySelector("#actions"),
  explanation: document.querySelector("#explanation"),
};

let current = null;
let orderedIndex = 0;
let selectedKey = "";

function save() {
  localStorage.setItem(stateKey, JSON.stringify(state));
  renderStats();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[char]));
}

function partNames() {
  return [...new Set(questions.map((question) => question.part))];
}

function getPool() {
  const focus = els.focusFilter.value;
  return questions.filter((question) => {
    if (els.partFilter.value !== "all" && question.part !== els.partFilter.value) return false;
    if (els.difficultyFilter.value !== "all" && question.level !== els.difficultyFilter.value) return false;
    if ((focus === "all" || focus === "unseen") && state.answered[question.id]) return false;
    if (focus === "wrong" && !state.wrong[question.id]) return false;
    if (focus === "starred" && !state.starred[question.id]) return false;
    return true;
  });
}

function pickQuestion() {
  const pool = getPool();
  selectedKey = "";

  if (!pool.length) {
    current = null;
    renderQuestion();
    return;
  }

  if (els.shuffleToggle.checked) {
    current = pool[Math.floor(Math.random() * pool.length)];
  } else {
    current = pool[orderedIndex % pool.length];
    orderedIndex += 1;
  }

  renderQuestion();
}

function renderQuestion() {
  els.options.innerHTML = "";
  els.actions.innerHTML = "";
  els.explanation.className = "explanation";
  els.explanation.innerHTML = "";

  if (!current) {
    els.partLabel.textContent = "沒有題目";
    els.skillLabel.textContent = "-";
    els.difficultyLabel.textContent = "-";
    els.questionNumber.textContent = "請調整篩選條件";
    els.promptBox.className = "prompt-box";
    els.promptBox.textContent = "";
    els.questionText.textContent = "這個篩選目前沒有可練習的新題目。可以切到錯題複習、收藏題，或重設紀錄再練一次。";
    els.starButton.disabled = true;
    return;
  }

  els.starButton.disabled = false;
  els.starButton.textContent = state.starred[current.id] ? "★" : "☆";
  els.starButton.classList.toggle("active", Boolean(state.starred[current.id]));
  els.partLabel.textContent = current.part;
  els.skillLabel.textContent = current.skill;
  els.difficultyLabel.textContent = current.level === "foundation" ? "基礎" : "往 550 橋接";
  els.questionNumber.textContent = `Question ${current.number}`;
  els.questionText.textContent = current.question;

  if (current.prompt) {
    els.promptBox.className = "prompt-box visible";
    els.promptBox.textContent = current.prompt;
  } else {
    els.promptBox.className = "prompt-box";
    els.promptBox.textContent = "";
  }

  current.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "option";
    button.innerHTML = `<span class="option-key">${option.key}</span><span>${escapeHtml(option.text)}</span>`;
    button.addEventListener("click", () => {
      selectedKey = option.key;
      [...els.options.children].forEach((child) => child.classList.remove("selected"));
      button.classList.add("selected");
    });
    els.options.appendChild(button);
  });

  const submit = document.createElement("button");
  submit.type = "button";
  submit.className = "primary";
  submit.textContent = "送出答案";
  submit.addEventListener("click", () => submitAnswer(submit));
  els.actions.appendChild(submit);

  const skip = document.createElement("button");
  skip.type = "button";
  skip.className = "ghost";
  skip.textContent = "跳過";
  skip.addEventListener("click", pickQuestion);
  els.actions.appendChild(skip);
}

function submitAnswer(submitButton) {
  if (!current || !selectedKey) return;

  const isCorrect = selectedKey === current.answer;
  state.answered[current.id] = true;

  if (isCorrect) {
    state.correct[current.id] = (state.correct[current.id] || 0) + 1;
    delete state.wrong[current.id];
    state.streak += 1;
  } else {
    state.wrong[current.id] = true;
    state.streak = 0;
  }

  [...els.options.children].forEach((child) => {
    const key = child.querySelector(".option-key").textContent;
    child.disabled = true;
    if (key === current.answer) child.classList.add("correct");
    if (key === selectedKey && key !== current.answer) child.classList.add("wrong");
  });

  const answerOption = current.options.find((option) => option.key === current.answer);
  els.explanation.className = "explanation visible";
  els.explanation.innerHTML = `
    <h3 class="${isCorrect ? "result-correct" : "result-wrong"}">${isCorrect ? "答對了" : "答錯了"}</h3>
    <p><strong>正解：${current.answer}. ${escapeHtml(answerOption.text)}</strong></p>
    <p>${escapeHtml(current.explanation)}</p>
    <p><strong>學習重點：</strong>${escapeHtml(current.tip)}</p>
  `;

  submitButton.disabled = true;
  save();
}

function renderStats() {
  const answeredIds = Object.keys(state.answered);
  const correctAttempts = Object.values(state.correct).reduce((sum, value) => sum + value, 0);
  const wrongIds = Object.keys(state.wrong);
  const totalAttempts = correctAttempts + wrongIds.length;
  const accuracy = totalAttempts ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
  const progress = questions.length ? Math.round((answeredIds.length / questions.length) * 100) : 0;

  els.answeredCount.textContent = String(answeredIds.length);
  els.accuracyRate.textContent = `${accuracy}%`;
  els.streakCount.textContent = String(state.streak || 0);
  els.reviewCount.textContent = String(wrongIds.length);
  els.progressText.textContent = `${answeredIds.length} / ${questions.length}`;
  els.progressBar.style.width = `${progress}%`;
  renderWrongList();
}

function renderWrongList() {
  const wrongQuestions = questions.filter((question) => state.wrong[question.id]).slice(0, 20);
  els.wrongList.innerHTML = "";

  if (!wrongQuestions.length) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "目前沒有錯題。";
    els.wrongList.appendChild(empty);
    return;
  }

  wrongQuestions.forEach((question) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "wrong-item";
    button.innerHTML = `<strong>${escapeHtml(question.part)}｜Q${question.number}</strong><span>${escapeHtml(question.question)}</span>`;
    button.addEventListener("click", () => {
      current = question;
      renderQuestion();
    });
    els.wrongList.appendChild(button);
  });
}

function resetProgress() {
  if (!confirm("確定要清除所有作答紀錄嗎？")) return;
  localStorage.removeItem(stateKey);
  state.answered = {};
  state.correct = {};
  state.wrong = {};
  state.starred = {};
  state.streak = 0;
  save();
  pickQuestion();
}

function init() {
  els.partFilter.innerHTML = `<option value="all">全部題型</option>${partNames()
    .map((part) => `<option value="${escapeHtml(part)}">${escapeHtml(part)}</option>`)
    .join("")}`;

  els.nextButton.addEventListener("click", pickQuestion);
  els.resetButton.addEventListener("click", resetProgress);
  els.partFilter.addEventListener("change", () => {
    orderedIndex = 0;
    pickQuestion();
  });
  els.focusFilter.addEventListener("change", () => {
    orderedIndex = 0;
    pickQuestion();
  });
  els.difficultyFilter.addEventListener("change", () => {
    orderedIndex = 0;
    pickQuestion();
  });
  els.shuffleToggle.addEventListener("change", () => {
    orderedIndex = 0;
  });
  els.starButton.addEventListener("click", () => {
    if (!current) return;
    state.starred[current.id] = !state.starred[current.id];
    if (!state.starred[current.id]) delete state.starred[current.id];
    save();
    renderQuestion();
  });

  renderStats();
  pickQuestion();
}

init();
