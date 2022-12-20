import { ethers } from "ethers";
import Card from "../components/Card";

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
        <Card
          index={i + 1}
          img={tokenURIs[i].image_data}
          name={tokenURIs[i].name}
          price={priceList[i]}
          available={priceList[i] > 0}
          buyToken={buyToken}
        />
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
