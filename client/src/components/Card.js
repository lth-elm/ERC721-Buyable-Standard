import React from "react";
import "../styles/Card.css";

export default function Card(props) {
  const { index, img, name, price, available, buyToken } = props;

  return (
    <div className="nftCard">
      <div className="nftCardHeader">
        <div className="nftCardContainer">
          <img src={img} alt={name}></img>
        </div>
        <div className="name">{name}</div>
      </div>
      {/* <button
        className={available ? "buy" : "not_for_sale"}
        onClick={() => buyToken(index)}
      >
        {available ? `${price} ETH | Buy` : "Not for sale"}
      </button> */}
      {available ? (
        <div class="parent">
          <div class="div1">
            <input placeholder={`${price} ETH | Buy`} />
          </div>
          <div class="div2">
            <button
              className={available ? "buy" : "not_for_sale"}
              onClick={() => buyToken(index)}
            >
              Update price
            </button>
          </div>
          <div class="div3">
            <button
              className={available ? "buy" : "not_for_sale"}
              onClick={() => buyToken(index)}
            >
              Remove from sale
            </button>
          </div>
        </div>
      ) : (
        <button
          className={available ? "buy" : ""}
          onClick={() => buyToken(index)}
        >
          Add to sale
        </button>
      )}
    </div>
  );
}
