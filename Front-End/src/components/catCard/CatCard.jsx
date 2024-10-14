import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CatCard.scss";

function CatCard({ card }) {

  // if (!category) {
  //   return null;
  // }

  return (
    <Link reloadDocument to={"/gigsFilter/" + card.id}>
      <div className="catCard">
        <img src={card.img} alt="" />
        <span className="desc">{card.desc}</span>
        <span className="title">{card.title}</span>
      </div>
    </Link>
  );
}
export default CatCard;
