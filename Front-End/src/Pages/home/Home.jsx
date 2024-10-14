import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Home.scss";
import Featured from '../../components/featured/Featured';
import TrustedBy from "../../components/trustedBy/TrustedBy";
import {projects1, projects2} from "../../data";
import CatCard from '../../components/catCard/CatCard';
import ProjectCard from '../../components/projectCard/ProjectCard';


const Home = () => {

  const [categories, setCategories] = useState({
    loading: true,
    results: [],
    err: null,
    reload: 0
});

const [cards1, setCards1] = useState({
  loading: true,
  results: [],
  err: null,
  reload: 0
});

const [cards2, setCards2] = useState({
  loading: true,
  results: [],
  err: null,
  reload: 0
});

useEffect(() => {
    setCategories({ ...categories, loading: true })
    axios.get("http://localhost:3000/api/categories/getAllCategories")
        .then(
            resp => {
                console.log(resp.data);
                setCategories({ results: resp.data, loading: false, err: null });
                console.log(resp);

                setCards1({ results : [
                  {
                    id: categories.results[0]?._id,
                    title: categories.results[0]?.categoryName,
                    desc: categories.results[0]?.categoryDesc,
                    img: "https://images.pexels.com/photos/7532110/pexels-photo-7532110.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  },
                  {
                    id: categories.results[1]?._id,
                    title: categories.results[1]?.categoryName,
                    desc: categories.results[1]?.categoryDesc,
                    img: "https://images.pexels.com/photos/11295165/pexels-photo-11295165.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  },
                  {
                    id: categories.results[2]?._id,
                    title: categories.results[2]?.categoryName,
                    desc: categories.results[2]?.categoryDesc,
                    img: "https://images.pexels.com/photos/4371669/pexels-photo-4371669.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  },
                  {
                    id: categories.results[3]?._id,
                    title: categories.results[3]?.categoryName,
                    desc: categories.results[3]?.categoryDesc,
                    img: "https://images.pexels.com/photos/7608079/pexels-photo-7608079.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  }
                ]});


                setCards2({ results : [
                  {
                    id: categories.results[4]?._id,
                    title: categories.results[4]?.categoryName,
                    desc: categories.results[4]?.categoryDesc,
                    img: "https://images.pexels.com/photos/13388047/pexels-photo-13388047.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  },
                  {
                    id: categories.results[5]?._id,
                    title: categories.results[5]?.categoryName,
                    desc: categories.results[5]?.categoryDesc,
                    img: "https://images.pexels.com/photos/11378899/pexels-photo-11378899.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  },
                  {
                    id: categories.results[6]?._id,
                    title: categories.results[6]?.categoryName,
                    desc: categories.results[6]?.categoryDesc,
                    img: "https://images.pexels.com/photos/4820241/pexels-photo-4820241.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  },
                  {
                    id: categories.results[7]?._id,
                    title: categories.results[7]?.categoryName,
                    desc: categories.results[7]?.categoryDesc,
                    img: "https://images.pexels.com/photos/15032623/pexels-photo-15032623.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
                  }
                ]});
            }
        ).catch(error => {
            // setCategories({ loading: false, err: error.response.data.msg });
            console.log(error);
        })
}, [categories.reload]);



  return (
    <div className='home'>
      <Featured />
      <TrustedBy />
      <div className="homeCards">
        <div className="homeCardsHeader">
          <h1>Popular services</h1>
        </div>
        <div className="card1">
          {cards1.results.length > 0 && cards1.results.map((card) => (
            <CatCard key={card.id} card={card} />
          ))}
        </div>
        <div className="card2">
          {cards2.results.length > 0 && cards2.results.map((card) => (
            <CatCard key={card.id} card={card} />
          ))}
        </div>
      </div>
      <div className="features">
        <div className="featuresContainer">
          <div className="left">
            <h1>The best part? Everything.</h1>
            <div className="title">
              <img src="./img/check.png" alt="" />
              Stick to your budget
            </div>
            <p>Find the right service for every price point. No hourly rates, just project-based pricing.</p>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Get quality work done quickly
            </div>
            <p>Hand your project over to a talented freelancer in minutes, get long-lasting results.</p>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Pay when you're happy
            </div>
            <p>Upfront quotes mean no surprises. Payments only get released when you approve.</p>

            <div className="title">
              <img src="./img/check.png" alt="" />
              Count on 24/7 support
            </div>
            <p>Our round-the-clock support team is available to help anytime, anywhere.</p>
          </div>
          <div className="right">
            <video src="./img/video.mp4" controls></video>
          </div>
        </div>
      </div>
      <div className='proCardHeader'><h2>Inspiring work made on WorkHub</h2></div>
      {/* <div className="project1">
        {projects1.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </div>
      <div className="project2">
        {projects2.map((card) => (
          <ProjectCard key={card.id} card={card} />
        ))}
      </div> */}
    </div>
  )
}

export default Home