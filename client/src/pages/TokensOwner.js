const TokensOwner = ({ contractAddress }) => {
  console.log("Contract address in tokens owner page:", contractAddress);
  return <h1>Tokens Owner {contractAddress}</h1>;
};

export default TokensOwner;
