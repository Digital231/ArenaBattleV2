import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StartPage from "./pages/StartPage";
import LobbyPage from "./pages/LobbyPage";
import Toolbar from "./components/Toolbar";
import UnitShopPage from "./pages/UnitShopPage";
import ItemShopPage from "./pages/ItemShopPage";
import ArenaPage from "./pages/ArenaPage";
import { UNITS } from "./components/UnitsComp";
import { ARMOUR, WEAPONS } from "./components/ItemsComp";

function App() {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [gold, setGold] = useState(5000);
  const [totalUnits, setTotalUnits] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [availableUnits, setAvailableUnits] = useState(UNITS);
  const [availableArmour, setAvailableArmour] = useState(ARMOUR);
  const [availableWeapons, setAvailableWeapons] = useState(WEAPONS);

  const [error, setError] = useState("");

  const handleBuyUnit = (unit) => {
    if (gold >= unit.price && totalUnits.length < 8) {
      setGold(gold - unit.price);
      setTotalUnits([
        ...totalUnits,
        { ...unit, equipped: {}, damage: 0, armor: 0 },
      ]);
      setAvailableUnits(availableUnits.filter((u) => u.id !== unit.id));
      setError("");
    } else if (totalUnits.length >= 8) {
      setError("You can only have up to 8 units.");
    } else {
      setError("Not enough gold to buy this unit.");
    }
  };

  const handleBuyItem = (item) => {
    if (gold >= item.price) {
      setGold(gold - item.price);
      setInventory([...inventory, item]);
      if (item.type) {
        setAvailableArmour(availableArmour.filter((i) => i.id !== item.id));
      } else {
        setAvailableWeapons(availableWeapons.filter((i) => i.id !== item.id));
      }
    }
  };

  return (
    <>
      <BrowserRouter>
        <Toolbar />
        <Routes>
          <Route
            path="/"
            element={
              <StartPage
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                handleBuyUnit={handleBuyUnit}
              />
            }
          />
          <Route
            path="/lobby"
            element={
              <LobbyPage
                selectedUnit={selectedUnit}
                setSelectedUnit={setSelectedUnit}
                gold={gold}
                totalUnits={totalUnits}
                setTotalUnits={setTotalUnits}
                inventory={inventory}
                setInventory={setInventory}
              />
            }
          />
          <Route
            path="/unit-shop"
            element={
              <UnitShopPage
                gold={gold}
                handleBuyUnit={handleBuyUnit}
                availableUnits={availableUnits}
                error={error}
              />
            }
          />
          <Route
            path="/item-shop"
            element={
              <ItemShopPage
                gold={gold}
                handleBuyItem={handleBuyItem}
                availableArmour={availableArmour}
                availableWeapons={availableWeapons}
              />
            }
          />
          <Route
            path="/arena"
            element={
              <ArenaPage
                totalUnits={totalUnits}
                gold={gold}
                setGold={setGold}
              />
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
