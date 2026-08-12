const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

let score = {
  wins: 0,
  losses: 0,
};

app.get("/score", (req, res) => {
  res.json(score);
});

app.post("/score", (req, res) => {
  score = {
    wins: Number(req.body.wins) || 0,
    losses: Number(req.body.losses) || 0,
  };

  res.json(score);
});

app.listen(3001, () => {
  console.log("OW Tracker server running on http://localhost:3001");
});