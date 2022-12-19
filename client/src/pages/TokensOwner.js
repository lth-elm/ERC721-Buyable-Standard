import { ethers } from "ethers";

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
        <img src={tokenURIs[i].image_data} alt={tokenURIs[i].name} />
        {priceList[i] > 0 ? (
          <div>
            <div>
              <input
                type="number"
                id={"setNewPrice" + i}
                placeholder={("Currently " + priceList[i]).toString() + " ETH"}
                step="0.01"
                min="0"
              />
              <button
                onClick={() =>
                  setPrice(
                    i + 1,
                    document.getElementById("setNewPrice" + i).value
                  )
                }
                variant="contained"
                sx={{
                  marginLeft: "10px",
                  background: "#2167E5",
                  ":hover": { background: "#073C9C" },
                }}
              >
                Update selling price
              </button>
            </div>
            <button
              onClick={() => removeTokenSale(i + 1)}
              color="error"
              /* startIcon={"X"}
              <DeleteIcon /> */ sx={{ marginTop: "35px" }} // --> ADD A DELETE ICON HERE
            >
              Remove from sale
            </button>
          </div>
        ) : (
          <div>
            <input
              type="number"
              id={"setPrice" + i}
              placeholder="Price in ETH"
              step="0.01"
              min="0"
            />
            <button
              onClick={() =>
                setPrice(i + 1, document.getElementById("setPrice" + i).value)
              }
              variant="contained"
              sx={{
                marginLeft: "10px",
                background: "#66bb6a",
                ":hover": { background: "#388e3c" },
              }}
            >
              Add to sale
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h1>Tokens Owner</h1>
      <div className="Display">
        {tokenOwned.map((id, index) => (
          <div key={index}>
            <h3>{tokenURIs[id - 1].name}</h3>
            {<DisplayMyTokens i={id - 1} />}
          </div>
        ))}
      </div>
    </div>
  );
}
