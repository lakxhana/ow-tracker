import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [wins, setWins] = useState(() => {
    return Number(localStorage.getItem("ow-wins")) || 0;
  });

  const [losses, setLosses] = useState(() => {
    return Number(localStorage.getItem("ow-losses")) || 0;
  });

  // Listen for changes made by another browser tab/window
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "ow-wins") {
        setWins(Number(event.newValue) || 0);
      }

      if (event.key === "ow-losses") {
        setLosses(Number(event.newValue) || 0);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "w") {
        addWin();
      }
  
      if (event.key.toLowerCase() === "l") {
        addLoss();
      }
  
      if (event.key.toLowerCase() === "r") {
        reset();
      }
    };
  
    window.addEventListener("keydown", handleKeyDown);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [wins, losses]);

  const totalGames = wins + losses;

  const winRate =
    totalGames === 0 ? "0.0" : ((wins / totalGames) * 100).toFixed(1);

  const addWin = () => {
    const newWins = wins + 1;

    setWins(newWins);
    localStorage.setItem("ow-wins", newWins.toString());
  };

  const addLoss = () => {
    const newLosses = losses + 1;

    setLosses(newLosses);
    localStorage.setItem("ow-losses", newLosses.toString());
  };

  const reset = () => {
    setWins(0);
    setLosses(0);

    localStorage.setItem("ow-wins", "0");
    localStorage.setItem("ow-losses", "0");
  };

  const isOverlay = window.location.pathname === "/overlay";

  if (isOverlay) {
    return (
      <div className="overlay">
        <div className="overlay-record">
          <span className="overlay-wins">W {wins}</span>
          <span className="overlay-losses">L {losses}</span>
        </div>
  
        <div className="overlay-rate">
          {winRate}% WIN RATE
        </div>
      </div>
    );
  }

  return (
    <main className="app">
      <section className="counter">
        <h1>OVERWATCH 2</h1>

        <div className="stats">
          <div className="stat">
            <span className="label">WINS</span>
            <span className="number wins">{wins}</span>
          </div>

          <div className="stat">
            <span className="label">LOSSES</span>
            <span className="number losses">{losses}</span>
          </div>
        </div>

        <div className="win-rate">
          {winRate}% WIN RATE
        </div>

        <div className="buttons">
          <button className="win-button" onClick={addWin}>
            + WIN
          </button>

          <button className="loss-button" onClick={addLoss}>
            + LOSS
          </button>
        </div>

        <button className="reset-button" onClick={reset}>
          RESET
        </button>
      </section>
    </main>
  );
}

export default App;