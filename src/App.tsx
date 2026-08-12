import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // Read score from URL
  const params = new URLSearchParams(window.location.search);

  const urlWins = Number(params.get("wins"));
  const urlLosses = Number(params.get("losses"));

  const [wins, setWins] = useState(
    Number.isFinite(urlWins) && params.has("wins")
      ? urlWins
      : Number(localStorage.getItem("ow-wins")) || 0
  );

  const [losses, setLosses] = useState(
    Number.isFinite(urlLosses) && params.has("losses")
      ? urlLosses
      : Number(localStorage.getItem("ow-losses")) || 0
  );

  const isOverlay = window.location.pathname === "/overlay";

  const totalGames = wins + losses;

  const winRate =
    totalGames === 0
      ? "0.0"
      : ((wins / totalGames) * 100).toFixed(1);

  // Save score
  useEffect(() => {
    localStorage.setItem("ow-wins", String(wins));
    localStorage.setItem("ow-losses", String(losses));
  }, [wins, losses]);

  const addWin = () => {
    setWins((current) => current + 1);
  };

  const addLoss = () => {
    setLosses((current) => current + 1);
  };

  const reset = () => {
    setWins(0);
    setLosses(0);
  };

  // =========================
  // OVERLAY
  // =========================

  if (isOverlay) {
    return (
      <div className="overlay">
        <div className="overlay-record">
          <span className="overlay-wins">
            W {wins}
          </span>

          <span className="overlay-losses">
            L {losses}
          </span>
        </div>

        <div className="overlay-rate">
          {winRate}% WIN RATE
        </div>
      </div>
    );
  }

  // =========================
  // CONTROLLER
  // =========================

  return (
    <main className="app">
      <section className="counter">
        <h1>OVERWATCH 2</h1>

        <div className="stats">
          <div className="stat">
            <span className="label">WINS</span>

            <span className="number wins">
              {wins}
            </span>
          </div>

          <div className="stat">
            <span className="label">LOSSES</span>

            <span className="number losses">
              {losses}
            </span>
          </div>
        </div>

        <div className="win-rate">
          {winRate}% WIN RATE
        </div>

        <div className="buttons">
          <button
            className="win-button"
            onClick={addWin}
          >
            + WIN
          </button>

          <button
            className="loss-button"
            onClick={addLoss}
          >
            + LOSS
          </button>
        </div>

        <button
          className="reset-button"
          onClick={reset}
        >
          RESET
        </button>
      </section>
    </main>
  );
}

export default App;