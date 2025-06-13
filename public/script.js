let verbs = [];
let current = 0;
let score = 20;

async function fetchVerbs() {
  const res = await fetch("/api/verbs");
  verbs = await res.json();
  resetGame();
}

function resetGame() {
  current = 0;
  score = 20;
  document.getElementById("score").innerText = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("question").innerText = "";
  document.querySelector("button#submitBtn").disabled = false;
  document.getElementById("replayBtn").style.display = "none";
  showQuestion();
}

function showQuestion() {
  const v = verbs[current];
  document.getElementById("question").innerText =
    `Complète ce verbe : ${v.translation}`;
  document.getElementById("base").value = "";
  document.getElementById("preterite").value = "";
  document.getElementById("participle").value = "";
  document.getElementById("feedback").innerText = "";
}

async function submitAnswer() {
  const base = document.getElementById("base").value.trim();
  const preterite = document.getElementById("preterite").value.trim();
  const participle = document.getElementById("participle").value.trim();

  const res = await fetch("/api/check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      base: base,
      answerPreterite: preterite,
      answerParticiple: participle
    })
  });

  const result = await res.json();

  if (result.correct) {
    document.getElementById("feedback").innerText = "Bonne réponse !";
  } else {
    document.getElementById("feedback").innerText =
      `Faux ! Réponse attendue : ${result.correctBase} / ${result.correctPreterite} / ${result.correctParticiple}`;
    score--;
  }

  current++;
  if (current < verbs.length) {
    setTimeout(showQuestion, 1500);
  } else {
    setTimeout(() => {
      document.getElementById("question").innerText = `Test terminé !`;
      document.getElementById("feedback").innerText = "";
      document.getElementById("score").innerText = `Note finale : ${score}/20`;
      document.querySelector("button#submitBtn").disabled = true;
      document.getElementById("replayBtn").style.display = "inline-block";
    }, 1500);
  }
}

window.onload = fetchVerbs;
