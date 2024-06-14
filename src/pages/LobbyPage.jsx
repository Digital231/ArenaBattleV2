import PropTypes from "prop-types";
import { useState } from "react";
import "../LobbyPage.css";

function LobbyPage({
  selectedUnit,
  setSelectedUnit,
  gold,
  totalUnits,
  setTotalUnits,
  inventory,
  setInventory,
}) {
  const [selectedItemSlot, setSelectedItemSlot] = useState(null);

  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
    setSelectedItemSlot(null); // Clear selected item slot when changing unit
  };

  const handleEquipItem = (item) => {
    const isWeaponSlot =
      selectedItemSlot === "mainhand" || selectedItemSlot === "offhand";
    const isCorrectSlotForWeapon =
      isWeaponSlot && item.class && selectedUnit.class === item.class;

    if (
      (item.type && selectedItemSlot === item.type) ||
      isCorrectSlotForWeapon
    ) {
      const updatedUnits = totalUnits.map((unit) => {
        if (unit.id === selectedUnit.id) {
          const updatedEquipped = {
            ...unit.equipped,
            [selectedItemSlot]: item,
          };

          // Calculate new damage and armor
          const newDamage =
            (updatedEquipped.mainhand ? updatedEquipped.mainhand.damage : 0) +
            (updatedEquipped.offhand ? updatedEquipped.offhand.damage : 0);

          const newArmor =
            (updatedEquipped.head ? updatedEquipped.head.armour : 0) +
            (updatedEquipped.body ? updatedEquipped.body.armour : 0) +
            (updatedEquipped.legs ? updatedEquipped.legs.armour : 0);

          return {
            ...unit,
            equipped: updatedEquipped,
            damage: newDamage,
            armor: newArmor,
          };
        }
        return unit;
      });
      setTotalUnits(updatedUnits);
      setInventory(inventory.filter((i) => i.id !== item.id));
      setSelectedUnit({
        ...selectedUnit,
        equipped: {
          ...selectedUnit.equipped,
          [selectedItemSlot]: item,
        },
        damage:
          (selectedUnit.equipped.mainhand
            ? selectedUnit.equipped.mainhand.damage
            : 0) +
          (selectedUnit.equipped.offhand
            ? selectedUnit.equipped.offhand.damage
            : 0),
        armor:
          (selectedUnit.equipped.head ? selectedUnit.equipped.head.armour : 0) +
          (selectedUnit.equipped.body ? selectedUnit.equipped.body.armour : 0) +
          (selectedUnit.equipped.legs ? selectedUnit.equipped.legs.armour : 0),
      }); // Update selected unit's equipped items and stats
      setSelectedItemSlot(null);
    }
  };

  const handleSelectItemSlot = (slot) => {
    setSelectedItemSlot(slot);
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center">
      <div>
        <h1>Lobby Page</h1>
        <p>
          Selected unit: {selectedUnit?.name} Class {selectedUnit?.class}
        </p>
        <p>Gold: {gold}</p>
      </div>
      <div className="units-container">
        <div className="units">
          <h3>Your Units</h3>
          {totalUnits.map((unit) => (
            <div
              key={unit.id}
              onClick={() => handleSelectUnit(unit)}
              className={`unit ${
                selectedUnit?.id === unit.id ? "selected" : ""
              }`}
            >
              {unit.icon} {unit.name}
            </div>
          ))}
        </div>
        <div className="equipment-container">
          <div className="equipment">
            <div
              className={`slot ${
                selectedItemSlot === "head" ? "selected-slot" : ""
              }`}
              onClick={() => handleSelectItemSlot("head")}
            >
              {selectedUnit?.equipped?.head?.icon || "Head Slot"}
            </div>
            <div
              className={`slot ${
                selectedItemSlot === "body" ? "selected-slot" : ""
              }`}
              onClick={() => handleSelectItemSlot("body")}
            >
              {selectedUnit?.equipped?.body?.icon || "Body Slot"}
            </div>
            <div className="weapon-slots">
              <div
                className={`slot ${
                  selectedItemSlot === "mainhand" ? "selected-slot" : ""
                }`}
                onClick={() => handleSelectItemSlot("mainhand")}
              >
                {selectedUnit?.equipped?.mainhand?.icon || "MainHand"}
              </div>
              <div
                className={`slot ${
                  selectedItemSlot === "offhand" ? "selected-slot" : ""
                }`}
                onClick={() => handleSelectItemSlot("offhand")}
              >
                {selectedUnit?.equipped?.offhand?.icon || "Offhand"}
              </div>
            </div>
            <div
              className={`slot ${
                selectedItemSlot === "legs" ? "selected-slot" : ""
              }`}
              onClick={() => handleSelectItemSlot("legs")}
            >
              {selectedUnit?.equipped?.legs?.icon || "Leg Slot"}
            </div>
          </div>
        </div>
        <div className="inventory">
          <h3>Global Inventory</h3>
          {inventory.map((item) => (
            <div
              key={item.id}
              onClick={() => handleEquipItem(item)}
              className="inventory-item"
            >
              {item.icon} {item.type || item.class},{" "}
              {item.type ? item.armour + " armor" : item.damage + " damage"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

LobbyPage.propTypes = {
  selectedUnit: PropTypes.shape({
    id: PropTypes.number.isRequired,
    icon: PropTypes.string,
    class: PropTypes.string,
    name: PropTypes.string,
    health: PropTypes.number,
    price: PropTypes.number,
    inventory: PropTypes.arrayOf(PropTypes.string),
    equipped: PropTypes.object,
  }),
  setSelectedUnit: PropTypes.func.isRequired,
  gold: PropTypes.number.isRequired,
  totalUnits: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      icon: PropTypes.string,
      class: PropTypes.string,
      name: PropTypes.string,
      health: PropTypes.number,
      price: PropTypes.number,
      inventory: PropTypes.arrayOf(PropTypes.string),
      equipped: PropTypes.object,
    })
  ).isRequired,
  setTotalUnits: PropTypes.func.isRequired,
  inventory: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      icon: PropTypes.string,
      type: PropTypes.string,
      price: PropTypes.number,
      armour: PropTypes.number,
      class: PropTypes.string,
      damage: PropTypes.number,
    })
  ).isRequired,
  setInventory: PropTypes.func.isRequired,
};

export default LobbyPage;
