import React, { useState } from "react";
import "./GigCard.scss";
import { Link, useLocation } from "react-router-dom";
import { getAuthUser } from "../../localStorage/storage";

const GigCard = ({ item }) => {

  const [openOption, setOpenOption] = useState(false)

  const { pathname } = useLocation();
  const user = getAuthUser();

  return (
    <div className="gigCardContainer">
      {pathname !== "/gigs" &&
        <div className="gigCardOptions" onClick={() => setOpenOption(!openOption)}>
          <img src="/img/more.png" />
          {openOption && <div className="exploreOptions">
            <>
              <div className='link' to="/gigs">Delete Service</div>
              <div className='link' to="/community">Update Service</div>
            </>
          </div>}
        </div>}
      <div className="gigCard">
      <Link reloadDocument to={"/gig/" + item._id} className="gigLink">
          <img className="gigImg" src={item.serviceCover_url} />
        </Link>
        <div className="gigInfo">
          <div className="user">
            <div class={pathname !== "/gigs" ? "card-badge" : "card-badge-2nd"}>WorkHub service</div>
            <Link reloadDocument to={"/profile/" + item?.freelancerId._id} className="freelancerLink">
                <img src={item.freelancerId.image_url} />
                <span className="freelancerName">{item.freelancerId.name}</span>
            </Link>
          </div>
          <p>{item.serviceTitle}</p>
          <div className="star">
            <img src="./img/star.png" alt="" />
            <span>{item.serviceShortTitle}</span>
          </div>
        </div>
        <hr />
        <div className="detail">
          <div className="price">
            <h2>
              ${item.servicePrice}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GigCard;
