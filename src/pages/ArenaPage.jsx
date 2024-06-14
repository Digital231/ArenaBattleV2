import { useEffect, useState } from "react";
import { ENEMIES } from "../components/UnitsComp";
const boardSize = 8;

const generateRandomEnemies = (num) => {
  const shuffled = ENEMIES.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num).map((enemy, index) => ({
    ...enemy,
    id: `enemy-${index + 1}`,
  }));
};

const getRandomInt = (max) => Math.floor(Math.random() * max);

const ArenaPage = ({ totalUnits, gold, setGold }) => {
  const [chessboard, setChessboard] = useState(
    Array.from({ length: boardSize }, () => Array(boardSize).fill(null))
  );
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitStats, setSelectedUnitStats] = useState(null);
  const [playerTurn, setPlayerTurn] = useState(true);
  const [enemies, setEnemies] = useState(generateRandomEnemies(1));
  const [round, setRound] = useState(1);

  useEffect(() => {
    const initializeChessboard = () => {
      const updatedChessboard = Array.from({ length: boardSize }, () =>
        Array(boardSize).fill(null)
      );

      // Place player's units on the bottom row
      totalUnits.forEach((unit, index) => {
        updatedChessboard[boardSize - 1][index] = unit;
      });

      // Place enemies on the top row
      enemies.forEach((enemy, index) => {
        updatedChessboard[0][index] = enemy;
      });

      setChessboard(updatedChessboard);
    };

    initializeChessboard();
  }, [totalUnits, enemies]);

  const startNextRound = () => {
    const nextRoundEnemiesCount = Math.min(2 ** round, ENEMIES.length);
    setEnemies(generateRandomEnemies(nextRoundEnemiesCount));
    setRound(round + 1);
    setPlayerTurn(true);
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    console.log(`Cell clicked at (${rowIndex}, ${cellIndex})`);
    if (playerTurn) {
      if (selectedUnit) {
        const { row, cell, unit } = selectedUnit;

        // Determine valid move range based on unit type
        const moveRange = unit.class === "archer" ? 2 : 1;
        const isValidMove =
          Math.abs(row - rowIndex) <= moveRange &&
          Math.abs(cell - cellIndex) <= moveRange;

        console.log(`Selected unit: ${unit.name}`);
        console.log(`Trying to move to (${rowIndex}, ${cellIndex})`);
        console.log(`Is valid move: ${isValidMove}`);
        console.log(
          `Target cell: ${JSON.stringify(chessboard[rowIndex][cellIndex])}`
        );

        if (isValidMove) {
          const targetCell = chessboard[rowIndex][cellIndex];
          if (targetCell && targetCell.type === "enemy") {
            if (unit.class !== "healer") {
              console.log(
                `${unit.name} is attempting to attack ${targetCell.icon} at (${rowIndex}, ${cellIndex})`
              );

              // Combat logic
              targetCell.health = Math.max(targetCell.health - unit.damage, 0);
              if (targetCell.health > 0) {
                unit.health = Math.max(unit.health - targetCell.damage, 0);
              }

              // Check if enemy is defeated
              if (targetCell.health <= 0) {
                chessboard[rowIndex][cellIndex] = null;
                setEnemies(
                  enemies.filter((enemy) => enemy.id !== targetCell.id)
                );
                setGold(gold + targetCell.reward);
              }

              // Check if player is defeated
              if (unit.health <= 0) {
                chessboard[row][cell] = null;
              }

              setSelectedUnit(null); // Deselect unit after attack
              setChessboard([...chessboard]);
              setPlayerTurn(false);

              setTimeout(() => {
                handleEnemyMove();
              }, 1000);
            }
          } else if (targetCell && targetCell.type === "player") {
            if (unit.class === "healer") {
              console.log(
                `${unit.name} is attempting to heal ${targetCell.name} at (${rowIndex}, ${cellIndex})`
              );

              // Healing logic
              const maxHealth = totalUnits.find(
                (u) => u.id === targetCell.id
              ).health;
              targetCell.health = Math.min(
                targetCell.health + unit.damage,
                maxHealth
              );

              // Update chessboard state with healed player unit
              const updatedChessboard = [...chessboard];
              updatedChessboard[rowIndex][cellIndex] = { ...targetCell };

              setChessboard(updatedChessboard);
              setPlayerTurn(false);
              setSelectedUnit(null); // Deselect unit after healing

              setTimeout(() => {
                handleEnemyMove();
              }, 1000);
            } else {
              console.log("Cannot move to a cell occupied by another player.");
              setSelectedUnit(null);
              return;
            }
          } else {
            chessboard[row][cell] = null;
            chessboard[rowIndex][cellIndex] = unit;
            setChessboard([...chessboard]);
            setSelectedUnit(null); // Deselect unit after move
            setPlayerTurn(false);

            setTimeout(() => {
              handleEnemyMove();
            }, 1000);
          }
        } else {
          console.log(`Move to (${rowIndex}, ${cellIndex}) is invalid.`);
          setSelectedUnit(null);
        }
      } else if (
        chessboard[rowIndex][cellIndex] &&
        chessboard[rowIndex][cellIndex].type === "player"
      ) {
        setSelectedUnit({
          unit: chessboard[rowIndex][cellIndex],
          row: rowIndex,
          cell: cellIndex,
        });
        setSelectedUnitStats(chessboard[rowIndex][cellIndex]);
        console.log(`Selected unit: ${chessboard[rowIndex][cellIndex].name}`);
        console.log(`Unit stats: `, chessboard[rowIndex][cellIndex]);
      }
    }
  };

  const handleEnemyMove = () => {
    const updatedChessboard = [...chessboard];

    enemies.forEach((enemy) => {
      const enemyPosition = findPosition(updatedChessboard, enemy);
      if (!enemyPosition) return;

      // Find adjacent player units
      const adjacentCells = getPossibleMoves(
        updatedChessboard,
        enemyPosition.row,
        enemyPosition.cell,
        1
      );

      const playerCell = adjacentCells.find(
        (cell) =>
          updatedChessboard[cell.row][cell.cell] &&
          updatedChessboard[cell.row][cell.cell].type === "player"
      );

      if (playerCell) {
        const targetCell = updatedChessboard[playerCell.row][playerCell.cell];
        console.log(
          `Enemy ${enemy.icon} is attacking ${targetCell.name} at (${playerCell.row}, ${playerCell.cell})`
        );

        // Combat logic
        targetCell.health = Math.max(targetCell.health - enemy.damage, 0);
        if (targetCell.health > 0) {
          enemy.health = Math.max(enemy.health - targetCell.damage, 0);
        }

        // Check if player is defeated
        if (targetCell.health <= 0) {
          updatedChessboard[playerCell.row][playerCell.cell] = null;
        }

        // Check if enemy is defeated
        if (enemy.health <= 0) {
          updatedChessboard[enemyPosition.row][enemyPosition.cell] = null;
          setEnemies(enemies.filter((e) => e.id !== enemy.id));
          setGold(gold + enemy.reward);
        } else {
          // Place the enemy back to its original position if it wasn't defeated
          updatedChessboard[enemyPosition.row][enemyPosition.cell] = enemy;
        }
      } else {
        // Move to an empty cell if no player units are adjacent
        const possibleMoves = adjacentCells.filter(
          (cell) => !updatedChessboard[cell.row][cell.cell]
        );

        if (possibleMoves.length > 0) {
          const move =
            possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
          updatedChessboard[enemyPosition.row][enemyPosition.cell] = null;
          updatedChessboard[move.row][move.cell] = enemy;
        }
      }
    });

    setChessboard(updatedChessboard);
    setPlayerTurn(true);
  };

  const findPosition = (board, unit) => {
    for (let row = 0; row < board.length; row++) {
      for (let cell = 0; cell < board[row].length; cell++) {
        if (board[row][cell] && board[row][cell].id === unit.id) {
          return { row, cell };
        }
      }
    }
    return null;
  };

  const getPossibleMoves = (board, row, cell, range) => {
    const moves = [];
    const directions = [
      { row: -1, cell: 0 },
      { row: 1, cell: 0 },
      { row: 0, cell: -1 },
      { row: 0, cell: 1 },
      { row: -1, cell: -1 },
      { row: -1, cell: 1 },
      { row: 1, cell: -1 },
      { row: 1, cell: 1 },
    ];

    directions.forEach((direction) => {
      for (let i = 1; i <= range; i++) {
        const newRow = row + direction.row * i;
        const newCell = cell + direction.cell * i;

        if (
          newRow >= 0 &&
          newRow < boardSize &&
          newCell >= 0 &&
          newCell < boardSize
        ) {
          moves.push({ row: newRow, cell: newCell });
        }
      }
    });

    return moves;
  };

  return (
    <div className="arena">
      <h1>Arena</h1>
      <p>Gold: {gold}</p>
      <h3>Selected unit stats:</h3>
      {selectedUnitStats && (
        <div>
          <p>Name: {selectedUnitStats.name}</p>
          <p>Class: {selectedUnitStats.class}</p>
          <p>Health: {selectedUnitStats.health}</p>
          <p>Damage: {selectedUnitStats.damage}</p>
        </div>
      )}
      <div className="chessboard">
        {chessboard.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`cell ${
                  selectedUnit &&
                  selectedUnit.row === rowIndex &&
                  selectedUnit.cell === cellIndex
                    ? "selected"
                    : ""
                }`}
                onClick={() => handleCellClick(rowIndex, cellIndex)}
              >
                {cell ? (
                  <>
                    {cell.icon}
                    <div className="hp">HP: {cell.health}</div>
                  </>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button onClick={startNextRound} disabled={enemies.length > 0}>
        Start Next Round
      </button>
    </div>
  );
};

export default ArenaPage;
