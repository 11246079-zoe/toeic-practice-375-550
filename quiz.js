const stateKey = "toeic-375-to-550-practice-v2";

const generatedQuestions = buildGeneratedBank();
const questions = generatedQuestions;

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

function buildGeneratedBank() {
  const bank = [];
  let number = 1;

  const workplaces = [
    { en: "manager", zh: "經理", verb: "reviews", base: "review", action: "檢閱", object: "the weekly sales report", objectZh: "每週銷售報告" },
    { en: "assistant", zh: "助理", verb: "prepares", base: "prepare", action: "準備", object: "the meeting agenda", objectZh: "會議議程" },
    { en: "technician", zh: "技術人員", verb: "checks", base: "check", action: "檢查", object: "the office equipment", objectZh: "辦公設備" },
    { en: "supervisor", zh: "主管", verb: "approves", base: "approve", action: "核准", object: "the travel request", objectZh: "出差申請" },
    { en: "receptionist", zh: "接待人員", verb: "answers", base: "answer", action: "接聽", object: "customer calls", objectZh: "顧客來電" },
    { en: "accountant", zh: "會計", verb: "updates", base: "update", action: "更新", object: "the expense records", objectZh: "費用紀錄" },
  ];

  workplaces.forEach((item, index) => {
    bank.push({
      id: `gen-p5-sv-${index}`,
      number: number++,
      part: "Part 5 短句填空",
      skill: "主詞動詞一致",
      level: index % 2 ? "bridge" : "foundation",
      question: `The ${item.en} _____ ${item.object} every Friday.`,
      translation: `這位${item.zh}每週五${item.action}${item.objectZh}。`,
      options: [
        { key: "A", text: item.base },
        { key: "B", text: item.verb },
        { key: "C", text: `${item.base}ing` },
        { key: "D", text: `to ${item.base}` },
      ],
      answer: "B",
      explanation: `主詞 The ${item.en} 是第三人稱單數，而且 every Friday 表示固定習慣，所以動詞要用第三人稱單數 ${item.verb}。`,
      tip: "看到 every day、every week、usually 這類頻率線索，先檢查現在簡單式和主詞單複數。",
    });
  });

  const deadlines = [
    { task: "submit the application", taskZh: "提交申請表", time: "Friday", timeZh: "星期五" },
    { task: "complete the survey", taskZh: "完成問卷", time: "noon", timeZh: "中午" },
    { task: "send the invoice", taskZh: "寄出發票", time: "the end of the month", timeZh: "月底" },
    { task: "reserve a seat", taskZh: "預訂座位", time: "tomorrow morning", timeZh: "明天早上" },
    { task: "confirm the schedule", taskZh: "確認時程", time: "5 P.M.", timeZh: "下午五點" },
  ];

  deadlines.forEach((item, index) => {
    bank.push({
      id: `gen-p5-by-${index}`,
      number: number++,
      part: "Part 5 短句填空",
      skill: "介系詞",
      level: "foundation",
      question: `Please ${item.task} by ${item.time}.`,
      translation: `請在${item.timeZh}以前${item.taskZh}。`,
      options: [
        { key: "A", text: "by" },
        { key: "B", text: "with" },
        { key: "C", text: "about" },
        { key: "D", text: "between" },
      ],
      answer: "A",
      explanation: `by ${item.time} 表示「不晚於${item.timeZh}」，符合期限語意。`,
      tip: "by + 時間點 = 在期限以前完成；until 則強調動作持續到某時間。",
    });
  });

  const vocabSets = [
    {
      id: "refund",
      sentence: "Because the item arrived damaged, the customer requested a full _____.",
      zh: "因為商品送達時已受損，顧客要求全額_____。",
      answer: "refund",
      answerZh: "退款",
      explanation: "商品受損後要求 full refund，意思是全額退款。",
      options: [
        ["refund", "退款"],
        ["agenda", "議程"],
        ["branch", "分公司"],
        ["receipt", "收據"],
      ],
    },
    {
      id: "appointment",
      sentence: "Dr. Lin is not available now, but you can make an _____ for next Tuesday.",
      zh: "林醫師現在沒有空，但你可以預約下週二的_____。",
      answer: "appointment",
      answerZh: "預約",
      explanation: "make an appointment 是固定用法，表示安排預約。",
      options: [
        ["invoice", "發票"],
        ["appointment", "預約"],
        ["warehouse", "倉庫"],
        ["discount", "折扣"],
      ],
    },
    {
      id: "invoice",
      sentence: "The accounting department will send the _____ after the order is shipped.",
      zh: "訂單出貨後，會計部門會寄出_____。",
      answer: "invoice",
      answerZh: "發票、請款單",
      explanation: "invoice 是商務付款情境中的發票或請款單。",
      options: [
        ["invoice", "發票、請款單"],
        ["cafeteria", "自助餐廳"],
        ["candidate", "候選人"],
        ["entrance", "入口"],
      ],
    },
    {
      id: "renovation",
      sentence: "The lobby will be closed during the hotel _____.",
      zh: "飯店_____期間，大廳將會關閉。",
      answer: "renovation",
      answerZh: "整修",
      explanation: "renovation 指建築或空間的整修、翻新。",
      options: [
        ["renovation", "整修、翻新"],
        ["shipment", "貨運、出貨"],
        ["receipt", "收據"],
        ["survey", "問卷、調查"],
      ],
    },
    {
      id: "available",
      sentence: "The meeting room is _____ after 3 P.M.",
      zh: "會議室下午三點後可以_____。",
      answer: "available",
      answerZh: "可用的、有空的",
      explanation: "available 表示某人有空，或某物可使用。",
      options: [
        ["available", "可用的、有空的"],
        ["annual", "年度的"],
        ["damaged", "受損的"],
        ["manual", "手動的、手冊"],
      ],
    },
    {
      id: "confirm",
      sentence: "Please _____ your reservation by replying to this e-mail.",
      zh: "請回覆這封電子郵件以_____您的預訂。",
      answer: "confirm",
      answerZh: "確認",
      explanation: "confirm a reservation 表示確認預訂。",
      options: [
        ["deliver", "運送"],
        ["confirm", "確認"],
        ["install", "安裝"],
        ["repair", "修理"],
      ],
    },
  ];

  vocabSets.forEach((item, index) => {
    const options = item.options.map(([text, zh], optionIndex) => ({
      key: "ABCD"[optionIndex],
      text,
      translation: zh,
    }));
    const answer = options.find((option) => option.text === item.answer).key;
    bank.push({
      id: `gen-vocab-${item.id}`,
      number: number++,
      part: "Part 5 短句填空",
      skill: "單字",
      level: index % 2 ? "bridge" : "foundation",
      question: item.sentence,
      translation: item.zh.replace("_____", item.answerZh),
      options,
      answer,
      explanation: item.explanation,
      tip: "單字題先判斷句子情境，再用詞性和搭配詞縮小答案。",
    });
  });

  const part2 = [
    ["Where is the nearest printer?", "最近的印表機在哪裡？", "Next to the supply cabinet.", "在文具櫃旁邊。", "Where 問地點，所以要回答位置。"],
    ["When does the workshop begin?", "研習課什麼時候開始？", "At ten o'clock.", "十點開始。", "When 問時間，所以答案要是時間。"],
    ["Who approved the budget?", "誰核准了預算？", "Ms. Patel did.", "Patel 女士核准了。", "Who 問人，所以回答人名或職稱。"],
    ["Why don't we review the contract now?", "我們為什麼不現在檢查合約呢？", "That's a good idea.", "這是個好主意。", "Why don't we 是建議句，常用 Sounds good 或 Good idea 回答。"],
    ["Would you like coffee or tea?", "你想要咖啡還是茶？", "Tea, please.", "茶，謝謝。", "or 問句要選其中一項，不適合只回答 yes。"],
  ];

  part2.forEach((item, index) => {
    bank.push({
      id: `gen-p2-${index}`,
      number: number++,
      part: "Part 2 應答問題",
      skill: index === 3 ? "建議句" : "問句應答",
      level: index > 2 ? "bridge" : "foundation",
      prompt: `You hear: ${item[0]}`,
      promptTranslation: `你會聽到：${item[1]}`,
      question: "Choose the best response.",
      translation: "請選出最適合的回應。",
      options: [
        { key: "A", text: item[2], translation: item[3] },
        { key: "B", text: "It was delivered yesterday.", translation: "它昨天送達了。" },
        { key: "C", text: "No, I don't have one.", translation: "不，我沒有。" },
        { key: "D", text: "The office is very large.", translation: "辦公室很大。" },
      ],
      answer: "A",
      explanation: item[4],
      tip: "Part 2 先聽疑問詞或句型功能，再排除答非所問的選項。",
    });
  });

  const readings = [
    {
      id: "cafeteria",
      prompt: "NOTICE\n\nThe cafeteria on the third floor will close at 2 P.M. today for cleaning. Employees may buy snacks and drinks from the vending machines near the elevators.",
      promptZh: "公告：三樓自助餐廳今天下午兩點會因清潔而關閉。員工可以在電梯旁的自動販賣機購買點心和飲料。",
      question: "What is the notice mainly about?",
      questionZh: "這則公告主要是關於什麼？",
      answer: "A change in cafeteria hours",
      answerZh: "自助餐廳營業時間的變動",
      explanation: "公告重點是餐廳今天下午兩點關閉，因此主旨是營業時間變動。",
    },
    {
      id: "membership",
      prompt: "Dear Customer,\n\nYour annual membership will expire on June 30. Renew before June 15 to receive a 10 percent discount on next year's fee.",
      promptZh: "親愛的顧客：您的年度會員資格將於 6 月 30 日到期。請在 6 月 15 日前續約，即可享有明年費用九折優惠。",
      question: "Why was this message written?",
      questionZh: "這則訊息的目的為何？",
      answer: "To ask a customer to renew a membership",
      answerZh: "請顧客續約會員資格",
      explanation: "訊息提醒會員即將到期，並提供續約折扣，因此目的是請顧客續約。",
    },
    {
      id: "training-room",
      prompt: "The training room has been reserved for sales staff from 9 A.M. to noon on Wednesday. Other employees should use Meeting Room B during that time.",
      promptZh: "訓練室已於星期三上午九點到中午保留給業務人員使用。其他員工在那段時間應使用 B 會議室。",
      question: "Who will use the training room on Wednesday morning?",
      questionZh: "星期三早上誰會使用訓練室？",
      answer: "Sales staff",
      answerZh: "業務人員",
      explanation: "原文明確說訓練室保留給 sales staff 使用。",
    },
  ];

  readings.forEach((item, index) => {
    bank.push({
      id: `gen-p7-${item.id}`,
      number: number++,
      part: "Part 7 單篇閱讀",
      skill: index === 0 ? "主旨" : "細節",
      level: index === 2 ? "bridge" : "foundation",
      prompt: item.prompt,
      promptTranslation: item.promptZh,
      question: item.question,
      translation: item.questionZh,
      options: [
        { key: "A", text: item.answer, translation: item.answerZh },
        { key: "B", text: "To announce a new office location", translation: "宣布新的辦公室地點" },
        { key: "C", text: "To apologize for a late payment", translation: "為延遲付款道歉" },
        { key: "D", text: "To introduce a new employee", translation: "介紹一位新員工" },
      ],
      answer: "A",
      explanation: item.explanation,
      tip: "閱讀題先抓標題、第一句和關鍵名詞，再回原文定位答案。",
    });
  });

  const baseSize = bank.length;
  const variants = [];
  for (let round = 1; round <= 80; round += 1) {
    bank.slice(0, baseSize).forEach((question, index) => {
      variants.push(makeVariant(question, round, index, number++));
    });
  }

  return [...bank, ...variants];
}

function makeVariant(question, round, index, number) {
  const variant = structuredClone(question);
  const suffix = round % 2 ? "this week" : "next week";
  const suffixZh = round % 2 ? "本週" : "下週";
  variant.id = `${question.id}-v${round}`;
  variant.number = number;
  variant.question = `${question.question} (${suffix})`;
  variant.translation = question.translation ? `${question.translation}（${suffixZh}練習變化題）` : "本題為多益練習變化題。";
  variant.prompt = question.prompt ? `${question.prompt}` : question.prompt;
  variant.promptTranslation = question.promptTranslation ? `${question.promptTranslation}（${suffixZh}練習變化題）` : question.promptTranslation;
  variant.explanation = `${question.explanation} 這是同一考點的變化練習，題目 ID 不同，作答後也會被記錄為已完成。`;
  if (index % 4 === 0) {
    variant.level = "bridge";
  }
  return variant;
}

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
    ${renderTranslationBlock(current)}
    ${renderOptionMeanings(current)}
    <p>${escapeHtml(current.explanation)}</p>
    <p><strong>學習重點：</strong>${escapeHtml(current.tip)}</p>
  `;

  submitButton.disabled = true;
  save();
}

function renderTranslationBlock(question) {
  const promptTranslation = question.promptTranslation
    ? `<p><strong>文章／聽力內容翻譯：</strong>${escapeHtml(question.promptTranslation)}</p>`
    : "";
  const questionTranslation = question.translation
    ? `<p><strong>題目中文翻譯：</strong>${escapeHtml(question.translation)}</p>`
    : "";
  return `${promptTranslation}${questionTranslation}`;
}

function renderOptionMeanings(question) {
  if (question.skill !== "單字" && !question.options.some((option) => option.translation)) return "";
  const items = question.options
    .map((option) => `<li>${option.key}. ${escapeHtml(option.text)}：${escapeHtml(option.translation || "無補充翻譯")}</li>`)
    .join("");
  return `<div class="option-meanings"><strong>選項中文意思：</strong><ul>${items}</ul></div>`;
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
  els.progressBar.style.width = `${Math.min(progress, 100)}%`;
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
