import propTypes from "prop-types";

function ItemShopPage({
  gold,
  handleBuyItem,
  availableArmour,
  availableWeapons,
}) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <h1>Item Shop</h1>
      <p>Gold: {gold}</p>
      <div className="container">
        <div className="row">
          <div className="col">
            <h3>Armour</h3>
            {availableArmour.map((item) => (
              <div
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                key={item.id}
                onClick={() => handleBuyItem(item)}
              >
                {item.icon} Type {item.type}, {item.armour} defence,
                {item.price} gold
              </div>
            ))}
          </div>
          <div className="col">
            <h3>Weapons</h3>
            {availableWeapons.map((item) => (
              <div
                style={{
                  fontSize: "30px",
                  cursor: "pointer",
                  userSelect: "none",
                }}
                key={item.id}
                onClick={() => handleBuyItem(item)}
              >
                {item.icon} Class {item.class}, {item.damage} damage,
                {item.price} gold
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ItemShopPage.propTypes = {
  gold: propTypes.number,
  handleBuyItem: propTypes.func.isRequired,
  availableArmour: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number.isRequired,
      icon: propTypes.string,
      type: propTypes.string,
      price: propTypes.number,
      armour: propTypes.number,
    })
  ).isRequired,
  availableWeapons: propTypes.arrayOf(
    propTypes.shape({
      id: propTypes.number.isRequired,
      icon: propTypes.string,
      class: propTypes.string,
      price: propTypes.number,
      damage: propTypes.number,
    })
  ).isRequired,
};

export default ItemShopPage;
