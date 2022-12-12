import { Outlet, Link } from "react-router-dom";

const Layout = (param) => {
  console.log("Get param in layout", param);
  var urlParam;
  if (param.param) {
    urlParam = "?contractAddress=" + param.param;
  }
  console.log("Generated url param", urlParam);

  return (
    <div className="Layout">
      <nav>
        <ul>
          <li>
            <Link to={param.param ? `/owner${urlParam}` : "/owner"}>
              Contract Owner
            </Link>
          </li>
          <li>
            <Link to={param.param ? `/${urlParam}` : "/"}>Collection</Link>
          </li>
          <li>
            <Link to={param.param ? `/tokens${urlParam}` : "/tokens"}>
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
