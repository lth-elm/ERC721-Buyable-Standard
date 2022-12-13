import { ethers } from "ethers";

export default function Collection(props) {
  const {
    nftContract,
    tokenURIs,
    priceList,
    getContractData,
    clearTransactionDialog,
    setShowSign,
    setShowDialog,
    setMined,
    setTransactionHash,
  } = props;

  const buyToken = async (tokenId) => {
    console.log("Attempt to buy token", tokenId);

    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      const override = {
        value: ethers.utils.parseEther(priceList[tokenId - 1].toString()),
      };
      let transaction = await nftContract.buyToken(tokenId, override);

      setShowSign(false);

      await transaction.wait();

      setMined(true);
      setTransactionHash(transaction.hash);
      console.log("Successfully bought, transaction hash:", transaction.hash);

      await getContractData();
    } catch (error) {
      console.log(error);
      clearTransactionDialog();
    }
  };

  const DisplayTokens = ({ i, tokenURIs }) => {
    return (
      <div>
        <img src={tokenURIs[i].image_data} alt={tokenURIs[i].name} />
        {priceList[i] > 0 ? (
          <div>
            <button
              onClick={() => buyToken(i + 1)}
              variant="contained"
              sx={{
                background: "#66bb6a",
                ":hover": { background: "#388e3c" },
              }}
            >
              Buy for {priceList[i]} eth
            </button>
          </div>
        ) : (
          <div>
            <button variant="contained" disabled>
              Not for sale
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Collection</h1>
      <div className="Display">
        {tokenURIs.map((token, index) => (
          <div key={index}>
            {<DisplayTokens i={index} tokenURIs={tokenURIs} />}
          </div>
        ))}
      </div>
    </div>
  );
}
