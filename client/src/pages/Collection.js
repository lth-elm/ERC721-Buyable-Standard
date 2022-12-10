import { useSearchParams } from "react-router-dom";

const Collection = () => {
  const [searchParams] = useSearchParams();
  return <h1>Collection {searchParams.get("contractAddress")}</h1>;
};

export default Collection;
