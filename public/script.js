let verbs = [];
let current = 0;
let score = 10;
let currentVerb = null;

async function fetchVerbs() {
  const res = await fetch("/api/verbs");
  verbs = await res.json();
  console.log("Verbs fetched:", verbs);
  resetGame();
}

function resetGame() {
  current = 0;
  score = 10;
  document.getElementById("score").innerText = "";
  document.getElementById("feedback").innerText = "";
  document.getElementById("question").innerText = "";
  document.querySelector("button#submitBtn").disabled = false;
  document.getElementById("replayBtn").style.display = "none";
  showQuestion();
}

function showQuestion() {
  if (!verbs.length || current >= verbs.length) {
    document.getElementById("question").innerText = "Aucun verbe à afficher.";
    return;
  }
  currentVerb = verbs[current];
  document.getElementById("question").innerText =
    `Complète ce verbe : ${currentVerb.translation}`;
  document.getElementById("base").value = "";
  document.getElementById("preterite").value = "";
  document.getElementById("participle").value = "";
  document.getElementById("feedback").innerText = "";
}

async function submitAnswer() {
  const base = document.getElementById("base").value.trim();
  const preterite = document.getElementById("preterite").value.trim();
  const participle = document.getElementById("participle").value.trim();

  if (!base || !preterite || !participle) {
    document.getElementById("feedback").innerText = "Veuillez remplir tous les champs.";
    document.getElementById("feedback").style.color = "red";
    return;
  }

  // Remise à zéro du style   
  document.getElementById("feedback").style.color = "";

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

  console.log("Current verb:", currentVerb);
  console.log("Résultat reçu :", result);

  if (result.correct) {
    document.getElementById("feedback").innerText = "Bonne réponse !";
  } else {
    const expectedPreterite = result.correctPreterite ?? currentVerb.preterite;
    const expectedParticiple = result.correctParticiple ?? currentVerb.pastParticiple;

    console.log("Expected Preterite:", expectedPreterite);
    console.log("Expected Participle:", expectedParticiple);

    document.getElementById("feedback").innerText =
      `Faux ! Réponse attendue : ${currentVerb.base} / ${expectedPreterite} / ${expectedParticiple}`;
    if (score > 0) score--;
  }

  current++;
  if (current < verbs.length) {
    setTimeout(showQuestion, 2800);
  } else {
    setTimeout(() => {
      document.getElementById("question").innerText = "Test terminé !";
      document.getElementById("feedback").innerText = "";
      document.getElementById("score").innerText = `Note finale : ${score}/10`;
      document.querySelector("button#submitBtn").disabled = true;
      document.getElementById("replayBtn").style.display = "inline-block";
      showCelebration(score);
    }, 1500);
  }
}

function showFallingEmojis(emoji, count = 30) {
  const container = document.getElementById('animation-container');

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.classList.add('falling');
    el.textContent = emoji;
    el.style.left = `${Math.random() * 100}vw`;
    el.style.fontSize = `${Math.random() * 20 + 24}px`;
    const duration = 2.5 + Math.random() * 1.5;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${Math.random() * 1.5}s`;
    container.appendChild(el);
    setTimeout(() => el.remove(), (duration + 1.5) * 1000);
  }
}

function showCelebration(score) {
  if (score >= 9) {
    showFallingEmojis('💪');
    showFallingEmojis('🎉');
    showFallingEmojis('🥳');
  } else if (score >= 7) {
    showFallingEmojis('👍');
    showFallingEmojis('🎊');
    showFallingEmojis('😊');
  } else if (score >= 5) {
    showFallingEmojis('🙂');
  } else {
    showFallingEmojis('😅');
    showFallingEmojis('😢');
    showFallingEmojis('😞');
  }
}

window.onload = fetchVerbs;
