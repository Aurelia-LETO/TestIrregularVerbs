const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const verbs = JSON.parse(fs.readFileSync("./verbs.json"));

function getRandomVerbs(count) {
  const shuffled = verbs.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

app.get("/api/verbs", (req, res) => {
  res.json(getRandomVerbs(20));
});

app.post("/api/check", (req, res) => {
  const { base, answerPreterite, answerParticiple } = req.body;
  // Comparaison insensible à la casse pour la base
  const verb = verbs.find(v => v.base.toLowerCase() === base.toLowerCase());
  if (!verb) return res.status(404).json({ correct: false });

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