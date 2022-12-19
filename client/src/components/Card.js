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
      <button
        className={available ? "buy" : "not_for_sale"}
        onClick={() => buyToken(index)}
      >
        {available ? `${price} ETH | Buy` : "Not for sale"}
      </button>
    </div>
  );
}
