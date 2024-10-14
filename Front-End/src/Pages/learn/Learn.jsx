import React from 'react'
import LearnFeatured from '../../components/LearnFeatured/LearnFeatured'
import LearnMenu from '../../components/LearnMenu/LearnMenu'
import "./Learn.scss"
import LearnSlider from '../../Pages/learn/learnSlider';



const Learn = () => {
  return (
    <>
      <LearnFeatured />
      <LearnMenu />
      <div className="learnSection">
        <div className="learnSectionContainer">
          <div className="title1">
            <img src="./img/brain.png" alt="" />
            <h1>Practical skills</h1>
            <p>Learn proven methods, processes, and best practices - and apply them to your work immediately.</p>
          </div>
          <div className="title2">
            <img src="./img/trophy.png" alt="" />
            <h1>Learn from the best</h1>
            <p>Courses tailored for your professional needs, led by handpicked, industry experts.</p>
          </div>
          <div className="title3">
            <img src="./img/noFees.png" alt="" />
            <h1>No subscription fees</h1>
            <p>Pay only for courses you want to take, no monthly fees. Know the exact cost upfront.</p>
          </div>
        </div>
      </div>
      <LearnSlider />
    </>
  )
}

export default Learn