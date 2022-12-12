import { Outlet, Link } from "react-router-dom";

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
      <nav>
        <ul>
          <li>
            <Link to={param.foundUrlParam ? `/owner${urlParam}` : "/owner"}>
              Contract Owner
            </Link>
          </li>
          <li>
            <Link to={param.foundUrlParam ? `/${urlParam}` : "/"}>
              Collection
            </Link>
          </li>
          <li>
            <Link to={param.foundUrlParam ? `/tokens${urlParam}` : "/tokens"}>
              My Tokens
            </Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
