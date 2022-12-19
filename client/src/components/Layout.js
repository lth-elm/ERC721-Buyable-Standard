import "../styles/Layout.css";

import { Outlet, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Layout = ({ param, checked }) => {
  const [style, setStyle] = useState("orange");

  useEffect(() => changeStyle());

  const changeStyle = () => {
    console.log("checked", checked);
    checked ? setStyle("light") : setStyle("orange");
  };

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
              className={`owner ${style}`}
            >
              Contract Owner
            </NavLink>
          </li>
          <li>
            <NavLink
              to={param.foundUrlParam ? `/${urlParam}` : "/"}
              className={`collection ${style}`}
            >
              Collection
            </NavLink>
          </li>
          <li>
            <NavLink
              to={param.foundUrlParam ? `/tokens${urlParam}` : "/tokens"}
              className={`tokens ${style}`}
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
