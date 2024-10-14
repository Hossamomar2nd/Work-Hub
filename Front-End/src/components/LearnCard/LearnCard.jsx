import React from "react";
import "./LearnCard.scss";
import { Link } from "react-router-dom";

const LearnCard = ({ item }) => {
  return (
    <Link reloadDocument to={"/course/" + item._id} className="learnLink">
      <div className="learnCard">
        <img className='learnImg' src={item.courseCoverImage_url} alt="" />
        <div className="courseInfo">
          <div className="badgeDuration">
            <div className="card-badge">course</div>
            <div className="courseDuration">
              <img
                className="hourIconOut"
                src="/img/hour.png"
              />
              <span className="courseDurationNo">{item.courseDuration} Hours</span>
            </div>
          </div>
          <p>{item.courseTitle}</p>
          <span className="courseDescCard">{item.courseDesc}</span>
          <div className="star">
          </div>
          <div className="proffInfoContainer">
            <div className="professorName">
              <img className="proffImageLearnCard" src={item.proffImage_url} alt="" />
              <div className="proffInfoCard">
              <span>{item.proffName}</span>
              <p>{item.ProffDesc}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LearnCard;
