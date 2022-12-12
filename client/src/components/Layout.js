import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div className="Layout">
      <nav>
        <ul>
          <li>
            <Link to="/owner">Contract Owner</Link>
          </li>
          <li>
            <Link to="/">Collection</Link>
          </li>
          <li>
            <Link to="/tokens">My Tokens</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
