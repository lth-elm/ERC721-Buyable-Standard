import { Outlet, NavLink } from "react-router-dom";
import "../styles/Layout.css";
import { useState } from "react";

const Layout = ({ param }) => {
  console.log("Get param in layout", param);
  var urlParam;
  if (param.foundUrlParam) {
    urlParam = "?contractAddress=" + param.contractAddress;
  }
  console.log("Found url param", param.foundUrlParam);
  console.log("Generated url param", urlParam);

  return (
    <div className="Layout">
      <nav className="navbar">
        <ul>
          <li>
            <NavLink
              to={param.foundUrlParam ? `/owner${urlParam}` : "/owner"}
              className="owner"
            >
              Contract Owner
            </NavLink>
          </li>
          <li>
            <NavLink
              to={param.foundUrlParam ? `/${urlParam}` : "/"}
              className="collection"
            >
              Collection
            </NavLink>
          </li>
          <li>
            <NavLink
              to={param.foundUrlParam ? `/tokens${urlParam}` : "/tokens"}
              className="tokens"
            >
              My Tokens
            </NavLink>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
