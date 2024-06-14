import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import SplitButton from "react-bootstrap/SplitButton";
import Button from "react-bootstrap/Button";
import { UNITS } from "../components/UnitsComp";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

function StartPage({ selectedUnit, setSelectedUnit, handleBuyUnit }) {
  const handleSelectUnit = (unit) => {
    setSelectedUnit(unit);
  };

  const navigate = useNavigate();

  const warriorUnits = UNITS.filter((unit) => unit.class === "warrior");
  const archerUnits = UNITS.filter((unit) => unit.class === "archer");

  const handleStartAndBuy = () => {
    if (selectedUnit) {
      handleBuyUnit(selectedUnit);
      handleStartGame();
    }
  };

  function handleStartGame() {
    navigate("/lobby");
    console.log("Starting game...");
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-column justify-content-center align-items-center gap-5">
        <h1>Welcome to Arena Fighter</h1>
        <h4 className="text-center">Choose your first unit!</h4>
        <div className="d-flex justify-content-between gap-3">
          <SplitButton
            id="dropdown-split-variants-warning"
            variant="warning"
            title="Warrior"
          >
            {warriorUnits.map((unit, index) => (
              <Dropdown.Item key={index} onClick={() => handleSelectUnit(unit)}>
                {unit.name}
              </Dropdown.Item>
            ))}
          </SplitButton>
          <SplitButton
            id="dropdown-split-variants-danger"
            variant="danger"
            title="Archer"
          >
            {archerUnits.map((unit, index) => (
              <Dropdown.Item key={index} onClick={() => handleSelectUnit(unit)}>
                {unit.name}
              </Dropdown.Item>
            ))}
          </SplitButton>
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div style={{ fontSize: "5rem" }} className="selectedUnit mb-3">
            {selectedUnit ? selectedUnit.icon : "🎅"}
          </div>
          <h4 className="mb-3">
            {selectedUnit ? `Selected: ${selectedUnit.name}` : ""}
          </h4>
          <h4>{selectedUnit ? `Health: ${selectedUnit.health}` : ""}</h4>
          <h4>
            {selectedUnit
              ? `Class: ${selectedUnit.class}`.toLocaleUpperCase()
              : ""}
          </h4>
          <Button
            onClick={handleStartAndBuy}
            variant="info"
            disabled={!selectedUnit}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
}

StartPage.propTypes = {
  selectedUnit: PropTypes.shape({
    icon: PropTypes.string,
    class: PropTypes.string,
    name: PropTypes.string,
    health: PropTypes.number,
    price: PropTypes.number,
    inventory: PropTypes.arrayOf(PropTypes.string),
  }),
  setSelectedUnit: PropTypes.func.isRequired,
  handleBuyUnit: PropTypes.func.isRequired,
};

export default StartPage;
