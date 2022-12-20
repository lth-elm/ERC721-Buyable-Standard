import React from "react";
import "../styles/Card.css";

export default function Card(props) {
  const {
    index,
    img,
    name,
    price,
    available,
    buyToken,
    setPrice,
    removeTokenSale,
  } = props;

  return (
    <div className="nftCard">
      <div className="nftCardHeader">
        <div className="nftCardContainer">
          <img src={img} alt={name}></img>
        </div>
        <div className="name">{name}</div>
      </div>
      {buyToken ? (
        <button
          className={available ? "buy" : "not_for_sale"}
          onClick={() => buyToken(index)}
        >
          {available ? `${price} ETH | Buy` : "Not for sale"}
        </button>
      ) : (
        <>
          {available ? (
            <div class="footer-inSale">
              <div className="child1">
                <input
                  placeholder={`${price} ETH`}
                  type="number"
                  id={"setNewPrice" + index}
                />

                <button
                  className={available ? "buy" : "not_for_sale"}
                  onClick={() =>
                    setPrice(
                      index,
                      document.getElementById("setNewPrice" + index).value
                    )
                  }
                >
                  Update price
                </button>
              </div>

              <div class="child2">
                <button
                  className={available ? "buy" : "not_for_sale"}
                  onClick={() => removeTokenSale(index)}
                >
                  Remove from sale
                </button>
              </div>
            </div>
          ) : (
            <div className="footer-notInSale">
              <input
                placeholder={`Price in ETH`}
                type="number"
                id={"setNewPrice" + index}
                step="0.01"
                min="0"
              />
              <button
                className={available ? "buy" : "sale"}
                onClick={() =>
                  setPrice(
                    index,
                    document.getElementById("setNewPrice" + index).value
                  )
                }
              >
                Add to sale
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
