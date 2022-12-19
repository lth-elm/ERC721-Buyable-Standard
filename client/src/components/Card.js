import React from "react";
import "../styles/Card.css";

export default function Card(props) {
  const { index, img, name, price, available, buyToken } = props;
  console.log(img);
  return (
    <div className="card">
      <div className="card-header">
        <div className="nft-container">
          <img src={img} alt={name}></img>
        </div>
        <div className="title">{name}</div>
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
