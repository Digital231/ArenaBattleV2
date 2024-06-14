import { Link } from "react-router-dom";

function Toolbar() {
  return (
    <div>
      <div className="toolbar">
        <Link to="/lobby" className="toolbar-link">
          Lobby
        </Link>
        <Link to="/unit-shop" className="toolbar-link">
          Unit Shop
        </Link>
        <Link to="/item-shop" className="toolbar-link">
          Item Shop
        </Link>
        <Link to="/arena" className="toolbar-link">
          Arena
        </Link>
      </div>
    </div>
  );
}

export default Toolbar;
