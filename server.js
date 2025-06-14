const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const verbs = JSON.parse(fs.readFileSync("./verbs.json"));
const playedBases = new Set(); 

function getRandomVerbs(count) {
  // Verbes disponibles
  const available = verbs.filter(v => !playedBases.has(v.base));

  if (available.length < count) {
    //réinitialisation de la mémoire
    playedBases.clear();
    return getRandomVerbs(count);
  }

  const shuffled = [...available].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  selected.forEach(v => playedBases.add(v.base)); 

  return selected;
}

app.get("/api/verbs", (req, res) => {
  const randomVerbs = getRandomVerbs(10);
  res.json(randomVerbs);
});

app.post("/api/check", (req, res) => {
  const { base, answerPreterite, answerParticiple } = req.body;

  const verb = verbs.find(v => v.base.toLowerCase() === base.toLowerCase());
  if (!verb) return res.json({ correct: false, message: "Verbe non trouvé" });

  const correctPreterite = verb.preterite.toLowerCase();
  const correctParticiple = verb.pastParticiple.toLowerCase();

  const isCorrect =
    verb.base.toLowerCase() === base.toLowerCase() &&
    answerPreterite.toLowerCase().trim() === correctPreterite &&
    answerParticiple.toLowerCase().trim() === correctParticiple;

  res.json({ correct: isCorrect, correctPreterite, correctParticiple });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
