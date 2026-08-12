import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import "./App.css";

type Score = {
  id: number;
  wins: number;
  losses: number;
};

function App() {
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  const isOverlay = window.location.pathname === "/overlay";

  const totalGames = wins + losses;

  const winRate =
    totalGames === 0
      ? "0.0"
      : ((wins / totalGames) * 100).toFixed(1);

  // Get current score from Supabase
  useEffect(() => {
    const loadScore = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        console.error("Failed to load score:", error);
        return;
      }

      if (data) {
        setWins(data.wins);
        setLosses(data.losses);
      }
    };

    loadScore();
  }, []);

  // Listen for live score changes
  useEffect(() => {
    const channel = supabase
      .channel("ow-score")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "scores",
          filter: "id=eq.1",
        },
        (payload) => {
          const score = payload.new as Score;

          setWins(score.wins);
          setLosses(score.losses);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update Supabase
  const updateScore = async (
    newWins: number,
    newLosses: number
  ) => {
    const { error } = await supabase
      .from("scores")
      .update({
        wins: newWins,
        losses: newLosses,
      })
      .eq("id", 1);

    if (error) {
      console.error("Failed to update score:", error);
      return;
    }

    setWins(newWins);
    setLosses(newLosses);
  };

  const addWin = () => {
    updateScore(wins + 1, losses);
  };

  const addLoss = () => {
    updateScore(wins, losses + 1);
  };

  const reset = () => {
    updateScore(0, 0);
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