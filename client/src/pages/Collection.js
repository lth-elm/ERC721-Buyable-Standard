const Collection = ({ contractAddress }) => {
  console.log("Contract address in collection page:", contractAddress);

  return <h1>Collection {contractAddress}</h1>;
};

export default Collection;
