const ContractOwner = ({ contractAddress }) => {
  console.log("Contract address in owner page:", contractAddress);
  return <h1>Contract Owner {contractAddress}</h1>;
};

export default ContractOwner;
