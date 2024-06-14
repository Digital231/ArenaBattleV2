import propTypes from "prop-types";

function UnitShopPage({ gold, handleBuyUnit, availableUnits, error }) {
  return (
    <div>
      <h1 className="text-center">Unit Shop</h1>
      <p className="text-center">Gold: {gold}</p>
      <div className="container d-flex justify-content-center">
        <div className="row">
          <div className="col">
            <h3>Units</h3>
            {error && <p>{error}</p>}
            {availableUnits.map((unit) => (
              <div
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                key={unit.id}
                onClick={() => handleBuyUnit(unit)}
              >
                {unit.icon} Type {unit.class}, {unit.health} health,
                {unit.price} gold
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

UnitShopPage.propTypes = {
  gold: propTypes.number,
  handleBuyUnit: propTypes.func.isRequired,
  availableUnits: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number.isRequired,
      icon: propTypes.string,
      class: propTypes.string,
      name: propTypes.string,
      health: propTypes.number,
      price: propTypes.number,
      inventory: propTypes.arrayOf(propTypes.string),
    })
  ).isRequired,
};

export default UnitShopPage;
