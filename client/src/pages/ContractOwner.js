export default function ContractOwner(props) {
  const {
    nftContract,
    isAdmin,
    royalty,
    royaltyDenominator,
    getContractData,
    clearTransactionDialog,
    setShowSign,
    setShowDialog,
    setMined,
    setTransactionHash,
  } = props;

  const displayRoyalties = () => {
    var variable = document.getElementById("newRoy").value;
    document.getElementById("showRoyalties").innerHTML =
      (variable / royaltyDenominator) * 100 + "%";
  };

  const setNewRoyalty = async (newRoy) => {
    if (newRoy >= royaltyDenominator) {
      alert("Royalties cannot exceed 100%");
      return;
    } else if (newRoy >= (royalty * royaltyDenominator) / 100) {
      alert("Royalties must be lower than current one");
      return;
    }

    console.log(
      "Attempt to update royalties at",
      (newRoy / royaltyDenominator) * 100,
      "%"
    );

    setShowSign(true);
    setShowDialog(true);
    setMined(false);

    try {
      let transaction = await nftContract.setRoyalty(newRoy);

      setShowSign(false);

      await transaction.wait();

      setMined(true);
      setTransactionHash(transaction.hash);
      console.log(
        "Royalties successfully updated, transaction hash:",
        transaction.hash
      );

      await getContractData();
    } catch (error) {
      console.log(error);
      clearTransactionDialog();
    }
  };

  const RoyaltyUpdate = () => {
    return (
      <div>
        <p>
          Enter royalty as an integer, the denominator is{" "}
          {royaltyDenominator.toString()}
        </p>
        {
          <div>
            <input
              type="number"
              id={"newRoy"}
              onInput={() => displayRoyalties()}
              placeholder={"< " + royaltyDenominator.toString()}
              min="0"
            />
            <button
              onClick={() =>
                setNewRoyalty(document.getElementById("newRoy").value)
              }
              variant="contained"
              sx={{
                marginLeft: "10px",
                background: "#2167E5",
                ":hover": { background: "#073C9C" },
              }}
            >
              Update Royalty
            </button>
            <p id="showRoyalties" />
          </div>
        }
      </div>
    );
  };

  return (
    <div>
      <h1>Contract Owner</h1>
      <div className="Display">
        {isAdmin ? (
          <RoyaltyUpdate />
        ) : (
          <p>You are not the owner of this contract.</p>
        )}
      </div>
    </div>
  );
}
