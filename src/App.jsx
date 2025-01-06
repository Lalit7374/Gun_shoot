// import "bootstrap/dist/css/bootstrap.min.css";
// import FoodItems from "./Fooditems";
// import Error from "./assets/Error";

// function App() {
//   let footiems=["dal","chawal","milk","cake","samosa"]

 
//   return <>
//     <h1>Healthy food</h1>
//    <FoodItems><Footiems></Footiems></FoodItems>
//    <Error></Error>
// </>
// }
// App.jsx
import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [spaceshipX, setSpaceshipX] = useState(250);
  const [lasers, setLasers] = useState([]);
  const [enemies, setEnemies] = useState(createEnemies());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameAreaRef = useRef(null);

  function createEnemies() {
    const rows = 3;
    const cols = 5;
    const enemies = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        enemies.push({ x: col * 80 + 30, y: row * 60 + 30 });
      }
    }
    return enemies;
  }

  useEffect(() => {
    if (gameOver) return;

    const gameArea = gameAreaRef.current;
    const gameWidth = gameArea.clientWidth;
    const gameHeight = gameArea.clientHeight;

    const moveEnemies = () => {
      setEnemies(prevEnemies => prevEnemies.map(enemy => ({
        ...enemy,
        y: enemy.y + 1
      })));
    };

    const checkCollisions = () => {
      setEnemies(prevEnemies => {
        const remainingEnemies = prevEnemies.filter(enemy => enemy.y < gameHeight - 50);
        const hitEnemies = remainingEnemies.filter(enemy => {
          return lasers.some(laser => 
            laser.y <= enemy.y + 50 &&
            laser.y >= enemy.y &&
            laser.x >= enemy.x &&
            laser.x <= enemy.x + 60
          );
        });
        if (hitEnemies.length > 0) {
          setScore(prevScore => prevScore + hitEnemies.length * 10);
        }
        return remainingEnemies.filter(enemy => !hitEnemies.includes(enemy));
      });
      setLasers(prevLasers => prevLasers.filter(laser => laser.y > 0));
    };

    const moveLasers = () => {
      setLasers(prevLasers => prevLasers.map(laser => ({
        ...laser,
        y: laser.y - 5
      })));
    };

    const gameInterval = setInterval(() => {
      if (!gameOver) {
        moveEnemies();
        moveLasers();
        checkCollisions();
      }
      if (enemies.some(enemy => enemy.y >= gameArea.clientHeight - 50)) {
        setGameOver(true);
      }
    }, 100);

    return () => clearInterval(gameInterval);
  }, [lasers, gameOver, enemies]);

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      setSpaceshipX(prev => Math.max(prev - 20, 0));
    } else if (event.key === 'ArrowRight') {
      setSpaceshipX(prev => Math.min(prev + 20, gameAreaRef.current.clientWidth - 60));
    } else if (event.key === ' ') {
      setLasers(prevLasers => [
        ...prevLasers,
        { x: spaceshipX + 25, y: 550 }
      ]);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [spaceshipX]);

  const handleRestart = () => {
    setSpaceshipX(250);
    setLasers([]);
    setEnemies(createEnemies());
    setScore(0);
    setGameOver(false);
  };

  return (
    <div className="game" ref={gameAreaRef}>
      <div className="spaceship" style={{ left: `${spaceshipX}px` }}></div>
      {enemies.map((enemy, index) => (
        <div
          key={index}
          className="enemy"
          style={{ left: `${enemy.x}px`, top: `${enemy.y}px` }}
        />
      ))}
      {lasers.map((laser, index) => (
        <div
          key={index}
          className="laser"
          style={{ left: `${laser.x}px`, top: `${laser.y}px` }}
        />
      ))}
      <div className="score">Score: {score}</div>
      {gameOver && (
        <div className="game-over">
          Game Over! <button onClick={handleRestart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;

