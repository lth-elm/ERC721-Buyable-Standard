import { ethers } from "ethers";
import Card from "./../components/Card";

export default function TokensOwner(props) {
  const {
    nftContract,
    tokenOwned,
    tokenURIs,
    priceList,
    getContractData,
    clearTransactionDialog,
    setShowSign,
    setShowDialog,
    setMined,
    setTransactionHash,
  } = props;

  const setPrice = async (tokenId, ether) => {
    if (!ether) {
      alert("Selling price cannot be 0");
      return;
    }

    console.log(
      "Attempt to set token",
      tokenId,
      "for sale for",
      ether,
      "ether"
    );

    const weiPrice = ethers.utils.parseEther(ether);

    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      let transaction = await nftContract.setPrice(tokenId, weiPrice);

      setShowSign(false);

      await transaction.wait();

      setMined(true);
      setTransactionHash(transaction.hash);
      console.log(
        "Price successfully updated, transaction hash:",
        transaction.hash
      );

      await getContractData();
    } catch (error) {
      console.log(error);
      clearTransactionDialog();
    }
  };

  const removeTokenSale = async (tokenId) => {
    console.log("Attempt to remove token from sale");

    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      let transaction = await nftContract.removeTokenSale(tokenId);

      setShowSign(false);

      await transaction.wait();

      setMined(true);
      setTransactionHash(transaction.hash);
      console.log(
        "Successfully removed token from sale, transaction hash:",
        transaction.hash
      );

      await getContractData();
    } catch (error) {
      console.log(error);
      clearTransactionDialog();
    }
  };

  const DisplayMyTokens = ({ i }) => {
    return (
      <div>
        <Card
          index={i + 1}
          img={tokenURIs[i].image_data}
          name={tokenURIs[i].name}
          price={priceList[i]}
          available={priceList[i] > 0}
          buyToken={null}
          setPrice={setPrice}
          removeTokenSale={removeTokenSale}
        />
      </div>
    );
  };

  return (
    <div>
      <h1>Tokens Owner</h1>
      <div className="Display">
        {tokenOwned.map((id, index) => (
          <div key={index}>{<DisplayMyTokens i={id - 1} />}</div>
        ))}
      </div>
    </div>
  );
}
